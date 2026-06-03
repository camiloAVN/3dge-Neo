'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateOrderDelivery(orderId: string, isDelivered: boolean) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered,
        deliveredAt: isDelivered ? new Date() : null,
      },
    });
    revalidatePath('/admin/orders');
    return { ok: true };
  } catch {
    return { ok: false, message: 'No se pudo actualizar el estado de entrega.' };
  }
}
