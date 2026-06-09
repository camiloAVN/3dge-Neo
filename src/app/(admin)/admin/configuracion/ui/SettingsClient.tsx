'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { updateSettings, getHeroImageUploadUrl, saveHeroImage, deleteHeroImage } from '@/actions';
import { LuCircleCheck, LuImagePlus, LuMail, LuSave, LuTrash2 } from 'react-icons/lu';

type HeroSlot = 'heroImageMain' | 'heroImageLeft' | 'heroImageRight';

interface Props {
  adminEmail: string;
  heroImageMain:  string | null;
  heroImageLeft:  string | null;
  heroImageRight: string | null;
}

const SLOTS: { key: HeroSlot; label: string; desc: string; aspect: string }[] = [
  { key: 'heroImageMain',  label: 'Foto principal',       desc: 'Slot grande — banda superior derecha', aspect: 'aspect-[4/5]' },
  { key: 'heroImageLeft',  label: 'Foto detalle izq.',    desc: 'Slot pequeño — banda inferior izquierda', aspect: 'aspect-video' },
  { key: 'heroImageRight', label: 'Foto detalle der.',    desc: 'Slot pequeño — banda inferior derecha', aspect: 'aspect-video' },
];

function HeroImageSlot({ slotKey, label, desc, aspect, initialUrl }: {
  slotKey: HeroSlot; label: string; desc: string; aspect: string; initialUrl: string | null;
}) {
  const [url, setUrl]         = useState<string | null>(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError('');

    const presign = await getHeroImageUploadUrl(slotKey, file.name, file.type, file.size);
    if (!presign.ok) { setError(presign.message); setLoading(false); return; }

    const upload = await fetch(presign.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });
    if (!upload.ok) { setError('Error al subir imagen a R2'); setLoading(false); return; }

    const save = await saveHeroImage(slotKey, presign.publicUrl);
    if (!save.ok) { setError(save.message ?? 'Error al guardar'); setLoading(false); return; }

    setUrl(presign.publicUrl);
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    setError('');
    const result = await deleteHeroImage(slotKey);
    if (!result.ok) { setError(result.message ?? 'Error al eliminar'); setLoading(false); return; }
    setUrl(null);
    setLoading(false);
  }

  return (
    <div>
      <p className="text-xs font-semibold text-[#111111] mb-0.5">{label}</p>
      <p className="text-xs text-[#444444] mb-2">{desc}</p>

      <div
        className={`relative ${aspect} rounded-lg overflow-hidden border-2 border-dashed cursor-pointer transition-colors group ${url ? 'border-[#E5E5E5]' : 'border-[#E5E5E5] hover:border-[#D61C1C] bg-[#F8F9FA]'}`}
        onClick={() => !loading && inputRef.current?.click()}
      >
        {url ? (
          <>
            <Image src={url} alt={label} fill className="object-cover" sizes="300px" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-xs font-semibold">{loading ? 'Subiendo…' : 'Cambiar imagen'}</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 select-none">
            {loading
              ? <span className="text-xs text-[#444444]">Subiendo…</span>
              : <>
                  <LuImagePlus className="w-6 h-6 text-[#CCCCCC]" />
                  <span className="text-xs text-[#BBBBBB]">Haz clic para subir</span>
                </>
            }
          </div>
        )}
      </div>

      {url && (
        <button
          type="button"
          disabled={loading}
          onClick={handleDelete}
          className="mt-1.5 flex items-center gap-1 text-xs text-[#D61C1C] hover:underline disabled:opacity-50"
        >
          <LuTrash2 className="w-3 h-3" />
          Eliminar imagen
        </button>
      )}

      {error && <p className="text-xs text-[#D61C1C] mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}

export function SettingsClient({ adminEmail: initial, heroImageMain, heroImageLeft, heroImageRight }: Props) {
  const [email, setEmail] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState('');

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111111]">Configuración</h1>
        <p className="text-sm text-[#444444] mt-1">Ajustes generales del panel administrativo</p>
      </div>

      {/* Hero images */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden mb-4">
        <div className="px-6 py-4 border-b border-[#E5E5E5]">
          <h2 className="font-semibold text-[#111111]">Imágenes de la ventana principal</h2>
          <p className="text-sm text-[#444444] mt-1">
            Fotos que aparecen en el hero de la página de inicio. Haz clic en cada slot para subir, cambiar o eliminar.
          </p>
        </div>
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SLOTS.map(s => (
            <HeroImageSlot
              key={s.key}
              slotKey={s.key}
              label={s.label}
              desc={s.desc}
              aspect={s.aspect}
              initialUrl={
                s.key === 'heroImageMain'  ? heroImageMain  :
                s.key === 'heroImageLeft'  ? heroImageLeft  :
                heroImageRight
              }
            />
          ))}
        </div>
      </div>

      {/* Email notifications */}
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
          </div>
          {error && <p className="text-sm text-[#D61C1C]">{error}</p>}
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
    </div>
  );
}
