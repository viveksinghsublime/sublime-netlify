export function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

export function parseJsonObject(value, fallback = {}) {
  if (!value) return fallback;
  if (typeof value === 'object' && !Array.isArray(value)) return value;

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export function toInteger(value, fallback = null) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function toBooleanFlag(value) {
  return value === true || value === 'true' || value === '1' || value === 1 ? 1 : 0;
}

export function normalizeWhitespace(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function stripControlCharacters(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim();
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function normalizeSlug(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  return value
    .replace(/[\u2013\u2014\u2212]+/g, '-')
    .replace(/&/g, ' and ')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function serializeJson(value) {
  return JSON.stringify(value ?? []);
}

export function summarizeText(value, maxLength = 120) {
  if (!value) return '';
  const stringValue = String(value).trim();
  return stringValue.length > maxLength ? `${stringValue.slice(0, maxLength)}...` : stringValue;
}
