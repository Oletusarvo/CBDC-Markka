/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('user')
    .whereNull('user_status_id')
    .update({
      user_status_id: knex
        .select('id')
        .from('user_status_type')
        .where({ label: 'active' })
        .limit(1),
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.resolve();
};
