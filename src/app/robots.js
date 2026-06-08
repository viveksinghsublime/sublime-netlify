/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://sublimetechnocorp.com/sitemap.xml',
  };
}
