'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductImage } from '@/components';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import styles from '../checkout.module.css';

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const cart = useCartStore(state => state.cart);

  useEffect(() => { setLoaded(true); }, []);

  if (!loaded) {
    return (
      <div>
        <p className={styles.sectionTitle}>Productos del pedido</p>
        <div className={styles.productList}>
          {[1, 2].map(i => (
            <div key={i} className={styles.productItem}>
              <div className={`${styles.productImg} ${styles.skeleton}`} />
              <div style={{ flex: 1 }}>
                <div className={styles.skeleton} style={{ height: 14, width: '70%', marginBottom: 8 }} />
                <div className={styles.skeleton} style={{ height: 10, width: '35%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div>
        <p className={styles.sectionTitle}>Productos del pedido</p>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Tu carrito está vacío.</p>
          <Link href="/products" className={styles.emptyLink}>Ver productos →</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className={styles.sectionTitle}>
        Productos del pedido ({cart.length})
      </p>
      <div className={styles.productList}>
        {cart.map(item => (
          <div
            key={`${item.id}-${item.variantId ?? 'default'}`}
            className={styles.productItem}
          >
            <div className={styles.productImg}>
              <ProductImage
                src={item.image}
                width={56}
                height={56}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div className={styles.productInfo}>
              <Link href={`/product/${item.slug}`} className={styles.productTitle}>
                {item.title}
              </Link>
              <div className={styles.productMeta}>
                {item.variantLabel && (
                  <span className={styles.productVariant}>{item.variantLabel}</span>
                )}
                <span className={styles.productQty}>×{item.quantity}</span>
              </div>
            </div>

            <div className={styles.productPrice}>
              <span className={styles.productPriceMain}>
                {currencyFormat(item.price * item.quantity)}
              </span>
              {item.quantity > 1 && (
                <span className={styles.productPriceSub}>
                  {currencyFormat(item.price)} c/u
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
