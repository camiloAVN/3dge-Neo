import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import { CuentaTiles } from './ui/CuentaTiles';
import styles from './cuenta.module.css';

export const metadata = { title: 'Mi cuenta' };

export default async function CuentaPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  const isAdmin = (session.user as any).role === 'admin';

  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* ── LEFT: blue brand panel ── */}
        <div className={styles.left}>
          <Link href="/" className={styles.backLink}>
            ← <Brand3DGE size={18} />
          </Link>

          <div className={styles.blueTop}>EST.&nbsp;2024</div>
          <div className={styles.vert}>Mi cuenta</div>

          <div className={styles.mark}>
            <Brand3DGE size={38} priority />
          </div>
        </div>

        {/* ── RIGHT: action tiles ── */}
        <CuentaTiles isAdmin={isAdmin} />

      </div>
    </div>
  );
}
