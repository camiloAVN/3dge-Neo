'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  LuX, LuTruck, LuCircleCheck, LuClock, LuMapPin,
  LuMail, LuPhone, LuPackage, LuCalendar, LuChevronRight,
} from 'react-icons/lu';
import { updateOrderDelivery } from '@/actions/order/update-order-delivery';
import { currencyFormat } from '@/utils';

/* ── Types ──────────────────────────────────────────────────── */
type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  variantLabel: string | null;
  product: { title: string; slug: string; images: { url: string }[] };
};

type OrderAddress = {
  firstName: string; lastName: string;
  address: string; address2: string | null;
  city: string; postalCode: string; phone: string;
  country: { name: string };
} | null;

type Order = {
  id: string;
  createdAt: Date;
  subTotal: number;
  tax: number;
  total: number;
  itemsInOrder: number;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  user: { name: string; email: string };
  orderAddress: OrderAddress;
  orderItems: OrderItem[];
};

type Filter = 'all' | 'pending' | 'delivered';

/* ── Helpers ─────────────────────────────────────────────────── */
const fmt = (d: Date) =>
  new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

const shortId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;

/* ── Main component ──────────────────────────────────────────── */
export function OrdersClient({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [filter, setFilter]           = useState<Filter>('all');
  const [selected, setSelected]       = useState<Order | null>(null);
  const [toggling, setToggling]       = useState<string | null>(null);
  const [actionError, setActionError] = useState<Record<string, string>>({});

  /* counts */
  const pending   = orders.filter(o => !o.isDelivered).length;
  const delivered = orders.filter(o =>  o.isDelivered).length;

  const visible = useMemo(() => {
    if (filter === 'pending')   return orders.filter(o => !o.isDelivered);
    if (filter === 'delivered') return orders.filter(o =>  o.isDelivered);
    return orders;
  }, [orders, filter]);

  /* toggle delivery */
  async function handleToggle(order: Order, e: React.MouseEvent) {
    e.stopPropagation();
    setToggling(order.id);
    setActionError({});
    const result = await updateOrderDelivery(order.id, !order.isDelivered);
    setToggling(null);
    if (!result.ok) {
      setActionError({ [order.id]: result.message ?? 'Error' });
    } else {
      router.refresh();
      if (selected?.id === order.id) setSelected(null);
    }
  }

  /* ── Tabs ── */
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: 'all',       label: 'Todas',        count: orders.length },
    { key: 'pending',   label: 'Por entregar', count: pending },
    { key: 'delivered', label: 'Completadas',  count: delivered },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Órdenes</h1>
          <p className="text-sm text-[#444444] mt-1">Solo se muestran órdenes pagadas</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-[#F8F9FA] rounded-lg p-1 w-fit mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === t.key
                ? 'bg-white text-[#111111] shadow-sm'
                : 'text-[#444444] hover:text-[#111111]'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              filter === t.key
                ? t.key === 'pending'   ? 'bg-amber-100 text-amber-700'
                : t.key === 'delivered' ? 'bg-green-100 text-green-700'
                :                         'bg-[#F8F9FA] text-[#444444]'
                : 'bg-[#E5E5E5] text-[#444444]'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        {visible.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#444444]">
            No hay órdenes en esta categoría.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Orden</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden md:table-cell">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden lg:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden sm:table-cell">Items</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Total</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Estado</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {visible.map(order => (
                <React.Fragment key={order.id}>
                  <tr
                    onClick={() => setSelected(order)}
                    className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA] cursor-pointer"
                  >
                    {/* Order ID */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-[#111111]">
                        {shortId(order.id)}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-medium text-[#111111] leading-tight">{order.user.name}</p>
                      <p className="text-xs text-[#444444] mt-0.5">{order.user.email}</p>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-[#444444] text-xs hidden lg:table-cell">
                      {fmt(order.createdAt)}
                    </td>

                    {/* Items */}
                    <td className="px-4 py-3 text-center text-[#444444] hidden sm:table-cell">
                      {order.itemsInOrder}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 text-right font-semibold text-[#111111]">
                      {currencyFormat(order.total)}
                    </td>

                    {/* Delivery status */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={e => handleToggle(order, e)}
                        disabled={toggling === order.id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${
                          order.isDelivered
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {order.isDelivered
                          ? <><LuCircleCheck className="w-3 h-3" /> Entregado</>
                          : <><LuClock className="w-3 h-3" /> Por entregar</>
                        }
                      </button>
                    </td>

                    {/* Arrow */}
                    <td className="px-4 py-3">
                      <LuChevronRight className="w-4 h-4 text-[#BBBBBB]" />
                    </td>
                  </tr>

                  {actionError[order.id] && (
                    <tr className="bg-red-50">
                      <td colSpan={7} className="px-4 py-2 text-xs text-[#D61C1C]">
                        {actionError[order.id]}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Detail Drawer ── */}
      {selected && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelected(null)}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 flex flex-col overflow-hidden">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] flex-shrink-0">
              <div>
                <p className="font-semibold text-[#111111]">{shortId(selected.id)}</p>
                <p className="text-xs text-[#444444] mt-0.5 flex items-center gap-1">
                  <LuCalendar className="w-3 h-3" />
                  {fmt(selected.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Status toggle (large version) */}
                <button
                  onClick={e => handleToggle(selected, e)}
                  disabled={toggling === selected.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors disabled:opacity-50 ${
                    selected.isDelivered
                      ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                      : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  {selected.isDelivered
                    ? <><LuCircleCheck className="w-3.5 h-3.5" /> Entregado</>
                    : <><LuTruck className="w-3.5 h-3.5" /> Marcar como entregado</>
                  }
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444]"
                >
                  <LuX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Customer info */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#BBBBBB] mb-3">
                  Cliente
                </p>
                <div className="space-y-2">
                  <p className="font-semibold text-[#111111]">{selected.user.name}</p>
                  <p className="flex items-center gap-2 text-sm text-[#444444]">
                    <LuMail className="w-3.5 h-3.5 flex-shrink-0" />
                    {selected.user.email}
                  </p>
                  {selected.orderAddress && (
                    <p className="flex items-center gap-2 text-sm text-[#444444]">
                      <LuPhone className="w-3.5 h-3.5 flex-shrink-0" />
                      {selected.orderAddress.phone}
                    </p>
                  )}
                </div>
              </section>

              {/* Shipping address */}
              {selected.orderAddress && (
                <section>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#BBBBBB] mb-3">
                    Dirección de entrega
                  </p>
                  <div className="flex items-start gap-2.5">
                    <LuMapPin className="w-4 h-4 text-[#D61C1C] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-[#444444] space-y-0.5">
                      <p className="font-medium text-[#111111]">
                        {selected.orderAddress.firstName} {selected.orderAddress.lastName}
                      </p>
                      <p>{selected.orderAddress.address}</p>
                      {selected.orderAddress.address2 && <p>{selected.orderAddress.address2}</p>}
                      <p>
                        {selected.orderAddress.city}, CP {selected.orderAddress.postalCode}
                      </p>
                      <p>{selected.orderAddress.country.name}</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Items */}
              <section>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#BBBBBB] mb-3">
                  Productos ({selected.orderItems.length})
                </p>
                <div className="space-y-3">
                  {selected.orderItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      {/* Product image */}
                      <div className="w-12 h-12 rounded-md bg-[#F8F9FA] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.product.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/products/${item.product.images[0].url}`}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LuPackage className="w-5 h-5 text-[#E5E5E5]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111111] truncate">
                          {item.product.title}
                        </p>
                        {item.variantLabel && (
                          <p className="text-xs text-[#444444]">{item.variantLabel}</p>
                        )}
                        <p className="text-xs text-[#444444]">
                          {item.quantity} × {currencyFormat(item.price)}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-[#111111] flex-shrink-0">
                        {currencyFormat(item.quantity * item.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Financial summary */}
              <section className="border-t border-[#E5E5E5] pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#444444]">
                    <span>Subtotal</span>
                    <span>{currencyFormat(selected.subTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#444444]">
                    <span>IVA (19%)</span>
                    <span>{currencyFormat(selected.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#111111] text-base pt-2 border-t border-[#E5E5E5]">
                    <span>Total</span>
                    <span>{currencyFormat(selected.total)}</span>
                  </div>
                </div>
              </section>

              {/* Delivery info */}
              {selected.isDelivered && selected.deliveredAt && (
                <section className="bg-green-50 rounded-lg px-4 py-3 flex items-center gap-2.5">
                  <LuCircleCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Entregado</p>
                    <p className="text-xs text-green-700">{fmt(selected.deliveredAt)}</p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
