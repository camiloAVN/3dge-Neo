"use client";

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore, useUIStore } from "@/store";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false);
    const productsInCart = useCartStore(state => state.cart);
    const closeCart = useUIStore(state=> state.closeCart);
    const updateProductsQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProduct = useCartStore(state => state.removeProduct);

    useEffect(()=>{
        setLoaded(true);
    },[])

    if(!loaded){
        return <p>Loading...</p>
    }


  return (
    <>

        {
            productsInCart.length === 0 &&(
                <div className="flex justify-center items-center h-full">
                    <h1 className="text-black">Carrito de compras vacio</h1>
                </div>
            )
        }

        {  productsInCart .map((item) => {

            return(
                <div key={`${item.slug}-${item.size}`} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <ProductImage
                            src={item.image}
                            width={100}
                            height={100}
                            alt={item.title}
                            className=""
                        />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                        <Link href={`/product/${item.slug}`} className="hover:underline" onClick={()=>closeCart()}>
                            <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                        </Link>

                    </div>
                    </div>

                    {/* Quantity and Price Controls */}
                    <div className="flex items-center justify-between mt-4">
                    <QuantitySelector 
                        quantity={item.quantity}
                        onQuantityChanged={value=>updateProductsQuantity(item, value)}
                    />

                    <div className="flex items-center space-x-3">
                        <span className="font-bold text-lg text-gray-800">
                        {currencyFormat(item.price * item.quantity)}
                        </span>

                        <button
                            className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                            onClick={()=>removeProduct(item)}
                        >
                        <FaTrash className="w-3 h-3 text-red-500" />
                        </button>
                    </div>
                    </div>
                </div>
                )
            })
        }
    
    
    
    </>
  )
}
