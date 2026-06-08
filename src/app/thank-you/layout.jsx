import { THANK_YOU_PATH, createPageMetadata } from '@/lib/site';

export const metadata = {
  ...createPageMetadata({
    title: 'Thank You | Sublime Technocorp',
    description: 'Thank you for contacting Sublime Technocorp. Our team will review your request shortly.',
    path: THANK_YOU_PATH,
  }),
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function ThankYouLayout({ children }) {
  return children;
}
