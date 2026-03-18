import { createHandler } from '../../../utils/create-handler';
import { verifyJWT } from '../../../utils/jwt';
import { registerUserHandler } from './register-user-handler';

export const registerUserWithTokenHandler = createHandler(async (req, res) => {
  const { token, password1, password2 } = req.data;

  const payload = verifyJWT(token) as { email: string };
  req.data = {
    email: payload.email,
    password1,
    password2,
  };
  return await registerUserHandler(req, res);
});
