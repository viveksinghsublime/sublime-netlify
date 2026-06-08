import { permanentRedirect } from 'next/navigation';
import { WORKS_PATH } from '@/lib/site';

export default function CaseStudyRedirectPage() {
  permanentRedirect(WORKS_PATH);
}
