import nodemailer from 'nodemailer';

let transporter;

function hasMailConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  if (!hasMailConfig()) {
    throw new Error('SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.');
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

function normalizeRecipients(rawValue, fallback = '') {
  return (rawValue || fallback)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function sendMail({ to, subject, html, text, attachments = [] }) {
  const activeTransporter = getTransporter();
  const recipients = Array.isArray(to) ? to : normalizeRecipients(to);

  if (recipients.length === 0) {
    throw new Error('No mail recipients were provided.');
  }

  return activeTransporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: recipients,
    subject,
    html,
    text,
    attachments,
  });
}

export function getContactRecipients() {
  return normalizeRecipients(
    process.env.CONTACT_RECIPIENTS,
    'sales@sublimetechnocorp.com,info@sublimetechnocorp.com,sami@sublimetechnocorp.com'
  );
}

export function getJobApplicationRecipients() {
  return normalizeRecipients(
    process.env.JOB_APPLICATION_RECIPIENTS,
    process.env.CONTACT_RECIPIENTS || 'hr@sublimetechnocorp.com'
  );
}

