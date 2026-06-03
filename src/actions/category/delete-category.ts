'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { ok: true };
  } catch {
    return { ok: false, message: 'No se puede eliminar: tiene productos asociados' };
  }
}
