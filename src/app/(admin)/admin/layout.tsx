import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from './ui/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <AdminShell userName={session.user.name ?? ''}>
      {children}
    </AdminShell>
  );
}
