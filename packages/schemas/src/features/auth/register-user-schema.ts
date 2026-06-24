import z from 'zod';
import { passwordSchema } from './password-schema';
import { emailSchema } from './email-schema';

export const registerUserCredentialsSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    password2: z.string(),
  })
  .refine(user => user.password === user.password2, { error: 'Passwords do not match!' });
