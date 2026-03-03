import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { transactionRepo } from '../../../utils/classes/transaction-repo';
import { createHandler } from '../../../utils/create-handler';

/**Returns all transactions where the currently authenticated user's account is involved. */
export const getTransactionsHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const acc = await db(tablenames.accounts)
      .where({ user_id: session.user.id })
      .select('id')
      .first();
    const transactions = await transactionRepo
      .getRawQuery(db)
      .where({ from: acc.id })
      .orWhere({ to: acc.id })
      .orderBy('transaction.timestamp', 'desc')
      .limit(50);

    return res.status(200).json(transactions);
  },
);
