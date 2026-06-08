import { cache } from 'react';
import {
  getCaseStudyById,
  getCaseStudyBySlug,
  listCaseStudyCategories,
  listPublicCaseStudies,
} from '@/lib/server/caseStudies';
import {
  getCaseStudyMediaUrl,
  getCaseStudyPath,
  getCaseStudySlug,
  normalizeCaseStudySlug,
  parseLegacyCaseStudyParam,
} from '@/lib/caseStudyShared';

export const CASE_STUDY_REVALIDATE_SECONDS = 3600;

function dedupeSlugs(caseStudies) {
  const seen = new Map();

  for (const caseStudy of caseStudies) {
    const slug = getCaseStudySlug(caseStudy);

    if (!slug) {
      continue;
    }

    const previous = seen.get(slug);
    if (previous && previous !== caseStudy.id) {
      throw new Error(
        `Duplicate normalized case study slug "${slug}" found for IDs ${previous} and ${caseStudy.id}.`
      );
    }

    seen.set(slug, caseStudy.id);
  }
}

export const fetchAllCaseStudies = cache(async () => {
  try {
    const caseStudies = await listPublicCaseStudies();
    dedupeSlugs(caseStudies);
    return caseStudies;
  } catch {
    return [];
  }
});

export const fetchCaseStudyCategories = cache(async () => {
  try {
    return await listCaseStudyCategories();
  } catch {
    return [];
  }
});

export const fetchCaseStudyDetailById = cache(async (id) => {
  if (!id) {
    return null;
  }

  try {
    return await getCaseStudyById(id);
  } catch {
    return null;
  }
});

export const findCaseStudySummaryBySlug = cache(async (slug) => {
  const normalizedSlug = normalizeCaseStudySlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const caseStudies = await fetchAllCaseStudies();
  return caseStudies.find((caseStudy) => getCaseStudySlug(caseStudy) === normalizedSlug) || null;
});

export const fetchCaseStudyDetailBySlug = cache(async (slug) => {
  const normalizedSlug = normalizeCaseStudySlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  try {
    return await getCaseStudyBySlug(normalizedSlug);
  } catch {
    return null;
  }
});

export { getCaseStudyMediaUrl, getCaseStudyPath, getCaseStudySlug, normalizeCaseStudySlug, parseLegacyCaseStudyParam };
