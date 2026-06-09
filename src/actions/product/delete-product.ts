'use server';

import prisma from '@/lib/prisma';
import { deleteFromR2 } from '@/lib/r2-upload';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: { select: { url: true } } },
    });

    await prisma.product.delete({ where: { id } });

    if (product?.images.length) {
      await Promise.allSettled(
        product.images
          .filter(img => img.url.startsWith('http'))
          .map(img => deleteFromR2(img.url))
      );
    }

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, message: 'No se pudo eliminar el producto' };
  }
}
