import { ensureDatabaseSetup } from '@/lib/server/schema';
import { getOne, query } from '@/lib/server/db';
import { getJobApplicationRecipients, sendMail } from '@/lib/server/mail';
import { normalizeSlug, normalizeWhitespace, parseJsonArray, serializeJson, toBooleanFlag, toInteger } from '@/lib/server/utils';
import {
  getFileExtension,
  isValidEmail,
  isValidPhone,
  isValidSlug,
} from '@/lib/validation';

function parseSkills(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeWhitespace(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,/)
      .map((item) => normalizeWhitespace(item))
      .filter(Boolean);
  }

  return [];
}

function jobsSelectSql(whereClause) {
  return `
    SELECT
      jobs.*,
      role.name AS role_name,
      location.name AS location_name,
      employment.name AS employment_type_name,
      employment.value AS employment_type_value
    FROM job_postings AS jobs
    LEFT JOIN job_role_master AS role ON role.id = jobs.role_id
    LEFT JOIN job_location_master AS location ON location.id = jobs.location_id
    LEFT JOIN job_employment_type_master AS employment ON employment.id = jobs.employment_type_id
    ${whereClause}
    ORDER BY jobs.id DESC
  `;
}

function mapJobRow(row) {
  if (!row) return null;
  const skills = parseJsonArray(row.skills_json);
  return {
    ...row,
    skills,
    skills_text: skills.join('\n'),
  };
}

async function ensureUniqueJobSlug(slug, currentId = 0) {
  const existing = await getOne('SELECT id FROM job_postings WHERE slug = ? AND status = 1 AND id != ? LIMIT 1', [
    slug,
    currentId,
  ]);

  if (existing) {
    throw new Error('Job posting with the same slug already exists.');
  }
}

function normalizeJobPayload(payload) {
  const title = normalizeWhitespace(payload.title);
  return {
    title,
    slug: normalizeSlug(payload.slug || title),
    description: payload.description || '',
    skills_json: serializeJson(parseSkills(payload.skills_text || payload.skills_json || payload.skills)),
    role_id: toInteger(payload.role_id),
    location_id: toInteger(payload.location_id),
    employment_type_id: toInteger(payload.employment_type_id),
    is_published: toBooleanFlag(payload.is_published),
  };
}

export async function listPublishedJobs() {
  await ensureDatabaseSetup();
  const rows = await query(
    jobsSelectSql('WHERE jobs.status = 1 AND jobs.is_published = 1 AND role.status = 1 AND location.status = 1 AND employment.status = 1')
  );
  return rows.map(mapJobRow);
}

export async function listAdminJobs() {
  await ensureDatabaseSetup();
  const rows = await query(jobsSelectSql('WHERE jobs.status = 1'));
  return rows.map(mapJobRow);
}

export async function getJobById(id, { includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  const rows = await query(
    jobsSelectSql(includeDeleted ? 'WHERE jobs.id = ?' : 'WHERE jobs.id = ? AND jobs.status = 1'),
    [id]
  );
  return rows[0] ? mapJobRow(rows[0]) : null;
}

export async function createJobPosting(payload) {
  await ensureDatabaseSetup();
  const normalized = normalizeJobPayload(payload);

  if (!normalized.title || !normalized.slug || !normalized.description) {
    throw new Error('Title, slug, and description are required.');
  }
  if (!isValidSlug(normalized.slug)) {
    throw new Error('Slug can only contain lowercase letters, numbers, and hyphens.');
  }
  if (!normalized.role_id || !normalized.location_id || !normalized.employment_type_id) {
    throw new Error('Role, location, and employment type are required.');
  }
  if (normalizeWhitespace(normalized.description).length < 20) {
    throw new Error('Description must be at least 20 characters.');
  }

  await ensureUniqueJobSlug(normalized.slug);
  const result = await query(
    `INSERT INTO job_postings (
      title, slug, description, skills_json, role_id, location_id, employment_type_id,
      is_published, status, published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    [
      normalized.title,
      normalized.slug,
      normalized.description,
      normalized.skills_json,
      normalized.role_id,
      normalized.location_id,
      normalized.employment_type_id,
      normalized.is_published,
      normalized.is_published ? new Date() : null,
    ]
  );

  return getJobById(result.insertId, { includeDeleted: true });
}

export async function updateJobPosting(id, payload) {
  await ensureDatabaseSetup();
  const existing = await getJobById(id);
  if (!existing) {
    throw new Error('Job posting not found.');
  }

  const normalized = normalizeJobPayload(payload);

  if (!normalized.title || !normalized.slug || !normalized.description) {
    throw new Error('Title, slug, and description are required.');
  }
  if (!isValidSlug(normalized.slug)) {
    throw new Error('Slug can only contain lowercase letters, numbers, and hyphens.');
  }
  if (!normalized.role_id || !normalized.location_id || !normalized.employment_type_id) {
    throw new Error('Role, location, and employment type are required.');
  }
  if (normalizeWhitespace(normalized.description).length < 20) {
    throw new Error('Description must be at least 20 characters.');
  }

  await ensureUniqueJobSlug(normalized.slug, id);

  await query(
    `UPDATE job_postings SET
      title = ?, slug = ?, description = ?, skills_json = ?, role_id = ?, location_id = ?,
      employment_type_id = ?, is_published = ?, published_at = ?
    WHERE id = ?`,
    [
      normalized.title,
      normalized.slug,
      normalized.description,
      normalized.skills_json,
      normalized.role_id,
      normalized.location_id,
      normalized.employment_type_id,
      normalized.is_published,
      normalized.is_published ? new Date() : null,
      id,
    ]
  );

  return getJobById(id);
}

export async function softDeleteJobPosting(id) {
  await ensureDatabaseSetup();
  await query('UPDATE job_postings SET status = 0 WHERE id = ?', [id]);
}

export async function submitJobApplication(formData) {
  await ensureDatabaseSetup();

  const fullName = normalizeWhitespace(formData.get('fullName'));
  const emailAddress = normalizeWhitespace(formData.get('emailAddress'));
  const phoneNumber = normalizeWhitespace(formData.get('phoneNumber'));
  const message = normalizeWhitespace(formData.get('message'));
  const jobId = toInteger(formData.get('jobId'));
  const jobTitle = normalizeWhitespace(formData.get('jobTitle'));
  const resume = formData.get('resume');

  if (!fullName || !emailAddress || !phoneNumber || !resume?.size) {
    throw new Error('Full name, email address, phone number, and resume are required.');
  }
  if (!isValidEmail(emailAddress)) {
    throw new Error('Enter a valid email address.');
  }
  if (!isValidPhone(phoneNumber)) {
    throw new Error('Enter a valid phone number.');
  }
  if (!['pdf', 'doc', 'docx'].includes(getFileExtension(resume.name))) {
    throw new Error('Resume must be a PDF, DOC, or DOCX file.');
  }
  if (resume.size > 10 * 1024 * 1024) {
    throw new Error('Resume must be 10MB or smaller.');
  }

  const resolvedJob = jobId ? await getJobById(jobId) : null;
  const finalJobTitle = resolvedJob?.title || jobTitle || 'General application';
  const buffer = Buffer.from(await resume.arrayBuffer());

  await sendMail({
    to: getJobApplicationRecipients(),
    subject: `New job application: ${finalJobTitle}`,
    text: `${fullName} applied for ${finalJobTitle}.`,
    html: `
      <h2>New Job Application</h2>
      <p><strong>Job:</strong> ${finalJobTitle}</p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${emailAddress}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Message:</strong></p>
      <p>${message || 'No message provided.'}</p>
    `,
    attachments: [
      {
        filename: resume.name || 'resume',
        content: buffer,
        contentType: resume.type || 'application/octet-stream',
      },
    ],
  });
}
