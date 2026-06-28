import { transactionSchema } from '@cbdc-markka/schemas';
import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';

import { createHandler } from '../../../utils/create-handler';
import { getAccountHandler } from '../../accounts/handlers/get-account-handler';
import z from 'zod';
import { Core } from '@cbdc-markka/core';
import { transactionService } from '../../../services/transaction-service';

/**Transfers money between two accounts. */
export const createTransaction = createHandler(
  async (req: AuthenticatedExpressRequest<z.infer<typeof transactionSchema>>, res) => {
    const session = req.session;
    await db.transaction(async trx => {
      await transactionService.transact(
        {
          from: session.user.id,
          to: req.data.recipient_id,
          amount_in_cents: Math.round(req.data.amt * Core.COIN),
          message: req.data.message,
          nonce: req.data.nonce,
        },
        trx,
      );
    });

    return await getAccountHandler(req, res);
  },
  (err, res) => {
    const msg = err.message;
    const status =
      msg === 'transaction:sender-invalid' || msg === 'transaction:recipient-invalid'
        ? 404
        : msg === 'transaction:self-transaction' ||
            msg === 'transaction:funds-insufficient' ||
            msg === 'transaction:sequence-invalid'
          ? 409
          : 500;
    if (status !== 500) {
      return res.status(status).json({
        error: msg,
      });
    }
  },
);
