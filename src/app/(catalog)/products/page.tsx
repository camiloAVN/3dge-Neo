'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import { NeoCart } from '@/components/cart/neo-cart/NeoCart';
import styles from './selector.module.css';

export default function ProductsPage() {
  useEffect(() => {
    const sync = () => {
      document.body.style.overflow = window.innerWidth > 820 ? 'hidden' : 'auto';
    };
    document.body.style.background = '#141210';
    sync();
    window.addEventListener('resize', sync);
    return () => {
      document.body.style.overflow = '';
      document.body.style.background = '';
      window.removeEventListener('resize', sync);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.page}>

        {/* ── Top bar ── */}
        <div className={styles.topBar}>
          <Link href="/" className={styles.backLink}>← <Brand3DGE size={20} /></Link>
          <span className={styles.topLabel}>Colecciones</span>
          <NeoCart />
        </div>

        {/* ── Three category shapes ── */}
        <div className={styles.main}>

          {/* 01 · NEO — vertical blue rectangle */}
          <Link href="/products/neo" className={`${styles.shape} ${styles.neo}`}>
            <span className={styles.shapeNum}>01</span>
            <span className={styles.shapeLabel}>NEO</span>
            <span className={styles.shapeArrow}>→</span>
          </Link>

          {/* 02 · HEXA — yellow hexagon */}
          <Link href="/products/hexa" className={`${styles.shape} ${styles.hexa}`}>
            <span className={styles.shapeNum}>02</span>
            <span className={styles.shapeLabel}>HEXA</span>
            <span className={styles.shapeArrow}>→</span>
          </Link>

          {/* 03 · CREA — red hammer */}
          <Link href="/products/crea" className={`${styles.shape} ${styles.crea}`}>
            <span className={styles.shapeNum}>03</span>
            <span className={styles.shapeLabel}>CREA</span>
            <span className={styles.shapeArrow}>→</span>
          </Link>

        </div>
      </div>
    </div>
  );
}
