const crypto = require('crypto');
const createSignature = require('../migration-utils/create-signature');
const updateAccountSignatures = require('../migration-utils/update-account-signatures');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.transaction(async trx => {
    //Update balances
    await trx('account').update({
      balance_in_cents: knex.raw('balance_in_cents * 100'),
    });

    //Update signatures
    await updateAccountSignatures(trx);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.transaction(async trx => {
    //Update balances
    await trx('account').update({
      balance_in_cents: knex.raw('balance_in_cents / 100'),
    });

    //Update signatures
    await updateAccountSignatures(trx);
  });
};
