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

router.post(
  '/register',
  createMiddleware(async (req, res, next) => {
    const token = req.body.token;
    const schema = token
      ? z.object({
          token: z.jwt(),
          password1: passwordSchema,
          password2: passwordSchema,
        })
      : z.object({
          email: emailSchema,
        });
    const parser = createBodyParser(schema);
    return await parser(req, res, next);
  }),
  createHandler(async (req, res) => {
    const token = req.data.token;
    return token
      ? //User registers with token, proceed to create data.
        await registerUserWithTokenHandler(req, res)
      : //User is sending their email address only; send them a registration token.
        await createRegistrationTokenHandler(req, res);
  }),
);

router.post('/login', createBodyParser(loginCredentialsSchema), loginHandler);
router.get('/session', checkAuth(), getSessionHandler);
router.put('/logout', checkAuth(), logoutHandler);

export { router as authRouter };
