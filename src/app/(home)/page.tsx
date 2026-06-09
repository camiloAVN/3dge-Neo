'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuShoppingCart } from 'react-icons/lu';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store';
import { Brand3DGE } from '@/components/ui/brand/Brand3DGE';
import { NeoCartModal } from '@/components/cart/neo-cart/NeoCartModal';
import styles from './hero.module.css';

interface HeroImages {
  heroImageMain:  string | null;
  heroImageLeft:  string | null;
  heroImageRight: string | null;
}

async function fetchHeroImages(): Promise<HeroImages> {
  try {
    const res = await fetch('/api/hero-images', { next: { revalidate: 60 } });
    if (!res.ok) return { heroImageMain: null, heroImageLeft: null, heroImageRight: null };
    return res.json();
  } catch {
    return { heroImageMain: null, heroImageLeft: null, heroImageRight: null };
  }
}


export default function HeroPage() {
  const [navOpen,  setNavOpen]  = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded,   setLoaded]   = useState(false);
  const [imgs, setImgs] = useState<HeroImages>({ heroImageMain: null, heroImageLeft: null, heroImageRight: null });
  const router     = useRouter();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const cart       = useCartStore(s => s.cart);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setLoaded(true);
    fetchHeroImages().then(setImgs);

    const syncOverflow = () => {
      document.body.style.overflow = window.innerWidth >= 821 ? 'hidden' : 'auto';
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

            <div className={`${styles.block} ${styles.blockBlue}`}>
              <div className={styles.blueTopBrand}>
                <Brand3DGE size={26} priority />
              </div>
              <div className={styles.vert}>Orden en la pared</div>
              <button
                className={styles.blueCartBtn}
                onClick={handleCartClick}
                aria-label={totalItems === 0 ? 'Ver colecciones' : `Carrito — ${totalItems} productos`}
              >
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <LuShoppingCart style={{ width: 'clamp(20px,2.2vw,28px)', height: 'clamp(20px,2.2vw,28px)' }} />
                  {loaded && totalItems > 0 && (
                    <span className={styles.blueCartCount}>{totalItems}</span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Yellow block */}
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

          {/* IMAGE SLOT — main */}
          <figure className={`${styles.cell} ${styles.photo} ${styles.photoBig} ${styles.hoverable}`}>
            <div className={styles.ph}>
              {imgs.heroImageMain ? (
                <Image src={imgs.heroImageMain} alt="Producto destacado" fill className="object-cover" sizes="(max-width:820px) 100vw, 45vw" />
              ) : (
                <>
                  <div className={styles.frame} />
                  <div className={styles.cap}>Foto — producto destacado</div>
                </>
              )}
            </div>
          </figure>
        </div>

        {/* — BANDA INFERIOR — */}
        <div className={`${styles.band} ${styles.bandBottom}`}>

          {/* Photo left */}
          <figure className={`${styles.cell} ${styles.photo} ${styles.hoverable}`}>
            <div className={styles.ph}>
              {imgs.heroImageLeft ? (
                <Image src={imgs.heroImageLeft} alt="Detalle llavero" fill className="object-cover" sizes="(max-width:820px) 100vw, 25vw" />
              ) : (
                <>
                  <div className={styles.frame} />
                  <div className={styles.cap}>Foto — detalle llavero</div>
                </>
              )}
            </div>
            <span className={styles.tag}>
              <span className={styles.tagAccent}>01</span> · Organizador de llaves
            </span>
          </figure>

          {/* Red block */}
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

          {/* Photo right */}
          <figure className={`${styles.cell} ${styles.photo} ${styles.hoverable}`}>
            <div className={styles.ph}>
              {imgs.heroImageRight ? (
                <Image src={imgs.heroImageRight} alt="Abrigo colgado" fill className="object-cover" sizes="(max-width:820px) 100vw, 25vw" />
              ) : (
                <>
                  <div className={styles.frame} />
                  <div className={styles.cap}>Foto — abrigo colgado</div>
                </>
              )}
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
          <Link
            href={isAuthenticated ? '/cuenta' : '/auth/login'}
            className={`${styles.ovItem} ${styles.ovItemD} ${navOpen ? styles.ovItemVisible : ''}`}
            onClick={close}
          >
            <span className={styles.ovNum}>04</span>
            <span className={styles.ovLabel}>{isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión'}</span>
            <span className={styles.ovArrow}>→</span>
          </Link>
        </div>
      </nav>

      {/* ====== CART MODAL ====== */}
      <NeoCartModal open={cartOpen} onClose={() => setCartOpen(false)} />

    </div>
  );
}
