import type { NextConfig } from "next";

function getR2Hostname(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
}

const r2Hostname = getR2Hostname();

const securityHeaders = [
  // Previene clickjacking (la página no puede cargarse en iframes externos)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Previene MIME-type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limita información de referrer enviada a otros sitios
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Protección XSS legacy para navegadores viejos
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Desactiva APIs de hardware no usadas
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Content Security Policy: bloquea scripts, frames e iframes externos no autorizados
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js requiere unsafe-inline/unsafe-eval para hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.sandbox.paypal.com",
      "style-src 'self' 'unsafe-inline'",
      // Imágenes propias + R2/Cloudflare + data URIs para optimización Next.js
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.paypal.com https://www.sandbox.paypal.com",
      "frame-src https://www.paypal.com https://www.sandbox.paypal.com",
      // Bloquea objetos embebidos (Flash, plugins)
      "object-src 'none'",
      // Previene inyección de base URL
      "base-uri 'self'",
      // Formularios solo pueden enviarse al mismo origen
      "form-action 'self'",
    ].join('; '),
  },
  // HSTS: fuerza HTTPS solo en producción (no aplica en localhost)
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]
    : []),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(r2Hostname
        ? [{ protocol: 'https' as const, hostname: r2Hostname }]
        : []
      ),
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
