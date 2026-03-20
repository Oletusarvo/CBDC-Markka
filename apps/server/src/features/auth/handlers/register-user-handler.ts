import z from 'zod';
import { ExpressRequest } from '../../../types/express';

import { createHandler } from '../../../utils/create-handler';
import { db } from '../../../db-config';
import { hashPassword } from '../../../utils/password';
import { tablenames } from '../../../tablenames';
import { userSchema } from '@cbdc-markka/schemas';
import { signAccountState } from '../../accounts/util/signature';
import { Core } from '@cbdc-markka/core';

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

      const mint = Core.COIN * 20;
      const supplyRowsAffected = await trx('supply')
        .where('unreleased_supply', '>=', mint)
        .decrement('unreleased_supply', mint)
        .forUpdate()
        .limit(1);

      await trx(tablenames.accounts).insert({
        user_id: user.id,
        balance_in_cents: supplyRowsAffected == 1 ? mint : 0,
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
