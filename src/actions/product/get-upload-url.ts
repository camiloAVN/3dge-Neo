'use server';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';
import { randomUUID } from 'crypto';
import path from 'path';
import { auth } from '@/auth';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function getUploadUrl(
  filename: string,
  contentType: string,
  fileSize: number,
  folder = 'products'
): Promise<
  | { ok: true; uploadUrl: string; publicUrl: string; key: string }
  | { ok: false; message: string }
> {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  if (!ALLOWED_MIME.has(contentType)) {
    return { ok: false, message: 'Tipo de archivo no permitido. Solo JPG, PNG y WEBP.' };
  }
  if (fileSize > MAX_SIZE_BYTES) {
    return { ok: false, message: 'El archivo supera el límite de 5 MB.' };
  }
  if (!R2_BUCKET || !R2_PUBLIC_URL) {
    return { ok: false, message: 'Almacenamiento R2 no configurado.' };
  }

  const ext = path.extname(filename).toLowerCase() || '.jpg';
  const key = `${folder}/${randomUUID()}${ext}`;

  // ContentLength is intentionally omitted: including it signs the
  // content-length header, which browsers set automatically and may
  // differ from the signed value, causing a 403 from R2.
  // Size is already validated above before reaching this point.
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

  return {
    ok: true,
    uploadUrl,
    publicUrl: `${R2_PUBLIC_URL}/${key}`,
    key,
  };
}
