import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';
import { getDomainUrl } from '../../../utils/get-domain-url';
import { createJWT, verifyJWT } from '../../../utils/jwt';
import { hashPassword } from '../../../utils/password';
import { sendEmail } from '../../../utils/send-email';
import { createEmailHTML } from '../util/create-email-html';

export const createPasswordResetEmailHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const { email } = req.data;
    const userRecord = await db(tablenames.users).where({ email }).select('id').first();
    if (!userRecord) {
      return res.status(404).json({
        error: 'auth:user-not-found',
      });
    }

    const token = createJWT(
      { email: req.data.email },
      {
        expiresIn: '1h',
      },
    );

    const domainUrl = getDomainUrl();
    const html = createEmailHTML({
      title: 'Tervehdys!',
      bodyText: `Olet pyytänyt salasanasi vaihtamista. Jos se et ollut sinä, voit jättää tämän viestin huomiotta. Muussa tapauksessa klikkaa <a href="${domainUrl}/reset-password?token=${token}">tähän.</a>`,
    });
    await sendEmail({
      to: email,
      html,
      subject: 'Vaihda e-MRK salasanasi',
    });
    return res.status(200).end();
  },
);

export const resetPasswordHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const { token, password1, password2 } = req.data;
  const decodedPayload = verifyJWT(token) as { id: string };
  await db(tablenames.users)
    .where({
      id: decodedPayload.id,
    })
    .update({
      password: await hashPassword(password1),
    });
  return res.status(200).end();
});
