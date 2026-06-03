import {
  LuClipboardList, LuPackage, LuTag, LuUser, LuUsers, LuBanknote,
} from 'react-icons/lu';
import { getDashboardStats } from '@/actions/admin/get-dashboard-stats';
import { RevenueChart }     from './ui/RevenueChart';
import { CustomersChart }   from './ui/CustomersChart';
import { TopProductsChart } from './ui/TopProductsChart';
import { currencyFormat }   from '@/utils';

export default async function AdminDashboard() {
  const { counts, monthlyRevenue, monthlyCustomers, topProducts } =
    await getDashboardStats();

  const statCards = [
    {
      label: 'Categorías',
      icon:  LuTag,
      value: counts.categories,
      sub:   'registradas',
    },
    {
      label: 'Productos',
      icon:  LuPackage,
      value: counts.products,
      sub:   'en catálogo',
    },
    {
      label: 'Órdenes',
      icon:  LuClipboardList,
      value: counts.orders,
      sub:   'totales',
    },
    {
      label: 'Clientes',
      icon:  LuUsers,
      value: counts.customers,
      sub:   'registrados',
    },
    {
      label: 'Admins',
      icon:  LuUser,
      value: counts.admins,
      sub:   'usuarios admin',
    },
    {
      label: 'Ingresos',
      icon:  LuBanknote,
      value: currencyFormat(counts.totalRevenue),
      sub:   'órdenes pagadas',
      accent: true,
    },
  ];

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Estadísticas</h1>
        <p className="text-sm text-[#444444] mt-1">Resumen general del negocio</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map(({ label, icon: Icon, value, sub, accent }) => (
          <div
            key={label}
            className={`rounded-lg border px-5 py-4 flex flex-col gap-3 ${
              accent
                ? 'bg-[#D61C1C] border-[#D61C1C] text-white'
                : 'bg-white border-[#E5E5E5]'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              accent ? 'bg-white/20' : 'bg-red-50'
            }`}>
              <Icon className={`w-4 h-4 ${accent ? 'text-white' : 'text-[#D61C1C]'}`} />
            </div>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-widest ${
                accent ? 'text-white/70' : 'text-[#444444]'
              }`}>
                {label}
              </p>
              <p className={`text-xl font-bold mt-0.5 leading-tight ${
                accent ? 'text-white' : 'text-[#111111]'
              }`}>
                {value}
              </p>
              <p className={`text-[10px] mt-0.5 ${
                accent ? 'text-white/60' : 'text-[#BBBBBB]'
              }`}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-3">
          <RevenueChart data={monthlyRevenue} />
        </div>
        <div className="lg:col-span-2">
          <CustomersChart data={monthlyCustomers} total={counts.customers} />
        </div>
      </div>

      {/* ── Charts row 2 ── */}
      <TopProductsChart data={topProducts} />
    </>
  );
}
