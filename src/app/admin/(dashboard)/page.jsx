import Link from 'next/link';
import Card from '@/components/ui/Card';
import { ADMIN_DASHBOARD_METRICS, isAdminModuleVisible } from '@/lib/adminModules';
import { listAdminCaseStudies, listCaseStudyCategories, listCaseStudySubcategories } from '@/lib/server/caseStudies';
import { listAdminContacts } from '@/lib/server/contact';
import { listAdminJobs } from '@/lib/server/jobs';
import { listMasters } from '@/lib/server/masters';
import { listAdminReviews } from '@/lib/server/reviews';

async function getCounts() {
  const [caseStudies, categories, subcategories, jobs, roles, locations, employmentTypes, reviews, contacts] =
    await Promise.all([
      listAdminCaseStudies().catch(() => []),
      listCaseStudyCategories().catch(() => []),
      listCaseStudySubcategories().catch(() => []),
      listAdminJobs().catch(() => []),
      listMasters('role').catch(() => []),
      listMasters('location').catch(() => []),
      listMasters('employmentType').catch(() => []),
      listAdminReviews().catch(() => []),
      listAdminContacts().catch(() => []),
    ]);

  const counts = {
    caseStudies: caseStudies.length,
    caseCategories: categories.length,
    caseSubcategories: subcategories.length,
    jobs: jobs.length,
    jobRoles: roles.length,
    jobLocations: locations.length,
    jobEmploymentTypes: employmentTypes.length,
    reviews: reviews.length,
    contacts: contacts.length,
  };

  return ADMIN_DASHBOARD_METRICS.filter((metric) => isAdminModuleVisible(metric.key)).map((metric) => ({
    ...metric,
    value: counts[metric.key] || 0,
  }));
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
