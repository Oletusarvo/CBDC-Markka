import { transactionSchema } from '@cbdc-markka/schemas';
import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';

import { createHandler } from '../../../utils/create-handler';
import { getAccountHandler } from '../../accounts/handlers/get-account-handler';
import z from 'zod';
import { Core } from '@cbdc-markka/core';

/**Transfers money between two accounts. */
export const createTransaction = createHandler(
  async (req: AuthenticatedExpressRequest<z.infer<typeof transactionSchema>>, res) => {
    const session = req.session;
    const senderAccount = await db(tablenames.accounts)
      .where({ user_id: session.user.id })
      .select(
        'id',
        'user_id',
        db.raw('CAST(balance_in_cents AS BIGINT) as balance_in_cents'),
        db.raw('CAST(nonce AS BIGINT) as nonce'),
      )
      .first();

    const receiverAccount = await db(tablenames.accounts)
      .where({
        id: req.data.recipient_id,
      })
      .select(
        'id',
        'user_id',
        db.raw('CAST(balance_in_cents AS BIGINT) as balance_in_cents'),
        db.raw('CAST(nonce AS BIGINT) as nonce'),
      )
      .first();

    if (req.data.nonce != senderAccount.nonce) {
      return res.status(409).json({
        error: 'transaction:sequence-invalid',
      });
    }

    //Convert to cents.
    const amt_in_cents = Math.round(req.data.amt * Core.COIN);

    if (!senderAccount) {
      return res.status(404).json({
        error: 'transaction:sender-invalid',
      });
    } else if (!receiverAccount) {
      return res.status(404).json({
        error: 'transaction:recipient-invalid',
      });
    } else if (senderAccount.id === receiverAccount.id) {
      return res.status(409).json({
        error: 'transaction:self-transaction',
      });
    } else if (amt_in_cents > senderAccount.balance_in_cents) {
      return res.status(409).json({
        error: 'transaction:funds-insufficient',
      });
    }

    await db.transaction(async trx => {
      await trx(tablenames.transactions).insert({
        from: senderAccount.id,
        to: receiverAccount.id,
        amount_in_cents: amt_in_cents,
        message: req.data.message,
      });

      await trx(tablenames.accounts)
        .where({ id: senderAccount.id })
        .decrement('balance_in_cents', amt_in_cents)
        .increment('nonce', 1);

      await trx(tablenames.accounts)
        .where({ id: receiverAccount.id })
        .increment('balance_in_cents', amt_in_cents);
    });

    return await getAccountHandler(req, res);
  },
);
