'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
  cargo: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type AdminUserFormData = z.infer<typeof schema>;

export async function createUpdateAdminUser(raw: AdminUserFormData) {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.errors[0]?.message ?? 'Datos inválidos' };
  }

  const { id, password, ...data } = parsed.data;

  try {
    if (id) {
      await prisma.user.update({
        where: { id },
        data: {
          ...data,
          role: 'admin',
          ...(password ? { password: bcrypt.hashSync(password) } : {}),
        },
      });
    } else {
      if (!password) {
        return { ok: false, message: 'La contraseña es requerida para nuevos usuarios' };
      }
      await prisma.user.create({
        data: {
          ...data,
          role: 'admin',
          password: bcrypt.hashSync(password),
        },
      });
    }

    revalidatePath('/admin/users');
    return { ok: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { ok: false, message: 'Ya existe un usuario con ese email' };
    }
    return { ok: false, message: 'Error al guardar el usuario' };
  }
}
