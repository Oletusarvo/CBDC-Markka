import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';
import crypto from 'crypto';
import { frontEndService } from '../util/front-end-service';

export const authorizeHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  if (session) {
    //Create code
    const code = crypto.randomBytes(32).toString('base64url');
    const codeHash = crypto.createHash('SHA256').update(code).digest().toString('hex');
    /*await db(tablenames.authCodes).insert({
      code_hash: codeHash,
      user_id: session.user.id,
    });*/
    const callbackUrl = req.query.callback_url as string;
    const url = new URL(`${callbackUrl}`);
    url.searchParams.set('code', codeHash);
    return res.status(200).json({
      redirectTo: url.toString(),
    });
  } else {
    //Redirect to login
    const url = frontEndService.getLoginRoute({
      callbackUrl: `/api/auth/authorize?callback_uri=${req.query.callback_url}`,
    });
    return res.redirect(url);
  }
});
