'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';

export async function login(
  prevState: string | undefined,
  formData: FormData
) {
  const email    = (formData.get('email')    as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string);

  if (!email || !password) return 'Completa todos los campos';

  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown';

  // 5 intentos por IP+email cada 15 minutos
  const { allowed } = checkRateLimit(`login:${ip}:${email}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return 'Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo.';
  }

  try {
    await signIn('credentials', { email, password, redirect: false });
    return 'Success';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Correo o contraseña incorrectos';
        case 'CallbackRouteError':
          return 'Error de conexión. Verifica que la base de datos esté activa.';
        default:
          return 'Ocurrió un error. Inténtalo de nuevo.';
      }
    }
    throw error;
  }
}

export const loginData = async (email: string, password: string) => {
  try {
    await signIn('credentials', { email, password, redirect: false });
    return { ok: true };
  } catch {
    return { ok: false, message: 'No se pudo iniciar sesión' };
  }
};
