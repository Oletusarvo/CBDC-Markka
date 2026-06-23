import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';

export const createPaymentSessionHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const { from, amount_in_cents, callback_url } = req.body;
    const session = req.session;
    const [{ id }] = await db(tablenames.paymentSessions)
      .insert({
        from,
        to: session.user.id,
        amount_in_cents,
        callback_url,
        payment_status_id: db
          .select('id')
          .from(tablenames.paymentSessionStatus)
          .where({ label: 'pending' })
          .limit(1),
      })
      .returning('id');
    return res.status(200).json({
      paymentSessionId: id,
    });
  },
);
