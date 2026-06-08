import { fetchAllCaseStudies, getCaseStudyPath } from '@/lib/caseStudies';
import { CONTACT_PATH, SITE_URL, WORKS_PATH } from '@/lib/site';

/** @returns {import('next').MetadataRoute.Sitemap} */
export default async function sitemap() {
  const now = new Date();

  const staticUrls = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}${WORKS_PATH}`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/careers`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}${CONTACT_PATH}`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const caseStudies = await fetchAllCaseStudies();
  const caseStudyUrls = caseStudies
    .filter((cs) => cs.id)
    .map((cs) => {
      const lastMod = cs.updated_at || cs.created_at || now;
      return {
        url: `${SITE_URL}${getCaseStudyPath(cs)}`,
        lastModified: new Date(lastMod),
        changeFrequency: 'monthly',
        priority: 0.8,
      };
    });

  return [...staticUrls, ...caseStudyUrls];
}
