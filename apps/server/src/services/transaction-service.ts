import { Knex } from 'knex';
import { db } from '../db-config';
import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';

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

    await ctx(tablenames.transactions).insert({
      from: senderAccount.id,
      to: receiverAccount.id,
      amount_in_cents: transaction.amount_in_cents,
      message: transaction.message,
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
