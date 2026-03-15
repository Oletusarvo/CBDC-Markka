import crypto from 'crypto';

export function verifyAccountSignature(data: Record<string, any>) {
  const { signature, id, user_id, balance_in_cents, nonce } = data;
  const signatureBuffer = Buffer.from(signature, 'base64');
  const dataBuffer = Buffer.from(
    JSON.stringify({
      id,
      user_id,
      balance_in_cents,
      nonce,
    }),
    'utf-8',
  );
  const keyBase64 = process.env.PUBLIC_KEY;
  const keyBuffer = Buffer.from(keyBase64, 'base64');
  const key = crypto.createPublicKey({
    key: keyBuffer,
    type: 'spki',
    format: 'der',
  });

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
  const keyBase64 = process.env.PRIVATE_KEY;
  const keyBuffer = Buffer.from(keyBase64, 'base64');
  const key = crypto.createPrivateKey({ key: keyBuffer, type: 'pkcs8', format: 'der' });
  const sig = crypto.sign(null, dataBuffer, key);

  return sig.toString('base64');
}
