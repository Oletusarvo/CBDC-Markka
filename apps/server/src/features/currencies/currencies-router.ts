import { getRouter } from '../../utils/get-router';
import { checkAuth } from '../auth/middleware/check-auth';
import { getCirculationHandler } from './handlers/get-circulation-handler';
import { getUserTokensHandler } from './handlers/get-user-tokens-handler';

const router = getRouter();

router.get('/circulation', getCirculationHandler);
router.get('/tokens', checkAuth(), getUserTokensHandler);
export { router as currenciesRouter };
