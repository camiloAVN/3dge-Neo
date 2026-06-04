export const revalidate = 60;

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPaginationProductWithImages } from '@/actions';
import { NeoProductCard } from './ui/NeoProductCard';
import { NeoCart } from '@/components/cart/neo-cart/NeoCart';
import styles from './grid.module.css';

/* ── Fixed category definitions ── */
const CATEGORIES = {
  neo:  { label: 'NEO',  accent: 'Blue'   as const, num: '01' },
  hexa: { label: 'HEXA', accent: 'Yellow' as const, num: '02' },
  crea: { label: 'CREA', accent: 'Red'    as const, num: '03' },
} as const;

type Slug = keyof typeof CATEGORIES;

interface Props {
  params:       Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug }     = await params;
  const { page: pg } = await searchParams;

  if (!(slug in CATEGORIES)) notFound();

  const cat  = CATEGORIES[slug as Slug];
  const page = pg ? Math.max(1, parseInt(pg)) : 1;

  /* CREA → coming-soon screen (no DB query needed) */
  if (slug === 'crea') {
    return (
      <div className={styles.container}>
        <div className={styles.page}>
          <TopBar cat={cat} slug={slug} />
          <div className={styles.gridArea}>
            <div className={styles.comingSoon}>
              <span className={styles.comingLabel}>{cat.num} — {cat.label}</span>
              <h1 className={styles.comingTitle}>Próximamente.</h1>
              <div className={styles.comingRule} />
              <span className={styles.emptyText}>Esta colección está en camino</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { products, totalPages } = await getPaginationProductWithImages({
    page,
    take: 12,
    categorySlug: slug,
  });

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <TopBar cat={cat} slug={slug} />

        <div className={styles.gridArea}>
          {products.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyNum}>∅</span>
              <span className={styles.emptyText}>No hay productos en esta colección aún</span>
              <Link href="/products" className={styles.emptyLink}>← Volver a colecciones</Link>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {products.map(p => (
                  <NeoProductCard key={p.slug} product={p} />
                ))}
              </div>
              {totalPages > 1 && (
                <NeoPagination currentPage={page} totalPages={totalPages} slug={slug} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Shared top bar ── */
function TopBar({ cat, slug }: { cat: (typeof CATEGORIES)[Slug]; slug: string }) {
  return (
    <div className={styles.topBar}>
      <Link href="/products" className={styles.backLink}>← Colecciones</Link>
      <span className={styles.topTitle}>{cat.label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div className={`${styles.topAccent} ${styles[`accent${cat.accent}`]}`} />
        <NeoCart />
      </div>
    </div>
  );
}

/* ── Neoplastic pagination ── */
function NeoPagination({
  currentPage,
  totalPages,
  slug,
}: {
  currentPage: number;
  totalPages: number;
  slug: string;
}) {
  const href = (p: number) => `/products/${slug}?page=${p}`;

  return (
    <div className={styles.paginationArea}>
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className={styles.pageBtn}>←</Link>
      ) : (
        <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>←</span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <Link
          key={p}
          href={href(p)}
          className={`${styles.pageBtn} ${p === currentPage ? styles.pageBtnActive : ''}`}
        >
          {p}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className={styles.pageBtn}>→</Link>
      ) : (
        <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>→</span>
      )}
    </div>
  );
}
