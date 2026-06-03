"use client";

import { useUIStore } from "@/store/ui/ui-store";
import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  LuX,
  LuUser,
  LuPackage,
  LuLogIn,
  LuLogOut,
  LuLayoutDashboard,
} from "react-icons/lu";

export const SideBar = () => {
  const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
  const closeMenu = useUIStore(state => state.closeSideMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  return (
    <div>
      {/* Overlay */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* Panel */}
      <nav
        className={clsx(
          "fixed top-0 right-0 w-[300px] h-screen bg-white z-[70] border-l border-[#E5E5E5] transform transition-transform duration-300 ease-in-out flex flex-col",
          { "translate-x-full": !isSideMenuOpen }
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] border-b border-[#E5E5E5] flex-shrink-0">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#444444]">
            Mi cuenta
          </span>
          <button
            onClick={closeMenu}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#F8F9FA] rounded transition-colors"
          >
            <LuX className="w-4 h-4 text-[#444444]" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
          {/* No autenticado */}
          {!isAuthenticated && (
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#111111] hover:bg-[#F8F9FA] group transition-colors"
            >
              <LuLogIn className="w-4 h-4 text-[#444444] group-hover:text-[#D61C1C] flex-shrink-0 transition-colors" />
              Iniciar sesión
            </Link>
          )}

          {/* Usuario normal */}
          {isAuthenticated && !isAdmin && (
            <>
              <Link
                href="/profile"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#111111] hover:bg-[#F8F9FA] group transition-colors"
              >
                <LuUser className="w-4 h-4 text-[#444444] group-hover:text-[#D61C1C] flex-shrink-0 transition-colors" />
                Perfil
              </Link>
              <Link
                href="/orders"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#111111] hover:bg-[#F8F9FA] group transition-colors"
              >
                <LuPackage className="w-4 h-4 text-[#444444] group-hover:text-[#D61C1C] flex-shrink-0 transition-colors" />
                Mis pedidos
              </Link>
              <button
                onClick={() => { closeMenu(); signOut({ callbackUrl: '/' }); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#111111] hover:bg-[#F8F9FA] group transition-colors"
              >
                <LuLogOut className="w-4 h-4 text-[#444444] group-hover:text-[#D61C1C] flex-shrink-0 transition-colors" />
                Cerrar sesión
              </button>
            </>
          )}

          {/* Admin */}
          {isAdmin && (
            <>
              <Link
                href="/profile"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#111111] hover:bg-[#F8F9FA] group transition-colors"
              >
                <LuUser className="w-4 h-4 text-[#444444] group-hover:text-[#D61C1C] flex-shrink-0 transition-colors" />
                Perfil
              </Link>
              <Link
                href="/admin"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#111111] hover:bg-[#F8F9FA] group transition-colors"
              >
                <LuLayoutDashboard className="w-4 h-4 text-[#444444] group-hover:text-[#D61C1C] flex-shrink-0 transition-colors" />
                Panel administrativo
              </Link>
              <button
                onClick={() => { closeMenu(); signOut({ callbackUrl: '/' }); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-[#111111] hover:bg-[#F8F9FA] group transition-colors"
              >
                <LuLogOut className="w-4 h-4 text-[#444444] group-hover:text-[#D61C1C] flex-shrink-0 transition-colors" />
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};
