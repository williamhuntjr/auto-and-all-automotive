import type { EstimateRequest } from "./estimate";
import type { PhotoAttachment } from "./estimate-photos";
import { sendMail } from "./mailer";
import { SITE } from "./seo";

const EMAIL = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;

const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

/** Emails a new estimate request to the shop, with Reply-To set to the customer when they gave an email address. */
export async function sendEstimateEmail(
  request: EstimateRequest,
  photos: PhotoAttachment[] = [],
) {
  const rows: [string, string][] = [
    ["Name", request.name],
    ["Phone or email", request.contact],
    ["Vehicle", request.vehicle],
    ["Service needed", request.service],
    ["Photos", photos.length ? `${photos.length} attached` : "None attached"],
  ];

  const text = [
    "New online estimate request",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Details:",
    request.details,
  ].join("\n");

  const html = `
    <h2 style="margin:0 0 16px;font-family:Arial,sans-serif">New online estimate request</h2>
    <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 16px 6px 0;color:#555"><b>${label}</b></td><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
    <h3 style="margin:20px 0 6px;font-family:Arial,sans-serif">Details</h3>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(request.details)}</p>`;

  await sendMail({
    to: process.env.ESTIMATE_TO_EMAIL?.trim() || SITE.estimatesEmail,
    subject: oneLine(
      `New estimate request: ${request.service} — ${request.vehicle} (${request.name})`,
    ).slice(0, 200),
    text,
    html,
    attachments: photos,
    replyTo: EMAIL.test(request.contact)
      ? {
          name: oneLine(request.name).replace(/["<>]/g, ""),
          address: request.contact,
        }
      : undefined,
  });
}
