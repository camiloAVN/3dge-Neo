'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { placeOrder } from '@/actions';
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import type { Address } from '@/interfaces';
import styles from '../checkout.module.css';

interface Props {
  userAddress: Partial<Address>;
}

export const PlaceOrder = ({ userAddress }: Props) => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);

  const { subTotal, tax, total, itemsInCart } = useMemo(() => {
    const subTotal = cart.reduce((acc, p) => acc + p.quantity * p.price, 0);
    const tax = subTotal * 0.19;
    return { subTotal, tax, total: subTotal + tax, itemsInCart: cart.reduce((acc, p) => acc + p.quantity, 0) };
  }, [cart]);

  useEffect(() => { setLoaded(true); }, []);

  if (!loaded) {
    return (
      <>
        <div className={styles.skeleton} style={{ height: 120, marginBottom: 14 }} />
        <div className={styles.skeleton} style={{ height: 160 }} />
      </>
    );
  }

  const onPlaceOrder = async () => {
    setIsPlacing(true);
    setErrorMessage('');

    const productsToOrder = cart.map(p => ({
      productId:    p.id,
      quantity:     p.quantity,
      variantId:    p.variantId,
      variantLabel: p.variantLabel,
    }));

    const address: Address = {
      firstName:  userAddress.firstName  ?? '',
      lastName:   userAddress.lastName   ?? '',
      address:    userAddress.address    ?? '',
      address2:   userAddress.address2   ?? '',
      postalCode: userAddress.postalCode ?? '',
      city:       userAddress.city       ?? '',
      country:    userAddress.country    ?? 'CO',
      phone:      userAddress.phone      ?? '',
    };

    const resp = await placeOrder(productsToOrder, address);

    if (!resp.ok) {
      setIsPlacing(false);
      setErrorMessage(resp.message ?? 'Ocurrió un error al procesar el pedido.');
      return;
    }

    clearCart();
    router.replace('/orders/' + resp.order?.id);
  };

  return (
    <>
      {/* Delivery address */}
      <div className={styles.addressBlock}>
        <div className={styles.addressHeader}>
          <span className={styles.addressTitle}>Dirección de entrega</span>
          <Link href="/checkout/address" className={styles.addressEdit}>Editar</Link>
        </div>
        <p className={styles.addressName}>
          {userAddress.firstName} {userAddress.lastName}
        </p>
        <p className={styles.addressLine}>
          {userAddress.address}
          {userAddress.address2 ? `, ${userAddress.address2}` : ''}
        </p>
        <p className={styles.addressLine}>
          {userAddress.city}, {userAddress.postalCode}
        </p>
        <p className={styles.addressLine}>Colombia · {userAddress.phone}</p>
      </div>

      {/* Order totals */}
      <div className={styles.totals}>
        <p className={styles.sectionTitle}>Resumen</p>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>
            {itemsInCart === 1 ? '1 producto' : `${itemsInCart} productos`}
          </span>
          <span className={styles.totalValue}>{currencyFormat(subTotal)}</span>
        </div>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>IVA (19%)</span>
          <span className={styles.totalValue}>{currencyFormat(tax)}</span>
        </div>

        <div className={styles.totalFinalRow}>
          <span className={styles.totalFinalLabel}>Total</span>
          <span className={styles.totalFinalValue}>{currencyFormat(total)}</span>
        </div>
      </div>

      {errorMessage && (
        <div className={styles.errorBanner}>{errorMessage}</div>
      )}

      <button
        disabled={isPlacing || cart.length === 0}
        onClick={onPlaceOrder}
        className={styles.submit}
      >
        <span>{isPlacing ? 'Procesando…' : 'Completar pedido'}</span>
        <span>→</span>
      </button>

      <p className={styles.submitNote}>Pago seguro · Al continuar aceptas nuestros términos.</p>
    </>
  );
};
