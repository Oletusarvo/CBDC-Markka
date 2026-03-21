/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('transaction').update({
    amount_in_cents: knex.raw('amount_in_cents * 1000000::bigint'),
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('transaction').update({
    amount_in_cents: knex.raw('amount_in_cents / 1000000::bigint'),
  });
};
