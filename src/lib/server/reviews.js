import { ensureDatabaseSetup } from '@/lib/server/schema';
import { getOne, query } from '@/lib/server/db';
import { saveUploadedFile } from '@/lib/server/uploads';
import { normalizeWhitespace, toBooleanFlag, toInteger } from '@/lib/server/utils';
import { validateImageFile, validateReviewForm } from '@/lib/validation';

function normalizeReviewPayload(payload) {
  return {
    name: normalizeWhitespace(payload.name),
    position: payload.position || '',
    company_name: payload.company_name || '',
    message: payload.message || '',
    sort_order: toInteger(payload.sort_order, 0),
    is_published: toBooleanFlag(payload.is_published),
  };
}

export async function listPublishedReviews() {
  await ensureDatabaseSetup();
  return query(
    'SELECT * FROM reviews WHERE status = 1 AND is_published = 1 ORDER BY sort_order ASC, id DESC'
  );
}

export async function listAdminReviews({ includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  return query(
    `SELECT * FROM reviews ${includeDeleted ? '' : 'WHERE status = 1'} ORDER BY sort_order ASC, id DESC`
  );
}

export async function getReviewById(id, { includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  return getOne(
    `SELECT * FROM reviews WHERE id = ? ${includeDeleted ? '' : 'AND status = 1'} LIMIT 1`,
    [id]
  );
}

export async function createReview(formData) {
  await ensureDatabaseSetup();
  const payload = normalizeReviewPayload(JSON.parse(formData.get('payload') || '{}'));
  const imageFile = formData.get('image');

  const validationMessage = validateReviewForm(payload);
  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const imageValidationMessage = validateImageFile(imageFile);
  if (imageValidationMessage) {
    throw new Error(imageValidationMessage);
  }

  const existingSortOrder = await getOne(
    'SELECT id FROM reviews WHERE sort_order = ? AND status = 1 LIMIT 1',
    [payload.sort_order]
  );
  if (existingSortOrder) {
    throw new Error(`Sort order ${payload.sort_order} is already in use. Choose a different value.`);
  }

  const image = await saveUploadedFile(imageFile, 'reviews', 'review');
  const result = await query(
    `INSERT INTO reviews (name, position, company_name, message, image, sort_order, is_published, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [payload.name, payload.position, payload.company_name, payload.message, image, payload.sort_order, payload.is_published]
  );

  return getReviewById(result.insertId, { includeDeleted: false });
}

export async function updateReview(id, formData) {
  await ensureDatabaseSetup();
  const existing = await getReviewById(id, { includeDeleted: false });
  if (!existing) {
    throw new Error('Review not found.');
  }

  const payload = normalizeReviewPayload(JSON.parse(formData.get('payload') || '{}'));
  const imageFile = formData.get('image');

  const validationMessage = validateReviewForm(payload);
  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const imageValidationMessage = validateImageFile(imageFile);
  if (imageValidationMessage) {
    throw new Error(imageValidationMessage);
  }

  const duplicateSortOrder = await getOne(
    'SELECT id FROM reviews WHERE sort_order = ? AND id != ? AND status = 1 LIMIT 1',
    [payload.sort_order, id]
  );
  if (duplicateSortOrder) {
    throw new Error(`Sort order ${payload.sort_order} is already in use. Choose a different value.`);
  }

  const image = (await saveUploadedFile(imageFile, 'reviews', 'review')) || existing.image || '';
  await query(
    'UPDATE reviews SET name = ?, position = ?, company_name = ?, message = ?, image = ?, sort_order = ?, is_published = ? WHERE id = ?',
    [payload.name, payload.position, payload.company_name, payload.message, image, payload.sort_order, payload.is_published, id]
  );

  return getReviewById(id, { includeDeleted: false });
}

export async function softDeleteReview(id) {
  await ensureDatabaseSetup();
  await query('UPDATE reviews SET status = 2 WHERE id = ?', [id]);
}
