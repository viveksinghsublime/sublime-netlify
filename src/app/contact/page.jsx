import { permanentRedirect } from 'next/navigation';
import { CONTACT_PATH } from '@/lib/site';

export default function ContactRedirectPage() {
  permanentRedirect(CONTACT_PATH);
}
