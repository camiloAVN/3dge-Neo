"use client";

import {  IoLockClosed } from "react-icons/io5";
import { FaCreditCard, FaPaypal, FaApplePay, FaGooglePay } from "react-icons/fa";
import { LuShoppingCart, LuUser, LuMail, LuPhone, LuMapPin } from "react-icons/lu";
import { FaAngleLeft } from "react-icons/fa";
import { initialData } from "@/seed/seed";

export default function CartPage () {
  // Datos ficticios del carrito
  // Datos falsos para mostrar
    const cartItems = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
    ];


  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * 3), 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-black/50 rounded-4xl">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 rounded-2xl backdrop-blur-lg border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <FaAngleLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Checkout
                </h1>
                <p className="text-sm text-gray-500">Complete your purchase</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <IoLockClosed className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Forms */}
          <div className="space-y-6">
            
            {/* Customer Information */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 border border-gray-100/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <LuUser className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Customer Information</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john.doe@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 border border-gray-100/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <LuMapPin className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Billing Address</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input 
                      type="text" 
                      placeholder="New York"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input 
                      type="text" 
                      placeholder="10001"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 border border-gray-100/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FaCreditCard className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
              </div>
              
              {/* Payment Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button className="p-4 border-2 border-lime-400 bg-lime-50 rounded-xl flex flex-col items-center space-y-2 transition-all">
                  <FaCreditCard className="w-6 h-6 text-lime-600" />
                  <span className="text-xs font-medium text-lime-700">Card</span>
                </button>
                <button className="p-4 border border-gray-200 hover:border-gray-300 rounded-xl flex flex-col items-center space-y-2 transition-all">
                  <FaPaypal className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">PayPal</span>
                </button>
                <button className="p-4 border border-gray-200 hover:border-gray-300 rounded-xl flex flex-col items-center space-y-2 transition-all">
                  <FaApplePay className="w-6 h-6 text-gray-800" />
                  <span className="text-xs font-medium text-gray-600">Apple Pay</span>
                </button>
                <button className="p-4 border border-gray-200 hover:border-gray-300 rounded-xl flex flex-col items-center space-y-2 transition-all">
                  <FaGooglePay className="w-6 h-6 text-blue-500" />
                  <span className="text-xs font-medium text-gray-600">Google Pay</span>
                </button>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 h-fit">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <LuShoppingCart className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-2.5 sm:space-y-4 mb-4 sm:mb-6">
                {cartItems.map((item) => (
                  <div key={item.slug} className="flex items-center space-x-3 p-2.5 sm:p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-500 text-xs font-medium">AI</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate text-sm sm:text-base">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-500">Qty: {3}</p>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base flex-shrink-0">
                      ${(item.price * 3).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-3 sm:pt-4 space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>IVA (19%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-800 pt-2 sm:pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button className="w-full bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 text-white py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-lime-400/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 mb-3 sm:mb-4">
                Complete Order
              </button>

              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By completing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};