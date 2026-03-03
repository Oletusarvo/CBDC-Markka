import { userSchema } from '@cbdc-markka/schemas';
import { createBodyParser } from '../../utils/create-body-parser';
import { getRouter } from '../../utils/get-router';
import { registerUserHandler } from '../auth/handlers/register-user-handler';
import { checkAuth } from '../auth/middleware/check-auth';

import { createAccount } from './handlers/create-account';
import { getAccount } from './handlers/get-account';

const router = getRouter();

router.post('/', checkAuth(), createBodyParser(userSchema), createAccount);
router.get('/', checkAuth(), getAccount);
export { router as accountsRouter };
