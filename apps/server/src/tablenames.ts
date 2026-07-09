export const tablenames = {
  accounts: 'account',
  currencyObjects: 'currency_object',
  denomTypes: 'denom_type',
  users: 'user',
  /**@deprecated Use ledger and ledger_metadata for storing sender/recipient relationships */
  transactions: 'transaction',
  ledger: 'transaction_data',
  ledger_metadata: 'transaction_metadata',
  paymentSessions: 'payment_session',
  paymentSessionStatus: 'payment_session_status_type',
  authCodes: 'auth_code',
};
