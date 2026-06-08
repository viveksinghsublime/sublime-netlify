'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/case-studies', label: 'Case Studies' },
  { href: '/admin/case-categories', label: 'Case Categories' },
  { href: '/admin/case-subcategories', label: 'Case Subcategories' },
  { href: '/admin/jobs', label: 'Jobs' },
  { href: '/admin/job-roles', label: 'Job Roles' },
  { href: '/admin/job-locations', label: 'Job Locations' },
  { href: '/admin/job-employment-types', label: 'Employment Types' },
  { href: '/admin/reviews', label: 'Reviews' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {sections.map((section) => {
        const isDashboard = section.href === '/admin';
        const isActive = isDashboard
          ? pathname === section.href
          : pathname === section.href || pathname.startsWith(`${section.href}/`);
        return (
          <Link
            key={section.href}
            href={section.href}
            className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-300 hover:text-white-100'
            }`}
          >
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
