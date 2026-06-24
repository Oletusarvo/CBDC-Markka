import { DBContext } from '../types/db-context';
import { createJWT } from '../utils/jwt';

class TokenService {
  createEmailVerificationToken(id: string) {
    return createJWT(
      { id },
      {
        expiresIn: '24h',
      },
    );
  }
  createPasswordResetToken(id: string) {
    return createJWT(
      { id },
      {
        expiresIn: '1h',
      },
    );
  }
}

export const tokenService = new TokenService();
