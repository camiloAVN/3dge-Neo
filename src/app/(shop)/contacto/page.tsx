import {
  LuMapPin,
  LuPhone,
  LuMail,
  LuClock,
  LuInstagram,
  LuFacebook,
} from 'react-icons/lu';
import { ContactForm } from './ui/ContactForm';

const CONTACT_INFO = [
  {
    icon: LuMapPin,
    label: 'Dirección',
    value: 'Calle 72 # 10-07, Oficina 304\nBogotá, Colombia',
  },
  {
    icon: LuPhone,
    label: 'Teléfono',
    value: '+57 311 456 7890',
  },
  {
    icon: LuMail,
    label: 'Correo',
    value: 'contacto@unik.com',
  },
  {
    icon: LuClock,
    label: 'Horario de atención',
    value: 'Lunes – Viernes: 8:00 am – 6:00 pm\nSábado: 9:00 am – 1:00 pm',
  },
];

const SOCIAL = [
  { icon: LuInstagram, label: '@unik.store', href: '#' },
  { icon: LuFacebook,  label: 'UNIK Store',  href: '#' },
];

export default function ContactPage() {
  return (
    <div className="pt-8 pb-16 max-w-5xl mx-auto">

      {/* Page title */}
      <div className="mb-10">
        <div className="h-1 w-10 bg-[#D61C1C] rounded-full mb-3" />
        <h1 className="text-3xl font-bold text-[#111111]">Contáctanos</h1>
        <p className="text-sm text-[#444444] mt-1.5">
          Estamos aquí para ayudarte. Cuéntanos lo que necesitas.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

        {/* ── Form (left, wider) ── */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        {/* ── Contact info (right) ── */}
        <div className="lg:col-span-2">
          <div className="bg-[#F8F9FA] rounded-xl p-6 sm:p-8 h-full">
            <h2 className="text-base font-bold text-[#111111] mb-6">
              Información de contacto
            </h2>

            <ul className="space-y-6">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#D61C1C]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BBBBBB] mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm text-[#111111] leading-snug whitespace-pre-line">
                      {value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="border-t border-[#E5E5E5] my-7" />

            {/* Social links */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#BBBBBB] mb-3">
                Redes sociales
              </p>
              <div className="flex flex-col gap-2.5">
                {SOCIAL.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-[#444444] hover:text-[#D61C1C] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
