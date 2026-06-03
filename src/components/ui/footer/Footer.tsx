import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-[#E5E5E5] mt-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/imgs/logo_2.png"
              alt="UNIK"
              height={44}
              width={140}
              className="h-9 w-auto object-contain"
            />
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/products" className="text-xs text-[#444444] hover:text-[#111111] transition-colors">
              Productos
            </Link>
            <Link href="/nosotros" className="text-xs text-[#444444] hover:text-[#111111] transition-colors">
              Nosotros
            </Link>
            <Link href="/contacto" className="text-xs text-[#444444] hover:text-[#111111] transition-colors">
              Contáctanos
            </Link>
          </nav>

          <p className="text-xs text-[#444444]">
            © {new Date().getFullYear()} UNIK. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
