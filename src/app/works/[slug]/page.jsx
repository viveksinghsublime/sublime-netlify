import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import FeaturesSection from '@/components/caseStudy/FeaturesSection';
import {
  fetchAllCaseStudies,
  fetchCaseStudyDetailBySlug,
  getCaseStudyMediaUrl,
  getCaseStudyPath,
  getCaseStudySlug,
} from '@/lib/caseStudies';
import {
  CONTACT_PATH,
  SITE_NAME,
  SITE_URL,
  WORKS_PATH,
  toAbsoluteUrl,
} from '@/lib/site';

export const revalidate = 3600;

function parseJsonArray(value) {
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

export async function generateStaticParams() {
  const caseStudies = await fetchAllCaseStudies();

  return caseStudies
    .map((caseStudy) => getCaseStudySlug(caseStudy))
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const study = await fetchCaseStudyDetailBySlug(slug);

  if (!study) {
    return {
      title: 'Case Study | Sublime Technocorp',
      description: 'View our detailed case study and learn how we delivered results.',
    };
  }

  const title = study.seo_title || study.title || 'Case Study | Sublime Technocorp';
  const description = study.seo_description || study.sub_title || study.solution || '';
  const canonicalUrl = toAbsoluteUrl(`${WORKS_PATH}/${slug}`);
  const ogImageUrl = toAbsoluteUrl(getCaseStudyMediaUrl(
    Array.isArray(study.product_image) && study.product_image[0]
      ? study.product_image[0]?.url || study.product_image[0]
      : study.cover_image || study.image
  ));

  return {
    title,
    description,
    keywords: study.keywords ? study.keywords.split(',').map((keyword) => keyword.trim()) : [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: study.title || 'Case study image',
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

function CaseStudyJsonLd({ study, slug }) {
  const canonicalUrl = toAbsoluteUrl(`${WORKS_PATH}/${slug}`);
  const ogImageUrl = toAbsoluteUrl(getCaseStudyMediaUrl(
    Array.isArray(study.product_image) && study.product_image[0]
      ? study.product_image[0]?.url || study.product_image[0]
      : study.cover_image || study.image
  ));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: study.title,
    description: study.sub_title || study.solution || study.seo_description || '',
    image: ogImageUrl,
    url: canonicalUrl,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl('/images/img_image_15_1.png'),
      },
    },
    inLanguage: 'en',
    datePublished: study.created_at ? new Date(study.created_at).toISOString().split('T')[0] : undefined,
    dateModified: study.updated_at ? new Date(study.updated_at).toISOString().split('T')[0] : undefined,
    about: [study.category_name, study.subcategory_name].filter(Boolean).join(', ') || undefined,
  };

  Object.keys(schema).forEach((key) => {
    if (schema[key] === undefined) delete schema[key];
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function WorkDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === 'string' ? resolvedParams.slug : '';
  const study = await fetchCaseStudyDetailBySlug(slug);

  if (!study) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Works', href: WORKS_PATH },
    { name: study.title?.trim() || 'Case Study', href: getCaseStudyPath(study) },
  ];

  const accent = study.colorCode ? `#${String(study.colorCode).replace('#', '')}` : '#008dd2';
  const heroImage = getCaseStudyMediaUrl(study.cover_image || study.image);
  const keypoints = parseJsonArray(study.keypoints);
  const features = parseJsonArray(study.features);
  const productImages = parseJsonArray(study.product_image);

  return (
    <div className="min-h-screen bg-white">
      <CaseStudyJsonLd study={study} slug={slug} />
      <Header />

      <section
        className="relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-[#0D1114] text-white md:min-h-[500px]"
        style={{ borderBottom: `4px solid ${accent}` }}
      >
        {heroImage && (
          <Image
            src={heroImage}
            alt={study.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1114] via-[#0D1114]/80 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-8">
          <Breadcrumbs items={breadcrumbItems} variant="hero" />
          <div className="mt-6 max-w-4xl">
            {(study.category_name || study.subcategory_name) && (
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-blue-400">
                {[study.category_name, study.subcategory_name].filter(Boolean).join(' · ')}
              </p>
            )}
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">{study.title}</h1>
            {study.sub_title && (
              <p className="text-lg leading-relaxed text-gray-300 md:text-xl">{study.sub_title}</p>
            )}
          </div>
        </div>
      </section>

      {(study.situation || study.solution) && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {study.situation && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">The Situation</h2>
                  <p className="whitespace-pre-line leading-relaxed text-gray-700">{study.situation}</p>
                </div>
              )}
              {study.solution && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Solution</h2>
                  <p className="whitespace-pre-line leading-relaxed text-gray-700">{study.solution}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {keypoints.length > 0 && (
        <section className="bg-white py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="mb-10 text-3xl font-bold text-gray-900">Key Highlights</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {keypoints.map((kp, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {kp.image && (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={getCaseStudyMediaUrl(kp.image)}
                        alt={kp.title || 'Key highlight'}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {kp.title && <h3 className="mb-2 text-xl font-semibold text-gray-900">{kp.title}</h3>}
                    {kp.subtitle && <p className="text-gray-600">{kp.subtitle}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {features.length > 0 && (
        <FeaturesSection features={features} featureTitle={study.feature_title} />
      )}

      {study.product_description && (
        <section className="bg-white py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">Product Overview</h2>
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{study.product_description}</p>
          </div>
        </section>
      )}

      {productImages.length > 0 && (
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="mb-10 text-3xl font-bold text-gray-900">Product Gallery</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {productImages.map((img, index) => {
                const url = typeof img === 'string' ? img : img?.url;
                if (!url) return null;
                return (
                  <div
                    key={index}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white shadow-md"
                  >
                    <Image
                      src={getCaseStudyMediaUrl(url)}
                      alt={`${study.title} screenshot ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain p-2"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#0D1114] py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to build something similar?</h2>
          <p className="mb-8 text-gray-300">
            Let&apos;s discuss how Sublime Technocorp can deliver a tailored solution for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={WORKS_PATH}
              className="rounded-lg border border-white/30 px-8 py-3 font-medium transition-colors hover:bg-white/10"
            >
              View more work
            </Link>
            <Link
              href={CONTACT_PATH}
              className="rounded-lg bg-blue-500 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-600"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
