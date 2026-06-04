'use server';

import { Preference, Payment } from 'mercadopago';
import mercadopago from '@/lib/mercadopago';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendOrderEmails } from '@/actions/order/send-order-emails';

export const createMercadoPagoPreference = async (orderId: string, total: number) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  try {
    const preference = new Preference(mercadopago);
    const response = await preference.create({
      body: {
        items: [
          {
            id: orderId,
            title: 'Pedido 3DGE',
            quantity: 1,
            unit_price: total,
            currency_id: 'COP',
          },
        ],
        external_reference: orderId,
        back_urls: {
          success: `${appUrl}/orders/${orderId}`,
          failure: `${appUrl}/orders/${orderId}`,
          pending: `${appUrl}/orders/${orderId}`,
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/payments/mercadopago`,
      },
    });

    return { ok: true, preferenceId: response.id! };
  } catch (error) {
    console.error(error);
    return { ok: false, preferenceId: null };
  }
};

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

    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date(), transactionId: paymentId },
    });

    sendOrderEmails(orderId).catch(console.error);

    revalidatePath(`/orders/${orderId}`);
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'Error al verificar el pago' };
  }
};
