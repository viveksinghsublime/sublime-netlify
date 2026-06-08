export const SITE_URL = 'https://sublimetechnocorp.com';
export const SITE_NAME = 'Sublime Technocorp';
export const DEFAULT_OG_IMAGE = '/images/img_image_721x288.png';
export const WORKS_PATH = '/works';
export const CONTACT_PATH = '/contact-us';
export const THANK_YOU_PATH = '/thank-you';

export function toAbsoluteUrl(path = '/') {
  if (!path) {
    return SITE_URL;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return new URL(path, SITE_URL).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords,
  robots,
}) {
  const canonicalUrl = toAbsoluteUrl(path);
  const imageUrl = toAbsoluteUrl(image);

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(robots ? { robots } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
