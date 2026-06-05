'use server';

import { Preference, Payment } from 'mercadopago';
import mercadopago from '@/lib/mercadopago';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendOrderEmails } from '@/actions/order/send-order-emails';

const isLocalhost = (url: string) =>
  url.includes('localhost') || url.includes('127.0.0.1');

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

async function markOrderPaid(orderId: string, paymentId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { isPaid: true, paidAt: new Date(), transactionId: paymentId },
  });
  sendOrderEmails(orderId).catch(console.error);
  revalidatePath(`/orders/${orderId}`);
}

function extractMPError(error: any): { code: string; description: string } {
  const causes: any[] = error?.cause ?? [];
  const first = Array.isArray(causes) ? causes[0] : causes;
  return {
    code: first?.code ?? error?.status ?? 'UNKNOWN',
    description: first?.description ?? error?.message ?? '',
  };
}

/* ─── Create preference (for MP wallet option in the brick) ───────────────── */

export const createMercadoPagoPreference = async (orderId: string, total: number) => {
  if (!process.env.MP_ACCESS_TOKEN) {
    console.error('[MP] MP_ACCESS_TOKEN no configurado en .env');
    return { ok: false, preferenceId: null, message: 'Pasarela de pago no configurada.' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  try {
    const preference = new Preference(mercadopago);
    const response = await preference.create({
      body: {
        items: [{
          id: orderId,
          title: 'Pedido 3DGE',
          quantity: 1,
          unit_price: Math.round(total),
          currency_id: 'COP',
        }],
        external_reference: orderId,
        back_urls: {
          success: `${appUrl}/orders/${orderId}`,
          failure: `${appUrl}/orders/${orderId}`,
          pending: `${appUrl}/orders/${orderId}`,
        },
        ...(!isLocalhost(appUrl) && {
          auto_return: 'approved',
          notification_url: `${appUrl}/api/payments/mercadopago`,
        }),
      },
    });

    return { ok: true, preferenceId: response.id!, message: null };
  } catch (error: any) {
    const { code, description } = extractMPError(error);
    console.error(`[MP] createPreference falló — code: ${code}, description: ${description}`);
    return {
      ok: false,
      preferenceId: null,
      message: code === 'PA_UNAUTHORIZED_RESULT_FROM_POLICIES'
        ? 'Credenciales inválidas. Verifica el Access Token (debe empezar con TEST-).'
        : 'No se pudo iniciar el pago. Intenta de nuevo.',
    };
  }
};

/* ─── Process payment from brick onSubmit (card payments) ────────────────── */

export const processPayment = async (orderId: string, formData: Record<string, any>) => {
  console.log('[MP] processPayment — orderId:', orderId, 'formData keys:', Object.keys(formData));
  try {
    const payment = new Payment(mercadopago);
    const response = await payment.create({
      body: { ...formData, external_reference: orderId, description: 'Pedido 3DGE' },
    });

    console.log('[MP] payment.create response — status:', response.status, 'detail:', response.status_detail, 'id:', response.id);

    const status = response.status;

    if (status === 'approved') {
      await markOrderPaid(orderId, String(response.id));
      return { ok: true, status: 'approved' };
    }

    if (status === 'in_process' || status === 'pending') {
      return {
        ok: false,
        status,
        message: 'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
      };
    }

    console.warn('[MP] Pago rechazado — status:', status, 'detail:', response.status_detail);
    return {
      ok: false,
      status,
      message: 'El pago fue rechazado. Verifica los datos e intenta de nuevo.',
    };
  } catch (error: any) {
    const { code, description } = extractMPError(error);
    console.error('[MP] processPayment excepción — code:', code, 'description:', description, 'raw:', error?.cause ?? error?.message);
    return { ok: false, status: 'error', message: 'No se pudo procesar el pago. Intenta de nuevo.' };
  }
};

/* ─── Verify payment by payment_id (back_url redirect flow) ──────────────── */

export const verifyMercadoPagoPayment = async (paymentId: string, orderId: string) => {
  try {
    const payment = new Payment(mercadopago);
    const data = await payment.get({ id: paymentId });

    if (data.status !== 'approved') {
      return { ok: false, message: 'El pago no fue aprobado' };
    }
    if (data.external_reference !== orderId) {
      return { ok: false, message: 'La referencia del pago no coincide' };
    }

    await markOrderPaid(orderId, paymentId);
    return { ok: true };
  } catch (error: any) {
    console.error('[MP] verifyPayment falló:', error?.message ?? error);
    return { ok: false, message: 'Error al verificar el pago' };
  }
};

/* ─── Check payment status by external_reference (wallet fallback) ────────── */

export const checkOrderPaymentByReference = async (orderId: string) => {
  try {
    const payment = new Payment(mercadopago);
    const result = await payment.search({
      options: {
        external_reference: orderId,
        sort: 'date_created',
        criteria: 'desc',
      },
    });

    const approved = result.results?.find(p => p.status === 'approved');
    if (!approved?.id) {
      return { ok: false, message: 'No encontramos un pago aprobado para esta orden.' };
    }

    // Idempotency: skip if already paid
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { isPaid: true },
    });
    if (order?.isPaid) return { ok: true };

    await markOrderPaid(orderId, String(approved.id));
    return { ok: true };
  } catch (error: any) {
    console.error('[MP] checkOrderPayment falló:', error?.message ?? error);
    return { ok: false, message: 'Error al verificar el pago.' };
  }
};
