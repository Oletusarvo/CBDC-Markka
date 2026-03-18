import { createBodyParser } from '../../utils/create-body-parser';
import { getRouter } from '../../utils/get-router';
import { registerUserHandler } from './handlers/register-user-handler';
import { loginHandler } from './handlers/login-handler';

import { checkAuth } from './middleware/check-auth';
import { getSessionHandler } from './handlers/get-session-handler';
import { logoutHandler } from './handlers/logout-handler';
import {
  emailSchema,
  loginCredentialsSchema,
  passwordSchema,
  userSchema,
} from '@cbdc-markka/schemas';
import { registerUserWithTokenHandler } from './handlers/register-user-with-token';
import { createRegistrationTokenHandler } from './handlers/create-registration-token-handler';
import z from 'zod';
import { createHandler, createMiddleware } from '../../utils/create-handler';

const router = getRouter();

router.post('/register', createBodyParser(userSchema), registerUserHandler);

router.post('/login', createBodyParser(loginCredentialsSchema), loginHandler);
router.get('/session', checkAuth(), getSessionHandler);
router.put('/logout', checkAuth(), logoutHandler);

export { router as authRouter };
