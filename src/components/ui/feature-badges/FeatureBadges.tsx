import { LuGlobe, LuShieldCheck, LuTruck, LuHeadphones } from 'react-icons/lu';

const BADGES = [
  {
    icon: LuGlobe,
    title: 'Importación Nacional',
    sub: 'Productos seleccionados directamente del exterior',
  },
  {
    icon: LuShieldCheck,
    title: 'Calidad Garantizada',
    sub: 'Materiales de primera selección en cada prenda',
  },
  {
    icon: LuTruck,
    title: 'Envíos Seguros',
    sub: 'Entrega protegida a cualquier parte del país',
  },
  {
    icon: LuHeadphones,
    title: 'Atención Personalizada',
    sub: 'Soporte dedicado para cada cliente',
  },
];

export function FeatureBadges() {
  return (
    <div className="border-t border-b border-[#E5E5E5] -mx-5 sm:-mx-10 bg-white">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E5E5E5]">
        {BADGES.map(({ icon: Icon, title, sub }) => (
          <div
            key={title}
            className="flex flex-col lg:flex-row items-center lg:items-center text-center lg:text-left gap-2.5 lg:gap-3 px-5 py-5 lg:py-4 bg-white"
          >
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-[#D61C1C]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111111] leading-tight">{title}</p>
              <p className="text-xs text-[#444444] mt-1 leading-snug">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
