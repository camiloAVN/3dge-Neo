

import { IoCheckmarkCircle, IoDownload } from "react-icons/io5";
import { FaCreditCard, FaReceipt, FaShoppingBag } from "react-icons/fa";
import { FaExclamation } from "react-icons/fa6";
import { LuCalendar, LuMail, LuMapPin, LuUser, LuClock } from "react-icons/lu";
import { BsShop } from "react-icons/bs";
import { PayPalButton, Title } from "@/components";
import clsx from "clsx";

import { redirect } from 'next/navigation';
import Image from 'next/image';
import { currencyFormat } from '@/utils';
import { getOrderById } from '@/actions';


interface Props{
    params:Promise<{
        id:string;
    }>
}

export default async function OrderPage({params}:Props) {

    const id= (await params).id;

    const {ok, order} = await getOrderById(id);


    if(!ok){
      redirect('/')
    }
    const address = order!.OrderAddress;


  return (
    <div className="min-h-screen rounded-4xl">
      
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        
        {/* Success Banner */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-100/50 shadow-xl mb-4 sm:mb-8 text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className={
                clsx(
                    "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg",
                    {
                        'bg-red-500': !order!.isPaid,
                        'bg-gradient-to-br from-lime-400 to-emerald-500':order!.isPaid
                        
                    }
                )
            }>
              {
                order?.isPaid ? (
                  <>
                    <IoCheckmarkCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </>
                ):(
                  <>
                    <FaExclamation className="w-8 h-8 sm:w-10 sm:h-10 text-white"/>
                  </>
                )
              }
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
            {
              order?.isPaid ? 'Payment Successful!':'Pending'
            }
            
          </h2>
          <Title title={`Order #${id.split('-').at(-1)}`}/>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Your order has been processed successfully. You'll receive a confirmation email shortly.
          </p>
          
          {/* Quick Order Info */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Order Number</p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{id}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">${order?.total}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Date</p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{order?.createdAt.toLocaleDateString('es-CO')}</p>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Order Information */}
            <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FaReceipt className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Order Details</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <LuCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Order Date & Time</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">{`${order?.createdAt.toLocaleDateString('es-CO')} at ${order?.createdAt.toLocaleTimeString('es-CO')}`}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaCreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">{`Visa ending in ${address?.lastName}`}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <LuClock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Status</p>
                    <p className="font-medium text-green-600 text-sm sm:text-base">{order?.isPaid? 'pagado':'no pagado'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <LuMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Receipt sent to</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">{address?.firstName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <LuUser className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Customer Information</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <LuUser className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">{address!.firstName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <LuMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">{address!.countryId}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <LuMapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Billing Address</p>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">
                      {address!.address}<br />
                      {address!.city}, {address!.postalCode}<br />
                      {address!.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Order Items */}
            <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100/50 shadow-xl">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FaShoppingBag className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Items Purchased</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {order!.OrderItem.map((item) => (
                  <div key={item.product.slug + '-' + item.size} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image
                      src={`/products/${item.product.ProductImage[0].url}`}
                      width={100}
                      height={100}
                      alt={item.product.title}
                      className='rounded'
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">{item.product.title}</h4>
                      
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-2 py-1 bg-lime-100 text-lime-700 text-xs rounded-md font-medium">
                          {item.size}
                        </span>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="font-semibold text-gray-800 text-sm">{currencyFormat(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="border-t border-gray-200 mt-4 mb-2 sm:mt-6 pt-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>No. Productos</span>
                  <span>{order?.itemsInOrder}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>${order?.subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>IVA (19%)</span>
                  <span>{order?.tax}</span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-800 pt-2 sm:pt-3 border-t border-gray-200">
                  <span>Total Paid</span>
                  <span>${order?.total}</span>
                </div>
              </div>

              {/* Paypal */}
              {
                order?.isPaid ?(
                  <div className='flex justify-center items-center bg-green-500 rounded p-2'> 
                    <span className="font-semibold text-black mr-2">Pagado</span>
                    <IoCheckmarkCircle className="w-8 h-8 sm:w-6 sm:h-6 text-white" />
                  </div>
                ):( 
                  <PayPalButton
                    amount={order!.total}
                    orderId={order!.id}
                  />
                )
              }
            </div>
            {/* Action Buttons */}
            <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100/50 shadow-xl">
              <div className="space-y-3 sm:space-y-4">
                <button className="w-full bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 text-white py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-lime-400/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2">
                  <IoDownload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Download Receipt</span>
                </button>
                
                <button className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center space-x-2">
                  <BsShop className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Continue Shopping</span>
                </button>
                
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Questions about your order? Contact our support team at support@agentstore.com
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};