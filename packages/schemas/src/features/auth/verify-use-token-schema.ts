import z from 'zod';

export const verifyUserTokenSchema = z.object({
  token: z.jwt(),
});
