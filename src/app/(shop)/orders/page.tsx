
import { IoEye } from "react-icons/io5";
import { FaReceipt, FaCheck, FaClock, FaTimes } from "react-icons/fa";
import { LuSearch, LuFilter } from "react-icons/lu";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa";
import { getOrdersByUser } from "@/actions";
import { redirect } from "next/navigation";
import { Pagination } from "@/components";

export default async function OrdersPage ()  {

  const {ok, orders = []} = await getOrdersByUser();

  if(!ok){
    redirect('/auth/login')
  }



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
            <FaCheck className="w-3 h-3" />
            <span>Paid</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
            <FaClock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
            <FaTimes className="w-3 h-3" />
            <span>Failed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black/50 rounded-4xl">

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        
        {/* Filters and Search */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100/50 shadow-xl mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <FaReceipt className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">My Orders</h2>
                <p className="text-xs sm:text-sm text-gray-500">{orders.length} total orders</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all text-sm"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
                <LuFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-gray-100/50 shadow-xl overflow-hidden">
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">{`productos: ${order.itemsInOrder}`}</div>
                        <div className="text-sm text-gray-500">{order.OrderAddress?.firstName}</div>
                        <div className="text-sm text-gray-500">email</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order?.createdAt.toLocaleDateString('es-CO')}</div>
                      <div className="text-sm text-gray-500">{order?.createdAt.toLocaleTimeString('es-CO')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">${order.total}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order?.isPaid? 'paid':'failed')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center space-x-2 px-3 py-1.5 bg-lime-100 hover:bg-lime-200 text-lime-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        <IoEye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{order.id}</h3>
                    <p className="text-xs text-gray-500">{order?.createdAt.toLocaleDateString('es-CO')} at {order?.createdAt.toLocaleTimeString('es-CO')}</p>
                  </div>
                  {getStatusBadge(order?.isPaid? 'paid':'pending')}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{order.OrderAddress?.firstName}</p>
                    <p className="text-xs text-gray-500">email</p>
                  </div>
                  <p className="font-semibold text-gray-800">${order.total}</p>
                </div>
                
                <Link
                  href={`/orders/${order.id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-lime-100 hover:bg-lime-200 text-lime-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <IoEye className="w-4 h-4" />
                  <span>View Order</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <Pagination totalPages={3}/>

      </div>
    </div>
  );
};