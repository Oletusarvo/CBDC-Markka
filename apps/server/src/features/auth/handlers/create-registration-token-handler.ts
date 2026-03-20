import { db } from '../../../db-config';
import { createHandler } from '../../../utils/create-handler';
import { createJWT } from '../../../utils/jwt';
import { loadEnvVariable } from '../../../utils/load-env-variable';
import { sendEmail } from '../../../utils/send-email';

export const createRegistrationTokenHandler = createHandler(async (req, res) => {
  const { email } = req.data;
  const user = await db('user').where({ email }).first();
  if (user) {
    return res.status(409).json({
      error: 'auth:email-taken',
    });
  }
  const token = createJWT(
    { email },
    {
      expiresIn: '24h',
    },
  );

  const domainUrl = loadEnvVariable('DOMAIN_URL', false) || 'http://localhost:5173';
  const html = `
      <html>
        <h1>Tervehdys!</h1>
        <p>
          Olet pyytänyt rekisteröityä <strong>e-markan</strong> käyttäjäksi. Jos tämä ei ollut sinä, voit jättää tämän viestin huomiotta. <br/>
          Muussa tapauksessa ole hyvä ja napauta <a href="${domainUrl}/#/register?token=${token}">tätä linkkiä</a> jatkaaksesi rekisteröitymisprosessia.
        </p>
        <i>Ystävällisin terveisin, e-Markka tiimi.</i>
      </html>
    `;

  const emailRes = await sendEmail({
    subject: 'Rekisteröityminen e-Markan käyttäjäksi',
    to: email,
    html,
  });

  if (emailRes.ok) {
    return res.status(200).end();
  } else {
    return res.status(500).end();
  }
});
