require('dotenv').config();
const crypto = require('crypto');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return new Promise(async (resolve, reject) => {
    try {
      const privateKeyBase64 = process.env.PRIVATE_KEY;
      const privateKeyBuffer = Buffer.from(privateKeyBase64, 'base64');
      const privateKey = crypto.createPrivateKey({
        key: privateKeyBuffer,
        type: 'pkcs8',
        format: 'der',
      });

      const accs = await knex('account').select('id', 'user_id', 'balance_in_cents', 'nonce');
      await knex.transaction(async trx => {
        for (const acc of accs) {
          const accBuffer = Buffer.from(JSON.stringify(acc), 'utf-8');
          const sig = crypto.sign(null, accBuffer, privateKey);

          await trx('account')
            .where({ id: acc.id })
            .update({ signature: sig.toString('base64') });
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
