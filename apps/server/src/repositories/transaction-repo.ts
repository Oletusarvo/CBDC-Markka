import { db } from '../db-config';
import { tablenames } from '../tablenames';
import { Repo } from '../utils/classes/repo';

class TransactionRepo extends Repo<any> {
  constructor() {
    super(tablenames.ledger, (tbl, ctx) => {
      /*
        WITH transaction_types AS (
            SELECT
            MAX(CASE WHEN label = 'input' THEN id END) AS input_type_id,
            MAX(CASE WHEN label = 'output' THEN id END) AS output_type_id
            FROM transaction_type
          )

SELECT
    t.*,
    JSON_BUILD_OBJECT('id', fd.id, 'account_id', fd.account_id, 'user_id', a.user_id, 'email', u.email) AS foreign_transaction
FROM ?? t
CROSS JOIN transaction_types tt
LEFT JOIN transaction_metadata metadata
    ON metadata.output_transaction_id = t.id
    OR metadata.input_transaction_id = t.id
LEFT JOIN ?? fd 
	ON (
		CASE WHEN t.transaction_type_id = tt.input_type_id 
		THEN 
			fd.id = metadata.output_transaction_id 
		ELSE
			fd.id = metadata.input_transaction_id
		END
	)
LEFT JOIN account a 
	ON a.id = fd.account_id
LEFT JOIN "user" u 
	ON u.id = a.user_id;
        */

      return ctx
        .with('transaction_types', qb => {
          qb.select(
            db.raw(`
              MAX(CASE WHEN label = 'input' THEN id END) AS input_type_id,
              MAX(CASE WHEN label = 'output' THEN id END) AS output_type_id`),
          ).from('transaction_type');
        })
        .from({ t: tbl })
        .select(
          't.*',
          'transaction_type.label AS type',
          'metadata.message',
          db.raw(
            "JSON_BUILD_OBJECT('id', fd.id, 'account_id', fd.account_id, 'user_id', a.user_id, 'email', u.email) AS foreign_transaction",
          ),
        )
        .crossJoin(db.raw('transaction_types as tt'))
        .join('transaction_type', 'transaction_type.id', 't.transaction_type_id')
        .leftJoin(
          db.select('*').from('transaction_metadata').as('metadata'),
          db.raw('metadata.output_transaction_id = t.id OR metadata.input_transaction_id = t.id'),
        )
        .leftJoin(
          db.select('*').from(tablenames.ledger).as('fd'),
          db.raw(`
              CASE WHEN t.transaction_type_id = tt.input_type_id 
              THEN 
                fd.id = metadata.output_transaction_id 
              ELSE
                fd.id = metadata.input_transaction_id
              END
            `),
        )
        .leftJoin({ a: 'account' }, 'a.id', 'fd.account_id')
        .leftJoin({ u: 'user' }, 'u.id', 'a.user_id');
    });
  }
}

/**Singleton abstracting away the query-logic of transactions. */
export const transactionRepo = new TransactionRepo();
