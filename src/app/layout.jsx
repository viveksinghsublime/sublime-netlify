import '../styles/index.css';
import { OrganizationSchema } from '@/components/JsonLd';
import Script from 'next/script';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sublime Technocorp | Custom Software Development Company',
    template: '%s | Sublime Technocorp',
  },
  description:
    'Sublime Technocorp is an on-demand custom software development company delivering web apps, mobile apps, ERP, AI solutions, and dedicated developers for enterprises and SMEs worldwide.',
  keywords: [
    'custom software development',
    'web application development',
    'mobile app development',
    'ERP solutions',
    'AI solutions',
    'dedicated developers',
    'Sublime Technocorp',
  ],
  authors: [{ name: 'Sublime Technocorp' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Sublime Technocorp',
    title: 'Sublime Technocorp | Custom Software Development Company',
    description:
      'Your on-demand team for custom software development. Web apps, mobile apps, ERP, AI solutions and dedicated developers for enterprises and SMEs worldwide.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Sublime Technocorp - Custom Software Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SublimeTechno',
    creator: '@SublimeTechno',
    title: 'Sublime Technocorp | Custom Software Development',
    description: 'Your on-demand team for custom software development.',
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body>
        <a href="#main-content" className="skip-to-main sr-only">
          Skip to main content
        </a>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5PXQKNC568"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5PXQKNC568');
          `}
        </Script>
        <OrganizationSchema />
        <main id="main-content">{children}</main>
        {/* DhiWise debug scripts - uncomment if needed for development tooling */}
        {/* <script id="dhws-errorTracker" src="/dhws-error-tracker.js"></script> */}
        {/* <script id="dhws-elementInspector" src="/dhws-web-inspector.js"></script> */}
      </body>
    </html>
  );
}
