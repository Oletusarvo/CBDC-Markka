import { getRouter } from '../../utils/get-router';
import { checkAuth } from '../auth/middleware/check-auth';

import { getAccountHandler } from './handlers/get-account-handler';

const router = getRouter();

router.get('/', checkAuth(), getAccountHandler);
export { router as accountsRouter };
