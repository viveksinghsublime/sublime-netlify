import { ensureDatabaseSetup } from '@/lib/server/schema';
import { getOne, query } from '@/lib/server/db';
import { saveUploadedFile, saveUploadedFiles } from '@/lib/server/uploads';
import {
  normalizeSlug,
  normalizeWhitespace,
  parseJsonArray,
  parseJsonObject,
  serializeJson,
  toBooleanFlag,
  toInteger,
} from '@/lib/server/utils';
import { isValidSlug } from '@/lib/validation';

function mapCaseStudyRow(row) {
  if (!row) return null;

  return {
    ...row,
    keypoints: parseJsonArray(row.keypoints),
    features: parseJsonArray(row.features),
    product_image: parseJsonArray(row.product_image),
    why_us_data: parseJsonArray(row.why_us_data),
  };
}

function caseStudySelectSql(whereClause = 'WHERE cs.status = 1') {
  return `
    SELECT
      cs.*,
      cat.name AS category_name,
      subcat.name AS subcategory_name
    FROM case_study AS cs
    LEFT JOIN case_study_category AS cat ON cat.id = cs.categoryId
    LEFT JOIN case_study_subcategory AS subcat ON subcat.id = cs.subCategoryId
    ${whereClause}
    ORDER BY cs.id DESC
  `;
}

async function ensureUniqueCaseStudyTitle(title, currentId = 0) {
  const existing = await getOne(
    'SELECT id FROM case_study WHERE LOWER(title) = ? AND status = 1 AND id != ? LIMIT 1',
    [String(title).toLowerCase(), currentId]
  );

  if (existing) {
    throw new Error('Case study with the same title already exists.');
  }
}

function normalizeProductImages(items) {
  return parseJsonArray(items)
    .map((item) => {
      if (typeof item === 'string') {
        return { url: item };
      }
      if (item?.url) {
        return { url: item.url };
      }
      return null;
    })
    .filter(Boolean);
}

async function enrichCaseStudyPayloadWithUploads(payload, formData, existingRecord) {
  const keypoints = parseJsonArray(payload.keypoints).map((item) => ({
    title: item?.title || '',
    subtitle: item?.subtitle || '',
    image: item?.image || '',
  }));

  for (let index = 0; index < keypoints.length; index += 1) {
    const file = formData.get(`keypoint_image_${index}`);
    if (file?.size) {
      keypoints[index].image = await saveUploadedFile(file, 'case_study', `keypoint-${index}`);
    }
  }

  const whyUsData = parseJsonArray(payload.why_us_data).map((item) => ({
    title: item?.title || '',
    description: item?.description || '',
    icon: item?.icon || '',
  }));

  for (let index = 0; index < whyUsData.length; index += 1) {
    const file = formData.get(`why_us_image_${index}`);
    if (file?.size) {
      whyUsData[index].icon = await saveUploadedFile(file, 'case_study', `why-us-${index}`);
    }
  }

  const features = parseJsonArray(payload.features).map((group) => ({
    feature: group?.feature || '',
    details: parseJsonArray(group?.details).map((detail) => ({
      name: detail?.name || '',
      description: detail?.description || '',
      image: detail?.image || '',
    })),
  }));

  for (let groupIndex = 0; groupIndex < features.length; groupIndex += 1) {
    const details = features[groupIndex].details || [];
    for (let detailIndex = 0; detailIndex < details.length; detailIndex += 1) {
      const file = formData.get(`feature_image_${groupIndex}_${detailIndex}`);
      if (file?.size) {
        details[detailIndex].image = await saveUploadedFile(
          file,
          'case_study',
          `feature-${groupIndex}-${detailIndex}`
        );
      }
    }
  }

  const existingProductImages = normalizeProductImages(payload.existingProductImages || existingRecord?.product_image);
  const uploadedProductImages = await saveUploadedFiles(
    formData.getAll('product_images').filter((file) => file?.size),
    'case_study',
    'product'
  );

  return {
    image:
      (await saveUploadedFile(formData.get('image'), 'case_study', 'main')) ||
      existingRecord?.image ||
      '',
    logo:
      (await saveUploadedFile(formData.get('logo'), 'case_study', 'logo')) ||
      existingRecord?.logo ||
      '',
    cover_image:
      (await saveUploadedFile(formData.get('cover_image'), 'case_study', 'cover')) ||
      existingRecord?.cover_image ||
      '',
    keypoints,
    why_us_data: whyUsData,
    features,
    product_image: [
      ...existingProductImages,
      ...uploadedProductImages.map((url) => ({ url })),
    ],
  };
}

function normalizeCaseStudyPayload(payload) {
  return {
    title: normalizeWhitespace(payload.title),
    sub_title: payload.sub_title || '',
    category_url_name: normalizeWhitespace(payload.category_url_name || payload.title),
    short_url: payload.short_url || '',
    seo_title: payload.seo_title || '',
    seo_description: payload.seo_description || '',
    keywords: payload.keywords || '',
    categoryId: toInteger(payload.categoryId),
    subCategoryId: toInteger(payload.subCategoryId),
    situation: payload.situation || '',
    solution: payload.solution || '',
    product_description: payload.product_description || '',
    colorCode: normalizeWhitespace(payload.colorCode).replace(/^#/, ''),
    isTopProject: toBooleanFlag(payload.isTopProject),
    why_us_title: payload.why_us_title || '',
    feature_title: payload.feature_title || '',
  };
}

async function parseCaseStudyFormData(formData, existingRecord = null) {
  const payload = parseJsonObject(formData.get('payload'));
  const normalizedPayload = normalizeCaseStudyPayload(payload);

  if (!normalizedPayload.title) {
    throw new Error('Title is required.');
  }
  if (!normalizedPayload.category_url_name || !isValidSlug(normalizedPayload.category_url_name)) {
    throw new Error('Slug / Category URL Name can only contain lowercase letters, numbers, and hyphens.');
  }
  if (!normalizedPayload.categoryId) {
    throw new Error('Category is required.');
  }
  if (!normalizedPayload.seo_title) {
    throw new Error('SEO title is required.');
  }
  if (!normalizedPayload.seo_description) {
    throw new Error('SEO description is required.');
  }
  if (!normalizedPayload.situation) {
    throw new Error('Situation is required.');
  }
  if (!normalizedPayload.solution) {
    throw new Error('Solution is required.');
  }
  if (!normalizedPayload.product_description) {
    throw new Error('Product description is required.');
  }

  const uploadedContent = await enrichCaseStudyPayloadWithUploads(payload, formData, existingRecord);

  return {
    ...normalizedPayload,
    ...uploadedContent,
  };
}

export function getCaseStudySlug(caseStudy) {
  return normalizeSlug(caseStudy?.category_url_name || caseStudy?.title || '');
}

export async function listPublicCaseStudies() {
  await ensureDatabaseSetup();
  const rows = await query(caseStudySelectSql('WHERE cs.status = 1'));
  return rows.map(mapCaseStudyRow);
}

export async function listAdminCaseStudies() {
  await ensureDatabaseSetup();
  const rows = await query(caseStudySelectSql('WHERE cs.status = 1'));
  return rows.map(mapCaseStudyRow);
}

export async function getCaseStudyById(id, { includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  const whereClause = includeDeleted ? 'WHERE cs.id = ?' : 'WHERE cs.id = ? AND cs.status = 1';
  const rows = await query(caseStudySelectSql(whereClause), [id]);
  return rows[0] ? mapCaseStudyRow(rows[0]) : null;
}

export async function getCaseStudyBySlug(slug) {
  const studies = await listPublicCaseStudies();
  return studies.find((study) => getCaseStudySlug(study) === normalizeSlug(slug)) || null;
}

export async function createCaseStudy(formData) {
  await ensureDatabaseSetup();
  const payload = await parseCaseStudyFormData(formData);
  await ensureUniqueCaseStudyTitle(payload.title);

  const result = await query(
    `INSERT INTO case_study (
      title, sub_title, category_url_name, short_url, seo_title, seo_description, keywords,
      categoryId, subCategoryId, image, logo, cover_image, keypoints, features, situation, solution,
      product_description, product_image, colorCode, isTopProject, why_us_data, why_us_title, feature_title, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      payload.title,
      payload.sub_title,
      payload.category_url_name,
      payload.short_url,
      payload.seo_title,
      payload.seo_description,
      payload.keywords,
      payload.categoryId,
      payload.subCategoryId,
      payload.image,
      payload.logo,
      payload.cover_image,
      serializeJson(payload.keypoints),
      serializeJson(payload.features),
      payload.situation,
      payload.solution,
      payload.product_description,
      serializeJson(payload.product_image),
      payload.colorCode,
      payload.isTopProject,
      serializeJson(payload.why_us_data),
      payload.why_us_title,
      payload.feature_title,
    ]
  );

  return getCaseStudyById(result.insertId, { includeDeleted: true });
}

export async function updateCaseStudy(id, formData) {
  await ensureDatabaseSetup();
  const existingRecord = await getCaseStudyById(id);

  if (!existingRecord) {
    throw new Error('Case study not found.');
  }

  const payload = await parseCaseStudyFormData(formData, existingRecord);
  await ensureUniqueCaseStudyTitle(payload.title, id);

  await query(
    `UPDATE case_study SET
      title = ?, sub_title = ?, category_url_name = ?, short_url = ?, seo_title = ?, seo_description = ?,
      keywords = ?, categoryId = ?, subCategoryId = ?, image = ?, logo = ?, cover_image = ?, keypoints = ?,
      features = ?, situation = ?, solution = ?, product_description = ?, product_image = ?, colorCode = ?,
      isTopProject = ?, why_us_data = ?, why_us_title = ?, feature_title = ?
    WHERE id = ?`,
    [
      payload.title,
      payload.sub_title,
      payload.category_url_name,
      payload.short_url,
      payload.seo_title,
      payload.seo_description,
      payload.keywords,
      payload.categoryId,
      payload.subCategoryId,
      payload.image,
      payload.logo,
      payload.cover_image,
      serializeJson(payload.keypoints),
      serializeJson(payload.features),
      payload.situation,
      payload.solution,
      payload.product_description,
      serializeJson(payload.product_image),
      payload.colorCode,
      payload.isTopProject,
      serializeJson(payload.why_us_data),
      payload.why_us_title,
      payload.feature_title,
      id,
    ]
  );

  return getCaseStudyById(id);
}

export async function softDeleteCaseStudy(id) {
  await ensureDatabaseSetup();
  await query('UPDATE case_study SET status = 2 WHERE id = ?', [id]);
}

export async function listCaseStudyCategories({ includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  return query(
    `SELECT * FROM case_study_category ${includeDeleted ? '' : 'WHERE status = 1'} ORDER BY id DESC`
  );
}

export async function getCaseStudyCategoryById(id, { includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  return getOne(
    `SELECT * FROM case_study_category WHERE id = ? ${includeDeleted ? '' : 'AND status = 1'} LIMIT 1`,
    [id]
  );
}

export async function createCaseStudyCategory(payload) {
  await ensureDatabaseSetup();
  const name = normalizeWhitespace(payload.name);
  const urlName = normalizeWhitespace(payload.url_name || name);

  if (!name || !urlName) {
    throw new Error('Category name and URL name are required.');
  }

  const duplicate = await getOne(
    'SELECT id FROM case_study_category WHERE LOWER(name) = ? AND LOWER(url_name) = ? AND status = 1 LIMIT 1',
    [name.toLowerCase(), urlName.toLowerCase()]
  );
  if (duplicate) {
    throw new Error('Category with the same name and URL name already exists.');
  }

  const result = await query(
    'INSERT INTO case_study_category (name, url_name, status) VALUES (?, ?, 1)',
    [name, urlName]
  );

  return getCaseStudyCategoryById(result.insertId, { includeDeleted: true });
}

export async function updateCaseStudyCategory(id, payload) {
  await ensureDatabaseSetup();
  const existingCategory = await getCaseStudyCategoryById(id);
  if (!existingCategory) {
    throw new Error('Case study category not found.');
  }

  const name = normalizeWhitespace(payload.name);
  const urlName = normalizeWhitespace(payload.url_name || name);

  if (!name || !urlName) {
    throw new Error('Category name and URL name are required.');
  }

  const duplicate = await getOne(
    'SELECT id FROM case_study_category WHERE LOWER(name) = ? AND LOWER(url_name) = ? AND status = 1 AND id != ? LIMIT 1',
    [name.toLowerCase(), urlName.toLowerCase(), id]
  );
  if (duplicate) {
    throw new Error('Category with the same name and URL name already exists.');
  }

  await query('UPDATE case_study_category SET name = ?, url_name = ? WHERE id = ?', [name, urlName, id]);
  return getCaseStudyCategoryById(id);
}

export async function softDeleteCaseStudyCategory(id) {
  await ensureDatabaseSetup();
  const linkedSubcategory = await getOne(
    'SELECT id FROM case_study_subcategory WHERE cat_id = ? AND status = 1 LIMIT 1',
    [id]
  );

  if (linkedSubcategory) {
    throw new Error('Category is still linked to an active subcategory.');
  }

  await query('UPDATE case_study_category SET status = 2 WHERE id = ?', [id]);
}

export async function listCaseStudySubcategories({ includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  return query(
    `SELECT subcat.*, cat.name AS cat_name
     FROM case_study_subcategory AS subcat
     LEFT JOIN case_study_category AS cat ON cat.id = subcat.cat_id
     ${includeDeleted ? '' : 'WHERE subcat.status = 1'}
     ORDER BY subcat.id DESC`
  );
}

export async function getCaseStudySubcategoryById(id, { includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  return getOne(
    `SELECT * FROM case_study_subcategory WHERE id = ? ${includeDeleted ? '' : 'AND status = 1'} LIMIT 1`,
    [id]
  );
}

export async function createCaseStudySubcategory(payload) {
  await ensureDatabaseSetup();
  const name = normalizeWhitespace(payload.name);
  const categoryId = toInteger(payload.cat_id);

  if (!name || !categoryId) {
    throw new Error('Subcategory name and parent category are required.');
  }

  const duplicate = await getOne(
    'SELECT id FROM case_study_subcategory WHERE LOWER(name) = ? AND cat_id = ? AND status = 1 LIMIT 1',
    [name.toLowerCase(), categoryId]
  );
  if (duplicate) {
    throw new Error('Subcategory with the same name already exists under this category.');
  }

  const result = await query(
    'INSERT INTO case_study_subcategory (name, cat_id, status) VALUES (?, ?, 1)',
    [name, categoryId]
  );

  return getCaseStudySubcategoryById(result.insertId, { includeDeleted: true });
}

export async function updateCaseStudySubcategory(id, payload) {
  await ensureDatabaseSetup();
  const existingSubcategory = await getCaseStudySubcategoryById(id);
  if (!existingSubcategory) {
    throw new Error('Case study subcategory not found.');
  }

  const name = normalizeWhitespace(payload.name);
  const categoryId = toInteger(payload.cat_id);

  if (!name || !categoryId) {
    throw new Error('Subcategory name and parent category are required.');
  }

  const duplicate = await getOne(
    'SELECT id FROM case_study_subcategory WHERE LOWER(name) = ? AND cat_id = ? AND status = 1 AND id != ? LIMIT 1',
    [name.toLowerCase(), categoryId, id]
  );
  if (duplicate) {
    throw new Error('Subcategory with the same name already exists under this category.');
  }

  await query('UPDATE case_study_subcategory SET name = ?, cat_id = ? WHERE id = ?', [
    name,
    categoryId,
    id,
  ]);

  return getCaseStudySubcategoryById(id);
}

export async function softDeleteCaseStudySubcategory(id) {
  await ensureDatabaseSetup();
  const linkedCaseStudy = await getOne(
    'SELECT id FROM case_study WHERE subCategoryId = ? AND status = 1 LIMIT 1',
    [id]
  );

  if (linkedCaseStudy) {
    throw new Error('Subcategory is still linked to an active case study.');
  }

  await query('UPDATE case_study_subcategory SET status = 2 WHERE id = ?', [id]);
}
