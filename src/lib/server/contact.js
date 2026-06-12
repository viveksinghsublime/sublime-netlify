import { ensureDatabaseSetup } from '@/lib/server/schema';
import { getOne, query } from '@/lib/server/db';
import { getContactRecipients, sendMail } from '@/lib/server/mail';
import { escapeHtml, normalizeWhitespace, stripControlCharacters } from '@/lib/server/utils';
import { validateContactLeadPayload } from '@/lib/validation';

export async function listAdminContacts() {
  await ensureDatabaseSetup();
  return query('SELECT * FROM contact_us ORDER BY created_at DESC, id DESC');
}

export async function getAdminContactById(id) {
  await ensureDatabaseSetup();
  return getOne('SELECT * FROM contact_us WHERE id = ? LIMIT 1', [id]);
}

export async function submitContactLead(payload) {
  await ensureDatabaseSetup();

  const lead = {
    name: stripControlCharacters(payload.name || payload.fullName),
    email: normalizeWhitespace(payload.email || payload.emailAddress),
    phone: stripControlCharacters(payload.phone || payload.phoneNumber),
    company_name: stripControlCharacters(payload.company_name || payload.companyName),
    service_interested_in: stripControlCharacters(payload.service_interested_in || payload.serviceInterestedIn),
    message: stripControlCharacters(payload.message),
    source: stripControlCharacters(payload.source || 'contact-us'),
    subject: stripControlCharacters(payload.subject || 'New contact enquiry from website'),
  };

  const validationMessage = validateContactLeadPayload(lead);
  if (validationMessage) {
    throw new Error(validationMessage);
  }

  await query(
    `INSERT INTO contact_us (
      name, email, phone, company_name, service_interested_in, message, source, subject
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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

  try {
    await sendMail({
      to: getContactRecipients(),
      subject: lead.subject,
      text: `${lead.name} submitted a new contact enquiry.`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
        <p><strong>Company:</strong> ${escapeHtml(lead.company_name || 'Not provided')}</p>
        <p><strong>Service:</strong> ${escapeHtml(lead.service_interested_in || 'Not provided')}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(lead.message || 'No message provided.').replace(/\n/g, '<br />')}</p>
        <p><strong>Source:</strong> ${escapeHtml(lead.source)}</p>
      `,
    });
  } catch (error) {
    console.error('Failed to send contact notification email.', error);
    // Email notification is best-effort. Form submission succeeds regardless.
  }
}
