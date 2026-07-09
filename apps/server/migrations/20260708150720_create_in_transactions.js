const { v4 } = require('uuid');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.transaction(async trx => {
    const numTransactions = await trx('transaction').count('* AS result').first();
    const batchSize = 10;
    for (let i = 0; i < numTransactions.result; i += batchSize) {
      const batch = await trx('transaction')
        .select('id', 'from', 'to', 'amount_in_cents', 'timestamp', 'message')
        .offset(i)
        .limit(batchSize);

      //Insert transactions
      const inputData = batch.map(data => {
        const inputId = v4();
        const outputId = v4();

        return {
          message: data.message,
          input: {
            id: inputId,
            account_id: data.to,
            amount_in_cents: data.amount_in_cents,
            transaction_type_id: trx
              .select('id')
              .from('transaction_type')
              .where({ label: 'input' })
              .limit(1),
            created_at: data.timestamp,
          },
          output: {
            id: outputId,
            account_id: data.from,
            amount_in_cents: data.amount_in_cents,
            transaction_type_id: trx
              .select('id')
              .from('transaction_type')
              .where({ label: 'output' })
              .limit(1),
            created_at: data.timestamp,
          },
        };
      });

      await trx('transaction_data').insert(
        inputData
          .map(data => {
            return [data.input, data.output];
          })
          .flat(),
      );

      //Insert metadata.
      const metadata = inputData.map(data => {
        return {
          output_transaction_id: data.output.id,
          input_transaction_id: data.input.id,
          message: data.message,
        };
      });

      await trx('transaction_metadata').insert(metadata);
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return new Promise(async (resolve, reject) => {
    await knex.transaction(async trx => {
      await trx('transaction_data').del();
      await trx('transaction_metadata').del();
    });
    resolve();
  });
};
