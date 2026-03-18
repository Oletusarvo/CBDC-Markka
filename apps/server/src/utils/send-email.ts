
require('dotenv').config();
/**Sends an email using the configured transport-object in the nodemailer.config file.*/
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const body = JSON.stringify({
    sender: { email: process.env.SERVICE_EMAIL, name: 'e-Markka App' },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });

  return await fetch(
    'https://api.brevo.com/v3/smtp/email',

    {
      body,
      headers: {
        'api-key': process.env.EMAIL_API_KEY.trim(),
        'Content-Type': 'application/json',
      },
    },
  );
}
