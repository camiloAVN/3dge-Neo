"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useMemo, useState } from "react";

export const OrderSummary = () => {

    const cart = useCartStore(state => state.cart);

    const { subTotal, itemsInCart } = useMemo(() => {
        const subTotal = cart.reduce((acc, p) => acc + p.quantity * p.price, 0);
        const itemsInCart = cart.reduce((acc, p) => acc + p.quantity, 0);
        return { subTotal, itemsInCart };
    }, [cart]);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (!loaded) {
        return <p>Loading...</p>;
    }

    return (
        <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
                <span>{itemsInCart === 1 ? '1 producto' : `${itemsInCart} productos`}</span>
                <span>{currencyFormat(subTotal)}</span>
            </div>
            <div className="border-t border-[#E5E5E5] pt-2 flex justify-between font-semibold text-[#111111]">
                <span>Subtotal</span>
                <span>{currencyFormat(subTotal)}</span>
            </div>
            <p className="text-xs text-[#888]">IVA (19%) se calcula al finalizar el pedido.</p>
        </div>
    );
};
