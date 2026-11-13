import "server-only";
import { site } from "@/lib/data/site";

export type ContactMail = {
  name: string;
  email: string;
  reason?: string;
  message: string;
  attachment?: { filename: string; content: Buffer };
};

export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

/** Header values must stay on one line. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

/**
 * Sends a contact-form message to the studio inbox through Resend.
 * Throws when delivery is not set up or the provider refuses the message, so the form can say so.
 */
export async function sendContactMail(mail: ContactMail) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Mail delivery is not configured.");

  const from = process.env.CONTACT_FROM ?? `${site.domain} <onboarding@resend.dev>`;
  const text = [
    `Name: ${oneLine(mail.name)}`,
    `Email: ${oneLine(mail.email)}`,
    mail.reason ? `Reason: ${oneLine(mail.reason)}` : null,
    "",
    mail.message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [site.inbox],
      reply_to: oneLine(mail.email),
      subject: oneLine(`New inquiry${mail.reason ? ` (${mail.reason})` : ""} from ${mail.name}`).slice(0, 200),
      text,
      ...(mail.attachment
        ? { attachments: [{ filename: oneLine(mail.attachment.filename) || "attachment", content: mail.attachment.content.toString("base64") }] }
        : {}),
    }),
  });
  if (!res.ok) {
    console.error("Resend refused the message", res.status, await res.text().catch(() => ""));
    throw new Error("The mail provider refused the message.");
  }
}
