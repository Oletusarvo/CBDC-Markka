import z from 'zod';
import { passwordSchema } from './password-schema';

export const resetPasswordSchema = z
  .object({
    token: z.jwt(),
    password1: passwordSchema,
    password2: z.string().trim(),
  })
  .refine(val => val.password1 === val.password2, 'Passwords do not match!');
