import Link from 'next/link';
import { LuLayoutGrid } from 'react-icons/lu';

export default function CategoryNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <LuLayoutGrid className="w-12 h-12 text-[#E5E5E5] mb-4" />
      <h1 className="text-xl font-bold text-[#111111] mb-1">Categoría no encontrada</h1>
      <p className="text-sm text-[#444444] mb-6">
        Esta categoría no existe o ya no está disponible.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-[#D61C1C] hover:underline underline-offset-2"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
