'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LuShoppingCart,
  LuSearch,
  LuMenu,
  LuX,
  LuChevronDown,
  LuChevronRight,
  LuUser,
} from 'react-icons/lu';
import { useCartStore, useUIStore } from '@/store';
import { getCategories } from '@/actions';

type CategoryItem = { id: string; name: string; slug?: string; isActive?: boolean; sortOrder?: number };

const categoryHref = (cat: CategoryItem) =>
  `/category/${cat.slug ?? cat.name.toLowerCase().replace(/\s+/g, '-')}`;

export const TopMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  const openSideMenu = useUIStore(state => state.openSideMenu);
  const openCart = useUIStore(state => state.openCart);
  const totalItemsInCart = useCartStore(state => state.getTotalItems());

  useEffect(() => {
    setLoaded(true);
    getCategories().then(data => setCategories(data as CategoryItem[]));
  }, []);

  // Close category panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsCategoryPanelOpen(false);
      }
    };
    if (isCategoryPanelOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isCategoryPanelOpen]);

  const closeMobile = () => {
    setIsMobileMenuOpen(false);
    setIsMobileCategoriesOpen(false);
  };

  const visibleCategories = categories
    .filter(c => c.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <>
      {/* Category panel overlay (desktop) */}
      {isCategoryPanelOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={() => setIsCategoryPanelOpen(false)}
        />
      )}

      {/* Category left panel (desktop) */}
      <div
        ref={panelRef}
        className={`fixed top-[60px] left-0 h-[calc(100vh-60px)] w-72 bg-white border-r border-[#E5E5E5] z-40 shadow-sm transform transition-transform duration-300 ease-in-out ${
          isCategoryPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#444444] mb-4">
            Categorías
          </p>
          {visibleCategories.length === 0 ? (
            <p className="text-sm text-[#444444]">Sin categorías aún.</p>
          ) : (
            <ul className="space-y-0.5">
              {visibleCategories.map(cat => (
                <li key={cat.id}>
                  <Link
                    href={categoryHref(cat)}
                    onClick={() => setIsCategoryPanelOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded text-sm text-[#111111] hover:bg-[#F8F9FA] hover:text-[#D61C1C] transition-colors group"
                  >
                    {cat.name}
                    <LuChevronRight className="w-3.5 h-3.5 text-[#E5E5E5] group-hover:text-[#D61C1C] transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5] h-[60px]">
        <div className="max-w-7xl mx-auto h-full px-5 sm:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/imgs/logo_2.png"
              alt="UNIK"
              height={48}
              width={150}
              className="h-9 sm:h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-[#444444] hover:text-[#111111] transition-colors"
            >
              Inicio
            </Link>

            <button
              onClick={() => setIsCategoryPanelOpen(v => !v)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#444444] hover:text-[#111111] transition-colors"
            >
              Categorías
              <LuChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isCategoryPanelOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <Link
              href="/products"
              className="px-4 py-2 text-sm font-medium text-[#444444] hover:text-[#111111] transition-colors"
            >
              Productos
            </Link>

            <Link
              href="/nosotros"
              className="px-4 py-2 text-sm font-medium text-[#444444] hover:text-[#111111] transition-colors"
            >
              Nosotros
            </Link>

            <Link
              href="/contacto"
              className="px-4 py-2 text-sm font-medium text-[#444444] hover:text-[#111111] transition-colors"
            >
              Contáctanos
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              aria-label="Buscar"
              className="w-9 h-9 flex items-center justify-center text-[#444444] hover:text-[#111111] hover:bg-[#F8F9FA] rounded transition-colors"
            >
              <LuSearch className="w-[17px] h-[17px]" />
            </button>

            {/* Cart */}
            <button
              aria-label="Carrito"
              onClick={() => openCart()}
              className="relative w-9 h-9 flex items-center justify-center text-[#444444] hover:text-[#111111] hover:bg-[#F8F9FA] rounded transition-colors"
            >
              <LuShoppingCart className="w-[17px] h-[17px]" />
              {loaded && totalItemsInCart > 0 && (
                <span className="absolute top-1 right-1 w-[15px] h-[15px] bg-[#D61C1C] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {totalItemsInCart}
                </span>
              )}
            </button>

            {/* Account (desktop) */}
            <button
              aria-label="Mi cuenta"
              onClick={() => openSideMenu()}
              className="hidden md:flex w-9 h-9 items-center justify-center text-[#444444] hover:text-[#111111] hover:bg-[#F8F9FA] rounded transition-colors"
            >
              <LuUser className="w-[17px] h-[17px]" />
            </button>

            {/* Hamburger (mobile) */}
            <button
              aria-label="Menú"
              onClick={() => setIsMobileMenuOpen(v => !v)}
              className="md:hidden w-9 h-9 flex items-center justify-center text-[#444444] hover:text-[#111111] hover:bg-[#F8F9FA] rounded transition-colors"
            >
              {isMobileMenuOpen ? (
                <LuX className="w-5 h-5" />
              ) : (
                <LuMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#E5E5E5] shadow-sm z-50">
            <div className="px-5 py-3 space-y-0.5">
              <Link
                href="/"
                onClick={closeMobile}
                className="block px-3 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#F8F9FA] rounded"
              >
                Inicio
              </Link>

              {/* Categories accordion */}
              <div>
                <button
                  onClick={() => setIsMobileCategoriesOpen(v => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#F8F9FA] rounded"
                >
                  Categorías
                  <LuChevronDown
                    className={`w-4 h-4 text-[#444444] transition-transform duration-200 ${
                      isMobileCategoriesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isMobileCategoriesOpen && (
                  <div className="ml-3 mt-1 border-l-2 border-[#E5E5E5] pl-3 space-y-0.5 pb-1">
                    {visibleCategories.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-[#444444]">Sin categorías.</p>
                    ) : (
                      visibleCategories.map(cat => (
                        <Link
                          key={cat.id}
                          href={categoryHref(cat)}
                          onClick={closeMobile}
                          className="block px-3 py-2 text-sm text-[#444444] hover:text-[#D61C1C] hover:bg-[#F8F9FA] rounded"
                        >
                          {cat.name}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/products"
                onClick={closeMobile}
                className="block px-3 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#F8F9FA] rounded"
              >
                Productos
              </Link>

              <Link
                href="/nosotros"
                onClick={closeMobile}
                className="block px-3 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#F8F9FA] rounded"
              >
                Nosotros
              </Link>

              <Link
                href="/contacto"
                onClick={closeMobile}
                className="block px-3 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#F8F9FA] rounded"
              >
                Contáctanos
              </Link>

              <div className="border-t border-[#E5E5E5] pt-2 mt-2">
                <button
                  onClick={() => { openSideMenu(); closeMobile(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#F8F9FA] rounded"
                >
                  <LuUser className="w-4 h-4 text-[#444444]" />
                  Mi cuenta
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[60px]" />
    </>
  );
};
