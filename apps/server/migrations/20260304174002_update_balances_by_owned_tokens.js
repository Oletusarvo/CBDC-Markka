/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.raw(`
      UPDATE account 
      SET balance_in_cents = (SELECT SUM(denom_type.value_in_cents) FROM currency_object LEFT JOIN denom_type ON denom_type.id = currency_object.denom_type_id WHERE currency_object.account_id = account.id);
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.resolve();
};
