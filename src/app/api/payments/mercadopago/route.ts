import { Payment } from 'mercadopago';
import mercadopago from '@/lib/mercadopago';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendOrderEmails } from '@/actions/order/send-order-emails';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // MP also sends 'merchant_order' and 'test' events — ignore them
    if (body.type !== 'payment') {
      return Response.json({ received: true }, { status: 200 });
    }

    const paymentId = String(body.data?.id);
    if (!paymentId || paymentId === 'undefined') {
      return Response.json({ received: true }, { status: 200 });
    }

    const payment = new Payment(mercadopago);
    const data = await payment.get({ id: paymentId });

    if (data.status !== 'approved' || !data.external_reference) {
      return Response.json({ received: true }, { status: 200 });
    }

    const orderId = data.external_reference;

    // Idempotency: skip if already paid
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { isPaid: true },
    });

    if (!order || order.isPaid) {
      return Response.json({ received: true }, { status: 200 });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date(), transactionId: paymentId },
    });

    sendOrderEmails(orderId).catch(console.error);
    revalidatePath(`/orders/${orderId}`);

    return Response.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[MP Webhook]', error);
    // Always return 200 so MP doesn't retry on our internal errors
    return Response.json({ received: true }, { status: 200 });
  }
}

// MP verifies the endpoint with GET during dashboard configuration
export async function GET() {
  return Response.json({ ok: true }, { status: 200 });
}
