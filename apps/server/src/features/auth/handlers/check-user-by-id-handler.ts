import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { createHandler } from '../../../utils/create-handler';

export const checkUserByIdHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const { id } = req.params;
  const user = await db(tablenames.users).where({ id }).first();
  if (!user) {
    return res.status(404).end();
  }
  return res.status(200).end();
});
