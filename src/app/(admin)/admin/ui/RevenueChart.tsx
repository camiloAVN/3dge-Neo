'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, TooltipProps,
} from 'recharts';

interface Props {
  data: { month: string; ingresos: number }[];
}

const compact = (v: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP',
    minimumFractionDigits: 0, notation: 'compact',
  }).format(v);

const full = (v: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0,
  }).format(v);

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm px-3 py-2.5 text-sm">
      <p className="font-semibold text-[#111111] mb-1">{label}</p>
      <p className="text-[#D61C1C] font-bold">{full(payload[0].value ?? 0)}</p>
    </div>
  );
}

export function RevenueChart({ data }: Props) {
  const hasData = data.some(d => d.ingresos > 0);

  return (
    <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold text-[#111111]">Ingresos por mes</p>
        <p className="text-xs text-[#444444] mt-0.5">{new Date().getFullYear()} · órdenes pagadas</p>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#888888' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#888888' }}
              axisLine={false} tickLine={false}
              tickFormatter={compact}
              width={72}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FFF5F5' }} />
            <Bar dataKey="ingresos" fill="#D61C1C" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[240px] flex items-center justify-center text-sm text-[#BBBBBB]">
          Sin órdenes pagadas este año
        </div>
      )}
    </div>
  );
}
