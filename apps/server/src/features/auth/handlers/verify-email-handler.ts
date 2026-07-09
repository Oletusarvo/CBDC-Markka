import { Core } from '@cbdc-markka/core';
import { db } from '../../../db-config';
import { tablenames } from '../../../tablenames';
import { createHandler } from '../../../utils/create-handler';
import { verifyJWT } from '../../../utils/jwt';
import { mintingService } from '../../../services/minting-service';

/**Flips the status of a user to active if they are pending, and creates an account for them. */
export const verifyEmailHandler = createHandler(async (req, res) => {
  const { token } = req.data;
  const { id } = verifyJWT(token) as { id: string };
  const trx = await db.transaction();

  try {
    //Update the state of the pending user to active.
    const [updatedUser] = await trx(tablenames.users)
      .where({
        id,
        user_status_id: db
          .select('id')
          .from('user_status_type')
          .where({ label: 'pending' })
          .limit(1),
      })
      .update({
        user_status_id: db
          .select('id')
          .from('user_status_type')
          .where({ label: 'active' })
          .limit(1),
      })
      .returning('id')
      .limit(1);

    //Return an error if no user was updated.
    if (!updatedUser) {
      return res.status(409).json({
        error: 'auth:no-pending-user',
      });
    }

    //Create an account for the activated user.
    const mint = await mintingService.mint(Core.COIN * 20, trx);

    const [newAccount] = await trx(tablenames.accounts)
      .insert({
        user_id: updatedUser.id,
        balance_in_cents: mint,
      })
      .returning('id');

    await trx(tablenames.ledger).insert({
      account_id: newAccount.id,
      amount_in_cents: mint,
      transaction_type_id: db
        .select('id')
        .from('transaction_type')
        .where({ label: 'mint' })
        .limit(1),
    });

    await trx.commit();
    return res.status(200).end();
  } catch (err: any) {
    await trx.rollback();
    throw err;
  }
});
