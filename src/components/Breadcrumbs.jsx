import Link from 'next/link';

const SITE = 'https://sublimetechnocorp.com';

/**
 * @param {{ name: string; href: string }[]} items
 * @param {'default' | 'hero'} [variant] - hero: light text on dark hero background
 */
export function Breadcrumbs({ items, variant = 'default' }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href.startsWith('http') ? item.href : `${SITE}${item.href === '/' ? '' : item.href}`,
    })),
  };

  const isHero = variant === 'hero';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav
        aria-label="Breadcrumb"
        className={`bg-transparent text-sm ${isHero ? 'px-0 py-0' : 'px-4 py-3 text-blue-500'}`}
      >
        <div className={isHero ? 'w-full' : 'container mx-auto max-w-7xl'}>
          <ol className="flex flex-wrap items-center gap-1">
            {items.map((item, index) => (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <span
                    className={`mx-2 ${isHero ? 'text-blue-500/70' : 'text-blue-400'}`}
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
                {index === items.length - 1 ? (
                  <span
                    aria-current="page"
                    className={`font-medium ${isHero ? 'text-white' : 'text-blue-700'}`}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={
                      isHero
                        ? 'text-blue-500 transition-colors hover:text-blue-400'
                        : 'text-blue-500 transition-colors hover:text-blue-600'
                    }
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
