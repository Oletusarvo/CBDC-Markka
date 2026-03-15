const createSignature = require('./create-signature');

module.exports = async function updateAccountSignatures(trx) {
  const numAccounts = await trx('account').count('* as total').first();
  for (let i = 0; i < numAccounts.total; ++i) {
    const currentAcc = await trx('account')
      .select('id', 'user_id', 'balance_in_cents', 'nonce')
      .orderBy('id', 'desc')
      .offset(i)

      .first();

    await trx('account')
      .where({ id: currentAcc.id })
      .update({
        signature: createSignature(currentAcc),
      });
  }
};
