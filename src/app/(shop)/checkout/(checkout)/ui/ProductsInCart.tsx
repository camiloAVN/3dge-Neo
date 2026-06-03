"use client";

import { ProductImage } from "@/components";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart);

    useEffect(() => { setLoaded(true); }, []);

    if (!loaded) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-pulse">
                <div className="h-6 w-48 bg-gray-100 rounded mb-5" />
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-100 rounded w-3/4" />
                                <div className="h-3 bg-gray-100 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (productsInCart.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
                <p className="text-[#444444]">Tu carrito está vacío.</p>
                <Link href="/products" className="mt-3 inline-block text-sm text-[#D61C1C] hover:underline">
                    Ver productos
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-[#111111]">
                    Productos del pedido
                    <span className="ml-2 text-[#888] font-normal">({productsInCart.length})</span>
                </h2>
            </div>

            <div className="divide-y divide-gray-100">
                {productsInCart.map((item) => (
                    <div
                        key={`${item.id}-${item.variantId ?? 'default'}`}
                        className="flex items-center gap-4 px-5 py-4"
                    >
                        {/* Imagen */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                            <ProductImage
                                src={item.image}
                                width={64}
                                height={64}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/product/${item.slug}`}
                                className="text-sm font-semibold text-[#111111] hover:text-[#D61C1C] transition-colors line-clamp-2"
                            >
                                {item.title}
                            </Link>

                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                {item.variantLabel && (
                                    <span className="text-xs text-[#444444] bg-gray-100 px-2 py-0.5 rounded-md">
                                        {item.variantLabel}
                                    </span>
                                )}
                                <span className="text-xs text-[#888]">
                                    Cant: {item.quantity}
                                </span>
                            </div>
                        </div>

                        {/* Precio */}
                        <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-semibold text-[#111111]">
                                {currencyFormat(item.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                                <p className="text-xs text-[#888] mt-0.5">
                                    {currencyFormat(item.price)} c/u
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
