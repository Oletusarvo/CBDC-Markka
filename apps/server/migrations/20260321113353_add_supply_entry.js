/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('supply').update({
    unreleased_supply: knex.raw('100000000::bigint * 43200000::bigint'),
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('supply').update({ unreleased_supply: 0 });
};
