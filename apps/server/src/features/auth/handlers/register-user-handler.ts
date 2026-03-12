import z from 'zod';
import { ExpressRequest } from '../../../types/express';

import { createHandler } from '../../../utils/create-handler';
import { db } from '../../../db-config';
import { hashPassword } from '../../../utils/password';
import { tablenames } from '../../../tablenames';
import { userSchema } from '@cbdc-markka/schemas';
import { signAccountState } from '../../accounts/util/signature';

const MAX_SUPPLY_IN_CENTS = 10_000_000_000;

export const registerUserHandler = createHandler(
  async (req: ExpressRequest<z.infer<typeof userSchema>>, res) => {
    const credentials = req.data;
    await db.transaction(async trx => {
      const [user] = await trx(tablenames.users)
        .insert({
          email: credentials.email,
          password: await hashPassword(credentials.password1),
        })
        .returning('id');

      const mint = 2000;
      const currentSupplyInCents = await trx(tablenames.accounts)
        .sum('balance_in_cents as total')
        .first();

      const [newAccountData] = await trx(tablenames.accounts)
        .insert({
          user_id: user.id,
          balance_in_cents: currentSupplyInCents.total + mint < MAX_SUPPLY_IN_CENTS ? mint : 0,
        })
        .returning('*');

      //Sign the new account.
      await trx(tablenames.accounts)
        .where({ id: newAccountData.id })
        .update({
          signature: signAccountState(newAccountData),
        });
    });
    return res.status(200).end();
  },
  (err, res) => {
    const msg = err.message.toLowerCase() as string;
    if (msg.includes('duplicate')) {
      if (msg.includes('user_email')) {
        return res.status(409).json({
          error: 'auth:email-taken',
        });
      }
    }
  },
);
