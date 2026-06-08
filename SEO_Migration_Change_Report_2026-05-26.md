# Yesterday's SEO Migration Change Report

## Summary

This report documents the SEO migration work completed on **May 26, 2026** for the Sublime Technocorp website.

It covers:

- which files were changed
- what was changed in each file
- why the change was made
- the local file timestamp for the change

Important notes:

- The **when** values below are based on each file's local filesystem `LastWriteTime`.
- Timezone context: **Asia/Calcutta**
- Scope: only the files changed as part of the **May 26, 2026 SEO migration implementation**

## Timestamp Reference

- Date covered: **May 26, 2026**
- Timestamp source: local file `LastWriteTime`

## File Change Log

| Timestamp | File | What Changed | Why It Was Changed |
|---|---|---|---|
| 2026-05-26 17:49:17 | `src/lib/site.js` | Added shared site constants and `createPageMetadata()` helper | Centralized non-www domain, canonical path constants, fallback OG image, and reusable metadata generation |
| 2026-05-26 17:49:17 | `src/lib/caseStudyUrl.js` | Repointed URL logic to new works-based helper exports | Ensured all case-study URL generation uses `/works/[slug]` instead of legacy `/caseStudy/...` |
| 2026-05-26 17:50:12 | `src/app/layout.jsx` | Updated root metadata, non-www base URL, OG/Twitter defaults, and `next/font` setup | Made the whole site use final non-www metadata strategy and font optimization |
| 2026-05-26 17:50:12 | `src/app/robots.js` | Updated sitemap URL | Pointed robots to the final non-www sitemap URL |
| 2026-05-26 17:50:12 | `src/app/sitemap.js` | Rebuilt sitemap entries to include only final indexable URLs | Removed redirected legacy URLs and included `/works`, `/contact-us`, and `/works/[slug]` |
| 2026-05-26 17:50:12 | `src/app/about/layout.jsx` | Added page-level metadata via helper | Gave `/about` page-specific canonical, OG, and Twitter metadata |
| 2026-05-26 17:50:13 | `src/app/services/layout.jsx` | Added page-level metadata via helper | Gave `/services` page-specific canonical, OG, and Twitter metadata |
| 2026-05-26 17:50:13 | `src/app/careers/layout.jsx` | Added page-level metadata via helper | Gave `/careers` page-specific canonical, OG, and Twitter metadata |
| 2026-05-26 17:50:13 | `src/app/privacy/layout.jsx` | Added page-level metadata via helper | Gave `/privacy` page-specific canonical, OG, and Twitter metadata |
| 2026-05-26 17:50:13 | `src/app/contact/layout.jsx` | Reduced legacy contact layout to pass-through | Prevented legacy `/contact` from acting like a primary SEO page |
| 2026-05-26 17:50:13 | `src/app/caseStudy/layout.jsx` | Reduced legacy caseStudy layout to pass-through | Prevented legacy `/caseStudy` from acting like a primary SEO page |
| 2026-05-26 17:50:13 | `next.config.mjs` | Added static permanent redirects | Redirected `/work`, `/contact`, and `/caseStudy` to final public routes |
| 2026-05-26 17:50:41 | `src/styles/index.css` | Removed Google font import and switched body font to CSS variable | Completed the `next/font` migration and reduced render-blocking font loading |
| 2026-05-26 17:50:41 | `tailwind.config.js` | Updated font families to use `--font-manrope` and `--font-ibm-plex-mono` | Kept typography utilities aligned with the new `next/font` setup |
| 2026-05-26 17:58:09 | `src/app/works/page.jsx` | Created the new `/works` listing page | Replaced `/work` as the final SEO listing route with server-rendered cards, metadata, and CollectionPage JSON-LD |
| 2026-05-26 17:58:09 | `src/app/works/[slug]/page.jsx` | Created the new `/works/[slug]` detail page | Replaced `/caseStudy/[slug]` as the final SEO detail route with SSG, dynamic metadata, and CreativeWork JSON-LD |
| 2026-05-26 17:58:09 | `src/app/contact-us/layout.jsx` | Added metadata for `/contact-us` | Made `/contact-us` the final canonical contact page |
| 2026-05-26 17:58:09 | `src/app/contact-us/ContactUsForm.jsx` | Added frontend-only contact form | Implemented the approved V1 lead form and thank-you redirect flow |
| 2026-05-26 17:58:10 | `src/app/contact-us/page.jsx` | Added the new `/contact-us` page | Created the final public contact landing page with proper H1 and lead form |
| 2026-05-26 17:58:10 | `src/app/thank-you/layout.jsx` | Added metadata and `noindex, follow` | Ensured the thank-you page stays out of the index while still allowing follow behavior |
| 2026-05-26 17:58:10 | `src/app/thank-you/page.jsx` | Added the new `/thank-you` page | Completed the V1 contact submission funnel |
| 2026-05-26 17:58:23 | `src/app/work/page.jsx` | Replaced old listing page with permanent redirect | Prevented duplicate live `/work` content and forced all traffic to `/works` |
| 2026-05-26 17:58:23 | `src/app/contact/page.jsx` | Replaced old contact page with permanent redirect | Prevented duplicate live `/contact` content and forced all traffic to `/contact-us` |
| 2026-05-26 17:58:23 | `src/app/caseStudy/page.jsx` | Replaced old listing page with permanent redirect | Removed the thin legacy `/caseStudy` page from the public SEO surface |
| 2026-05-26 17:58:23 | `src/app/caseStudy/[slug]/page.jsx` | Replaced legacy detail rendering with redirect resolution logic | Ensured old `id` and `id-slug` case-study URLs redirect to the new slug-only `/works/[slug]` URLs |
| 2026-05-26 18:00:33 | `src/components/Breadcrumbs.jsx` | Updated breadcrumb schema/site base URL | Kept breadcrumb structured data aligned with the non-www canonical domain |
| 2026-05-26 18:00:33 | `src/components/JobPostingSchema.jsx` | Updated organization URL | Aligned job schema with the final non-www domain |
| 2026-05-26 18:00:33 | `src/components/JsonLd.jsx` | Updated organization schema URLs and logo path | Made shared organization schema consistent with the final SEO domain strategy |
| 2026-05-26 18:00:33 | `src/components/ui/Tag.jsx` | Updated font utility usage | Kept the component compatible with the new font setup |
| 2026-05-26 18:00:34 | `src/app/page.jsx` | Removed client-only page wrapper behavior | Allowed homepage sections like case studies to render server-side for SEO |
| 2026-05-26 18:00:52 | `src/components/common/Header.jsx` | Updated navigation links to final routes | Removed old `/work` and `/contact` destinations from header navigation and CTA buttons |
| 2026-05-26 18:00:52 | `src/components/CompanyIntroSection.jsx` | Updated CTA target to `/contact-us` | Kept home-page CTA links aligned with the final contact route |
| 2026-05-26 18:00:52 | `src/components/serviceCard.jsx` | Updated CTA target to `/contact-us` | Removed legacy contact destination from service cards |
| 2026-05-26 18:01:36 | `src/components/CaseStudies.jsx` | Rebuilt as server-rendered case-studies section | Replaced the old homepage client-fetch pattern so case study cards appear in initial HTML |
| 2026-05-26 18:01:36 | `src/components/common/Footer.jsx` | Updated footer links, contact CTA, and social links | Removed legacy public destinations and aligned footer navigation with final routes |
| 2026-05-26 18:02:19 | `src/components/ServiceDetails.jsx` | Updated CTA links to `/contact-us` | Removed old contact destinations from another high-traffic homepage section |
| 2026-05-26 18:02:19 | `src/components/WhyUs.jsx` | Updated CTA links to `/contact-us` | Kept all homepage conversion links consistent with the new contact route |
| 2026-05-26 18:49:50 | `src/lib/caseStudies.js` | Added shared fetch, slug, media URL, and legacy redirect helper logic | Centralized case-study data fetching, slug normalization, URL generation, sitemap compatibility, and legacy redirect mapping |

## Grouped Change Summary

### 1. Foundation and shared SEO helpers

Files:

- `src/lib/site.js`
- `src/lib/caseStudyUrl.js`
- `src/lib/caseStudies.js`

Why:

- to centralize the new non-www domain strategy
- to standardize `/works/[slug]` URL generation
- to normalize slugs and resolve legacy redirects consistently

### 2. Global metadata, robots, sitemap, fonts

Files:

- `src/app/layout.jsx`
- `src/app/robots.js`
- `src/app/sitemap.js`
- `src/styles/index.css`
- `tailwind.config.js`

Why:

- to switch the site to final canonical metadata
- to publish only final indexable URLs
- to migrate fonts to `next/font`

### 3. New routes

Files:

- `src/app/works/page.jsx`
- `src/app/works/[slug]/page.jsx`
- `src/app/contact-us/layout.jsx`
- `src/app/contact-us/page.jsx`
- `src/app/contact-us/ContactUsForm.jsx`
- `src/app/thank-you/layout.jsx`
- `src/app/thank-you/page.jsx`

Why:

- to implement the final public SEO route structure

### 4. Legacy route conversion to redirects

Files:

- `next.config.mjs`
- `src/app/work/page.jsx`
- `src/app/contact/page.jsx`
- `src/app/caseStudy/page.jsx`
- `src/app/caseStudy/[slug]/page.jsx`
- `src/app/contact/layout.jsx`
- `src/app/caseStudy/layout.jsx`

Why:

- to remove duplicate indexable legacy URLs
- to preserve old traffic and indexed URLs through permanent redirects

### 5. Internal linking and schema cleanup

Files:

- `src/components/common/Header.jsx`
- `src/components/common/Footer.jsx`
- `src/components/CompanyIntroSection.jsx`
- `src/components/serviceCard.jsx`
- `src/components/ServiceDetails.jsx`
- `src/components/WhyUs.jsx`
- `src/components/Breadcrumbs.jsx`
- `src/components/JsonLd.jsx`
- `src/components/JobPostingSchema.jsx`

Why:

- to remove legacy `/work`, `/contact`, and `/caseStudy` public destinations
- to keep schema and internal link paths aligned with the final route structure

### 6. Homepage SEO/performance improvement

Files:

- `src/app/page.jsx`
- `src/components/CaseStudies.jsx`

Why:

- to make homepage case studies render in initial HTML instead of relying on client-side fetching

## Notes

- All timestamps above are from **May 26, 2026**, which matches the "yesterday" scope requested.
- These timestamps reflect the local workspace file modification times.
- This file is intended as an audit-friendly record of the migration work only.
