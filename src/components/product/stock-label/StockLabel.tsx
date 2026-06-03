'use client';

import { getStockBySlug } from '@/actions';
import { useEffect, useState } from 'react';

interface Props {
  slug?: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [stock, setStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStockBySlug(slug).then(s => {
      setStock(s);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div className="h-6 w-24 bg-[#E5E5E5] animate-pulse rounded-full mb-4" />;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 border ${
      stock > 0
        ? 'bg-green-50 text-green-700 border-green-200'
        : 'bg-red-50 text-[#D61C1C] border-red-200'
    }`}>
      {stock > 0 ? `En stock: ${stock}` : 'Sin stock'}
    </span>
  );
};
