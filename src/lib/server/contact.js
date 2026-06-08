import { ensureDatabaseSetup } from '@/lib/server/schema';
import { query } from '@/lib/server/db';
import { getContactRecipients, sendMail } from '@/lib/server/mail';
import { normalizeWhitespace } from '@/lib/server/utils';
import { validateContactLeadPayload } from '@/lib/validation';

export async function submitContactLead(payload) {
  await ensureDatabaseSetup();

  const lead = {
    name: normalizeWhitespace(payload.name || payload.fullName),
    email: normalizeWhitespace(payload.email || payload.emailAddress),
    phone: normalizeWhitespace(payload.phone || payload.phoneNumber),
    company_name: normalizeWhitespace(payload.company_name || payload.companyName),
    service_interested_in: normalizeWhitespace(payload.service_interested_in || payload.serviceInterestedIn),
    message: normalizeWhitespace(payload.message),
    source: normalizeWhitespace(payload.source || 'contact-us'),
    subject: normalizeWhitespace(payload.subject || 'New contact enquiry from website'),
  };

  const validationMessage = validateContactLeadPayload(lead);
  if (validationMessage) {
    throw new Error(validationMessage);
  }

  await query(
    `INSERT INTO contact_us (
      name, email, phone, company_name, service_interested_in, message, source, subject, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      lead.name,
      lead.email,
      lead.phone,
      lead.company_name,
      lead.service_interested_in,
      lead.message,
      lead.source,
      lead.subject,
    ]
  );

  await sendMail({
    to: getContactRecipients(),
    subject: lead.subject,
    text: `${lead.name} submitted a new contact enquiry.`,
    html: `
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Company:</strong> ${lead.company_name || 'Not provided'}</p>
      <p><strong>Service:</strong> ${lead.service_interested_in || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${lead.message || 'No message provided.'}</p>
      <p><strong>Source:</strong> ${lead.source}</p>
    `,
  });
}
