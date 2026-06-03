'use client';

import { useState } from 'react';
import { LuSend, LuCircleCheck, LuCircleAlert } from 'react-icons/lu';
import { sendContactEmail } from '@/actions/contact/send-contact-email';

type Status = 'idle' | 'loading' | 'success' | 'error';

const EMPTY = { email: '', subject: '', body: '' };

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const result = await sendContactEmail({
      from: form.email,
      subject: form.subject,
      body: form.body,
    });

    if (result.ok) {
      setStatus('success');
      setForm(EMPTY);
    } else {
      setStatus('error');
      setErrorMsg(result.message ?? 'Error inesperado.');
    }
  }

  const inputCls =
    'w-full border border-[#E5E5E5] rounded-lg px-4 py-2.5 text-sm text-[#111111] placeholder-[#BBBBBB] focus:outline-none focus:border-[#111111] transition-colors';

  return (
    <div>
      <h2 className="text-xl font-bold text-[#111111] mb-1">Envíanos un mensaje</h2>
      <p className="text-sm text-[#444444] mb-6">
        Responderemos a tu correo en menos de 24 horas hábiles.
      </p>

      {/* Success banner */}
      {status === 'success' && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3.5 mb-6">
          <LuCircleCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">¡Mensaje enviado!</p>
            <p className="text-sm text-green-700 mt-0.5">
              Hemos recibido tu mensaje y te responderemos pronto.
            </p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {status === 'error' && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3.5 mb-6">
          <LuCircleAlert className="w-5 h-5 text-[#D61C1C] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[#D61C1C]">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[#444444] mb-1.5">
            Tu correo electrónico <span className="text-[#D61C1C]">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={set('email')}
            placeholder="correo@ejemplo.com"
            className={inputCls}
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-[#444444] mb-1.5">
            Asunto <span className="text-[#D61C1C]">*</span>
          </label>
          <input
            type="text"
            required
            value={form.subject}
            onChange={set('subject')}
            placeholder="¿En qué podemos ayudarte?"
            className={inputCls}
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-xs font-semibold text-[#444444] mb-1.5">
            Mensaje <span className="text-[#D61C1C]">*</span>
          </label>
          <textarea
            required
            rows={6}
            value={form.body}
            onChange={set('body')}
            placeholder="Escribe tu mensaje aquí..."
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center justify-center gap-2 w-full bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
        >
          {status === 'loading' ? (
            'Enviando…'
          ) : (
            <>
              <LuSend className="w-4 h-4" />
              Enviar mensaje
            </>
          )}
        </button>
      </form>
    </div>
  );
}
