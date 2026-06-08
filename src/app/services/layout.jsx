import { createPageMetadata } from '@/lib/site';

export const metadata = createPageMetadata({
  title: 'Services | Custom Software Development',
  description:
    'Web application development, mobile apps, ERP, AI solutions, custom software, and dedicated developers from Sublime Technocorp.',
  path: '/services',
});

export default function ServicesLayout({ children }) {
  return children;
}
