'use server';

// ─── Resend setup (activate when ready) ───────────────────────────────────────
// 1. npm install resend
// 2. Add to .env.local:
//      RESEND_API_KEY=re_xxxxxxxxxxxx
//      CONTACT_TO_EMAIL=tucorreo@unik.com
// 3. Uncomment the block below and remove the simulated return.
// ──────────────────────────────────────────────────────────────────────────────

interface ContactPayload {
  from: string;
  subject: string;
  body: string;
}

export async function sendContactEmail({ from, subject, body }: ContactPayload) {
  try {
    // ── Uncomment to enable Resend ──
    // const { Resend } = await import('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'UNIK Contacto <noreply@unik.com>',
    //   to:   process.env.CONTACT_TO_EMAIL ?? 'contacto@unik.com',
    //   replyTo: from,
    //   subject: `[Contacto UNIK] ${subject}`,
    //   text: `Mensaje de: ${from}\n\n${body}`,
    // });

    // Simulated success — remove this line once Resend is active
    console.log('[contact-form]', { from, subject, body });

    return { ok: true };
  } catch (error) {
    console.error('[contact-form] error:', error);
    return { ok: false, message: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' };
  }
}
