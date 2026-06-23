import { db } from '../../../db-config';
import { createHandler } from '../../../utils/create-handler';
import { getDomainUrl } from '../../../utils/get-domain-url';
import { createJWT } from '../../../utils/jwt';
import { loadEnvVariable } from '../../../utils/load-env-variable';
import { sendEmail } from '../../../utils/send-email';
import { createEmailHTML } from '../util/create-email-html';

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

  const domainUrl = getDomainUrl();
  const html = createEmailHTML({
    title: 'Tervehdys!',
    bodyText: `Olet pyytänyt rekisteröityä <strong>e-markan</strong> käyttäjäksi. Jos tämä ei ollut sinä, voit jättää tämän viestin huomiotta. <br/>
          Muussa tapauksessa ole hyvä ja napauta <a href="${domainUrl}/register?token=${token}">tätä linkkiä</a> jatkaaksesi rekisteröitymisprosessia.`,
  });

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
