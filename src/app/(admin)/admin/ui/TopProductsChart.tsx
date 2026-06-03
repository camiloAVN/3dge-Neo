'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, TooltipProps,
} from 'recharts';

interface Props {
  data: { name: string; vendidos: number }[];
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value ?? 0;
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm px-3 py-2.5 text-sm">
      <p className="font-semibold text-[#111111] mb-1 max-w-[200px] truncate">
        {payload[0].payload.name}
      </p>
      <p className="text-[#D61C1C] font-bold">
        {val} {val === 1 ? 'unidad vendida' : 'unidades vendidas'}
      </p>
    </div>
  );
}

export function TopProductsChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-6">
        <p className="text-sm font-bold text-[#111111] mb-1">Productos más vendidos</p>
        <div className="h-[200px] flex items-center justify-center text-sm text-[#BBBBBB]">
          Sin ventas registradas todavía
        </div>
      </div>
    );
  }

  // Determine bar colors: top 3 in red, rest in dark gray
  const getColor = (i: number) => (i < 3 ? '#D61C1C' : '#444444');

  return (
    <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold text-[#111111]">Productos más vendidos</p>
        <p className="text-xs text-[#444444] mt-0.5">Top {data.length} por unidades vendidas · todos los tiempos</p>
      </div>

      <ResponsiveContainer width="100%" height={data.length * 44 + 40}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 60, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#888888' }}
            axisLine={false} tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#111111' }}
            axisLine={false} tickLine={false}
            width={160}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FAFAFA' }} />
          <Bar dataKey="vendidos" radius={[0, 4, 4, 0]} maxBarSize={28} label={{ position: 'right', fontSize: 12, fill: '#444444' }}>
            {data.map((_, i) => (
              <Cell key={i} fill={getColor(i)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
