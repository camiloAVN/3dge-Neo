import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import { getOrdersByUser } from '@/actions';
import { currencyFormat } from '@/utils';
import styles from './orders.module.css';

export const metadata = { title: 'Mis pedidos' };

export default async function OrdersPage() {
  const { ok, orders = [] } = await getOrdersByUser();

  if (!ok) redirect('/auth/login');

  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* ── LEFT: blue brand panel ── */}
        <div className={styles.left}>
          <Link href="/cuenta" className={styles.backLink}>
            ← Mi cuenta
          </Link>

          <div className={styles.blueTop}>3DGE</div>
          <div className={styles.vert}>Mis pedidos</div>

          <div className={styles.mark}>
            <Brand3DGE size={38} priority />
          </div>
        </div>

        {/* ── RIGHT: orders list ── */}
        <div className={styles.right}>
          <div className={styles.rightInner}>

            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Mis pedidos</h1>
              <div className={styles.pageRule} />
            </div>

            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>
                  Sin pedidos<br />aún.
                </p>
                <p className={styles.emptyText}>
                  Todavía no has realizado ningún pedido.
                </p>
                <Link href="/products" className={styles.emptyLink}>
                  <span>Ver productos</span>
                  <span>→</span>
                </Link>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map(order => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className={styles.orderRow}
                  >
                    <div className={styles.orderRowLeft}>
                      <span className={styles.orderId}>
                        #{order.id.split('-').at(-1)?.toUpperCase()}
                      </span>
                      <p className={styles.orderDate}>
                        {order.createdAt.toLocaleDateString('es-CO', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                      <p className={styles.orderItems}>
                        {order.itemsInOrder === 1
                          ? '1 producto'
                          : `${order.itemsInOrder} productos`}
                      </p>
                    </div>

                    <div className={styles.orderRowMid}>
                      <span className={order.isPaid ? styles.statusPaid : styles.statusPending}>
                        {order.isPaid ? 'Pagado' : 'Pendiente'}
                      </span>
                    </div>

                    <div className={styles.orderRowRight}>
                      <span className={styles.orderTotal}>
                        {currencyFormat(order.total)}
                      </span>
                      <span className={styles.orderViewLink}>Ver →</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
