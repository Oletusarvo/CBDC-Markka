import crypto from 'crypto';

export function verifyAccountSignature(data: Record<string, any>) {
  const { signature, ...rest } = data;
  const signatureBuffer = Buffer.from(signature, 'base64');
  const dataBuffer = Buffer.from(JSON.stringify(rest), 'utf-8');
  const key = process.env.PUBLIC_KEY;

  return crypto.verify(null, dataBuffer, key, signatureBuffer);
}

export function signAccountState(data: Record<string, any>) {
  const { signature, id, user_id, balance_in_cents, nonce } = data;

  const dataBuffer = Buffer.from(
    JSON.stringify({
      id,
      user_id,
      balance_in_cents,
      nonce,
    }),
    'utf-8',
  );
  const key = process.env.PRIVATE_KEY;
  const sig = crypto.sign(null, dataBuffer, key);

  return sig.toString('base64');
}
