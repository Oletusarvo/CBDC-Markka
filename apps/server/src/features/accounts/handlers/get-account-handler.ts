import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { transactionRepo } from '../../../utils/classes/transaction-repo';
import { createHandler } from '../../../utils/create-handler';

export const getAccountHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  const acc = await db('account')
    .where({ user_id: session.user.id })
    .groupBy('account.id')
    .select('account.balance_in_cents', 'account.id', 'account.nonce')
    .first();

  if (!acc) {
    return res.status(404).json({
      error: 'account:not-found',
    });
  }

  const transactions = await transactionRepo
    .getRawQuery(db)
    .where({
      from: acc.id,
    })
    .orWhere({
      to: acc.id,
    })
    .orderBy('transaction.timestamp', 'desc')
    .limit(25);

  return res.status(200).json({
    ...acc,
    transactions,
  });
});
