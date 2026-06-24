import { createEmailHTML } from '../features/auth/util/create-email-html';
import { getDomainUrl } from '../utils/get-domain-url';
import { loadEnvVariable } from '../utils/load-env-variable';
import { sendEmail } from '../utils/send-email';

/**Responsible for sending emails. */
class EmailService {
  constructor(
    private endpoint: string,
    private apiKey: string,
  ) {}

  async sendPasswordReset(to: string, token: string) {
    const domainUrl = getDomainUrl();
    const html = createEmailHTML({
      title: 'Tervehdys!',
      bodyText: `Olet pyytänyt salasanasi vaihtamista. Jos se et ollut sinä, voit jättää tämän viestin huomiotta. Muussa tapauksessa klikkaa <a href="${domainUrl}/reset-password?token=${token}">tähän.</a>`,
    });
    await this.send({
      to,
      html,
      subject: 'Vaihda E-MRK salasanasi',
    });
  }

  sendEmailVerification(to: string, token: string) {
    const domainUrl = getDomainUrl();
    const html = createEmailHTML({
      title: 'Tervehdys!',
      bodyText: `Olet rekisteröitynyt <strong>E-MRK</strong> käyttäjäksi. Jos tämä et ollut sinä, voit jättää viestin huomiotta. <br/>
              Muussa tapauksessa ole hyvä ja napauta <a href="${domainUrl}/verify-email?token=${token}">tätä linkkiä</a> vahvistaaksesi sähköpostiosoitteesi.`,
    });
    return this.send({
      to,
      subject: 'Vahvista sähköpostiosoitteesi',
      html,
    });
  }

  async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    const serviceEmail = loadEnvVariable('SERVICE_EMAIL', true);
    const body = JSON.stringify({
      sender: { email: serviceEmail, name: 'E-MRK' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    const res = await fetch(
      this.endpoint,

      {
        method: 'POST',
        body,
        headers: {
          'api-key': this.apiKey.trim(),
          'Content-Type': 'application/json',
        },
      },
    );

    return res;
  }
}

export const emailService = new EmailService(
  'https://api.brevo.com/v3/smtp/email',
  loadEnvVariable('EMAIL_API_KEY'),
);
