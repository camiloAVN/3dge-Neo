'use client';

import { useState } from 'react';
import { LuShoppingCart } from 'react-icons/lu';
import { useCartStore } from '@/store';
import { NeoCartModal } from './NeoCartModal';
import styles from './neo-cart.module.css';

/**
 * Self-contained cart button + modal.
 * Drop into any server or client component.
 */
export function NeoCart() {
  const [open, setOpen] = useState(false);
  const cart       = useCartStore(s => s.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <button
        className={styles.cartBtn}
        onClick={() => setOpen(true)}
        aria-label={`Carrito — ${totalItems} productos`}
      >
        <LuShoppingCart size={15} />
        {totalItems > 0 && (
          <span className={styles.cartBtnCount}>{totalItems}</span>
        )}
      </button>

      <NeoCartModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
