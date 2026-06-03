'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuMinus, LuPlus, LuShoppingCart } from 'react-icons/lu';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import type { Product } from '@/interfaces';

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);
  const [quantity, setQuantity]         = useState(1);
  const [added, setAdded]               = useState(false);

  const addProductToCart = useCartStore(state => state.addProductToCart);

  const outOfStock = product.inStock === 0;

  const decrement = () => setQuantity(q => Math.max(1, q - 1));
  const increment = () => setQuantity(q => Math.min(product.inStock || 99, q + 1));

  const handleAdd = () => {
    if (outOfStock) return;
    addProductToCart({
      id:       product.id,
      slug:     product.slug,
      title:    product.title,
      price:    product.price,
      quantity,
      image:    product.images[0],
    } as any);
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden border border-[#E5E5E5] hover:border-[#D61C1C] hover:shadow-sm transition-all duration-200 group">

      {/* ── Image ── */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-[#F8F9FA]"
      >
        <Image
          src={`/products/${displayImage}`}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onMouseEnter={() => setDisplayImage(product.images[1] ?? product.images[0])}
          onMouseLeave={() => setDisplayImage(product.images[0])}
        />

        {outOfStock && (
          <span className="absolute top-2 left-2 z-10 bg-[#D61C1C] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Sin stock
          </span>
        )}
      </Link>

      {/* ── Info ── */}
      <div className="flex flex-col gap-2.5 p-3">

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <p className="text-sm font-medium text-[#111111] leading-snug line-clamp-2 hover:text-[#D61C1C] transition-colors duration-150">
            {product.title}
          </p>
        </Link>

        {/* Price */}
        <span className="text-base font-bold text-[#111111]">
          {currencyFormat(product.price)}
        </span>

        {/* Quantity + Add to cart */}
        <div className="flex items-center gap-2 mt-0.5">

          {/* − qty + */}
          <div className="flex items-center border border-[#E5E5E5] rounded overflow-hidden">
            <button
              onClick={decrement}
              disabled={quantity <= 1 || outOfStock}
              className="w-7 h-8 flex items-center justify-center text-[#444444] hover:bg-[#F8F9FA] disabled:opacity-30 transition-colors"
            >
              <LuMinus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-medium text-[#111111] select-none">
              {quantity}
            </span>
            <button
              onClick={increment}
              disabled={outOfStock}
              className="w-7 h-8 flex items-center justify-center text-[#444444] hover:bg-[#F8F9FA] disabled:opacity-30 transition-colors"
            >
              <LuPlus className="w-3 h-3" />
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className={`flex-1 h-8 flex items-center justify-center gap-1.5 rounded text-xs font-semibold transition-all duration-200
              ${added
                ? 'bg-green-600 text-white'
                : outOfStock
                  ? 'bg-[#F8F9FA] text-[#BBBBBB] cursor-not-allowed'
                  : 'bg-[#D61C1C] hover:bg-[#b81818] text-white'
              }`}
          >
            {added ? (
              '¡Agregado!'
            ) : (
              <>
                <LuShoppingCart className="w-3.5 h-3.5" />
                Agregar
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
