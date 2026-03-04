import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { tokenRepo } from '../../../utils/classes/token-repo';
import { createHandler } from '../../../utils/create-handler';

/**Returns the total value of tokens in circulation. */
export const getCirculationHandler = createHandler(async (req, res) => {
  const circulation = await tokenRepo.getBalanceCirculation(db);
  return res.status(200).json({
    circulation,
  });
});
