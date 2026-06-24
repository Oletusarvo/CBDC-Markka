import { db } from '../../../db-config';
import { createHandler } from '../../../utils/create-handler';
import { getDomainUrl } from '../../../utils/get-domain-url';
import { createJWT } from '../../../utils/jwt';
import { loadEnvVariable } from '../../../utils/load-env-variable';
import { sendEmail } from '../../../utils/send-email';
import { createEmailHTML } from '../util/create-email-html';

export const sendEmailVerificationHandler = createHandler(async (req, res) => {
  const { id } = req.data;
  console.log(id);
  const user = await db('user').where({ id }).first();
  console.log(user);
  const token = createJWT(
    { id: user.id },
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
    to: user.email,
    html,
  });

  if (emailRes.ok) {
    return res.status(200).end();
  } else {
    return res.status(500).end();
  }
});
