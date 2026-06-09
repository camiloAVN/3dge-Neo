'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import styles from './admin.module.css';

interface Props {
  children: React.ReactNode;
  userName: string;
}

export function AdminShell({ children, userName }: Props) {
  const [open, setOpen] = useState(false);

  /* Close drawer when resizing to desktop */
  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 821) setOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  return (
    <div className={styles.shell}>

      {/* Sidebar / drawer */}
      <AdminSidebar isOpen={open} onClose={() => setOpen(false)} />

      {/* Mobile scrim */}
      {open && (
        <div
          className={styles.scrim}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Right-side content */}
      <div className={styles.contentArea}>

        <header className={styles.topBar}>
          {/* Hamburger — visible only on mobile */}
          <button
            className={styles.hamburgerBtn}
            onClick={() => setOpen(true)}
            aria-label="Abrir menú de administración"
          >
            <span className={styles.hLine} />
            <span className={styles.hLine} />
            <span className={styles.hLine} />
          </button>

          <span className={styles.topBarLabel}>Panel de administración</span>
          <span className={styles.topBarUser}>{userName}</span>
        </header>

        <main className={styles.mainContent}>
          {children}
        </main>

      </div>
    </div>
  );
}
