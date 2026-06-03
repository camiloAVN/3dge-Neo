export const revalidate = 60;

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LuChevronRight, LuPackageSearch } from 'react-icons/lu';
import prisma from '@/lib/prisma';
import { getPaginationProductWithImages } from '@/actions';
import { Pagination, ProductGrid } from '@/components';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: 'Categoría no encontrada' };
  return {
    title: `${category.name} | UNIK`,
    description: category.description ?? `Explora todos los productos de ${category.name}`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;

  const [category, totalCount] = await Promise.all([
    prisma.category.findUnique({ where: { slug } }),
    prisma.product.count({ where: { category: { slug } } }),
  ]);

  if (!category || !category.isActive) notFound();

  const { products, totalPages } = await getPaginationProductWithImages({
    page,
    take: 10,
    categorySlug: slug,
  });

  return (
    <div>
      {/* ── Category banner ── */}
      <div className="relative -mx-5 sm:-mx-10 h-[180px] sm:h-[220px] overflow-hidden">
        {/* Background: real image or dark gradient placeholder */}
        {(category as any).imageUrl ? (
          <Image
            src={(category as any).imageUrl}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#111111] to-[#2a2a2a]" />
        )}

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#D61C1C]" />

        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-10 pb-6 sm:pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-[11px] text-white/50 mb-2">
            <Link href="/" className="hover:text-white/80 transition-colors">Inicio</Link>
            <LuChevronRight className="w-3 h-3" />
            <Link href="/categories" className="hover:text-white/80 transition-colors">Categorías</Link>
            <LuChevronRight className="w-3 h-3" />
            <span className="text-white/80">{category.name}</span>
          </nav>

          <div className="flex items-end justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {category.name}
            </h1>
            <span className="flex-shrink-0 text-xs text-white/60 pb-0.5">
              {totalCount} {totalCount === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          {(category as any).description && (
            <p className="text-sm text-white/60 mt-1.5 max-w-xl">
              {(category as any).description}
            </p>
          )}
        </div>
      </div>

      {/* ── Products section ── */}
      <div className="mt-8">
        {products.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <LuPackageSearch className="w-12 h-12 text-[#E5E5E5] mb-4" />
            <p className="text-base font-semibold text-[#111111]">
              Sin productos aún
            </p>
            <p className="text-sm text-[#444444] mt-1 mb-6">
              Esta categoría todavía no tiene productos disponibles.
            </p>
            <Link
              href="/"
              className="text-sm font-medium text-[#D61C1C] hover:underline underline-offset-2"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <ProductGrid products={products} />
            <Pagination totalPages={totalPages} />
          </>
        )}
      </div>
    </div>
  );
}
