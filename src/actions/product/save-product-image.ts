'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function saveProductImage(
  productId: string,
  url: string
): Promise<{ ok: true; id: number } | { ok: false; message: string }> {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    const image = await prisma.productImage.create({
      data: { url, productId },
      select: { id: true, product: { select: { slug: true } } },
    });
    revalidatePath('/admin/products');
    revalidatePath(`/product/${image.product.slug}`);
    return { ok: true, id: image.id };
  } catch {
    return { ok: false, message: 'Error al registrar la imagen' };
  }
}
