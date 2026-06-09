'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateSettings(data: {
  adminEmail?: string;
  heroImageMain?: string | null;
  heroImageLeft?: string | null;
  heroImageRight?: string | null;
}) {
  await prisma.appSettings.upsert({
    where:  { id: 'singleton' },
    update: data,
    create: { id: 'singleton', adminEmail: '', ...data },
  });
  revalidatePath('/admin/configuracion');
  revalidatePath('/');
  return { ok: true };
}
