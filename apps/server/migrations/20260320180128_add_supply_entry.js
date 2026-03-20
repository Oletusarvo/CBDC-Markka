/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('supply').update({
    unreleased_supply: knex.raw(
      '(100 * 50000000000) - (select sum(balance_in_cents) from account)',
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
