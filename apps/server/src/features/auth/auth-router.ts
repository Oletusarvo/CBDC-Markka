import { createBodyParser } from '../../utils/create-body-parser';
import { getRouter } from '../../utils/get-router';
import { registerUserHandler } from './handlers/register-user-handler';
import { loginHandler } from './handlers/login-handler';

import { checkAuth } from './middleware/check-auth';
import { getSessionHandler } from './handlers/get-session-handler';
import { logoutHandler } from './handlers/logout-handler';
import {
  forgotPasswordSchema,
  loginUserCredentialsSchema,
  registerUserCredentialsSchema,
  resetPasswordSchema,
} from '@cbdc-markka/schemas';
import { sendEmailVerificationHandler } from './handlers/send-email-verification-handler';
import z from 'zod';
import { resetPasswordHandler } from './handlers/reset-password-handler';
import { sendPasswordResetEmailHandler } from './handlers/send-password-reset-email-handler';
import { verifyEmailHandler } from './handlers/verify-email-handler';
import { checkUserByIdHandler } from './handlers/check-user-by-id-handler';

const router = getRouter();

router.get('/users', checkAuth(), checkUserByIdHandler);
router.post('/register', createBodyParser(registerUserCredentialsSchema), registerUserHandler);
router.post('/login', createBodyParser(loginUserCredentialsSchema), loginHandler);
router.post(
  '/forgot-password',
  createBodyParser(forgotPasswordSchema),
  sendPasswordResetEmailHandler,
);
router.post('/reset-password', createBodyParser(resetPasswordSchema), resetPasswordHandler);
router.get('/session', checkAuth(), getSessionHandler);
router.put('/logout', checkAuth(), logoutHandler);
router.post(
  '/send-email-verification',
  createBodyParser(z.object({ id: z.uuid() })),
  sendEmailVerificationHandler,
);
router.post(
  '/verify-email',
  createBodyParser(z.object({ token: z.jwt({ error: 'Ryyppäx' }) })),
  verifyEmailHandler,
);

export { router as authRouter };
