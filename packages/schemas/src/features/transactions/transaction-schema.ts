import z from 'zod';

export const transactionSchema = z.object({
  email: z.email().trim(),
  amt: z
    .string()
    .transform(val => parseFloat(val))
    .pipe(z.number()),
  message: z.string().trim().optional(),
});
