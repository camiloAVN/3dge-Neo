'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import type { Product } from '@/interfaces';
import styles from './card.module.css';

interface Props {
  product: Product;
}

export function NeoProductCard({ product }: Props) {
  const [hoverImage, setHoverImage] = useState(false);
  const [quantity, setQuantity]     = useState(1);
  const [added, setAdded]           = useState(false);

  const addProductToCart = useCartStore(s => s.addProductToCart);

  const outOfStock = product.inStock === 0;
  const img0 = product.images[0];
  const img1 = product.images[1] ?? img0;
  const currentImg = hoverImage && img1 ? img1 : img0;

  const toSrc = (name: string) =>
    name?.startsWith('http') ? name : `/products/${name}`;

  const handleAdd = () => {
    if (outOfStock) return;
    addProductToCart({
      id:       product.id,
      slug:     product.slug,
      title:    product.title,
      price:    product.price,
      quantity,
      image:    img0,
    } as any);
    setAdded(true);
    setQuantity(1);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className={styles.card}>

      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className={styles.imageWrap}
        onMouseEnter={() => setHoverImage(true)}
        onMouseLeave={() => setHoverImage(false)}
      >
        {img0 ? (
          <Image
            src={toSrc(currentImg)}
            alt={product.title}
            fill
            className={styles.image}
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 33vw, 25vw"
          />
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderFrame} />
          </div>
        )}
        {outOfStock && <span className={styles.badge}>Sin stock</span>}
      </Link>

      {/* Info */}
      <div className={styles.info}>
        <Link href={`/product/${product.slug}`} className={styles.title}>
          {product.title}
        </Link>

        <span className={styles.price}>{currencyFormat(product.price)}</span>

        <div className={styles.controls}>
          {/* Quantity */}
          <div className={styles.qty}>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1 || outOfStock}
              aria-label="Restar"
            >
              −
            </button>
            <span className={styles.qtyNum}>{quantity}</span>
            <button
              className={styles.qtyBtn}
              onClick={() => setQuantity(q => Math.min(product.inStock || 99, q + 1))}
              disabled={outOfStock}
              aria-label="Sumar"
            >
              +
            </button>
          </div>

          {/* Add to cart */}
          <button
            className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
            onClick={handleAdd}
            disabled={outOfStock}
          >
            <span>
              {added ? '¡Agregado!' : outOfStock ? 'Sin stock' : 'Agregar'}
            </span>
            <span>{added ? '✓' : '→'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
