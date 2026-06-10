# Deployment Playbook — Next.js 15 + Prisma + Railway

Guía de referencia para implementar y desplegar proyectos similares a 3DGE en Railway.
Aplica a proyectos con: Next.js 15 App Router, Prisma + PostgreSQL, NextAuth v5, MercadoPago, Resend, Cloudflare R2.

---

## 1. Configuración base del proyecto (antes de desplegar)

### package.json — scripts obligatorios
```json
"scripts": {
  "postinstall": "prisma generate",
  "migrate": "prisma migrate deploy",
  "build": "next build",
  "start": "next start"
}
```
`postinstall` regenera el cliente Prisma para Linux en Railway. Sin esto el build falla.

### next.config.ts — flags de build
```ts
const nextConfig: NextConfig = {
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // ... resto de config
};
```

### NextAuth v5 — trustHost (CRÍTICO)
Agregar `trustHost: true` en **ambos** archivos. Solo la variable de entorno NO funciona en edge runtime.

```ts
// src/auth.config.ts
export default {
  trustHost: true,
  pages: { signIn: '/auth/login' },
  callbacks: { /* ... */ },
  providers: [],
} as NextAuthConfig;

// src/auth.ts
export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [ /* Credentials(...) */ ],
  session: { strategy: 'jwt', maxAge: 86400 },
});
```

### src/middleware.ts — HTTPS redirect + exclusión de estáticos
```ts
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { NextResponse, type NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto');
    if (proto === 'http') {
      const url = request.nextUrl.clone();
      url.protocol = 'https:';
      url.port = '';
      return NextResponse.redirect(url, 301);
    }
  }
  return (auth as any)(request);
}

export const config = {
  // IMPORTANTE: excluir imgs y products o Next.js image optimization se rompe
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|imgs|products).*)'],
};
```

### Favicon
Colocar el logo como `src/app/favicon.ico` (puede ser PNG renombrado como .ico):
- **NO** poner `favicon.ico` en `public/` — genera conflicto con la ruta del app directory
- **NO** confiar solo en `metadata.icons` — Next.js inyecta su propio favicon.ico por defecto que tiene prioridad
- `src/app/icon.png` funciona como ícono complementario pero no reemplaza el favicon.ico por defecto

---

## 2. MercadoPago

### Credenciales
- **Pruebas**: usar "Credenciales de prueba" del panel MP — crear "Cuentas de prueba" (test users) para simular pagos reales
- **Producción**: ir a "Credenciales de producción" — activar la cuenta completando el perfil de vendedor

Solo se usan 2 credenciales:
- `NEXT_PUBLIC_MP_PUBLIC_KEY` → Public Key
- `MP_ACCESS_TOKEN` → Access Token

Client ID y Client Secret NO se usan (son para OAuth).

### Webhook con verificación de firma
```ts
// src/app/api/payments/mercadopago/route.ts
import { createHmac } from 'crypto';

function verifySignature(request: Request, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // skip en dev

  const xSignature = request.headers.get('x-signature') ?? '';
  const xRequestId = request.headers.get('x-request-id') ?? '';
  const parts = Object.fromEntries(xSignature.split(',').map(p => p.split('=')));
  const ts = parts['ts'];
  const v1 = parts['v1'];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computed  = createHmac('sha256', secret).update(manifest).digest('hex');
  return computed === v1;
}
```

`MP_WEBHOOK_SECRET` se obtiene en MP → Tus integraciones → Webhooks → crear webhook → copia la "clave secreta".

### auto_return y notification_url
Se activan automáticamente cuando `NEXT_PUBLIC_APP_URL` no es localhost:
```ts
const isLocal = appUrl.includes('localhost') || appUrl.includes('127.0.0.1');
const preference = {
  // ...
  ...(!isLocal && { back_urls: { success: `${appUrl}/orders/${orderId}` }, auto_return: 'approved' }),
  ...(!isLocal && { notification_url: `${appUrl}/api/payments/mercadopago` }),
};
```

---

## 3. Resend — Correos

### Plan gratuito (sin dominio verificado)
- FROM solo puede ser `onboarding@resend.dev`
- TO solo puede ser el email de la cuenta Resend
- Usar solo para probar que el flujo funciona

### Con dominio verificado
1. Ir a resend.com/domains → Add Domain → ingresar tu dominio
2. Resend da registros DNS (TXT para SPF, DKIM, DMARC) → agregarlos en GoDaddy
3. Esperar verificación (5-30 min)
4. Actualizar variables:
   - `RESEND_FROM_EMAIL=TuMarca <noreply@tudominio.com>`
   - `ADMIN_NOTIFICATION_EMAIL=cualquier@email.com` (ya sin restricciones)

### src/lib/resend.ts
```ts
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY);
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TuMarca <onboarding@resend.dev>';
```

### Envío con React email
```ts
import { render } from '@react-email/components'; // NO necesario con resend v3+
// Con Resend v3+, pasar el componente directamente:
await resend.emails.send({
  from: FROM_EMAIL,
  to: email,
  subject: 'Asunto',
  react: <MiTemplate {...data} />,
});
```

---

## 4. Cloudflare R2 — Subida de imágenes

### src/lib/r2.ts
```ts
import { S3Client } from '@aws-sdk/client-s3';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
  requestChecksumCalculation: 'WHEN_REQUIRED', // evita error de CRC32 en presigned PUT
  responseChecksumValidation: 'WHEN_REQUIRED',
});

export const R2_BUCKET     = process.env.R2_BUCKET_NAME ?? '';
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '';
```

### Configuración en Cloudflare R2
1. Crear bucket en dash.cloudflare.com → R2
2. Configurar dominio público del bucket (Settings → Public Access) → copiar URL
3. Crear API Token con permisos `Object Read & Write` para el bucket
4. En `next.config.ts` agregar el hostname de R2 a `images.remotePatterns`

### Presigned URL (server action)
```ts
'use server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function getUploadUrl(filename: string, contentType: string, fileSize: number) {
  // validar auth, mime type (solo jpg/png/webp), tamaño (max 5MB)
  const key = `products/${randomUUID()}${ext}`;
  const command = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType });
  // NO incluir ContentLength — browsers lo setean auto y puede causar 403
  const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
  return { uploadUrl, publicUrl: `${R2_PUBLIC_URL}/${key}` };
}
```

---

## 5. Railway — Despliegue paso a paso

### Pre-requisitos en el código
- [x] `postinstall: "prisma generate"` en package.json
- [x] `migrate: "prisma migrate deploy"` en package.json
- [x] `eslint/typescript.ignoreDuringBuilds/Errors: true` en next.config.ts
- [x] `trustHost: true` en auth.ts Y auth.config.ts
- [x] Middleware con HTTPS redirect y matcher correcto
- [x] `src/app/favicon.ico` con el logo

### Pasos en Railway
1. **Nuevo proyecto** → Deploy from GitHub → seleccionar repo
2. **Agregar PostgreSQL**: `+ New → Database → PostgreSQL` → Railway inyecta `DATABASE_URL` automáticamente
3. **NO desplegar todavía** — configurar variables primero

### Variables de entorno en Railway
```
DATABASE_URL          → auto-inyectada por Railway PostgreSQL
AUTH_SECRET           → node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
NEXTAUTH_URL          → https://www.tudominio.com
NEXT_PUBLIC_APP_URL   → https://www.tudominio.com
AUTH_TRUST_HOST       → true

NEXT_PUBLIC_MP_PUBLIC_KEY → APP_USR-... (producción)
MP_ACCESS_TOKEN           → APP_USR-... (producción)
MP_WEBHOOK_SECRET         → clave del panel MP → Webhooks

RESEND_API_KEY            → re_...
RESEND_FROM_EMAIL         → TuMarca <noreply@tudominio.com>
ADMIN_NOTIFICATION_EMAIL  → email que recibe alertas de órdenes

R2_ACCOUNT_ID             → de Cloudflare
R2_ACCESS_KEY_ID          → de Cloudflare R2 API Token
R2_SECRET_ACCESS_KEY      → de Cloudflare R2 API Token
R2_BUCKET_NAME            → nombre del bucket
NEXT_PUBLIC_R2_PUBLIC_URL → https://pub-xxx.r2.dev
```

### Primer deploy
Railway ejecuta automáticamente:
```
npm install → postinstall → prisma generate
npm run build
npm start → escucha en PORT (Railway inyecta 8080 por defecto)
```

### Después del primer deploy — Railway Shell
```bash
npm run migrate   # aplica todas las migraciones al PostgreSQL de Railway
```
Opcional si necesitas datos iniciales:
```bash
npx ts-node src/seed/seed-database.ts
```

### Puerto
Railway inyecta `PORT=8080`. En Railway Settings → Networking: dejar en **8080**.
No cambiarlo a 3000 — causa "connection refused".

---

## 6. Dominio personalizado (GoDaddy → Railway)

### Reglas críticas
- **NUNCA** cambiar los nameservers de GoDaddy — rompe el correo y todos los registros existentes
- GoDaddy NO soporta CNAME en `@` (dominio raíz) — es una limitación estándar de DNS
- Solo agregar registros DNS individuales, nunca delegar el dominio completo

### Pasos
1. En Railway → Service → Settings → Domains → Custom Domain → escribir `www.tudominio.com`
2. Railway muestra CNAME + TXT records
3. En GoDaddy DNS → Agregar nuevo registro:
   - CNAME: Nombre `www` → Valor: el target de Railway (ej. `xxx.up.railway.app`)
   - TXT: Nombre `_railway-verify` → Valor: string de verificación
4. Para el dominio raíz: GoDaddy DNS → sección **Reenvío** → `tudominio.com` → `https://www.tudominio.com` (301)
5. Esperar verificación (5-60 min) — Railway muestra ✓ verde
6. Actualizar `NEXT_PUBLIC_APP_URL` y `NEXTAUTH_URL` al dominio final

### Errores comunes GoDaddy
- "Nombre inválido": GoDaddy agrega el dominio automáticamente — poner solo la parte antes del dominio (`www`, no `www.tudominio.com`)
- Conflicto con `www`: borrar el CNAME o A record existente de `www` antes de agregar el nuevo
- TXT no propaga: verificar en dnschecker.org tipo TXT → `_railway-verify.tudominio.com`

---

## 7. Zod v4 — Cambios de API

```ts
// ❌ Zod v3
parsed.error.errors[0]?.message

// ✅ Zod v4
parsed.error.issues[0]?.message
```

---

## 8. Next.js — Errores comunes en Railway

| Error | Causa | Fix |
|-------|-------|-----|
| `prisma: not found` | Prisma client no generado | `postinstall: "prisma generate"` |
| `UntrustedHost` | NextAuth sin trustHost | `trustHost: true` en auth.ts Y auth.config.ts |
| `connection refused` | PORT mismatch | Dejar PORT en 8080 en Railway networking |
| `image received null` | Middleware intercepta fetch interno | Excluir `/imgs` y `/products` del matcher |
| CVE en next@15.x.x | Versión desactualizada | `npm install next@latest` |
| Build falla por ESLint/TS | Errores pre-existentes | `ignoreDuringBuilds/ignoreBuildErrors: true` |
| Favicon no cambia | Caché del navegador | `src/app/favicon.ico` (no en public/) + vaciar caché |
