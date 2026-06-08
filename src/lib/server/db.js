import mysql from 'mysql2/promise';

const globalForDb = globalThis;
const TRANSIENT_DB_ERROR_CODES = new Set([
  'ECONNRESET',
  'PROTOCOL_CONNECTION_LOST',
  'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR',
  'ETIMEDOUT',
  'EPIPE',
]);

function getDatabaseConfig() {
  return {
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
  };
}

export function hasDatabaseConfig() {
  const config = getDatabaseConfig();
  return Boolean(config.host && config.user && config.database);
}

export function getPool() {
  if (globalForDb.__sublimeDbPool) {
    return globalForDb.__sublimeDbPool;
  }

  if (!hasDatabaseConfig()) {
    throw new Error('Database configuration is missing. Set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.');
  }

  const config = getDatabaseConfig();
  globalForDb.__sublimeDbPool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    queueLimit: 0,
    namedPlaceholders: false,
  });

  return globalForDb.__sublimeDbPool;
}

async function resetPool() {
  if (globalForDb.__sublimeDbPool) {
    try {
      await globalForDb.__sublimeDbPool.end();
    } catch {
      // Ignore pool shutdown errors and recreate a fresh pool below.
    } finally {
      globalForDb.__sublimeDbPool = undefined;
    }
  }
}

function isTransientDbError(error) {
  return Boolean(error && TRANSIENT_DB_ERROR_CODES.has(error.code || error.errno));
}

async function runWithRetry(operation) {
  try {
    return await operation(getPool());
  } catch (error) {
    if (!isTransientDbError(error)) {
      throw error;
    }

    await resetPool();
    return operation(getPool());
  }
}

export async function query(sql, params = []) {
  return runWithRetry(async (activePool) => {
    const [rows] = await activePool.query(sql, params);
    return rows;
  });
}

export async function getOne(sql, params = []) {
  const rows = await query(sql, params);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function execute(sql, params = []) {
  return runWithRetry(async (activePool) => {
    const [result] = await activePool.execute(sql, params);
    return result;
  });
}
