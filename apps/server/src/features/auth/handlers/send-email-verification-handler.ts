import { db } from '../../../db-config';
import { emailService } from '../../../services/email-service';
import { tokenService } from '../../../services/token-service';
import { tablenames } from '../../../tablenames';
import { createHandler } from '../../../utils/create-handler';

export const sendEmailVerificationHandler = createHandler(async (req, res) => {
  const { id } = req.data;
  const token = tokenService.createEmailVerificationToken(id);
  const [email] = await db(tablenames.users).where({ id }).pluck('email');
  const emailRes = await emailService.sendEmailVerification(email, token);

  if (emailRes.ok) {
    return res.status(200).end();
  } else {
    return res.status(500).end();
  }
});
