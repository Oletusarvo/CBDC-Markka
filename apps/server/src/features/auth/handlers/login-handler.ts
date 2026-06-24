import { serverConfig } from '../../../../server-config';
import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { ExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';
import { createJWT } from '../../../utils/jwt';
import { verifyPassword } from '../../../utils/password';

export const loginHandler = createHandler(
  async (req: ExpressRequest<{ email: string; password: string }>, res) => {
    const credentials = req.body;
    const user = await db(tablenames.users)
      .join('user_status_type', 'user.user_status_id', 'user_status_type.id')
      .where({ email: credentials.email })
      .select('password', 'user.id', 'email', 'user_status_type.label as status')
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'auth:not-found',
      });
    }

    const passwordOk = await verifyPassword(credentials.password, user.password);
    if (!passwordOk) {
      return res.status(401).json({
        error: 'auth:invalid-password',
      });
    }

    const token = createJWT({
      id: user.id,
      email: user.email,
      status: user.status,
    });

    return res
      .status(200)
      .cookie(serverConfig.accessTokenName, token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .json({
        token,
      });
  },
);
