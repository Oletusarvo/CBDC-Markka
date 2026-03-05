import z from 'zod';

export const transactionSchema = z.object({
  email: z.email().trim(),
  amt: z.coerce
    .number()
    .positive()
    .refine(val => val > 0, {
      error: 'amt cannot be zero!',
    }),
  message: z.string().trim().optional(),
});
