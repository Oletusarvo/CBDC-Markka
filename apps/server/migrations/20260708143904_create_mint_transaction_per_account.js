/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return new Promise(async (resolve, reject) => {
    const trx = await knex.transaction();
    try {
      const numAccounts = await trx('account').count('* AS result').first();
      const batchSize = 10;

      for (let i = 0; i < numAccounts.result; i += batchSize) {
        const accounts = await trx('account').select('id').offset(i).limit(batchSize);
        const promises = [];
        const data = accounts.map(acc => {
          return {
            account_id: acc.id,
            amount_in_cents: 2000,
            transaction_type_id: trx
              .select('id')
              .from('transaction_type')
              .where({ label: 'mint' })
              .limit(1),
          };
        });

        await trx('transaction_data').insert(data);
      }
      await trx.commit();
      resolve();
    } catch (err) {
      await trx.rollback();
      reject(err);
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('transaction_data')
    .where({
      transaction_type_id: knex
        .select('id')
        .from('transaction_type')
        .where({ label: 'mint' })
        .limit(1),
      amount_in_cents: 2000,
    })
    .del();
};
