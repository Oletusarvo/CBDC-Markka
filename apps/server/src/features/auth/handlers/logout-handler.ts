import { serverConfig } from '../../../../server-config';
import { createHandler } from '../../../utils/create-handler';

export const logoutHandler = createHandler(async (req, res) => {
  res.clearCookie(serverConfig.accessTokenName, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
  return res.status(200).end();
});
