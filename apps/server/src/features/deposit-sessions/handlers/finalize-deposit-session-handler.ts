import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';
import { createTransaction } from '../../transactions/handlers/create-transaction';

export const finalizePaymentSessionHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const sessionId = req.params.sessionId;
    const paymentSession = await db(tablenames.paymentSessions)
      .where({
        id: sessionId,
      })
      .first();
    if (!paymentSession) {
      return res.status(404).json({
        error: 'deposit-session:not-found',
      });
    }
    const transaction = {
      from: req.data.from,
      to: paymentSession.to,
      amount_in_cents: paymentSession.amount_in_cents,
      nonce: req.data.nonce,
    };

    const transactionRes = await fetch('/auth/transact', {
      method: 'POST',
      body: JSON.stringify(transaction),
      headers: {
        Authorization: session.token,
        'Content-Type': 'application/json',
      },
    });

    if (!transactionRes.ok) {
      //Mark the deposit session as failed.
      await db(tablenames.paymentSessions)
        .where({ id: paymentSession.id })
        .update({
          deposit_status_id: db
            .select('id')
            .from(tablenames.paymentSessionStatus)
            .where({ label: 'failed' })
            .limit(1),
        });
      return res.status(transactionRes.status).json({
        error: await transactionRes.json(),
      });
    }

    //Mark the deposit session as successful.
    await db(tablenames.paymentSessions)
      .where({ id: paymentSession.id })
      .update({
        deposit_status_id: db
          .select('id')
          .from(tablenames.paymentSessionStatus)
          .where({ label: 'success' })
          .limit(1),
      });

    //Call the webhook.
    const webhookBody = {
      event: 'deposit.success',
      depositId: paymentSession.id,
      amountInCents: paymentSession.amount_in_cents,
    };
    //Fire and forget.
    fetch(paymentSession.callback_url, {
      method: 'POST',
      body: JSON.stringify(webhookBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    //Redirect the user.
    return res.status(200).end();
  },
);
