'use client';

import { generatePaginationNumbers } from '@/utils';
import Link from 'next/link';
import { usePathname, useSearchParams, redirect } from 'next/navigation';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageString = searchParams.get('page') ?? 1;
  const currentPage = isNaN(+pageString) ? 1 : +pageString;

  if (currentPage < 1 || isNaN(+pageString)) {
    redirect(pathname);
  }

  const allPages = generatePaginationNumbers(currentPage, totalPages);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    if (pageNumber === '...') return `${pathname}?${params.toString()}`;
    if (+pageNumber <= 0) return pathname;
    if (+pageNumber > totalPages) return `${pathname}?${params.toString()}`;
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const btnBase =
    'flex items-center justify-center h-9 min-w-[36px] px-1 rounded text-sm font-medium transition-colors select-none';
  const btnDefault = 'text-[#444444] hover:bg-[#F8F9FA]';
  const btnActive = 'bg-[#D61C1C] text-white shadow-sm pointer-events-none';
  const btnNav =
    'gap-1.5 px-3 border border-[#E5E5E5] text-[#444444] hover:bg-[#F8F9FA] hover:border-[#BBBBBB]';
  const btnNavDisabled = 'opacity-30 pointer-events-none border border-[#E5E5E5] text-[#444444]';

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-1 mt-10 mb-16">
      {/* Previous */}
      <Link
        href={createPageUrl(currentPage - 1)}
        aria-disabled={isPrevDisabled}
        className={`${btnBase} ${isPrevDisabled ? btnNavDisabled : btnNav}`}
      >
        <LuChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Link>

      {/* Page numbers */}
      <div className="flex items-center gap-1 mx-1">
        {allPages.map((page, i) =>
          page === '...' ? (
            <span
              key={`dots-${i}`}
              className={`${btnBase} ${btnDefault} cursor-default pointer-events-none`}
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`${btnBase} ${page === currentPage ? btnActive : btnDefault}`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      <Link
        href={createPageUrl(currentPage + 1)}
        aria-disabled={isNextDisabled}
        className={`${btnBase} ${isNextDisabled ? btnNavDisabled : btnNav}`}
      >
        <span className="hidden sm:inline">Siguiente</span>
        <LuChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
