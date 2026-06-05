'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Payment } from '@mercadopago/sdk-react';
import { processPayment, checkOrderPaymentByReference } from '@/actions';

interface Props {
  orderId: string;
  amount: number;
  preferenceId: string;
}

export const MercadoPagoPaymentBrick = ({ orderId, amount, preferenceId }: Props) => {
  const router = useRouter();
  const [brickError, setBrickError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const initialization = {
    amount,
    preferenceId,
  };

  const customization = {
    paymentMethods: {
      creditCard: 'all',
      debitCard: 'all',
      mercadoPago: 'all',
      onboarding_credits: 'none',
    },
  };

  const onSubmit = async ({ selectedPaymentMethod, formData }: { selectedPaymentMethod: string; formData: Record<string, any> }) => {
    setBrickError(null);
    console.log('[MP] onSubmit — method:', selectedPaymentMethod, 'keys:', Object.keys(formData));

    let result: { ok: boolean; status?: string; message?: string | null };
    try {
      result = await processPayment(orderId, formData);
    } catch (err: any) {
      const msg = err?.message ?? 'Error inesperado al procesar el pago';
      setBrickError(msg);
      throw err;
    }

    console.log('[MP] processPayment result:', result);

    if (result.ok) {
      router.replace(`/orders/${orderId}`);
      return;
    }

    const msg = result.message ?? 'El pago no fue aprobado. Intenta de nuevo.';
    setBrickError(msg);
    throw new Error(msg);
  };

  const onError = (error: any) => {
    const type: string = error?.type ?? '';
    if (type === 'non_critical' || type === 'validation_error' || type === 'incomplete_fields') {
      return;
    }
    console.warn('[MP Brick] error:', error);
    setBrickError('Ocurrió un error con el módulo de pago. Recarga la página.');
  };

  const handleVerifyWallet = async () => {
    setVerifying(true);
    setVerifyMessage(null);
    const result = await checkOrderPaymentByReference(orderId);
    if (result.ok) {
      router.replace(`/orders/${orderId}`);
    } else {
      setVerifyMessage(result.message ?? 'No se encontró un pago aprobado.');
      setVerifying(false);
    }
  };

  return (
    <div>
      {brickError && (
        <p style={{
          fontFamily: 'var(--font-space-mono)',
          fontSize: 12,
          color: 'var(--red)',
          border: '2px solid var(--red)',
          padding: '10px 14px',
          marginBottom: 12,
        }}>
          {brickError}
        </p>
      )}

      {/* key={preferenceId} ensures a single brick instance per order */}
      <Payment
        key={preferenceId}
        initialization={initialization}
        customization={customization as any}
        onSubmit={onSubmit}
        onError={onError}
      />

      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <button
          onClick={handleVerifyWallet}
          disabled={verifying}
          style={{
            background: 'none',
            border: 'none',
            cursor: verifying ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-space-mono)',
            fontSize: 11,
            color: verifying ? '#9b9690' : 'var(--blue)',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          {verifying ? 'Verificando…' : '¿Ya pagaste con MercadoPago? Verificar estado →'}
        </button>
        {verifyMessage && (
          <p style={{
            marginTop: 6,
            fontFamily: 'var(--font-space-mono)',
            fontSize: 11,
            color: 'var(--red)',
          }}>
            {verifyMessage}
          </p>
        )}
      </div>
    </div>
  );
};
