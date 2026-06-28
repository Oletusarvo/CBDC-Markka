import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';
import crypto from 'crypto';

export const authorizeHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  if (session) {
    //Create code
    const code = crypto.randomBytes(32).toString('base64url');
    const codeHash = crypto.createHash('SHA256').update(code).digest().toString('hex');
    await db(tablenames.authCodes).insert({
      code_hash: codeHash,
      user_id: session.user.id,
    });
    const uri = `${req.data.callbackUri}?code=${code}`;
    return res.redirect(uri);
  } else {
    //Redirect to login
    return res.redirect(`/api/auth/login?ca`);
  }
});
