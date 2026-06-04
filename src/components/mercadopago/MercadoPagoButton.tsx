'use client';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

interface Props {
  preferenceId: string;
}

export const MercadoPagoButton = ({ preferenceId }: Props) => {
  return (
    <Wallet initialization={{ preferenceId }} />
  );
};
