import Link from 'next/link';
import Image from 'next/image';
import { CONTACT_PATH, WORKS_PATH } from '@/lib/site';

const socialLinks = [
  {
    href: 'https://www.linkedin.com/company/sublimetechnocorp',
    label: 'LinkedIn',
    icon: '/images/img_clip_path_group.svg',
  },
  {
    href: 'https://twitter.com/sublimetechno',
    label: 'Twitter',
    icon: '/images/img_clip_path_group_white_a700.svg',
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="border-t border-blue-500 pb-12 pt-11">
        <div className="container mx-auto px-30">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <h2 className="mb-6 text-3xl font-semibold leading-11">
                Stay Ahead with Smart Solutions
              </h2>
              <p className="mb-8 max-w-md text-base font-medium leading-6">
                We deliver end-to-end software development services across various industries developing solutions that are dynamic, comprehensive, and designed around subject-matter expertise.
              </p>
              <Link
                href={CONTACT_PATH}
                className="mb-8 inline-flex rounded-2xl bg-blue-500 px-5 py-2 text-white shadow-md transition-colors hover:bg-blue-600"
              >
                Contact us
              </Link>
              <Image
                src="/images/img_image_15_1.png"
                alt="Sublime Technocorp Logo"
                width={72}
                height={40}
              />
            </div>

            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-wide">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/about" className="text-sm font-medium transition-colors hover:text-blue-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href={WORKS_PATH} className="text-base font-medium transition-colors hover:text-blue-400">
                    Works
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-base font-medium transition-colors hover:text-blue-400">
                    Career
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-base font-medium transition-colors hover:text-blue-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={CONTACT_PATH} className="text-base font-medium transition-colors hover:text-blue-400">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-wide">Services</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/services#web-development" className="text-sm font-medium transition-colors hover:text-blue-400">
                    Web Application Development
                  </Link>
                </li>
                <li>
                  <Link href="/services#mobile-development" className="text-sm font-medium transition-colors hover:text-blue-400">
                    Mobile App Development
                  </Link>
                </li>
                <li>
                  <Link href="/services#erp" className="text-sm font-medium transition-colors hover:text-blue-400">
                    ERP Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/services#custom-software" className="text-sm font-medium transition-colors hover:text-blue-400">
                    Custom software development
                  </Link>
                </li>
                <li>
                  <Link href="/services#ai" className="text-sm font-medium transition-colors hover:text-blue-400">
                    AI Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/services#hire-developers" className="text-sm font-medium transition-colors hover:text-blue-400">
                    Hire Developers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-medium uppercase tracking-wide">Work</h3>
              <ul className="space-y-4">
                {[
                  'Digital NGO platform',
                  'Sublime Client Management System',
                  'Logistics Solutions ERP',
                  'Sports Ecosystem',
                  'Webion Virtual Online Shopping',
                ].map((label) => (
                  <li key={label}>
                    <Link href={WORKS_PATH} className="text-sm font-medium transition-colors hover:text-blue-400">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto flex items-center justify-between px-30">
          <p className="text-sm font-medium">© 2025 - Sublime. All rights reserved.</p>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="transition-colors hover:text-blue-400"
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
              >
                <Image src={social.icon} alt={social.label} width={24} height={24} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
