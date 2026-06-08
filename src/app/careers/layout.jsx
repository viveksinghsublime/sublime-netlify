import { createPageMetadata } from '@/lib/site';

export const metadata = createPageMetadata({
  title: 'Careers at Sublime Technocorp | Join Our Tech Team',
  description:
    "Join Sublime Technocorp's growing team. Open positions in Angular, React, .NET, Mobile Development, UX/UI Design, and QA Engineering.",
  path: '/careers',
});

export default function CareersLayout({ children }) {
  return children;
}
