import { createEmailHTML } from "../features/auth/util/create-email-html";
import { getDomainUrl } from "../utils/get-domain-url";
import { loadEnvVariable } from "../utils/load-env-variable";
import { sendEmail } from "../utils/send-email";

/**Responsible for sending emails. */
class EmailService {
  constructor(
    private endpoint: string,
    private apiKey: string,
  ) {}

  async sendPasswordReset(to: string, token: string) {
    const domainUrl = getDomainUrl();
    const html = createEmailHTML({
      title: "Greetings!",
      bodyText: `You have requested to change your password. If it wasn't you, please ignore this message. Otherwise, please click <a href="${domainUrl}/reset-password?token=${token}">here.</a>`,
    });
    await this.send({
      to,
      html,
      subject: "Change your e-MRK password",
    });
  }

  sendEmailVerification(to: string, token: string) {
    const domainUrl = getDomainUrl();
    const html = createEmailHTML({
      title: "Greetings!",
      bodyText: `You have registered as an <strong>e-MRK</strong> user. If it wasn't you, please ignore this message. <br/>
              Otherwise, please click <a href="${domainUrl}/verify-email?token=${token}">here</a> to verify your email.`,
    });
    return this.send({
      to,
      subject: "Verify your email",
      html,
    });
  }

  async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    const serviceEmail = loadEnvVariable("SERVICE_EMAIL", true);
    const body = JSON.stringify({
      sender: { email: serviceEmail, name: "E-MRK" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    const res = await fetch(
      this.endpoint,

      {
        method: "POST",
        body,
        headers: {
          "api-key": this.apiKey.trim(),
          "Content-Type": "application/json",
        },
      },
    );

    return res;
  }
}

export const emailService = new EmailService(
  "https://api.brevo.com/v3/smtp/email",
  loadEnvVariable("EMAIL_API_KEY"),
);
