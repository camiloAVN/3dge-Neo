'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'El nombre es requerido').max(100),
  slug: z.string().min(1, 'El slug es requerido').max(100),
  description: z.string().default(''),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type CategoryFormData = z.infer<typeof schema>;

export async function createUpdateCategory(raw: CategoryFormData) {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? 'Datos inválidos' };
  }

  const { id, ...data } = parsed.data;
  data.slug = data.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  try {
    if (id) {
      await prisma.category.update({ where: { id }, data });
    } else {
      await prisma.category.create({ data });
    }
    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { ok: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { ok: false, message: 'Ya existe una categoría con ese nombre o slug' };
    }
    return { ok: false, message: 'Error al guardar la categoría' };
  }
}
