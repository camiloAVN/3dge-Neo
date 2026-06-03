"use client";

import { IoCloseOutline} from "react-icons/io5";
import { LuShoppingBag } from "react-icons/lu";
import { BsShop } from "react-icons/bs";
import { useUIStore } from "@/store/ui/ui-store";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";

export default function EmptyPage()  {
//const isCartOpen = useUIStore(state => state.isCartOpen);
    //const closeCart = useUIStore(state => state.closeCart);

    //if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-900 z-[70] flex flex-col">
            
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-lg border-b border-gray-100/50 px-4 py-4 safe-area-top">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button 
                            
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            <FaAngleLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Shopping Cart
                            </h1>
                            <p className="text-sm text-gray-500">Your cart is empty</p>
                        </div>
                    </div>
                    
                    <button 
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"

                    >
                        <IoCloseOutline className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Empty State Content */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 py-8 text-center">
                <div className="flex-1 flex flex-col items-center justify-center min-h-full mt-20">

                    <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 border border-white/20">
                        <LuShoppingBag className="w-16 h-16 text-white/70" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
                    <p className="text-white/70 mb-12 leading-relaxed text-lg max-w-sm">
                        Looks like you haven't added any AI agents to your cart yet. 
                        Discover our amazing collection!
                    </p>

                    <div className="space-y-4 w-full max-w-sm">
                        <button 

                            className="w-full bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 text-white py-5 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-lime-400/25 transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-3"
                        >
                            <BsShop className="w-6 h-6" />
                            <span>Start Shopping</span>
                        </button>

                        <Link 
                            href="/categories"

                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white py-5 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
                        >
                            <span>Browse Categories</span>
                        </Link>
                    </div>

                    {/* Popular Items Suggestion */}
                    <div className="mt-12 w-full max-w-sm">
                        <p className="text-white/50 mb-6 text-sm">Popular AI Agents:</p>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm font-bold">IG</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-white">Instagram Growth Agent</p>
                                    <p className="text-white/70 text-sm">$29.99</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm font-bold">WA</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-white">WhatsApp Chatbot Pro</p>
                                    <p className="text-white/70 text-sm">$49.99</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm font-bold">GM</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-white">Gmail Auto-Responder</p>
                                    <p className="text-white/70 text-sm">$19.99</p>
                                </div>
                            </div>
                        </div>
                    </div>






                </div>
            </div>
        </div>
    );
};