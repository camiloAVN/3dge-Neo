import { createHmac } from 'crypto';
import { Payment } from 'mercadopago';
import mercadopago from '@/lib/mercadopago';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendOrderEmails } from '@/actions/order/send-order-emails';

/**
 * Verifies the x-signature header sent by MercadoPago on every webhook call.
 * Template: id:<data.id>;request-id:<x-request-id>;ts:<ts>;
 * Docs: https://www.mercadopago.com.co/developers/es/docs/your-integrations/notifications/webhooks
 */
function verifySignature(request: Request, dataId: string, rawBody: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // skip in dev when secret is not configured

  const xSignature  = request.headers.get('x-signature') ?? '';
  const xRequestId  = request.headers.get('x-request-id') ?? '';

  // x-signature format: "ts=<timestamp>,v1=<hash>"
  const parts = Object.fromEntries(xSignature.split(',').map(p => p.split('=')));
  const ts = parts['ts'];
  const v1 = parts['v1'];

  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computed  = createHmac('sha256', secret).update(manifest).digest('hex');

  return computed === v1;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let body: Record<string, unknown>;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return Response.json({ received: true }, { status: 200 });
    }

    // MP also sends 'merchant_order' and 'test' events — ignore them
    if (body.type !== 'payment') {
      return Response.json({ received: true }, { status: 200 });
    }

    const dataId = String((body.data as Record<string, unknown>)?.id ?? '');
    if (!dataId || dataId === 'undefined') {
      return Response.json({ received: true }, { status: 200 });
    }

    // Reject notifications that fail signature verification
    if (!verifySignature(request, dataId, rawBody)) {
      console.warn('[MP Webhook] invalid signature — request rejected');
      return Response.json({ received: false }, { status: 401 });
    }

    const payment = new Payment(mercadopago);
    const data = await payment.get({ id: dataId });

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
      data: { isPaid: true, paidAt: new Date(), transactionId: dataId },
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
