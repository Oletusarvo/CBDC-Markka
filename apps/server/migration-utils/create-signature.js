require('dotenv').config();
const crypto = require('crypto');

const privateKeyBase64 = process.env.PRIVATE_KEY;
const privateKeyBuffer = Buffer.from(privateKeyBase64, 'base64');
const privateKey = crypto.createPrivateKey({
  key: privateKeyBuffer,
  type: 'pkcs8',
  format: 'der',
});

module.exports = function createSignature(data) {
  const accBuffer = Buffer.from(JSON.stringify(data), 'utf-8');
  const sig = crypto.sign(null, accBuffer, privateKey);
  return sig.toString('base64');
};
