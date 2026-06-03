'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LuArrowLeft,
  LuChartBar,
  LuClipboardList,
  LuLogOut,
  LuPackage,
  LuSettings,
  LuTag,
  LuUser,
  LuUsers,
} from 'react-icons/lu';

const navItems = [
  { label: 'Estadísticas',  href: '/admin',             icon: LuChartBar,     exact: true },
  { label: 'Categorías',    href: '/admin/categories',  icon: LuTag },
  { label: 'Productos',     href: '/admin/products',    icon: LuPackage },
  { label: 'Órdenes',       href: '/admin/orders',      icon: LuClipboardList },
  { label: 'Clientes',       href: '/admin/customers',      icon: LuUsers },
  { label: 'Usuarios',       href: '/admin/users',          icon: LuUser },
  { label: 'Configuración',  href: '/admin/configuracion',  icon: LuSettings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-white border-r border-[#E5E5E5] flex flex-col z-50">
      {/* Logo */}
      <div className="h-[60px] px-5 flex items-center gap-2.5 border-b border-[#E5E5E5] flex-shrink-0">
        <Link href="/admin" className="flex items-center">
          <Image
            src="/imgs/logo_2.png"
            alt="UNIK"
            height={44}
            width={140}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#D61C1C] bg-red-50 px-1.5 py-0.5 rounded flex-shrink-0">
          Admin
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors',
                active
                  ? 'bg-[#D61C1C] text-white'
                  : 'text-[#444444] hover:bg-[#F8F9FA] hover:text-[#111111]',
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-[#E5E5E5] space-y-0.5 flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#444444] hover:bg-[#F8F9FA] hover:text-[#111111] transition-colors"
        >
          <LuArrowLeft className="w-4 h-4 flex-shrink-0" />
          Volver a la tienda
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#444444] hover:bg-[#F8F9FA] hover:text-[#111111] transition-colors"
        >
          <LuLogOut className="w-4 h-4 flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
