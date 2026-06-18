/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('supply').update({
    unreleased_supply: knex.raw(
      '(100::bigint * 21000000000000::bigint) - (select sum(balance_in_cents::bigint) from account)',
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
