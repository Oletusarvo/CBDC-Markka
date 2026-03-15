require('dotenv').config();
const createSignature = require('../migration-utils/create-signature');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return new Promise(async (resolve, reject) => {
    try {
      const accs = await knex('account').select('id', 'user_id', 'balance_in_cents', 'nonce');
      await knex.transaction(async trx => {
        for (const acc of accs) {
          await trx('account')
            .where({ id: acc.id })
            .update({ signature: createSignature(acc) });
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.resolve();
};
