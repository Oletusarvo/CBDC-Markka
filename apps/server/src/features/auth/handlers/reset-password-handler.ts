import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';
import { verifyJWT } from '../../../utils/jwt';
import { hashPassword } from '../../../utils/password';

export const resetPasswordHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const { token, password } = req.data;
  const decodedPayload = verifyJWT(token) as { id: string };
  await db(tablenames.users)
    .where({
      id: decodedPayload.id,
    })
    .update({
      password: await hashPassword(password),
    });
  return res.status(200).end();
});
