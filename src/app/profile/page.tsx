import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import { getUserAddress } from '@/actions';
import { ProfileForm } from './ui/ProfileForm';
import styles from './profile.module.css';

export const metadata = { title: 'Mi perfil' };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login?redirectTo=/profile');

  const userAddress = await getUserAddress(session.user.id);

  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* ── LEFT: blue brand panel ── */}
        <div className={styles.left}>
          <Link href="/cuenta" className={styles.backLink}>
            ← Mi cuenta
          </Link>

          <div className={styles.blueTop}>3DGE</div>
          <div className={styles.vert}>Mi perfil</div>

          <div className={styles.mark}>
            <Brand3DGE size={38} priority />
          </div>
        </div>

        {/* ── RIGHT: profile form ── */}
        <ProfileForm
          userId={session.user.id}
          userName={session.user.name ?? ''}
          userEmail={session.user.email ?? ''}
          userRole={(session.user as any).role ?? 'user'}
          userAddress={userAddress}
        />

      </div>
    </div>
  );
}
