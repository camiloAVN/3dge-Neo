'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuShoppingCart } from 'react-icons/lu';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import styles from './neo-cart.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NeoCartModal({ open, onClose }: Props) {
  const cart       = useCartStore(s => s.cart);
  const removeItem = useCartStore(s => s.removeProduct);

  const subTotal    = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const toSrc = (img: string) =>
    img?.startsWith('http') ? img : `/products/${img}`;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label="Carrito de compras">

        {/* Header */}
        <div className={styles.drawerHead}>
          <div className={styles.drawerTitle}>
            <LuShoppingCart size={14} />
            Carrito
            {itemsInCart > 0 && (
              <span className={styles.drawerTitleCount}>{itemsInCart}</span>
            )}
          </div>
          <button className={styles.drawerClose} onClick={onClose} aria-label="Cerrar carrito">
            ×
          </button>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyNum}>∅</span>
            <span className={styles.emptyText}>Tu carrito está vacío</span>
            <Link href="/products" className={styles.emptyLink} onClick={onClose}>
              Ver colecciones →
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className={styles.drawerBody}>
              {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className={styles.item}>
                  {/* Thumbnail */}
                  <div className={styles.itemImg}>
                    {item.image ? (
                      <Image
                        src={toSrc(item.image)}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="68px"
                      />
                    ) : null}
                  </div>

                  {/* Info */}
                  <div className={styles.itemInfo}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemMeta}>Cant. {item.quantity}</span>
                    <span className={styles.itemPrice}>
                      {currencyFormat(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    className={styles.itemRemove}
                    onClick={() => removeItem(item)}
                    aria-label={`Eliminar ${item.title}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={styles.drawerFooter}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Subtotal</span>
                <span className={styles.totalAmount}>{currencyFormat(subTotal)}</span>
              </div>

              <div className={styles.actions}>
                <Link
                  href="/checkout/address"
                  className={styles.checkoutBtn}
                  onClick={onClose}
                >
                  <span>Proceder al pago</span>
                  <span>→</span>
                </Link>
                <button className={styles.continueBtn} onClick={onClose}>
                  Seguir comprando
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
