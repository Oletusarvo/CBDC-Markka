import z from 'zod';
import { emailSchema } from './email-schema';

export const loginUserCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string().trim(),
});
