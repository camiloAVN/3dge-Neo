'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import styles from '../cuenta.module.css';

interface Props {
  isAdmin: boolean;
}

export function CuentaTiles({ isAdmin }: Props) {
  return (
    <div className={styles.tiles}>
      {/* Row 1: Perfil + Mis pedidos */}
      <div className={styles.tilesRow}>
        <Link href="/profile" className={`${styles.tile} ${styles.tileYellow}`}>
          <span className={styles.tileNum}>01</span>
          <span className={styles.tileLabel}>Perfil</span>
          <span className={styles.tileArrow}>→</span>
        </Link>

        <Link href="/orders" className={`${styles.tile} ${styles.tilePaper}`}>
          <span className={styles.tileNum}>02</span>
          <span className={styles.tileLabel}>Mis pedidos</span>
          <span className={styles.tileArrow}>→</span>
        </Link>
      </div>

      {/* Row 2: Panel admin (admin only) + Cerrar sesión */}
      <div className={styles.tilesRow}>
        {isAdmin && (
          <Link href="/admin" className={`${styles.tile} ${styles.tileRed}`}>
            <span className={styles.tileNum}>03</span>
            <span className={styles.tileLabel}>Panel admin</span>
            <span className={styles.tileArrow}>→</span>
          </Link>
        )}

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className={`${styles.tile} ${styles.tileInk}`}
        >
          <span className={styles.tileNum}>{isAdmin ? '04' : '03'}</span>
          <span className={styles.tileLabel}>Cerrar sesión</span>
          <span className={styles.tileArrow}>→</span>
        </button>
      </div>
    </div>
  );
}
