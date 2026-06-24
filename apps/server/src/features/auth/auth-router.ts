import { createBodyParser } from '../../utils/create-body-parser';
import { getRouter } from '../../utils/get-router';
import { registerUserHandler } from './handlers/register-user-handler';
import { loginHandler } from './handlers/login-handler';

import { checkAuth } from './middleware/check-auth';
import { getSessionHandler } from './handlers/get-session-handler';
import { logoutHandler } from './handlers/logout-handler';
import {
  emailSchema,
  loginUserCredentialsSchema,
  passwordSchema,
  registerUserCredentialsSchema,
  resetPasswordSchema,
} from '@cbdc-markka/schemas';
import { sendEmailVerificationHandler } from './handlers/send-email-verification-handler';
import z from 'zod';
import { createHandler, createMiddleware } from '../../utils/create-handler';
import {
  createPasswordResetEmailHandler,
  resetPasswordHandler,
} from './handlers/reset-password-handler';

const router = getRouter();

router.post('/register', createBodyParser(registerUserCredentialsSchema), registerUserHandler);
router.post('/login', createBodyParser(loginUserCredentialsSchema), loginHandler);
router.post(
  '/reset-password',
  createMiddleware(async (req, res, next) => {
    const token = req.body.token;
    const schema = token ? resetPasswordSchema : z.object({ email: emailSchema });
    const parser = createBodyParser(schema);
    return await parser(req, res, next);
  }),
  createHandler(async (req, res) => {
    const token = req.data.token;
    return token ? resetPasswordHandler(req, res) : createPasswordResetEmailHandler(req, res);
  }),
);
router.get('/session', checkAuth(), getSessionHandler);
router.put('/logout', checkAuth(), logoutHandler);
router.post(
  '/send-email-verification',
  createBodyParser(z.object({ id: z.uuid() })),
  sendEmailVerificationHandler,
);

export { router as authRouter };
