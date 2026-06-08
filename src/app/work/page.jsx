import { permanentRedirect } from 'next/navigation';
import { WORKS_PATH } from '@/lib/site';

export default function WorkRedirectPage() {
  permanentRedirect(WORKS_PATH);
}
