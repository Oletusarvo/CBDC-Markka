import { transactionSchema } from '@cbdc-markka/schemas';
import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';

import { createHandler } from '../../../utils/create-handler';
import { getAccountHandler } from '../../accounts/handlers/get-account-handler';
import z from 'zod';

/**Transfers money between two accounts. */
export const createTransaction = createHandler(
  async (req: AuthenticatedExpressRequest<z.infer<typeof transactionSchema>>, res) => {
    const session = req.session;
    const senderAccount = await db(tablenames.accounts)
      .where({ user_id: session.user.id })
      .select('balance_in_cents', 'id')
      .first();

    const receiverAccount = await db(tablenames.accounts)
      .where({
        id: req.data.recipient_id,
      })
      .select('id')
      .first();

    console.log(req.data.recipient_id, receiverAccount);

    //Convert to cents.
    const amt_in_cents = Math.round(req.data.amt * 100);

    if (!senderAccount) {
      return res.status(404).json({
        error: 'transaction:sender-invalid',
      });
    } else if (!receiverAccount) {
      return res.status(404).json({
        error: 'transaction:invalid-recipient',
      });
    } else if (senderAccount.id === receiverAccount.id) {
      return res.status(409).json({
        error: 'transaction:self-transaction',
      });
    } else if (amt_in_cents > senderAccount.balance_in_cents) {
      return res.status(409).json({
        error: 'transaction:insufficient-funds',
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
        .increment('balance_in_cents', amt_in_cents)
        .increment('nonce', 1);
    });

    return await getAccountHandler(req, res);
  },
);
