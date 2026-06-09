import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

/*
 * FROM_EMAIL: dirección remitente para todos los correos.
 * - Plan gratuito Resend (sin dominio verificado): usar "3DGE <onboarding@resend.dev>"
 * - Con dominio verificado (ej. 3dge.co): usar "3DGE <noreply@3dge.co>"
 * Configura RESEND_FROM_EMAIL en .env para sobreescribir.
 */
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? '3DGE <onboarding@resend.dev>';
