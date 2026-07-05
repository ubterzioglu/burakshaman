import nodemailer from "nodemailer";
import { site } from "@/lib/content";

export async function sendMail(input: {
  to?: string;
  subject: string;
  text: string;
}) {
  if (!process.env.SMTP_HOST) return { skipped: true };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === "465",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? site.email,
    to: input.to ?? site.email,
    subject: input.subject,
    text: input.text,
  });

  return { skipped: false };
}
