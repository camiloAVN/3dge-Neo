import type { Metadata } from "next";

import "./globals.css";
import { bodoniModa, geistMono, geistSans, spaceMono, titleFont } from "@/config/fonts";
import { Providers } from "@/components";

export const metadata: Metadata = {
  title: {
    template: '%s | 3DGE',
    default: '3DGE — Organizadores de pared',
  },
  description: '3DGE — Organizadores de pared con estilo neoplasticista.',
  icons: {
    icon: '/imgs/logo.png',
    apple: '/imgs/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${titleFont.variable} ${bodoniModa.variable} ${spaceMono.variable} antialiased bg-white text-[#111111]`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
