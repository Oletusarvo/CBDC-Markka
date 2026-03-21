/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('supply').update({
    unreleased_supply: knex.raw(
      '(100000000::bigint * 1000000000::bigint) - (select sum(balance_in_cents::bigint) from account)',
    ),
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('supply').update({ unreleased_supply: 0 });
};
