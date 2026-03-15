/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.transaction(async trx => {
    await trx('transaction').update({
      amount_in_cents: knex.raw('amount_in_cents * 100'),
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.transaction(async trx => {
    await trx('transaction').update({
      amount_in_cents: knex.raw('amount_in_cents / 100'),
    });
  });
};
