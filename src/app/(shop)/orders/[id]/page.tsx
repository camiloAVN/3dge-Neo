import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import { PayPalButton } from '@/components';
import { getOrderById } from '@/actions';
import { currencyFormat } from '@/utils';
import styles from '../orders.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: 'Detalle del pedido' };

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const { ok, order } = await getOrderById(id);

  if (!ok || !order) redirect('/orders');

  const address = order.orderAddress!;
  const shortId = id.split('-').at(-1)?.toUpperCase() ?? id;

  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* ── LEFT: blue brand panel ── */}
        <div className={styles.left}>
          <Link href="/orders" className={styles.backLink}>
            ← Mis pedidos
          </Link>

          <div className={styles.blueTop}>Pedido #{shortId}</div>
          <div className={styles.vert}>
            {order.isPaid ? 'Pagado' : 'Pendiente'}
          </div>

          <div className={styles.mark}>
            <Brand3DGE size={38} priority />
          </div>
        </div>

        {/* ── RIGHT: order detail ── */}
        <div className={styles.right}>
          <div className={styles.rightInner}>

            {/* Status banner */}
            <div className={styles.statusBanner}>
              <div className={styles.statusBannerLeft}>
                <p className={styles.statusBannerTitle}>
                  Pedido #{shortId}
                </p>
                <p className={styles.statusBannerSub}>
                  {order.createdAt.toLocaleDateString('es-CO', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                  {' · '}
                  {order.itemsInOrder === 1
                    ? '1 producto'
                    : `${order.itemsInOrder} productos`}
                </p>
              </div>
              <span className={order.isPaid ? styles.statusPaid : styles.statusPending}>
                {order.isPaid ? 'Pagado' : 'Pendiente'}
              </span>
            </div>

            {/* Two-column: products | summary */}
            <div className={styles.detailBody}>

              {/* Products */}
              <div>
                <p className={styles.sectionTitle}>Productos del pedido</p>
                <div className={styles.productList}>
                  {order.orderItems.map(item => {
                    const imgUrl = item.product.images?.[0]?.url ?? '';
                    const src = imgUrl.startsWith('http')
                      ? imgUrl
                      : `/products/${imgUrl}`;

                    return (
                      <div
                        key={`${item.product.slug}-${item.variantLabel ?? 'default'}`}
                        className={styles.productItem}
                      >
                        <div className={styles.productImg}>
                          {imgUrl ? (
                            <Image
                              src={src}
                              width={56}
                              height={56}
                              alt={item.product.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : null}
                        </div>

                        <div className={styles.productInfo}>
                          <span className={styles.productTitle}>
                            {item.product.title}
                          </span>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                            {item.variantLabel && (
                              <span className={styles.productVariant}>
                                {item.variantLabel}
                              </span>
                            )}
                            <span className={styles.productQty}>
                              ×{item.quantity}
                            </span>
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
                    );
                  })}
                </div>
              </div>

              {/* Summary column */}
              <div className={styles.detailSummary}>

                {/* Delivery address */}
                <div className={styles.addressBlock}>
                  <p className={styles.addressTitle}>Dirección de entrega</p>
                  <p className={styles.addressName}>
                    {address.firstName} {address.lastName}
                  </p>
                  <p className={styles.addressLine}>
                    {address.address}
                    {address.address2 ? `, ${address.address2}` : ''}
                  </p>
                  <p className={styles.addressLine}>
                    {address.city}, {address.postalCode}
                  </p>
                  <p className={styles.addressLine}>
                    Colombia · {address.phone}
                  </p>
                </div>

                {/* Totals */}
                <div className={styles.totals}>
                  <p className={styles.sectionTitle}>Resumen</p>

                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>
                      {order.itemsInOrder === 1 ? '1 producto' : `${order.itemsInOrder} productos`}
                    </span>
                    <span className={styles.totalValue}>
                      {currencyFormat(order.subTotal)}
                    </span>
                  </div>

                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>IVA (19%)</span>
                    <span className={styles.totalValue}>
                      {currencyFormat(order.tax)}
                    </span>
                  </div>

                  <div className={styles.totalFinalRow}>
                    <span className={styles.totalFinalLabel}>Total</span>
                    <span className={styles.totalFinalValue}>
                      {currencyFormat(order.total)}
                    </span>
                  </div>
                </div>

                {/* Payment */}
                {order.isPaid ? (
                  <div className={styles.paidBadge}>
                    <span>Pago confirmado</span>
                    <span>✓</span>
                  </div>
                ) : (
                  <PayPalButton amount={order.total} orderId={order.id} />
                )}

                <Link href="/orders" className={styles.backToOrders}>
                  ← Volver a mis pedidos
                </Link>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
