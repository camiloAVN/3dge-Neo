'use server';

import prisma from '@/lib/prisma';
import { deleteFromR2 } from '@/lib/r2-upload';
import { revalidatePath } from 'next/cache';

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith('http')) {
    return { ok: false, error: 'No se pueden borrar imágenes locales' };
  }

  try {
    await deleteFromR2(imageUrl);

    const deleted = await prisma.productImage.delete({
      where: { id: imageId },
      select: { product: { select: { slug: true } } },
    });

    revalidatePath('/admin/products');
    revalidatePath(`/product/${deleted.product.slug}`);
    return { ok: true };
  } catch {
    return { ok: false, error: 'No se pudo eliminar la imagen' };
  }
};
