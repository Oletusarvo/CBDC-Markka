const loadSql = require('../migration-utils/load-sql');

const tablename = 'transaction_metadata';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .uuid('input_transaction_id')
        .references('id')
        .inTable('transaction_data')
        .onDelete('SET NULL');
      tbl
        .uuid('output_transaction_id')
        .references('id')
        .inTable('transaction_data')
        .onDelete('SET NULL');
      tbl.string('message');
    })
    .then(async () => {
      const verifyTransactionTypesSQL = await loadSql('verify-transaction-types.sql');
      const verifyTransactionAmountsSQL = await loadSql('verify-transactions-equal.sql');
      await knex.raw(verifyTransactionTypesSQL);
      await knex.raw(verifyTransactionAmountsSQL);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .raw('DROP TRIGGER IF EXISTS verify_transactions_equal ON ??', [tablename])
    .raw('DROP TRIGGER IF EXISTS verify_transaction_types ON ??', [tablename])
    .raw('DROP FUNCTION IF EXISTS verify_transactions_equal')
    .raw('DROP FUNCTION IF EXISTS verify_transaction_types')
    .dropTableIfExists(tablename);
};
