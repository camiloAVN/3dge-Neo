'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateSettings(data: { adminEmail: string }) {
  await prisma.appSettings.upsert({
    where:  { id: 'singleton' },
    update: { adminEmail: data.adminEmail },
    create: { id: 'singleton', adminEmail: data.adminEmail },
  });
  revalidatePath('/admin/configuracion');
  return { ok: true };
}
