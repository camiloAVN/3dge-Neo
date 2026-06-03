'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteAdminUser(id: string, currentUserId: string) {
  if (id === currentUserId) {
    return { ok: false, message: 'No puedes eliminar tu propia cuenta' };
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/users');
    return { ok: true };
  } catch {
    return { ok: false, message: 'No se pudo eliminar el usuario' };
  }
}
