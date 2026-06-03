'use server';

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';

export const registerUser = async (name: string, email: string, password: string) => {
  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown';

  // 3 registros por IP por hora
  const { allowed } = checkRateLimit(`register:${ip}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    return { ok: false, message: 'Demasiadas cuentas creadas. Espera una hora e inténtalo de nuevo.' };
  }

  const sanitizedName  = name.trim().slice(0, 100);
  const sanitizedEmail = email.trim().toLowerCase().slice(0, 200);

  if (sanitizedName.length < 2) {
    return { ok: false, message: 'El nombre debe tener al menos 2 caracteres' };
  }
  if (password.length < 8) {
    return { ok: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        // 12 rounds: ~4× más lento que el default 10, mejor resistencia a fuerza bruta
        password: bcrypt.hashSync(password, 12),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return { ok: true, user, message: 'Usuario creado' };
  } catch {
    return { ok: false, message: 'No se pudo crear el usuario' };
  }
};
