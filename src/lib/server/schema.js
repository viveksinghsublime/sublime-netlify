import { getOne, hasDatabaseConfig, query } from '@/lib/server/db';
import { hashPassword } from '@/lib/server/auth';

let schemaEnsured = false;
let ensurePromise;

const CREATE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS admin_users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS case_study_category (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url_name VARCHAR(255) NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS case_study_subcategory (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cat_id INT UNSIGNED NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_case_subcategory_cat_id (cat_id)
  )`,
  `CREATE TABLE IF NOT EXISTS case_study (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    sub_title TEXT NULL,
    category_url_name VARCHAR(255) NULL,
    short_url VARCHAR(255) NULL,
    seo_title VARCHAR(255) NULL,
    seo_description TEXT NULL,
    keywords TEXT NULL,
    categoryId INT UNSIGNED NULL,
    subCategoryId INT UNSIGNED NULL,
    image TEXT NULL,
    logo TEXT NULL,
    cover_image TEXT NULL,
    keypoints LONGTEXT NULL,
    features LONGTEXT NULL,
    situation LONGTEXT NULL,
    solution LONGTEXT NULL,
    product_description LONGTEXT NULL,
    product_image LONGTEXT NULL,
    colorCode VARCHAR(64) NULL,
    isTopProject TINYINT NOT NULL DEFAULT 0,
    why_us_data LONGTEXT NULL,
    why_us_title VARCHAR(255) NULL,
    feature_title VARCHAR(255) NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_case_study_category (categoryId),
    INDEX idx_case_study_subcategory (subCategoryId),
    INDEX idx_case_study_status (status)
  )`,
  `CREATE TABLE IF NOT EXISTS contact_us (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    company_name VARCHAR(255) NULL,
    service_interested_in VARCHAR(255) NULL,
    message LONGTEXT NULL,
    source VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS job_role_master (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS job_location_master (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS job_employment_type_master (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS job_postings (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    skills_json LONGTEXT NULL,
    role_id INT UNSIGNED NULL,
    location_id INT UNSIGNED NULL,
    employment_type_id INT UNSIGNED NULL,
    is_published TINYINT NOT NULL DEFAULT 1,
    status TINYINT NOT NULL DEFAULT 1,
    published_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_job_role (role_id),
    INDEX idx_job_location (location_id),
    INDEX idx_job_type (employment_type_id),
    INDEX idx_job_status (status)
  )`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NULL,
    message LONGTEXT NOT NULL,
    image TEXT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_published TINYINT NOT NULL DEFAULT 1,
    status TINYINT NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reviews_status (status)
  )`,
  `CREATE TABLE IF NOT EXISTS request_rate_limits (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) NOT NULL,
    identifier VARCHAR(255) NOT NULL,
    request_count INT UNSIGNED NOT NULL DEFAULT 0,
    window_start DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_rate_limit_key_identifier (key_name, identifier),
    INDEX idx_rate_limit_window_start (window_start)
  )`,
];

async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || '';
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const adminName = process.env.ADMIN_NAME || 'Sublime Admin';

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existingUser = await getOne('SELECT id FROM admin_users WHERE email = ? LIMIT 1', [adminEmail]);
  if (existingUser) {
    return;
  }

  const passwordHash = await hashPassword(adminPassword);
  await query(
    'INSERT INTO admin_users (name, email, password_hash, status) VALUES (?, ?, ?, 1)',
    [adminName, adminEmail, passwordHash]
  );
}

async function ensureSchemaInternal() {
  if (!hasDatabaseConfig()) {
    return;
  }

  for (const statement of CREATE_STATEMENTS) {
    await query(statement);
  }

  await seedAdminUser();
  schemaEnsured = true;
}

export async function ensureDatabaseSetup() {
  if (schemaEnsured || !hasDatabaseConfig()) {
    return;
  }

  if (!ensurePromise) {
    ensurePromise = ensureSchemaInternal().finally(() => {
      ensurePromise = undefined;
    });
  }

  await ensurePromise;
}
