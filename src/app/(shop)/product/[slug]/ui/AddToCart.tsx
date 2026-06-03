'use client';

import { QuantitySelector } from '@/components';
import type { CartProduct, Product } from '@/interfaces';
import { useCartStore } from '@/store';
import { LuShoppingCart } from 'react-icons/lu';
import { useState } from 'react';

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore(state => state.addProductToCart);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.inStock === 0;

  const addToCart = () => {
    if (outOfStock) return;

    const cartProduct: CartProduct = {
      id:       product.id,
      slug:     product.slug,
      title:    product.title,
      price:    product.price,
      quantity,
      image:    product.images[0],
    };
    addProductToCart(cartProduct);
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {!outOfStock && (
        <div>
          <p className="text-xs font-semibold text-[#444444] uppercase tracking-wider mb-2">Cantidad</p>
          <QuantitySelector
            quantity={quantity}
            onQuantityChanged={setQuantity}
            max={product.inStock}
          />
        </div>
      )}

      <button
        onClick={addToCart}
        disabled={outOfStock}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200
          ${added
            ? 'bg-green-600 text-white'
            : outOfStock
              ? 'bg-[#F8F9FA] text-[#BBBBBB] cursor-not-allowed border border-[#E5E5E5]'
              : 'bg-[#D61C1C] hover:bg-[#b81818] text-white'
          }`}
      >
        {added ? (
          '¡Agregado al carrito!'
        ) : outOfStock ? (
          'Sin stock disponible'
        ) : (
          <>
            <LuShoppingCart className="w-4 h-4" />
            Agregar al carrito
          </>
        )}
      </button>
    </div>
  );
};
