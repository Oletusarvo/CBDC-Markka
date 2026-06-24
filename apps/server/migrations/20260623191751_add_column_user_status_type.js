/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('user', tbl => {
    tbl.integer('user_status_id').references('id').inTable('user_status_type').onUpdate('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('user', tbl => {
    tbl.dropColumn('user_status_id');
  });
};
