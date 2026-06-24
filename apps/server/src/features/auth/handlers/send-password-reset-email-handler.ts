import { db } from '../../../db-config';
import { emailService } from '../../../services/email-service';
import { tokenService } from '../../../services/token-service';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';

export const sendPasswordResetEmailHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const { email } = req.data;
    const userRecord = await db(tablenames.users).where({ email }).select('id', 'email').first();
    if (!userRecord) {
      return res.status(404).json({
        error: 'auth:user-not-found',
      });
    }

    const token = tokenService.createPasswordResetToken(userRecord.id);
    await emailService.sendPasswordReset(userRecord.email, token);
    return res.status(200).end();
  },
);
