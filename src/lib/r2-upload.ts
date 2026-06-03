import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';
import { randomUUID } from 'crypto';
import path from 'path';

export async function uploadToR2(
  file: File,
  folder: string
): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  const ext  = path.extname(file.name).toLowerCase() || '.jpg';
  const key  = `${folder}/${randomUUID()}${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  try {
    await r2.send(new PutObjectCommand({
      Bucket:      R2_BUCKET,
      Key:         key,
      Body:        body,
      ContentType: file.type || 'image/jpeg',
    }));
    return { ok: true, url: `${R2_PUBLIC_URL}/${key}` };
  } catch {
    return { ok: false, message: 'Error al subir la imagen a R2' };
  }
}

export async function deleteFromR2(imageUrl: string): Promise<void> {
  const key = imageUrl.replace(`${R2_PUBLIC_URL}/`, '');
  try {
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  } catch {
    // Deletion failures are non-fatal
  }
}
