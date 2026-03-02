import { transactionSchema } from '@cbdc-markka/schemas';
import { createBodyParser } from '../../utils/create-body-parser';
import { getRouter } from '../../utils/get-router';
import { checkAuth } from '../auth/middleware/check-auth';
import { createTransaction } from './handlers/create-transaction';
import { createTokenTransactionHandler } from './handlers/create-token-transaction-handler';

const router = getRouter();

router.post('/', checkAuth(), createBodyParser(transactionSchema), createTokenTransactionHandler);

export { router as transactionsRouter };
