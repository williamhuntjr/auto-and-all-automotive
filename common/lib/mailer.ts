import nodemailer, { type Transporter } from "nodemailer";

/** Thrown when the SMTP settings in the environment are missing. */
export class MailConfigError extends Error {}

const truthy = (value: string | undefined, fallback: boolean) =>
  value === undefined || value.trim() === ""
    ? fallback
    : ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());

let transporter: Transporter | null = null;

/**
 * SMTP settings come from the environment:
 *
 *   SMTP_HOST                     required
 *   SMTP_PORT                     default 587
 *   SMTP_SECURE                   default false; true = implicit TLS (port 465)
 *   SMTP_REQUIRE_TLS              default true; refuse to send unless the
 *                                 connection is upgraded with STARTTLS
 *   SMTP_USER / SMTP_PASS         optional login
 *   SMTP_TLS_REJECT_UNAUTHORIZED  default true; set false only for a local
 *                                 test server with a self-signed certificate
 *   MAIL_FROM                     default SMTP_USER
 */
function getTransporter(): Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST?.trim();
  if (!host) throw new MailConfigError("SMTP_HOST is not configured.");

  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = truthy(process.env.SMTP_SECURE, port === 465);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    // On port 587 the connection starts in plain text and is upgraded with
    // STARTTLS. Requiring it means mail is never sent unencrypted.
    requireTLS: !secure && truthy(process.env.SMTP_REQUIRE_TLS, true),
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: truthy(process.env.SMTP_TLS_REJECT_UNAUTHORIZED, true),
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
}

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: { name: string; address: string };
  attachments?: { filename: string; content: Buffer; contentType: string }[];
};

export async function sendMail(message: MailMessage): Promise<void> {
  const from = process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim();
  if (!from) throw new MailConfigError("MAIL_FROM is not configured.");
  await getTransporter().sendMail({ from, ...message });
}
