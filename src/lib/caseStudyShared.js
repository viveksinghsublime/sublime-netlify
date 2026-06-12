import { DEFAULT_OG_IMAGE, SITE_URL, WORKS_PATH, toAbsoluteUrl } from '@/lib/site';

export function normalizeCaseStudySlug(value) {
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

export function getCaseStudySlug(project) {
  return normalizeCaseStudySlug(project?.category_url_name || project?.title || '');
}

export function getCaseStudyPath(project) {
  const slug = getCaseStudySlug(project);
  return slug ? `${WORKS_PATH}/${slug}` : WORKS_PATH;
}

export function getCaseStudyMediaUrl(path) {
  if (!path) {
    return DEFAULT_OG_IMAGE;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/')) {
    return path;
  }

  return `/${path.replace(/^\//, '')}`;
}

export function parseLegacyCaseStudyParam(param) {
  if (!param || typeof param !== 'string') {
    return { id: null, slug: '' };
  }

  const match = param.match(/^(\d+)(?:-(.+))?$/);
  if (match) {
    return {
      id: Number(match[1]),
      slug: normalizeCaseStudySlug(match[2] || ''),
    };
  }

  return {
    id: null,
    slug: normalizeCaseStudySlug(param),
  };
}
