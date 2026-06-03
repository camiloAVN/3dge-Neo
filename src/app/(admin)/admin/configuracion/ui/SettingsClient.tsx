'use client';

import { useState } from 'react';
import { updateSettings } from '@/actions';
import { LuCircleCheck, LuMail, LuSave } from 'react-icons/lu';

interface Props {
  adminEmail: string;
}

export function SettingsClient({ adminEmail: initial }: Props) {
  const [email, setEmail] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      await updateSettings({ adminEmail: email.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('No se pudo guardar la configuración.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Configuración</h1>
        <p className="text-sm text-[#444444] mt-1">
          Ajustes generales del panel administrativo
        </p>
      </div>

      {/* Section: Notifications */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <LuMail className="w-4 h-4 text-[#444444]" />
            <h2 className="font-semibold text-[#111111]">Notificaciones por correo</h2>
          </div>
          <p className="text-sm text-[#444444] mt-1">
            Configura el correo que recibirá alertas de nuevas órdenes de compra.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#444444] mb-1.5">
              Correo de notificaciones de órdenes
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-[#E5E5E5] rounded px-3 py-2 text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
              placeholder="admin@tutienda.com"
            />
            <p className="text-xs text-[#444444] mt-1.5">
              Cada vez que un cliente complete una compra, este correo recibirá
              todos los datos del pedido y la dirección de envío para iniciar
              la logística.
            </p>
          </div>

          {error && (
            <p className="text-sm text-[#D61C1C]">{error}</p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#D61C1C] hover:bg-[#b81818] disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded transition-colors"
            >
              <LuSave className="w-4 h-4" />
              {loading ? 'Guardando…' : 'Guardar cambios'}
            </button>

            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <LuCircleCheck className="w-4 h-4" />
                Cambios guardados
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Section: Resend status */}
      <div className="mt-4 bg-white rounded-lg border border-[#E5E5E5] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="font-semibold text-[#111111]">Estado del servicio de correo</h2>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#444444]">Proveedor</span>
            <span className="font-medium text-[#111111]">Resend</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#444444]">Variable <code className="text-xs bg-[#F8F9FA] px-1 py-0.5 rounded">RESEND_API_KEY</code></span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              process.env.NEXT_PUBLIC_RESEND_CONFIGURED === 'true'
                ? 'bg-green-50 text-green-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {process.env.NEXT_PUBLIC_RESEND_CONFIGURED === 'true' ? 'Configurado' : 'Pendiente'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#444444]">Variable <code className="text-xs bg-[#F8F9FA] px-1 py-0.5 rounded">RESEND_FROM_EMAIL</code></span>
            <span className="text-[#444444] font-mono text-xs">
              {process.env.NEXT_PUBLIC_RESEND_FROM_DISPLAY ?? 'noreply@unik.co (por defecto)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
