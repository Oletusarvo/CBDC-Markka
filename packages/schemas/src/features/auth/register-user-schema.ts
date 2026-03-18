import z from 'zod';
import { passwordSchema } from './password-schema';
import { emailSchema } from './email-schema';

export const userSchema = z
  .object({
    email: emailSchema,
    password1: passwordSchema,
    password2: z.string(),
  })
  .refine(user => user.password1 === user.password2, { error: 'Passwords do not match!' });
