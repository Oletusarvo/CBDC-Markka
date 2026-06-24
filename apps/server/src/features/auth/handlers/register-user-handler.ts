import z from 'zod';
import { ExpressRequest } from '../../../types/express';

import { createHandler } from '../../../utils/create-handler';
import { db } from '../../../db-config';
import { hashPassword } from '../../../utils/password';
import { tablenames } from '../../../tablenames';
import { registerUserCredentialsSchema } from '@cbdc-markka/schemas';
import { tokenService } from '../../../services/token-service';
import { emailService } from '../../../services/email-service';

export const registerUserHandler = createHandler(
  async (req: ExpressRequest<z.infer<typeof registerUserCredentialsSchema>>, res) => {
    const credentials = req.data;
    const trx = await db.transaction();

    const [user] = await trx(tablenames.users)
      .insert({
        email: credentials.email,
        password: await hashPassword(credentials.password),
        user_status_id: db
          .select('id')
          .from('user_status_type')
          .where({ label: 'pending' })
          .limit(1),
      })
      .returning(['id', 'email']);

    //Send verification email.
    const token = tokenService.createEmailVerificationToken(user.id);
    const emailRes = await emailService.sendEmailVerification(user.email, token);
    if (!emailRes.ok) {
      await trx.rollback();
      return res.status(emailRes.status).json({
        error: 'auth:send-email-failed',
      });
    }
    await trx.commit();
    return res.status(200).end();
  },
  (err, res) => {
    const msg = err.message.toLowerCase() as string;
    if (msg.includes('duplicate')) {
      if (msg.includes('user_email')) {
        return res.status(409).json({
          error: 'auth:email-taken',
        });
      }
    }
  },
);
