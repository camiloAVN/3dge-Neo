"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  useEffect(() => {
    // Initialize MercadoPago SDK once at app level to avoid duplicate bricks
    if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
      import("@mercadopago/sdk-react").then(({ initMercadoPago }) => {
        initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, { locale: "es-CO" });
      });
    }
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};
