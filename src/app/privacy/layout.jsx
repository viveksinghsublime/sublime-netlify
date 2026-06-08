import { createPageMetadata } from '@/lib/site';

export const metadata = createPageMetadata({
  title: 'Privacy Policy | Sublime Technocorp',
  description: 'Privacy policy and data protection practices at Sublime Technocorp.',
  path: '/privacy',
});

export default function PrivacyLayout({ children }) {
  return children;
}
