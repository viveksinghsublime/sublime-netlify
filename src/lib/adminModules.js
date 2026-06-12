export const ADMIN_MODULE_VISIBILITY = {
  dashboard: true,
  caseStudies: true,
  caseCategories: true,
  caseSubcategories: true,
  jobs: true,
  jobRoles: true,
  jobLocations: true,
  jobEmploymentTypes: true,
  reviews: true,
  contacts: true,
  profile: true,
};

export const ADMIN_NAVIGATION = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    type: 'link',
  },
  {
    key: 'caseStudyGroup',
    label: 'Case Study',
    type: 'group',
    children: [
      {
        key: 'caseStudies',
        label: 'Case Studies',
        href: '/admin/case-studies',
      },
      {
        key: 'caseCategories',
        label: 'Case Categories',
        href: '/admin/case-categories',
      },
      {
        key: 'caseSubcategories',
        label: 'Subcategories',
        href: '/admin/case-subcategories',
      },
    ],
  },
  {
    key: 'jobGroup',
    label: 'Jobs',
    type: 'group',
    children: [
      {
        key: 'jobs',
        label: 'Job Openings',
        href: '/admin/jobs',
      },
      {
        key: 'jobRoles',
        label: 'Job Roles',
        href: '/admin/job-roles',
      },
      {
        key: 'jobLocations',
        label: 'Job Locations',
        href: '/admin/job-locations',
      },
      {
        key: 'jobEmploymentTypes',
        label: 'Employment Types',
        href: '/admin/job-employment-types',
      },
    ],
  },
  {
    key: 'reviews',
    label: 'Reviews',
    href: '/admin/reviews',
    type: 'link',
  },
  {
    key: 'contacts',
    label: 'Contact Us',
    href: '/admin/contact-us',
    type: 'link',
  },
];

export const ADMIN_DASHBOARD_METRICS = [
  { key: 'caseStudies', label: 'Case Studies', href: '/admin/case-studies' },
  { key: 'caseCategories', label: 'Categories', href: '/admin/case-categories' },
  { key: 'caseSubcategories', label: 'Subcategories', href: '/admin/case-subcategories' },
  { key: 'jobs', label: 'Jobs', href: '/admin/jobs' },
  { key: 'jobRoles', label: 'Roles', href: '/admin/job-roles' },
  { key: 'jobLocations', label: 'Locations', href: '/admin/job-locations' },
  { key: 'jobEmploymentTypes', label: 'Employment Types', href: '/admin/job-employment-types' },
  { key: 'reviews', label: 'Reviews', href: '/admin/reviews' },
  { key: 'contacts', label: 'Contact Requests', href: '/admin/contact-us' },
];

export function isAdminModuleVisible(key) {
  return ADMIN_MODULE_VISIBILITY[key] !== false;
}

export function getVisibleAdminNavigation() {
  return ADMIN_NAVIGATION.reduce((items, item) => {
    if (item.type === 'group') {
      const children = (item.children || []).filter((child) => isAdminModuleVisible(child.key));
      if (children.length > 0) {
        items.push({
          ...item,
          children,
        });
      }
      return items;
    }

    if (isAdminModuleVisible(item.key)) {
      items.push(item);
    }

    return items;
  }, []);
}
