import z from 'zod';
import { emailSchema } from './email-schema';

export const loginCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string().trim(),
});
