import Link from 'next/link';
import Card from '@/components/ui/Card';
import { listAdminCaseStudies, listCaseStudyCategories, listCaseStudySubcategories } from '@/lib/server/caseStudies';
import { listAdminJobs } from '@/lib/server/jobs';
import { listMasters } from '@/lib/server/masters';
import { listAdminReviews } from '@/lib/server/reviews';

async function getCounts() {
  const [caseStudies, categories, subcategories, jobs, roles, locations, employmentTypes, reviews] =
    await Promise.all([
      listAdminCaseStudies().catch(() => []),
      listCaseStudyCategories().catch(() => []),
      listCaseStudySubcategories().catch(() => []),
      listAdminJobs().catch(() => []),
      listMasters('role').catch(() => []),
      listMasters('location').catch(() => []),
      listMasters('employmentType').catch(() => []),
      listAdminReviews().catch(() => []),
    ]);

  return [
    { label: 'Case Studies', value: caseStudies.length, href: '/admin/case-studies' },
    { label: 'Categories', value: categories.length, href: '/admin/case-categories' },
    { label: 'Subcategories', value: subcategories.length, href: '/admin/case-subcategories' },
    { label: 'Jobs', value: jobs.length, href: '/admin/jobs' },
    { label: 'Roles', value: roles.length, href: '/admin/job-roles' },
    { label: 'Locations', value: locations.length, href: '/admin/job-locations' },
    { label: 'Employment Types', value: employmentTypes.length, href: '/admin/job-employment-types' },
    { label: 'Reviews', value: reviews.length, href: '/admin/reviews' },
  ];
}

export default async function AdminDashboardPage() {
  const metrics = await getCounts();

  return (
    <div className="grid gap-8">
      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Overview</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">Admin Dashboard</h2>
        {/* <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          This panel now manages the content that previously depended on the external API service.
          Use the navigation to update case studies, careers data, reviews, and master data without
          leaving the website project.
        </p> */}
      </Card>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Link key={metric.label} href={metric.href} className="block">
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
              <p className="text-sm font-medium text-slate-500">{metric.label}</p>
              <p className="mt-3 text-4xl font-bold text-slate-900">{metric.value}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
