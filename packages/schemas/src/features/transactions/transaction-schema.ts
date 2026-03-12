import z from 'zod';

export const transactionSchema = z.object({
  recipient_id: z.uuid().trim(),
  amt: z.coerce
    .number()
    .positive()
    .refine(val => val > 0, {
      error: 'amt cannot be zero!',
    }),
  nonce: z.coerce.bigint(),
  message: z.string().trim().optional(),
});
