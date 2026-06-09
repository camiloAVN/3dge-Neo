'use server';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';
import { deleteFromR2 } from '@/lib/r2-upload';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import path from 'path';
import { auth } from '@/auth';

type HeroSlot = 'heroImageMain' | 'heroImageLeft' | 'heroImageRight';
const ALLOWED_SLOTS = new Set<HeroSlot>(['heroImageMain', 'heroImageLeft', 'heroImageRight']);
const ALLOWED_MIME  = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE      = 5 * 1024 * 1024;

export async function getHeroImageUploadUrl(
  slot: HeroSlot,
  filename: string,
  contentType: string,
  fileSize: number,
): Promise<{ ok: true; uploadUrl: string; publicUrl: string } | { ok: false; message: string }> {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }
  if (!ALLOWED_SLOTS.has(slot))       return { ok: false, message: 'Slot inválido' };
  if (!ALLOWED_MIME.has(contentType)) return { ok: false, message: 'Tipo de archivo no permitido' };
  if (fileSize > MAX_SIZE)            return { ok: false, message: 'El archivo supera 5 MB' };
  if (!R2_BUCKET || !R2_PUBLIC_URL)   return { ok: false, message: 'R2 no configurado' };

  const ext = path.extname(filename).toLowerCase() || '.jpg';
  const key = `hero/${slot}-${randomUUID()}${ext}`;

  const command = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

  return { ok: true, uploadUrl, publicUrl: `${R2_PUBLIC_URL}/${key}` };
}

export async function saveHeroImage(slot: HeroSlot, url: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  // Delete old image from R2 if it exists
  const current = await prisma.appSettings.findUnique({ where: { id: 'singleton' } });
  const oldUrl = current?.[slot];
  if (oldUrl?.startsWith('http')) await deleteFromR2(oldUrl);

  await prisma.appSettings.upsert({
    where:  { id: 'singleton' },
    update: { [slot]: url },
    create: { id: 'singleton', adminEmail: '', [slot]: url },
  });

  revalidatePath('/admin/configuracion');
  revalidatePath('/');
  return { ok: true };
}

export async function deleteHeroImage(slot: HeroSlot) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  const current = await prisma.appSettings.findUnique({ where: { id: 'singleton' } });
  const url = current?.[slot];
  if (url?.startsWith('http')) await deleteFromR2(url);

  await prisma.appSettings.upsert({
    where:  { id: 'singleton' },
    update: { [slot]: null },
    create: { id: 'singleton', adminEmail: '' },
  });

  revalidatePath('/admin/configuracion');
  revalidatePath('/');
  return { ok: true };
}
