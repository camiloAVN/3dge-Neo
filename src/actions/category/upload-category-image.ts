'use server';

import { uploadToR2 } from '@/lib/r2-upload';

export async function uploadCategoryImage(formData: FormData) {
  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) {
    return { ok: false as const, message: 'No se recibió ninguna imagen' };
  }
  return uploadToR2(file, 'categories');
}
