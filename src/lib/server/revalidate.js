import { revalidatePath } from 'next/cache';

export function revalidateCaseStudyContent(caseStudyPath) {
  revalidatePath('/', 'layout');
  revalidatePath('/works');
  revalidatePath('/sitemap.xml');
  if (caseStudyPath) {
    revalidatePath(caseStudyPath);
  }
}

export function revalidateJobContent() {
  revalidatePath('/', 'layout');
  revalidatePath('/careers');
}

export function revalidateReviewContent() {
  revalidatePath('/', 'layout');
  revalidatePath('/');
}

