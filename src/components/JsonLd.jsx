export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'Sublime Technocorp Pvt Ltd',
    url: 'https://sublimetechnocorp.com',
    logo: 'https://sublimetechnocorp.com/images/img_image_15_1.png',
    description:
      'Custom software development company specializing in web apps, mobile apps, ERP, and AI solutions.',
    foundingDate: '2012',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: '50+' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nerul',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+91 86910 25926',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://www.linkedin.com/company/sublimetechnocorp',
      'https://twitter.com/sublimetechno',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '50',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
