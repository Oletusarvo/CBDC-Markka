import { createHandler } from '../../../utils/create-handler';
import { createJWT } from '../../../utils/jwt';
import { sendEmail } from '../../../utils/send-email';

export const createRegistrationTokenHandler = createHandler(async (req, res) => {
  const { email } = req.data;

  const token = createJWT(
    { email },
    {
      expiresIn: '24h',
    },
  );

  const html = `
      <html>
        <h1>Tervehdys!</h1>
        <p>
          Olet pyytänyt rekisteröityä <strong>e-markan</strong> käyttäjäksi. Jos tämä ei ollut sinä, voit jättää tämän viestin huomiotta. <br/>
          Muussa tapauksessa ole hyvä ja napauta <a href="${process.env.DOMAIN_URL}/register?token=${token}">tätä linkkiä</a> jatkaaksesi rekisteröitymisprosessia.
        </p>
        <i>Ystävällisin terveisin, e-Markka tiimi.</i>
      </html>
    `;

  await sendEmail({
    subject: 'Rekisteröityminen e-Markan käyttäjäksi',
    to: email,

    html,
  });

  return res.status(200).end();
});
