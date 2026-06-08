import { createPageMetadata } from '@/lib/site';

export const metadata = createPageMetadata({
  title: 'About Us | 10+ Years of Software Excellence',
  description:
    'Founded in 2012, Sublime Technocorp has delivered 300+ projects for enterprises and SMEs globally. Learn about our team, values, and technology approach.',
  path: '/about',
});

export default function AboutLayout({ children }) {
  return children;
}
