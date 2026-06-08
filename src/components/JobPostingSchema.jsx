const baseJob = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  hiringOrganization: {
    '@type': 'Organization',
    name: 'Sublime Technocorp Pvt Ltd',
    sameAs: 'https://sublimetechnocorp.com',
  },
};

export function JobPostingSchema({ jobs = [] }) {
  return (
    <>
      {jobs.map((job) => {
        const schema = {
          ...baseJob,
          title: job.title,
          description: job.description,
          employmentType: job.employment_type_value || 'FULL_TIME',
          datePosted: job.published_at
            ? new Date(job.published_at).toISOString().split('T')[0]
            : new Date(job.created_at || Date.now()).toISOString().split('T')[0],
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: job.location_name || 'Nerul',
              addressCountry: 'IN',
            },
          },
        };
        return (
          <script
            key={job.title}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        );
      })}
    </>
  );
}
