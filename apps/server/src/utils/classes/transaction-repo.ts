import { tablenames } from '../../tablenames';
import { Repo } from './repo';

class TransactionRepo extends Repo<any> {
  constructor() {
    super(tablenames.transactions, (tbl, ctx) => {
      return ctx({ transaction: tbl })
        .leftJoin(
          ctx.select('id', 'user_id').from(tablenames.accounts).as('from_acc').groupBy('id'),
          'from_acc.id',
          'transaction.from',
        )
        .leftJoin(
          ctx.select('user_id', 'id').from(tablenames.accounts).as('to_acc').groupBy('id'),
          'to_acc.id',
          'transaction.to',
        )
        .leftJoin(
          ctx.select('email', 'id').from(tablenames.users).as('from_user').groupBy('id'),
          'from_user.id',
          'from_acc.user_id',
        )
        .leftJoin(
          ctx.select('email', 'id').from(tablenames.users).as('to_user').groupBy('id'),
          'to_user.id',
          'to_acc.user_id',
        )
        .select('transaction.*', 'from_user.email as from_email', 'to_user.email as to_email');
    });
  }
}

/**Singleton abstracting away the query-logic of transactions. */
export const transactionRepo = new TransactionRepo();
