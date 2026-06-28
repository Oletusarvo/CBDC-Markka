import { db } from '../../../db-config';
import { transactionService } from '../../../services/transaction-service';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';

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
      message: paymentSession.message,
    };

    try {
      await db.transaction(async trx => {
        await transactionService.transact(transaction, trx);
        //Mark the deposit session as successful.
        await trx(tablenames.paymentSessions)
          .where({ id: paymentSession.id })
          .update({
            deposit_status_id: db
              .select('id')
              .from(tablenames.paymentSessionStatus)
              .where({ label: 'success' })
              .limit(1),
          });
      });
    } catch (err: any) {
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
      return res.status(409).json({
        error: 'payment-session:payment-failed',
      });
    }

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
