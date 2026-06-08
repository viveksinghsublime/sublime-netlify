import { cache } from 'react';
import { listMasters } from '@/lib/server/masters';
import { listPublishedJobs } from '@/lib/server/jobs';

export const JOBS_REVALIDATE_SECONDS = 600;

export const fetchPublishedJobs = cache(async () => {
  try {
    return await listPublishedJobs();
  } catch {
    return [];
  }
});

export const fetchJobFilterMasters = cache(async () => {
  try {
    const [roles, locations, employmentTypes] = await Promise.all([
      listMasters('role'),
      listMasters('location'),
      listMasters('employmentType'),
    ]);

    return { roles, locations, employmentTypes };
  } catch {
    return {
      roles: [],
      locations: [],
      employmentTypes: [],
    };
  }
});
