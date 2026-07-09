import { Knex } from 'knex';
import { db } from '../db-config';
import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';
import { v4 } from 'uuid';

class TransactionService {
  async transact(
    transaction: {
      from: string;
      to: string;
      amount_in_cents: number;
      nonce: bigint;
      message: string;
    },
    ctx: Knex.Transaction,
  ) {
    const senderAccount = await ctx(tablenames.accounts)
      .where({ user_id: transaction.from })
      .forUpdate()
      .select(
        'id',
        'user_id',
        db.raw('CAST(balance_in_cents AS BIGINT) as balance_in_cents'),
        db.raw('CAST(nonce AS BIGINT) as nonce'),
      )
      .first();

    const receiverAccount = await ctx(tablenames.accounts)
      .where({
        id: transaction.to,
      })
      .forUpdate()
      .select(
        'id',
        'user_id',
        db.raw('CAST(balance_in_cents AS BIGINT) as balance_in_cents'),
        db.raw('CAST(nonce AS BIGINT) as nonce'),
      )
      .first();

    if (transaction.nonce != senderAccount.nonce) {
      throw new Error('transaction:sequence-invalid');
    }

    if (!senderAccount) {
      return new Error('transaction:sender-invalid');
    } else if (!receiverAccount) {
      return new Error('transaction:recipient-invalid');
    } else if (senderAccount.id === receiverAccount.id) {
      return new Error('transaction:self-transaction');
    } else if (transaction.amount_in_cents > senderAccount.balance_in_cents) {
      return Error('transaction:funds-insufficient');
    }
    //Insert a transaction for both the sender and receiver.

    const ledgerEntries = {
      message: transaction.message,
      sender: {
        id: v4(),
        account_id: senderAccount.id,
        amount_in_cents: transaction.amount_in_cents,
        transaction_type_id: ctx
          .select('id')
          .from('transaction_type')
          .where({ label: 'output' })
          .limit(1),
      },
      recipient: {
        id: v4(),
        account_id: receiverAccount.id,
        amount_in_cents: transaction.amount_in_cents,
        transaction_type_id: ctx
          .select('id')
          .from('transaction_type')
          .where({ label: 'input' })
          .limit(1),
      },
    };
    const ledgerData = [ledgerEntries.sender, ledgerEntries.recipient];
    await ctx(tablenames.ledger).insert(ledgerData);
    //Create metadata
    await ctx(tablenames.ledger_metadata).insert({
      output_transaction_id: ledgerEntries.sender.id,
      input_transaction_id: ledgerEntries.recipient.id,
      message: ledgerEntries.message,
    });

    await ctx(tablenames.accounts)
      .where({ id: senderAccount.id })
      .decrement('balance_in_cents', transaction.amount_in_cents)
      .increment('nonce', 1);

    await ctx(tablenames.accounts)
      .where({ id: receiverAccount.id })
      .increment('balance_in_cents', transaction.amount_in_cents);
  }
}

export const transactionService = new TransactionService();
