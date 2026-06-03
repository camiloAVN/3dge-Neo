'use client';

import { placeOrder } from "@/actions";
import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import type { Address } from "@/interfaces";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LuMapPin, LuCircleAlert, LuLock } from "react-icons/lu";

interface Props {
    userAddress: Partial<Address>;
}

export const PlaceOrder = ({ userAddress }: Props) => {

    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);

    const { subTotal, tax, total, itemsInCart } = useMemo(() => {
        const subTotal = cart.reduce((acc, p) => acc + p.quantity * p.price, 0);
        const tax = subTotal * 0.19;
        const total = subTotal + tax;
        const itemsInCart = cart.reduce((acc, p) => acc + p.quantity, 0);
        return { subTotal, tax, total, itemsInCart };
    }, [cart]);

    useEffect(() => { setLoaded(true); }, []);

    if (!loaded) {
        return (
            <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 animate-pulse">
                    <div className="h-4 w-40 bg-gray-100 rounded mb-4" />
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 animate-pulse">
                    <div className="h-32 bg-gray-100 rounded-xl" />
                </div>
            </div>
        );
    }

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true);
        setErrorMessage('');

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            variantId: product.variantId,
            variantLabel: product.variantLabel,
        }));

        const address: Address = {
            firstName: userAddress.firstName ?? '',
            lastName: userAddress.lastName ?? '',
            address: userAddress.address ?? '',
            address2: userAddress.address2 ?? '',
            postalCode: userAddress.postalCode ?? '',
            city: userAddress.city ?? '',
            country: userAddress.country ?? 'CO',
            phone: userAddress.phone ?? '',
        };

        const resp = await placeOrder(productsToOrder, address);

        if (!resp.ok) {
            setIsPlacingOrder(false);
            setErrorMessage(resp.message ?? 'Ocurrió un error al procesar el pedido.');
            return;
        }

        clearCart();
        router.replace('/orders/' + resp.order?.id);
    };

    return (
        <div className="space-y-4">

            {/* Dirección de entrega */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <LuMapPin className="w-4 h-4 text-[#D61C1C] flex-shrink-0" />
                        <h2 className="text-sm font-semibold text-[#111111]">Dirección de entrega</h2>
                    </div>
                    <Link
                        href="/checkout/address"
                        className="text-xs text-[#D61C1C] hover:underline font-medium"
                    >
                        Editar
                    </Link>
                </div>
                <div className="text-sm text-[#444444] space-y-0.5 pl-6">
                    <p className="font-semibold text-[#111111]">
                        {userAddress.firstName} {userAddress.lastName}
                    </p>
                    <p>
                        {userAddress.address}
                        {userAddress.address2 ? `, ${userAddress.address2}` : ''}
                    </p>
                    <p>{userAddress.city}, {userAddress.postalCode}</p>
                    <p>Colombia</p>
                    <p>{userAddress.phone}</p>
                </div>
            </div>

            {/* Resumen y botón */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-[#111111] mb-4">Resumen del pedido</h2>

                <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                        <span className="text-[#444444]">
                            {itemsInCart === 1 ? '1 producto' : `${itemsInCart} productos`}
                        </span>
                        <span className="text-[#111111]">{currencyFormat(subTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-[#444444]">IVA (19%)</span>
                        <span className="text-[#111111]">{currencyFormat(tax)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[#111111] pt-3 border-t border-gray-200">
                        <span>Total</span>
                        <span>{currencyFormat(total)}</span>
                    </div>
                </div>

                {errorMessage && (
                    <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                        <LuCircleAlert className="w-4 h-4 text-[#D61C1C] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[#D61C1C]">{errorMessage}</p>
                    </div>
                )}

                <button
                    disabled={isPlacingOrder || cart.length === 0}
                    onClick={onPlaceOrder}
                    className={clsx(
                        "mt-5 w-full py-3.5 rounded-xl font-semibold text-sm transition-colors",
                        isPlacingOrder || cart.length === 0
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[#D61C1C] hover:bg-[#b81818] text-white"
                    )}
                >
                    {isPlacingOrder ? 'Procesando pedido...' : 'Completar pedido'}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#888]">
                    <LuLock className="w-3 h-3" />
                    <span>Pago seguro — al continuar aceptas nuestros términos.</span>
                </div>
            </div>

        </div>
    );
};
