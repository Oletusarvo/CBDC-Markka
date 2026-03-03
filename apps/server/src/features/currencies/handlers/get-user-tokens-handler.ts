import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../types/express';
import { tokenRepo } from '../../../utils/classes/token-repo';
import { createHandler } from '../../../utils/create-handler';
import { getTokens } from '../helpers/get-tokens';

/**Returns the tokens owned by the currently authenticated user. */
export const getUserTokensHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  const tokens = await tokenRepo.getTokensOfUserById(session.user.id, db);
  return res.status(200).json(tokens);
});
