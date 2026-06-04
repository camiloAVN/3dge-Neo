'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuShoppingCart } from 'react-icons/lu';
import { useCartStore } from '@/store';
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import { NeoCartModal } from '@/components/cart/neo-cart/NeoCartModal';
import styles from './hero.module.css';

export default function HeroPage() {
  const [navOpen,  setNavOpen]  = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const router     = useRouter();
  const cart       = useCartStore(s => s.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const syncOverflow = () => {
      document.body.style.overflow = window.innerWidth > 820 ? 'hidden' : 'auto';
    };
    document.body.style.background = '#141210';
    syncOverflow();
    window.addEventListener('resize', syncOverflow);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setNavOpen(false); setCartOpen(false); }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      document.body.style.background = '';
      window.removeEventListener('resize', syncOverflow);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const open  = () => setNavOpen(true);
  const close = () => setNavOpen(false);

  /* Cart cell click: redirect if empty, open modal if has items */
  const handleCartClick = () => {
    if (totalItems === 0) router.push('/products');
    else setCartOpen(true);
  };

  return (
    <div className={styles.container}>

      {/* ====== HERO COMPOSITION ====== */}
      <main className={styles.hero}>

        {/* — BANDA SUPERIOR — */}
        <div className={`${styles.band} ${styles.bandTop}`}>

          {/* Left column: menu + blue block */}
          <div className={styles.colLeft}>
            <button className={styles.menuCell} onClick={open} aria-label="Abrir menú">
              <span className={styles.burger} aria-hidden="true">
                <span className={styles.burgerSpan} />
                <span className={styles.burgerSpan} />
                <span className={styles.burgerSpan} />
              </span>
            </button>

            <div className={`${styles.block} ${styles.blockBlue} ${styles.hoverable}`}>
              <div className={styles.blueTop}>EST.&nbsp;2024</div>
              <div className={styles.vert}>Orden en la pared</div>
              <div className={styles.blueMark}>
                <Brand3DGE size={36} priority />
              </div>
            </div>
          </div>

          {/* Yellow block — main brand cell */}
          <div className={`${styles.block} ${styles.blockYellow} ${styles.hoverable}`}>
            <div className={styles.brandline}>
              <span className={styles.brandlineDot} />
              <Brand3DGE size={14} priority />
              · ORGANIZADORES DE PARED
            </div>
            <h1 className={styles.headTitle}>
              Creatividad que desborda la realidad.
            </h1>
            <div className={styles.rule} />
            <p className={styles.headSub}>
              Piezas neoplasticistas que se anclan a tu pared y ordenan
              lo cotidiano: llaves, abrigos y todo lo que cuelga.
            </p>
            <button className={styles.cta} onClick={open}>
              Crea tu organizador <span>→</span>
            </button>
          </div>

          {/* ── CART CELL ── */}
          <figure
            className={`${styles.cell} ${styles.photo} ${styles.photoBig} ${styles.cartFig}`}
            onClick={handleCartClick}
            aria-label={totalItems === 0 ? 'Ver colecciones' : `Ver carrito — ${totalItems} productos`}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCartClick(); }}
          >
            <div className={styles.cartCell}>
              <LuShoppingCart
                className={styles.cartCellIcon}
                size={clamp(36, 48, 64)}
                style={{ width: 'clamp(36px,4.5vw,64px)', height: 'clamp(36px,4.5vw,64px)' }}
              />
              <div className={styles.cartCellRule} />
              <span className={`${styles.cartCellCount} ${totalItems === 0 ? styles.cartCellCountZero : ''}`}>
                {totalItems}
              </span>
              <span className={`${styles.cartCellLabel} ${totalItems > 0 ? styles.cartCellLabelActive : ''}`}>
                {totalItems === 0 ? 'Ver colecciones' : totalItems === 1 ? 'producto' : 'productos'}
              </span>
            </div>
          </figure>
        </div>

        {/* — BANDA INFERIOR — */}
        <div className={`${styles.band} ${styles.bandBottom}`}>

          {/* Key-holder detail photo */}
          <figure className={`${styles.cell} ${styles.photo} ${styles.hoverable}`}>
            <div className={styles.ph}>
              <div className={styles.frame} />
              <div className={styles.cap}>Foto — detalle llavero</div>
            </div>
            <span className={styles.tag}>
              <span className={styles.tagAccent}>01</span> · Organizador de llaves
            </span>
          </figure>

          {/* Red block — jacket collection */}
          <div className={`${styles.block} ${styles.blockRed} ${styles.hoverable}`}>
            <div className={styles.featIdx}>02 — Colección</div>
            <h2 className={styles.featTitle}>Organizador de chaquetas</h2>
            <div className={styles.rulePaper} />
            <p className={styles.featSub}>
              Líneas rectas y color puro para colgar abrigos sin perder
              el estilo. Composición fija, anclaje resistente.
            </p>
            <Link href="/products" className={styles.featLink}>
              Ver modelos
            </Link>
          </div>

          {/* Coat photo */}
          <figure className={`${styles.cell} ${styles.photo} ${styles.hoverable}`}>
            <div className={styles.ph}>
              <div className={styles.frame} />
              <div className={styles.cap}>Foto — abrigo colgado</div>
            </div>
          </figure>
        </div>
      </main>

      {/* ====== NAVIGATION OVERLAY ====== */}
      <nav
        className={`${styles.overlay} ${navOpen ? styles.overlayOpen : ''}`}
        aria-hidden={!navOpen}
        aria-label="Menú de navegación"
      >
        <div className={styles.ovBar}>
          <span className={styles.ovBrand}>
            <Brand3DGE size={32} priority />
          </span>
          <button className={styles.ovClose} onClick={close} aria-label="Cerrar menú">
            <span className={styles.ovCloseSpan} />
            <span className={styles.ovCloseSpan} />
          </button>
        </div>

        <div className={styles.ovRow}>
          <Link href="/" className={`${styles.ovItem} ${styles.ovItemA} ${navOpen ? styles.ovItemVisible : ''}`} onClick={close}>
            <span className={styles.ovNum}>01</span>
            <span className={styles.ovLabel}>Inicio</span>
            <span className={styles.ovArrow}>→</span>
          </Link>
          <Link href="/products" className={`${styles.ovItem} ${styles.ovItemB} ${navOpen ? styles.ovItemVisible : ''}`} onClick={close}>
            <span className={styles.ovNum}>02</span>
            <span className={styles.ovLabel}>Crea tu organizador</span>
            <span className={styles.ovArrow}>→</span>
          </Link>
        </div>

        <div className={styles.ovRow}>
          <Link href="/products" className={`${styles.ovItem} ${styles.ovItemC} ${navOpen ? styles.ovItemVisible : ''}`} onClick={close}>
            <span className={styles.ovNum}>03</span>
            <span className={styles.ovLabel}>Productos</span>
            <span className={styles.ovArrow}>→</span>
          </Link>
          <Link href="/auth/login" className={`${styles.ovItem} ${styles.ovItemD} ${navOpen ? styles.ovItemVisible : ''}`} onClick={close}>
            <span className={styles.ovNum}>04</span>
            <span className={styles.ovLabel}>Iniciar sesión</span>
            <span className={styles.ovArrow}>→</span>
          </Link>
        </div>
      </nav>

      {/* ====== CART MODAL ====== */}
      <NeoCartModal open={cartOpen} onClose={() => setCartOpen(false)} />

    </div>
  );
}

/* tiny helper — avoids importing a library just for clamping in JSX */
function clamp(min: number, val: number, max: number) {
  return Math.min(Math.max(val, min), max);
}
