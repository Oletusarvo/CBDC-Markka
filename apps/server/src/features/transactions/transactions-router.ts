import { transactionSchema } from '@cbdc-markka/schemas';
import { createBodyParser } from '../../utils/create-body-parser';
import { getRouter } from '../../utils/get-router';
import { checkAuth } from '../auth/middleware/check-auth';
import { createTransaction } from './handlers/create-transaction';
import { createTokenTransactionHandler } from './handlers/create-token-transaction-handler';
import { getTransactionsHandler } from './handlers/get-transactions';

const router = getRouter();

router.get('/', checkAuth(), getTransactionsHandler);
router.post('/', checkAuth(), createBodyParser(transactionSchema), createTransaction);

export { router as transactionsRouter };
