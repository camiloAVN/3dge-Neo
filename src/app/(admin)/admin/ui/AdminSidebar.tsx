'use client';

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
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import styles from './admin.module.css';

const navItems = [
  { label: 'Estadísticas',  href: '/admin',                icon: LuChartBar,     exact: true, num: '01' },
  { label: 'Categorías',    href: '/admin/categories',     icon: LuTag,                       num: '02' },
  { label: 'Productos',     href: '/admin/products',       icon: LuPackage,                   num: '03' },
  { label: 'Órdenes',       href: '/admin/orders',         icon: LuClipboardList,             num: '04' },
  { label: 'Clientes',      href: '/admin/customers',      icon: LuUsers,                     num: '05' },
  { label: 'Usuarios',      href: '/admin/users',          icon: LuUser,                      num: '06' },
  { label: 'Configuración', href: '/admin/configuracion',  icon: LuSettings,                  num: '07' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>

      {/* ── Header: logo + admin badge ── */}
      <div className={styles.header}>
        <Link href="/admin" className={styles.brandLink} onClick={onClose}>
          <Brand3DGE size={20} priority />
        </Link>
        <span className={styles.adminBadge}>Admin</span>
      </div>

      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        {navItems.map(({ label, href, icon: Icon, exact, num }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
            >
              <span className={styles.navNum}>{num}</span>
              <Icon size={13} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer actions ── */}
      <div className={styles.footer}>
        <Link href="/" onClick={onClose} className={styles.footerItem}>
          <LuArrowLeft size={13} style={{ flexShrink: 0 }} />
          Volver a la tienda
        </Link>
        <button
          onClick={() => { onClose?.(); signOut({ callbackUrl: window.location.origin }); }}
          className={styles.footerItem}
        >
          <LuLogOut size={13} style={{ flexShrink: 0 }} />
          Cerrar sesión
        </button>
      </div>

    </aside>
  );
}
