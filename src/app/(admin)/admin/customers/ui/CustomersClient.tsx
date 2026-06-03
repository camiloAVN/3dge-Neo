'use client';

import React, { useState } from 'react';
import {
  LuChevronDown,
  LuChevronUp,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuSearch,
  LuShoppingBag,
  LuUser,
  LuX,
} from 'react-icons/lu';

/* ── Types ──────────────────────────────────────────────────── */
type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  variantLabel: string | null;
  product: { title: string; slug: string; images: { url: string }[] };
};

type Order = {
  id: string;
  subTotal: number;
  tax: number;
  total: number;
  itemsInOrder: number;
  isPaid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  orderItems: OrderItem[];
  orderAddress: {
    firstName: string;
    lastName: string;
    address: string;
    address2: string | null;
    postalCode: string;
    city: string;
    phone: string;
    country: { name: string };
  } | null;
};

type UserAddress = {
  firstName: string;
  lastName: string;
  address: string;
  address2: string | null;
  postalCode: string;
  city: string;
  phone: string;
  country: { name: string };
};

type Customer = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  address: UserAddress | null;
  orders: Order[];
};

/* ── Helpers ─────────────────────────────────────────────────── */
function formatCOP(v: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d));
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function getPhone(c: Customer) {
  return c.address?.phone ?? c.orders[0]?.orderAddress?.phone ?? null;
}

function getCity(c: Customer) {
  return c.address?.city ?? c.orders[0]?.orderAddress?.city ?? null;
}

function totalSpent(c: Customer) {
  return c.orders.reduce((s, o) => s + o.total, 0);
}

/* ── Component ───────────────────────────────────────────────── */
export function CustomersClient({ customers }: { customers: Customer[] }) {
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState<'name' | 'orders' | 'spent'>('name');
  const [selected, setSelected]     = useState<Customer | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filtered = customers
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) ||
                 c.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'orders') return b.orders.length - a.orders.length;
      if (sortBy === 'spent')  return totalSpent(b) - totalSpent(a);
      return a.name.localeCompare(b.name, 'es');
    });

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Clientes</h1>
        <p className="text-sm text-[#444444] mt-1">{customers.length} clientes registrados</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo…"
            className="w-full border border-[#E5E5E5] rounded pl-9 pr-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] bg-white"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111] bg-white sm:w-56"
        >
          <option value="name">Ordenar: Nombre A–Z</option>
          <option value="orders">Ordenar: Más pedidos primero</option>
          <option value="spent">Ordenar: Mayor gasto primero</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        {customers.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">Aún no hay clientes registrados.</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-[#444444]">No se encontraron clientes con ese criterio.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden md:table-cell">Teléfono</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden lg:table-cell">Ciudad</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444]">Pedidos</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#444444] hidden sm:table-cell">Total gastado</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr
                  key={c.id}
                  onClick={() => { setSelected(c); setExpandedOrder(null); }}
                  className="border-t border-[#E5E5E5] hover:bg-[#FAFAFA] cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F8F9FA] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#444444]">
                        {initials(c.name)}
                      </div>
                      <div>
                        <p className="font-medium text-[#111111] leading-tight">{c.name}</p>
                        <p className="text-xs text-[#444444]">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#444444] hidden md:table-cell">{getPhone(c) ?? <span className="text-[#BBBBBB]">—</span>}</td>
                  <td className="px-4 py-3 text-[#444444] hidden lg:table-cell">{getCity(c) ?? <span className="text-[#BBBBBB]">—</span>}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-[#444444]">
                      <LuShoppingBag className="w-3.5 h-3.5" />
                      {c.orders.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#111111] hidden sm:table-cell">
                    {totalSpent(c) > 0 ? formatCOP(totalSpent(c)) : <span className="text-[#BBBBBB]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[#444444]">
                    <LuChevronUp className="w-4 h-4 rotate-90" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {search && (
        <p className="text-xs text-[#444444] mt-2">{filtered.length} de {customers.length} clientes</p>
      )}

      {/* Detail overlay */}
      {selected && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSelected(null)} />
      )}

      {/* Detail drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-[#E5E5E5] z-50 flex flex-col shadow-xl transform transition-transform duration-300 ${selected ? 'translate-x-0' : 'translate-x-full'}`}>
        {selected && (
          <>
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] flex-shrink-0">
              <h2 className="font-semibold text-[#111111]">Detalle del cliente</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F8F9FA] text-[#444444]">
                <LuX className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#F8F9FA] border border-[#E5E5E5] flex items-center justify-center text-lg font-bold text-[#444444] flex-shrink-0">
                  {initials(selected.name)}
                </div>
                <div>
                  <p className="text-lg font-bold text-[#111111]">{selected.name}</p>
                  <p className="text-sm text-[#444444]">{selected.email}</p>
                  <span className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${selected.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-[#444444]'}`}>
                    {selected.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              {/* Contact / Address */}
              {selected.address ? (
                <div className="bg-[#F8F9FA] rounded-lg p-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#444444] mb-3 flex items-center gap-1.5">
                    <LuUser className="w-3.5 h-3.5" /> Información de contacto
                  </p>
                  <Row label="Nombre" value={`${selected.address.firstName} ${selected.address.lastName}`} />
                  <Row label="Teléfono" value={selected.address.phone} icon={<LuPhone className="w-3 h-3" />} />
                  <Row label="Dirección" value={selected.address.address} icon={<LuMapPin className="w-3 h-3" />} />
                  {selected.address.address2 && <Row label="Dirección 2" value={selected.address.address2} />}
                  <Row label="Ciudad" value={selected.address.city} />
                  <Row label="Código postal" value={selected.address.postalCode} />
                  <Row label="País" value={selected.address.country.name} />
                </div>
              ) : (
                <div className="bg-[#F8F9FA] rounded-lg p-4 text-sm text-[#444444]">
                  Este cliente aún no ha guardado una dirección.
                </div>
              )}

              {/* Order history */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#444444] mb-3 flex items-center gap-1.5">
                  <LuPackage className="w-3.5 h-3.5" /> Historial de pedidos ({selected.orders.length})
                </p>

                {selected.orders.length === 0 ? (
                  <p className="text-sm text-[#444444]">Este cliente no ha realizado pedidos.</p>
                ) : (
                  <div className="space-y-3">
                    {selected.orders.map(order => (
                      <div key={order.id} className="border border-[#E5E5E5] rounded-lg overflow-hidden">
                        {/* Order header */}
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#FAFAFA] transition-colors text-left"
                        >
                          <div>
                            <p className="text-xs font-mono text-[#444444]">#{order.id.slice(-8).toUpperCase()}</p>
                            <p className="text-xs text-[#444444] mt-0.5">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${order.isPaid ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                              {order.isPaid ? 'Pagado' : 'Pendiente'}
                            </span>
                            <span className="font-semibold text-sm text-[#111111]">{formatCOP(order.total)}</span>
                            {expandedOrder === order.id
                              ? <LuChevronUp className="w-4 h-4 text-[#444444]" />
                              : <LuChevronDown className="w-4 h-4 text-[#444444]" />}
                          </div>
                        </button>

                        {/* Order items */}
                        {expandedOrder === order.id && (
                          <div className="border-t border-[#E5E5E5] divide-y divide-[#F0F0F0]">
                            {order.orderItems.map(item => (
                              <div key={item.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                <div>
                                  <p className="text-[#111111]">{item.product.title}</p>
                                  {item.variantLabel && (
                                    <p className="text-xs text-[#444444]">{item.variantLabel}</p>
                                  )}
                                  <p className="text-xs text-[#444444]">Cant: {item.quantity}</p>
                                </div>
                                <p className="font-medium text-[#111111] flex-shrink-0">{formatCOP(item.price * item.quantity)}</p>
                              </div>
                            ))}

                            {/* Order address */}
                            {order.orderAddress && (
                              <div className="px-4 py-3 bg-[#FAFAFA] text-xs text-[#444444] space-y-0.5">
                                <p className="font-semibold text-[#111111] mb-1">Dirección de envío</p>
                                <p>{order.orderAddress.firstName} {order.orderAddress.lastName} — {order.orderAddress.phone}</p>
                                <p>{order.orderAddress.address}{order.orderAddress.address2 ? `, ${order.orderAddress.address2}` : ''}</p>
                                <p>{order.orderAddress.city}, {order.orderAddress.postalCode} — {order.orderAddress.country.name}</p>
                              </div>
                            )}

                            {/* Order totals */}
                            <div className="px-4 py-3 text-xs text-[#444444] space-y-1">
                              <div className="flex justify-between">
                                <span>Subtotal</span><span>{formatCOP(order.subTotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>IVA (19%)</span><span>{formatCOP(order.tax)}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-[#111111] pt-1 border-t border-[#E5E5E5]">
                                <span>Total</span><span>{formatCOP(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ── Row helper ─────────────────────────────────────────────── */
function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      {icon && <span className="text-[#444444] mt-0.5 flex-shrink-0">{icon}</span>}
      <span className="text-[#444444] w-28 flex-shrink-0">{label}</span>
      <span className="text-[#111111] font-medium">{value}</span>
    </div>
  );
}
