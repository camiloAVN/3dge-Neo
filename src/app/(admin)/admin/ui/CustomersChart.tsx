'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, TooltipProps,
} from 'recharts';

interface Props {
  data: { month: string; clientes: number }[];
  total: number;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value ?? 0;
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm px-3 py-2.5 text-sm">
      <p className="font-semibold text-[#111111] mb-1">{label}</p>
      <p className="text-[#111111] font-bold">
        {val} {val === 1 ? 'cliente' : 'clientes'}
      </p>
    </div>
  );
}

export function CustomersChart({ data, total }: Props) {
  const hasData = data.some(d => d.clientes > 0);

  return (
    <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-[#111111]">Clientes nuevos por mes</p>
          <p className="text-xs text-[#444444] mt-0.5">{new Date().getFullYear()} · registros</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold text-[#111111]">{total}</p>
          <p className="text-[10px] text-[#888888] uppercase tracking-wider">total clientes</p>
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradClientes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#111111" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#111111" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#888888' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#888888' }}
              axisLine={false} tickLine={false}
              allowDecimals={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E5E5' }} />
            <Area
              type="monotone"
              dataKey="clientes"
              stroke="#111111"
              strokeWidth={2}
              fill="url(#gradClientes)"
              dot={{ r: 3, fill: '#111111', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#D61C1C', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-sm text-[#BBBBBB]">
          Sin registros este año
        </div>
      )}
    </div>
  );
}
