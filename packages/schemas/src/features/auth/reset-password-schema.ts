import z from 'zod';
import { passwordSchema } from './password-schema';
import { emailSchema } from './email-schema';

export const resetPasswordSchema = z
  .object({
    token: z.jwt(),
    password: passwordSchema,
    password2: z.string().trim(),
  })
  .refine(val => val.password === val.password2, 'Passwords do not match!');

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
