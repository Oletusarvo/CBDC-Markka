import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { tokenRepo } from '../../../utils/classes/token-repo';
import { createHandler } from '../../../utils/create-handler';

/**Returns the total quantity of tokens in circulation. */
export const getCirculationHandler = createHandler(async (req, res) => {
  const circulation = await tokenRepo.getCirculation(db);
  return res.status(200).json({
    circulation,
  });
});
