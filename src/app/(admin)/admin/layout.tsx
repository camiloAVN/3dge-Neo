import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from './ui/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f4ee' }}>
      <AdminSidebar />

      <div style={{ marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Header bar */}
        <header style={{
          height: 60,
          background: '#141210',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-space-mono), ui-monospace, monospace',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.16em',
            textTransform: 'uppercase',
            color: '#6c685f',
          }}>
            Panel de administración
          </span>
          <span style={{
            fontFamily: 'var(--font-space-mono), ui-monospace, monospace',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.10em',
            textTransform: 'uppercase',
            color: '#f6f4ee',
          }}>
            {session.user.name}
          </span>
        </header>

        <main style={{ flex: 1, padding: 32 }}>
          {children}
        </main>

      </div>
    </div>
  );
}
