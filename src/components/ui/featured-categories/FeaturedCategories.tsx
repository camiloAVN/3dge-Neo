import Link from 'next/link';
import Image from 'next/image';
import { LuArrowRight, LuLayoutGrid } from 'react-icons/lu';
import { getCategories } from '@/actions';

export async function FeaturedCategories() {
  const all = await getCategories();

  const categories = (all as { id: string; name: string; slug: string; imageUrl: string | null; isActive: boolean; isFeatured: boolean; sortOrder: number }[])
    .filter(c => c.isActive && c.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (categories.length === 0) return null;

  return (
    <section className="mt-5 mb-2">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-[#111111]">Categorías Destacadas</h2>
        <Link
          href="/categories"
          className="flex items-center gap-1.5 text-sm font-medium text-[#D61C1C] hover:underline underline-offset-2"
        >
          Ver todas las categorías
          <LuArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Category cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="group flex flex-col border border-[#E5E5E5] rounded-lg overflow-hidden bg-white hover:border-[#D61C1C] hover:shadow-sm transition-all duration-200"
          >
            {/* Image area */}
            <div className="relative aspect-[3/2] bg-[#F8F9FA]">
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : (
                /* Placeholder until the user adds real images */
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 select-none">
                  <LuLayoutGrid className="w-8 h-8 text-[#E5E5E5]" />
                  <span className="text-[10px] text-[#BBBBBB] font-medium uppercase tracking-wider">
                    Sin imagen
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 p-2.5">
              <p className="text-sm font-semibold text-[#111111] leading-tight truncate">
                {cat.name}
              </p>
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center justify-center gap-1.5 w-full rounded border border-[#E5E5E5] group-hover:bg-[#D61C1C] group-hover:border-[#D61C1C] group-hover:text-white text-[#444444] text-xs font-medium py-1.5 transition-colors duration-200"
              >
                Ir
                <LuArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
