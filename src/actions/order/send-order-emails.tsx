'use server';

import prisma from '@/lib/prisma';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { OrderNotificationEmail } from '@/emails/OrderNotificationEmail';
import type { OrderEmailData } from '@/emails/types';

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

export async function sendOrderEmails(orderId: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user:         { select: { name: true, email: true } },
        orderAddress: { include: { country: { select: { name: true } } } },
        orderItems:   { include: { product: { select: { title: true } } } },
      },
    });

    if (!order || !order.user || !order.orderAddress) return;

    const settings = await prisma.appSettings.findUnique({
      where: { id: 'singleton' },
    });

    const addr = order.orderAddress;

    const data: OrderEmailData = {
      orderId:       order.id,
      orderDate:     formatDate(order.createdAt),
      transactionId: order.transactionId ?? '—',
      customer: {
        name:  order.user.name,
        email: order.user.email,
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    // 1 — Customer confirmation
    await resend.emails.send({
      from:    FROM_EMAIL,
      to:      order.user.email,
      subject: `¡Compra confirmada! Orden #${orderId.slice(-8).toUpperCase()}`,
      react:   <OrderConfirmationEmail {...data} />,
    });

    // 2 — Admin notification (only if configured)
    const adminEmail = settings?.adminEmail?.trim();
    if (adminEmail) {
      await resend.emails.send({
        from:    FROM_EMAIL,
        to:      adminEmail,
        subject: `🛒 Nueva orden #${orderId.slice(-8).toUpperCase()} — ${order.user.name}`,
        react:   (
          <OrderNotificationEmail
            {...data}
            adminPanelUrl={`${appUrl}/admin/orders`}
          />
        ),
      });
    }
  } catch (err) {
    console.error('[send-order-emails]', err);
  }
}
