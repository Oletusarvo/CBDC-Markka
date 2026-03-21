/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('account').update({
    balance_in_cents: knex.raw('balance_in_cents * 1000000::bigint'),
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('account').update({
    balance_in_cents: knex.raw('balance_in_cents / 1000000::bigint'),
  });
};
