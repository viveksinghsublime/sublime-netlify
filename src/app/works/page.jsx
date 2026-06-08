import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import HeroSection from '@/components/common/HeroSection';
import Footer from '@/components/common/Footer';
import Card from '@/components/ui/Card';
import {
  fetchAllCaseStudies,
  fetchCaseStudyCategories,
  getCaseStudyMediaUrl,
  getCaseStudyPath,
} from '@/lib/caseStudies';
import {
  CONTACT_PATH,
  SITE_NAME,
  SITE_URL,
  WORKS_PATH,
  createPageMetadata,
  toAbsoluteUrl,
} from '@/lib/site';

export const revalidate = 3600;

export const metadata = {
  ...createPageMetadata({
    title: 'Our Works | Sublime Technocorp',
    description:
      'Explore our portfolio of successful projects and case studies across web development, ERP platforms, mobile applications, and AI-led software solutions.',
    path: WORKS_PATH,
  }),
  keywords: ['case studies', 'portfolio', 'web development', 'ERP', 'applications'],
};

const breadcrumbItems = [
  { name: 'Home', href: '/' },
  { name: 'Works', href: WORKS_PATH },
];

const officeLocations = [
  {
    city: 'Nerul, India',
    address: 'Office No: F21, Plot No: 88, Sector 19A, Seawoods, Navi Mumbai, Maharashtra 400706',
    phone: '+91 86910 25926',
    email: 'info@sublimetechnocorp.com',
  },
  {
    city: 'New York, USA',
    address: 'Office No: 42, 7th Avenue, Manhattan, NY 10011',
    phone: '+49 30 1234 5678',
    email: 'info@sublimetechnocorp.com',
  },
  {
    city: 'San Francisco, USA',
    address: '535 Mission Street, 14th Floor\nSan Francisco, CA 94105',
    phone: '+1 (415) 555-1234',
    email: 'info@sublimetechnocorp.com',
  },
];

const PAGE_SIZE = 6;

function buildFilterHref(category) {
  if (!category || category === 'All') {
    return WORKS_PATH;
  }

  return `${WORKS_PATH}?category=${encodeURIComponent(category)}`;
}

function buildPageHref(base, category, page) {
  let href = base;
  const params = [];

  if (category && category !== 'All') {
    params.push(`category=${encodeURIComponent(category)}`);
  }

  if (page > 1) {
    params.push(`page=${page}`);
  }

  if (params.length > 0) {
    href += `?${params.join('&')}`;
  }

  return href;
}

function WorksCollectionPageSchema({ items, selectedCategory }) {
  const filteredUrl =
    selectedCategory && selectedCategory !== 'All'
      ? `${SITE_URL}${buildFilterHref(selectedCategory)}`
      : `${SITE_URL}${WORKS_PATH}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Our Works',
    description: metadata.description,
    url: filteredUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: [
      'Custom software development',
      'Web application development',
      'ERP solutions',
      'Mobile applications',
      'AI solutions',
    ],
    mainEntity: items.map((item) => ({
      '@type': 'CreativeWork',
      name: item.title,
      description: item.sub_title || item.solution || metadata.description,
      image: toAbsoluteUrl(getCaseStudyMediaUrl(item.cover_image || item.image)),
      url: `${SITE_URL}${getCaseStudyPath(item)}`,
    })),
    hasPart: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: item.title,
        description: item.sub_title || item.solution || metadata.description,
        image: toAbsoluteUrl(getCaseStudyMediaUrl(item.cover_image || item.image)),
        url: `${SITE_URL}${getCaseStudyPath(item)}`,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function WorksPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const [caseStudyCategory, caseStudies] = await Promise.all([
    fetchCaseStudyCategories(),
    fetchAllCaseStudies(),
  ]);

  const selectedCategory =
    typeof resolvedSearchParams.category === 'string' && resolvedSearchParams.category.trim()
      ? resolvedSearchParams.category.trim()
      : 'All';

  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page, 10) || 1);
  const categoryOptions = ['All', ...caseStudyCategory.map((category) => category.name)];
  const activeCategory = categoryOptions.includes(selectedCategory) ? selectedCategory : 'All';
  const filteredProjects =
    activeCategory === 'All'
      ? caseStudies
      : caseStudies.filter((project) => project.category_name === activeCategory);

  const totalItems = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white">
      <WorksCollectionPageSchema items={paginatedProjects} selectedCategory={activeCategory} />
      <Header />
      <HeroSection
        breadcrumbItems={breadcrumbItems}
        title="Solving Complex Problems with Digital Solutions"
        subtitle="From product-market fit to platform scale, we help teams build technology that delivers measurable, meaningful, and user-centered results."
        buttonText="Explore Our Work"
        buttonHref="#portfolio-section"
      />

      <section id="portfolio-section" className="bg-white py-16" aria-labelledby="work-listing-title">
        <div className="container mx-auto px-25">
          <div className="mb-12">
            <h2 id="work-listing-title" className="mb-6 text-4xl font-bold text-black">
              Our Works
            </h2>
            <p className="max-w-2xl text-base font-medium leading-6 text-gray-700">
              Explore our portfolio of solutions that deliver measurable business outcomes and exceptional user experiences.
            </p>
          </div>

          <nav aria-label="Filter projects by category" className="mb-8 flex flex-wrap gap-3">
            {categoryOptions.map((category) => {
              const isActive = category === activeCategory;
              return (
                <Link
                  key={category}
                  href={buildFilterHref(category)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'border border-blue-500 bg-blue-500 text-white'
                      : 'border border-gray-400 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </Link>
              );
            })}
          </nav>

          {paginatedProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {paginatedProjects.map((project) => (
                  <article key={project.id}>
                    <Link
                      href={getCaseStudyPath(project)}
                      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <Card
                        className="h-full cursor-pointer rounded-2xl border-2 border-blue-500 p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl"
                        variant="default"
                      >
                        <div className="relative">
                          <div className="mb-6 flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {project.logo && (
                                <Image
                                  src={getCaseStudyMediaUrl(project.logo)}
                                  alt={`${project.title} icon`}
                                  width={31}
                                  height={31}
                                  className="rounded"
                                />
                              )}
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                  {project.category_name} {project.subcategory_name}
                                </p>
                                <h3 className="text-2xl font-medium text-black underline">{project.title}</h3>
                              </div>
                            </div>
                            <Image
                              src="/images/img_vector_amber_500_01.svg"
                              alt=""
                              width={40}
                              height={40}
                              className="flex-shrink-0"
                              aria-hidden
                            />
                          </div>
                          <div className="relative aspect-[8/5] w-full">
                            <Image
                              src={getCaseStudyMediaUrl(project.image)}
                              alt={`${project.title} - ${project.category_name || 'Portfolio'} project`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              loading="lazy"
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-12 flex items-center justify-center gap-4"
                >
                  <Link
                    href={buildPageHref(WORKS_PATH, activeCategory === 'All' ? null : activeCategory, safePage - 1)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      safePage <= 1
                        ? 'pointer-events-none cursor-not-allowed border border-gray-200 bg-gray-50 text-gray-400'
                        : 'border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-500'
                    }`}
                    aria-disabled={safePage <= 1}
                    tabIndex={safePage <= 1 ? -1 : 0}
                  >
                    Previous
                  </Link>

                  <span className="text-sm font-medium text-gray-600">
                    Page {safePage} of {totalPages}
                    <span className="ml-1 text-gray-400">({totalItems} items)</span>
                  </span>

                  <Link
                    href={buildPageHref(WORKS_PATH, activeCategory === 'All' ? null : activeCategory, safePage + 1)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      safePage >= totalPages
                        ? 'pointer-events-none cursor-not-allowed border border-gray-200 bg-gray-50 text-gray-400'
                        : 'border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-500'
                    }`}
                    aria-disabled={safePage >= totalPages}
                    tabIndex={safePage >= totalPages ? -1 : 0}
                  >
                    Next
                  </Link>
                </nav>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No case studies found</h3>
              <p className="text-gray-600">
                We could not find any projects for this category right now. Please try another filter.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-100 py-16" aria-labelledby="work-office-title">
        <div className="container mx-auto px-25">
          <div className="mb-12">
            <h2 id="work-office-title" className="mb-6 text-4xl font-bold text-black">
              Our Office
            </h2>
            <p className="text-base font-medium text-black">
              We Work Across Borders to deliver exceptional technology solutions worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {officeLocations.map((office) => (
              <Card key={office.city} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                    <Image
                      src="/images/img_background.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                      aria-hidden
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{office.city}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Image src="/images/img_svg.svg" alt="" width={20} height={20} className="mt-1" aria-hidden />
                    <p className="whitespace-pre-line text-base leading-6 text-gray-600">{office.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image src="/images/img_svg_gray_600.svg" alt="" width={20} height={20} aria-hidden />
                    <p className="text-base text-gray-600">{office.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/img_svg_gray_600_20x20.svg"
                      alt=""
                      width={20}
                      height={20}
                      aria-hidden
                    />
                    <p className="text-base text-gray-600">{office.email}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0D1114] py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to build something exceptional?</h2>
          <p className="mb-8 text-gray-300">
            Let&apos;s discuss how Sublime Technocorp can deliver a tailored solution for your business.
          </p>
          <Link
            href={CONTACT_PATH}
            className="inline-flex rounded-lg bg-blue-500 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-600"
          >
            Contact us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
