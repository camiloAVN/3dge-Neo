import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserAddress } from "@/actions";
import { Title } from "@/components";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";

export default async function CheckoutPage() {

    const session = await auth();
    if (!session?.user) redirect('/auth/login?redirectTo=/checkout/address');

    const userAddress = await getUserAddress(session.user.id);
    if (!userAddress) redirect('/checkout/address');

    return (
        <div className="py-6 pb-24">
            <Title title="Confirmar pedido" subtitle="Revisa tu pedido antes de pagar" />

            <div className="mt-2 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">

                {/* Productos — aparece primero en móvil */}
                <ProductsInCart />

                {/* Resumen — sticky en desktop, debajo en móvil */}
                <div className="lg:sticky lg:top-24">
                    <PlaceOrder userAddress={userAddress} />
                </div>

            </div>
        </div>
    );
}
