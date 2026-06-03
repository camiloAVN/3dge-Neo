"use client";

import { LuShoppingCart, LuX } from "react-icons/lu";
import { useUIStore } from "@/store/ui/ui-store";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Link from "next/link";
import { ProductsInCart } from "../ui/ProductsInCart";
import { OrderSummary } from "../ui/OrderSummary";

export const CartModal = () => {
  const isCartOpen = useUIStore(state => state.isCartOpen);
  const closeCart = useUIStore(state => state.closeCart);
  const { data: session } = useSession();

  const checkoutHref = session?.user
    ? "/checkout/address"
    : "/auth/login?redirectTo=/checkout/address";

  return (
    <div>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Cart panel */}
      <div
        className={clsx(
          "fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-[70] border-l border-[#E5E5E5] transform transition-transform duration-300 ease-in-out flex flex-col",
          { "translate-x-full": !isCartOpen }
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-[60px] border-b border-[#E5E5E5] flex-shrink-0">
          <div className="flex items-center gap-2">
            <LuShoppingCart className="w-4 h-4 text-[#444444]" />
            <span className="text-sm font-semibold text-[#111111]">Carrito</span>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center hover:bg-[#F8F9FA] rounded transition-colors"
          >
            <LuX className="w-4 h-4 text-[#444444]" />
          </button>
        </div>

        {/* Products */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ProductsInCart />
        </div>

        {/* Summary + Actions */}
        <div className="flex-shrink-0 border-t border-[#E5E5E5] px-6 py-5">
          <OrderSummary />

          <Link
            href={checkoutHref}
            onClick={closeCart}
            className="mt-4 block w-full bg-[#D61C1C] hover:bg-[#b81818] text-white text-sm font-semibold text-center py-3 rounded transition-colors"
          >
            Ir al pago
          </Link>

          <button
            onClick={closeCart}
            className="mt-2 block w-full text-sm text-[#444444] hover:text-[#111111] text-center py-2 transition-colors"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
};
