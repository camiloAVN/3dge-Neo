'use server';

import prisma from '@/lib/prisma';
import { uploadToR2 } from '@/lib/r2-upload';
import { revalidatePath } from 'next/cache';

export async function uploadProductImage(formData: FormData) {
  const file      = formData.get('file') as File | null;
  const productId = formData.get('productId') as string | null;

  if (!file || file.size === 0) return { ok: false as const, message: 'No se recibió ninguna imagen' };
  if (!productId)               return { ok: false as const, message: 'ID de producto requerido' };

  const upload = await uploadToR2(file, 'products');
  if (!upload.ok) return upload;

  const image = await prisma.productImage.create({
    data: { url: upload.url, productId },
    select: { id: true, product: { select: { slug: true } } },
  });

  revalidatePath('/admin/products');
  revalidatePath(`/product/${image.product.slug}`);

  return { ok: true as const, id: image.id, url: upload.url };
}
