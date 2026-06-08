# Sublime Technocorp — Website (2025)

Next.js 15 · React 19 · Tailwind CSS 3.4 · App Router

---

## Changelog — 17 May 2026

A comprehensive update covering security hardening, SEO foundations, UX improvements, and the full case study detail page feature.

---

### 1. Security & Dependency Updates

| Package | Change |
|---|---|
| `next` | Updated to `15.5.18` |
| `react` / `react-dom` | Updated to `19.x` |
| `postcss` | Updated to `^8.5.14` |
| `@next/bundle-analyzer` | Added for bundle inspection |
| `cross-env` | Added for cross-platform scripts |

- Added `npm overrides` in `package.json` for `postcss` and `micromatch` to resolve transitive vulnerability chains.
- Result: **0 vulnerabilities** (`npm audit`).

**Files:** `package.json`, `next.config.mjs`

---

### 2. SEO — Metadata, Canonicals & Structured Data

#### Root layout (`src/app/layout.jsx`)
- Added full `metadata` export: `title`, `description`, `metadataBase`, `alternates.canonical`.
- Added Open Graph and Twitter card tags with `og:image`.
- Added `<link rel="preconnect">` for Google Fonts and GTM.
- Added `<a href="#main-content">` skip-navigation link for accessibility.
- Wrapped page body in `<main id="main-content">` for landmark navigation.

#### Per-route layout files
Each route now has a dedicated `layout.jsx` that exports `metadata` with a canonical URL and page-specific `title` / `description`:

| Route | Layout |
|---|---|
| `/about` | `src/app/about/layout.jsx` |
| `/work` | `src/app/work/layout.jsx` |
| `/careers` | `src/app/careers/layout.jsx` |
| `/caseStudy` | `src/app/caseStudy/layout.jsx` |
| `/contact` | `src/app/contact/layout.jsx` |
| `/privacy` | `src/app/privacy/layout.jsx` |
| `/services` | `src/app/services/layout.jsx` |

**SEO impact:** Correct canonical URLs prevent duplicate-content penalties; per-page titles improve click-through rate from search results.

#### Robots & Sitemap
- `src/app/robots.js` — generates `/robots.txt` allowing all crawlers, pointing to sitemap.
- `src/app/sitemap.js` — generates `/sitemap.xml` listing all static routes.

**SEO impact:** Ensures all pages are discoverable and indexable by search engines.

#### JSON-LD Structured Data
- `src/components/JsonLd.jsx` — `Organization` + `LocalBusiness` schema injected in root layout. Provides rich results eligibility (business name, address, contact, social profiles).
- `src/components/JobPostingSchema.jsx` — `JobPosting` schema added to the careers page. Enables Google Jobs integration.

**SEO impact:** Structured data can unlock rich snippets in Google Search (star ratings, job listings, business info panel).

#### Heading Hierarchy Fix (H1 → H2)
The homepage had multiple `<h1>` elements, violating SEO best practices. Fixed in:
- `src/components/home/partners.jsx`
- `src/components/home/ServiceDetails.jsx` (2 headings)
- `src/components/home/CompanyIntroSection.jsx`

A single `<h1>` now remains only in `HomeHeroSection.jsx`.

**SEO impact:** Search engines use heading hierarchy to understand page structure; a single H1 is a ranking signal.

---

### 3. Google Analytics 4

- GA4 tag (`G-5PXQKNC568`) added via `<Script>` in `src/app/layout.jsx`.
- Loads with `strategy="afterInteractive"` to avoid blocking render.

---

### 4. Next.js Image Optimisation

- `src/components/home/CaseStudies.jsx` and `src/app/work/page.jsx` migrated from `<img>` to `next/image` with correct `sizes` attributes and `loading="lazy"`.
- `next.config.mjs` updated with `images.remotePatterns` to allow images from `api.samiinfotech.com`.

**SEO impact:** `next/image` auto-generates `srcset`, serves WebP, and avoids Cumulative Layout Shift — all Core Web Vitals improvements.

---

### 5. Bundle Optimisation

- `next.config.mjs`: `optimizePackageImports` for `react-icons` and `lucide-react` (tree-shakes icon sets).
- Added vendor `splitChunks` config to separate third-party code into a cacheable chunk.
- `package.json`: added `"analyze": "cross-env ANALYZE=true next build"` script.

---

### 6. Sticky Header with Scroll Behaviour

**File:** `src/components/common/Header.jsx`

- Header is now `position: fixed` at the top of every page.
- Hides smoothly when scrolling down, reappears when scrolling up.
- Shows a `backdrop-blur` background once the user has scrolled past the hero.
- A `ResizeObserver` dynamically measures header height and injects a spacer so content is never hidden beneath it.
- Mobile menu interaction keeps the header visible.

---

### 7. Breadcrumbs Component

**File:** `src/components/Breadcrumbs.jsx`

- New shared component with two variants:
  - `variant="default"` — standard breadcrumbs for use inside page content.
  - `variant="hero"` — transparent background, blue link text, white current-page label for use inside dark hero sections.
- Renders a `BreadcrumbList` JSON-LD structured data block alongside the visible trail.

**SEO impact:** Breadcrumbs appear in Google Search snippets under the page title, improving click-through rate and navigation clarity.

Breadcrumbs are embedded inside `HeroSection` on `/about`, `/work`, and `/careers` via a `breadcrumbItems` prop.

---

### 8. New Pages

| Page | Path | Notes |
|---|---|---|
| Contact | `/contact` | Full contact form page |
| Services | `/services` | Anchor IDs matching footer service links (`#web`, `#mobile`, etc.) |
| Privacy Policy | `/privacy` | Static legal page |

---

### 9. Broken Link & Navigation Fixes

- All "Contact us" buttons / links across the site (`WhyUs.jsx`, `Footer.jsx`, `CaseStudies.jsx`, `Header.jsx`) now route to `/contact`.
- Footer service links updated to `/services#<anchor>`.
- Footer "Work" links updated to `/work`.
- About hero corrected: "Capital Numbers" → "Sublime Technocorp".

**SEO impact:** Broken internal links waste crawl budget and reduce PageRank flow. All links are now valid.

---

### 10. Case Study Detail Page (Dynamic Route)

A fully functional case study detail route was built from scratch.

#### URL pattern
```
/caseStudy/{id}-{category_url_name}
e.g. /caseStudy/10-underground-mining-management-system
```

#### Files created

| File | Purpose |
|---|---|
| `src/Services/CaseStudyServices/CaseStudyDetail.jsx` | Calls `POST /casestudy/edit` with `{ id }`, returns full case study data |
| `src/lib/caseStudyUrl.js` | Helpers: `getCaseStudyPath(project)`, `parseCaseStudySlug(param)` |
| `src/app/caseStudy/[slug]/layout.jsx` | Pass-through layout for the dynamic route |
| `src/app/caseStudy/[slug]/page.jsx` | Full detail page (client component) |

#### Files modified

- `src/app/work/page.jsx` — each project card is now wrapped in `<Link href={getCaseStudyPath(project)}>` so clicking navigates to the detail page.

#### Detail page sections (in order)

1. **Hero** — `cover_image` (fallback: `image`) as full-bleed background with opacity overlay; `title`, `sub_title`, category badge; accent colour from `colorCode` field as bottom border.
2. **Breadcrumbs** — embedded in hero using `variant="hero"`.
3. **Situation / Solution** — two-column section; only renders if data is present.
4. **Key Highlights** — grid of `keypoints[]` cards (image + title + subtitle).
5. **Features & Capabilities** — interactive tabbed component (see below).
6. **Product Overview** — `product_description` prose block.
7. **Product Gallery** — `product_image[]` image grid.
8. **CTA** — "View more work" link + "Contact us" button.

#### Features tab component

The features section renders the original tabbed UI:

- Horizontal **tab pills** — one per `features[].feature` group; active tab is filled blue.
- **Content card** with two columns:
  - Left: the selected detail's `name` (bold, large) and `description`; other details in the group listed as clickable items with a blue left border.
  - Right: the selected detail's `image` as a screenshot preview.
- Clicking a tab resets to the first detail in that group.
- Clicking a sidebar detail swaps the image and description.

**SEO impact:** Each case study has its own indexable URL. Rich page content (structured sections, real text from the API) gives search engines substantive material to index per project.

---

## Environment Variables

```env
NEXT_PUBLIC_BASE_URL=https://api.samiinfotech.com/
```

## API Endpoints Used

| Endpoint | Method | Used in |
|---|---|---|
| `/casestudy/list` | GET | `/work` page, homepage `CaseStudies` component |
| `/casestudy/edit` | POST `{ id }` | Case study detail page |
| `/casestudy/categorylist` | GET | `/work` page filter chips |

## Running Locally

```bash
npm install
npm run dev        # development server
npm run build      # production build
npm run analyze    # bundle analysis (opens treemap in browser)
```
