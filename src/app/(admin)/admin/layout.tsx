import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from './ui/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AdminSidebar />
      <div className="ml-60 flex flex-col min-h-screen">
        <header className="h-[60px] bg-white border-b border-[#E5E5E5] px-8 flex items-center justify-between flex-shrink-0">
          <span className="text-sm text-[#444444]">Panel de administración</span>
          <span className="text-sm font-medium text-[#111111]">{session.user.name}</span>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
