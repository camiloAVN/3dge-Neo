import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import { getUserAddress } from '@/actions';
import { AddressForm } from './ui/AddressForm';
import styles from './address.module.css';

export const metadata = { title: 'Dirección de entrega' };

export default async function AddressPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login?redirectTo=/checkout/address');

  const userAddress = await getUserAddress(session.user.id) ?? undefined;

  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* ── LEFT: blue brand panel ── */}
        <div className={styles.left}>
          <Link href="/products" className={styles.backLink}>
            ← Productos
          </Link>

          <div className={styles.blueTop}>Paso 1 de 2</div>
          <div className={styles.vert}>Dirección de entrega</div>

          <div className={styles.mark}>
            <Brand3DGE size={38} priority />
          </div>
        </div>

        {/* ── RIGHT: form ── */}
        <AddressForm userStoreAddress={userAddress} />

      </div>
    </div>
  );
}
