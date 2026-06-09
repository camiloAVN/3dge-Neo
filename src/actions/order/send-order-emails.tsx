'use server';

import prisma from '@/lib/prisma';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { OrderNotificationEmail } from '@/emails/OrderNotificationEmail';
import type { OrderEmailData } from '@/emails/types';

/*
 * ADMIN_NOTIFICATION_EMAIL: recibe alertas de nuevas órdenes.
 * En plan gratuito Resend, este correo DEBE ser el mismo que usaste al crear
 * la cuenta en resend.com. Para enviar a cualquier dirección, verifica tu
 * dominio en resend.com/domains y actualiza RESEND_FROM_EMAIL en .env.
 */
const FALLBACK_ADMIN_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL ?? 'atencion@3dge-co.com';

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  }).format(date);
}

async function sendOne(label: string, payload: Parameters<typeof resend.emails.send>[0]) {
  const { data, error } = await resend.emails.send(payload);
  if (error) {
    console.error(`[Email] ${label} FAILED — ${error.name}: ${error.message}`);
    return false;
  }
  console.log(`[Email] ${label} sent — id: ${data?.id}`);
  return true;
}

export async function sendOrderEmails(orderId: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set — skipping');
    return;
  }

  console.log('[Email] sendOrderEmails start — orderId:', orderId);

  try {
    const [order, settings] = await Promise.all([
      prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user:         { select: { name: true, email: true } },
          orderAddress: { include: { country: { select: { name: true } } } },
          orderItems:   { include: { product: { select: { title: true } } } },
        },
      }),
      prisma.appSettings.findUnique({
        where: { id: 'singleton' },
        select: { adminEmail: true },
      }),
    ]);

    if (!order?.orderAddress) {
      console.error('[Email] Order or address not found for:', orderId);
      return;
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    /* Admin email: AppSettings → env var → hardcoded fallback */
    const adminEmail = settings?.adminEmail?.trim() || FALLBACK_ADMIN_EMAIL;
    const addr = order.orderAddress;
    const fmt = (n: number) =>
      new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

    const data: OrderEmailData = {
      orderId:       order.id,
      orderDate:     formatDate(order.createdAt),
      transactionId: order.transactionId ?? '—',
      customer: {
        name:  order.user.name  ?? 'Cliente',
        email: order.user.email ?? '',
      },
      address: {
        firstName:  addr.firstName,
        lastName:   addr.lastName,
        address:    addr.address,
        address2:   addr.address2,
        city:       addr.city,
        postalCode: addr.postalCode,
        country:    addr.country.name,
        phone:      addr.phone,
      },
      items: order.orderItems.map(item => ({
        title:    item.product.title,
        quantity: item.quantity,
        price:    item.price,
      })),
      subTotal: order.subTotal,
      tax:      order.tax,
      total:    order.total,
    };

    console.log('[Email] FROM:', FROM_EMAIL, '| adminTo:', adminEmail, '| customerTo:', order.user.email);

    /* ── 1. Notificación al administrador (siempre) ── */
    await sendOne('admin-notification', {
      from:    FROM_EMAIL,
      to:      adminEmail,
      subject: `🛒 Nueva orden #${orderId.slice(-8).toUpperCase()} · ${data.customer.name} · ${fmt(order.total)}`,
      react:   (
        <OrderNotificationEmail
          {...data}
          appUrl={appUrl}
          adminPanelUrl={`${appUrl}/admin/orders`}
        />
      ),
    });

    /* ── 2. Confirmación al cliente ── */
    if (order.user.email) {
      await sendOne('customer-confirmation', {
        from:    FROM_EMAIL,
        to:      order.user.email,
        subject: `¡Compra confirmada! Orden #${orderId.slice(-8).toUpperCase()} — 3DGE`,
        react:   <OrderConfirmationEmail {...data} appUrl={appUrl} />,
      });
    }

  } catch (err) {
    console.error('[send-order-emails] unexpected error:', err);
  }
}
