import { ensureDatabaseSetup } from '@/lib/server/schema';
import { getOne, query } from '@/lib/server/db';
import { normalizeWhitespace } from '@/lib/server/utils';
import { isValidSchemaValue } from '@/lib/validation';

const TABLE_CONFIG = {
  role: { table: 'job_role_master', requiredFields: ['name'] },
  location: { table: 'job_location_master', requiredFields: ['name'] },
  employmentType: { table: 'job_employment_type_master', requiredFields: ['name', 'value'] },
};

function getTableConfig(type) {
  const config = TABLE_CONFIG[type];
  if (!config) {
    throw new Error(`Unsupported master type: ${type}`);
  }
  return config;
}

function normalizePayload(type, payload) {
  if (type === 'employmentType') {
    return {
      name: normalizeWhitespace(payload.name),
      value: normalizeWhitespace(payload.value).toUpperCase(),
    };
  }

  return {
    name: normalizeWhitespace(payload.name),
  };
}

export async function listMasters(type, { includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  const { table } = getTableConfig(type);
  return query(`SELECT * FROM ${table} ${includeDeleted ? '' : 'WHERE status = 1'} ORDER BY id DESC`);
}

export async function getMasterById(type, id, { includeDeleted = false } = {}) {
  await ensureDatabaseSetup();
  const { table } = getTableConfig(type);
  return getOne(`SELECT * FROM ${table} WHERE id = ? ${includeDeleted ? '' : 'AND status = 1'} LIMIT 1`, [id]);
}

export async function createMaster(type, payload) {
  await ensureDatabaseSetup();
  const normalized = normalizePayload(type, payload);
  const { table, requiredFields } = getTableConfig(type);

  for (const field of requiredFields) {
    if (!normalized[field]) {
      throw new Error(`${field} is required.`);
    }
  }

  if (type === 'employmentType' && !isValidSchemaValue(normalized.value)) {
    throw new Error('Schema Value must use uppercase letters with underscores, for example FULL_TIME.');
  }

  const columns = Object.keys(normalized);
  const values = columns.map((column) => normalized[column]);
  const placeholders = columns.map(() => '?').join(', ');

  const result = await query(
    `INSERT INTO ${table} (${columns.join(', ')}, status) VALUES (${placeholders}, 1)`,
    values
  );

  return getMasterById(type, result.insertId, { includeDeleted: true });
}

export async function updateMaster(type, id, payload) {
  await ensureDatabaseSetup();
  const existing = await getMasterById(type, id);
  if (!existing) {
    throw new Error('Record not found.');
  }

  const normalized = normalizePayload(type, payload);
  const { table, requiredFields } = getTableConfig(type);

  for (const field of requiredFields) {
    if (!normalized[field]) {
      throw new Error(`${field} is required.`);
    }
  }

  if (type === 'employmentType' && !isValidSchemaValue(normalized.value)) {
    throw new Error('Schema Value must use uppercase letters with underscores, for example FULL_TIME.');
  }

  const columns = Object.keys(normalized);
  const assignments = columns.map((column) => `${column} = ?`).join(', ');
  const values = columns.map((column) => normalized[column]);

  await query(`UPDATE ${table} SET ${assignments} WHERE id = ?`, [...values, id]);
  return getMasterById(type, id);
}

export async function softDeleteMaster(type, id) {
  await ensureDatabaseSetup();
  const { table } = getTableConfig(type);
  await query(`UPDATE ${table} SET status = 2 WHERE id = ?`, [id]);
}
