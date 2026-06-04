import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import { getUserAddress } from '@/actions';
import { ProductsInCart } from './ui/ProductsInCart';
import { PlaceOrder } from './ui/PlaceOrder';
import styles from './checkout.module.css';

export const metadata = { title: 'Confirmar pedido' };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login?redirectTo=/checkout/address');

  const userAddress = await getUserAddress(session.user.id);
  if (!userAddress) redirect('/checkout/address');

  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* ── LEFT: blue brand panel ── */}
        <div className={styles.left}>
          <Link href="/checkout/address" className={styles.backLink}>
            ← Dirección
          </Link>

          <div className={styles.blueTop}>Paso 2 de 2</div>
          <div className={styles.vert}>Confirmar pedido</div>

          <div className={styles.mark}>
            <Brand3DGE size={38} priority />
          </div>
        </div>

        {/* ── RIGHT: products + summary ── */}
        <div className={styles.right}>
          <div className={styles.body}>
            <ProductsInCart />
            <div className={styles.summary}>
              <PlaceOrder userAddress={userAddress} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
