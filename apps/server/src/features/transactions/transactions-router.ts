import { transactionSchema } from '@cbdc-markka/schemas';
import { createBodyParser } from '../../utils/create-body-parser';
import { getRouter } from '../../utils/get-router';
import { checkAuth } from '../auth/middleware/check-auth';
import { createTransaction } from './handlers/create-transaction';
import { createTransactionWithTokens } from './handlers/create-transaction-with-tokens';

const router = getRouter();

router.post('/', checkAuth(), createBodyParser(transactionSchema), createTransactionWithTokens);

export { router as transactionsRouter };
