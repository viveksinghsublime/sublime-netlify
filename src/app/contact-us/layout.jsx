import { CONTACT_PATH, createPageMetadata } from '@/lib/site';

export const metadata = createPageMetadata({
  title: 'Contact Us | Sublime Technocorp',
  description:
    'Contact Sublime Technocorp to discuss your custom software, web, mobile, ERP, or AI project. We respond within 24 hours.',
  path: CONTACT_PATH,
});

export default function ContactUsLayout({ children }) {
  return children;
}
