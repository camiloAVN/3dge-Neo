# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (Turbopack)
npm run build      # Build for production (Turbopack)
npm start          # Start production server
npm run lint       # Run ESLint

# Database
docker compose up -d        # Start 3DGE_postgres container (port 5433)
npx prisma migrate dev      # Apply schema changes to 3dge_store
npx prisma studio           # Open Prisma GUI
npm run seed                # Seed DB with 3DGE categories + products
```

## Project Identity

**3DGE** — E-commerce de organizadores de pared con estética neoplasticista.  
Productos en tres categorías fijas: **NEO**, **HEXA**, **CREA**.

> **Nota**: Este código fue adaptado de un proyecto anterior llamado UNIK. Todo rastro de UNIK ha sido eliminado. Si aparece alguna referencia a UNIK, debe reemplazarse por 3DGE.

---

## Architecture Overview

Full-stack e-commerce built with **Next.js 15 App Router**, **Prisma + PostgreSQL**, and **next-auth v5 (beta)**.

### Data Flow Pattern

No traditional API routes. Database access goes through **Next.js Server Actions** (`src/actions/`) called directly from Server and Client Components. API routes: `/api/auth/[...nextauth]` (auth) and `/api/payments/mercadopago` (webhook).

### Route Groups

| Group | Base path | Layout | Description |
|-------|-----------|--------|-------------|
| `(home)` | `/` | Root only (no TopMenu/Footer) | Neoplastic hero — full-screen composition |
| `(catalog)` | `/products`, `/products/[slug]` | Root only (no TopMenu/Footer) | Category selector + product grids |
| `(shop)` | `/product/[slug]`, `/checkout`, `/orders`, etc. | TopMenu + SideBar + CartModal + Footer | Transactional pages |
| `(admin)` | `/admin` | AdminSidebar only (ink/neoplastic) | Admin panel |
| `auth` | `/auth/login`, `/auth/new-account` | Neoplastic two-panel (blue + paper) | Auth pages |
| standalone | `/cuenta`, `/profile` | Own full-screen neoplastic layout (z-55, covers TopMenu) | Account pages |

### `(home)` Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `(home)/page.tsx` | Full-screen neoplastic hero — colored blocks, nav overlay, product CTAs |

**Hero page structure (banda superior):**
- `colLeft`: menu burger button + blue block
  - Blue block TOP: Brand3DGE logo + "3DGE" text (replaces old EST.2024)
  - Blue block MIDDLE: "Orden en la pared" vertical — hidden on mobile
  - Blue block BOTTOM: cart button icon (opens NeoCartModal or pushes /products if empty)
- Yellow block: brand tagline + CTA "Crea tu organizador"
- Image slot (`photoBig`): placeholder for product photo (replaces old cart cell)

**Hero nav overlay** (item 04):
- If authenticated → "Mi cuenta" → `/cuenta`
- If not authenticated → "Iniciar sesión" → `/auth/login`
- Auth state read via `useSession` (SessionProvider wraps root layout)

### `(catalog)` Routes

| Route | File | Description |
|-------|------|-------------|
| `/products` | `(catalog)/products/page.tsx` | Category selector: NEO rectangle · HEXA hexagon · CREA hammer |
| `/products/neo` | `(catalog)/products/[slug]/page.tsx` | NEO product grid |
| `/products/hexa` | `(catalog)/products/[slug]/page.tsx` | HEXA product grid |
| `/products/crea` | `(catalog)/products/crea/page.tsx` | **CREA Configurador** — interactive wall organizer builder |

**CREA Configurador** (`/products/crea`):
- Static route that overrides the dynamic `[slug]` route — Next.js uses it by priority
- Client component `CreaConfigurator` in `src/app/(catalog)/products/crea/ui/CreaConfigurator.tsx`
- Two-layer composition system:
  - **Layer 1 — Shapes**: User places colored blocks (6 shape presets, 5 colors) on a grid up to 10×10
  - **Layer 2 — Functions**: User drags functional modules (colgador de llaves, base billetera, porta-celular, estante, gancho doble, bandeja) onto placed blocks
- Price calculated in real-time from assigned function modules (prices defined in `FUNCTIONS` array, currently TBD/0)
- Grid size adjustable W/H independently; reducing the grid removes out-of-bounds blocks
- Full undo/redo history, clear all, delete selected block
- Layout: ink frame, dark left panel (controls), paper canvas (grid)
- CSS: `src/app/(catalog)/products/crea/crea.module.css`

### `(shop)` Routes

| Route | Description |
|-------|-------------|
| `/product/[slug]` | Product detail — size/variant selector, add to cart |
| `/checkout/address` | Address form — full-screen neoplastic (z-55, covers TopMenu) |
| `/checkout` | Order review — full-screen neoplastic (z-55) |
| `/orders` | Order history list — full-screen neoplastic (z-55) |
| `/orders/[id]` | Single order detail + MercadoPago Payment Brick — full-screen neoplastic (z-55) |
| `/category/[slug]` | Legacy dynamic category page |
| `/contacto` | Contact form (Resend stub) |

> **No existe `/cart`** — la página de carrito fue eliminada. El carrito se accede exclusivamente via `NeoCartModal` desde el hero, o navegando desde el hero cuando el carrito tiene ítems.

### Standalone Account Routes (outside `(shop)` layout)

| Route | File | Auth | Description |
|-------|------|------|-------------|
| `/cuenta` | `src/app/cuenta/page.tsx` | Required | Hub de cuenta — 4 tiles neoplásticos |
| `/profile` | `src/app/profile/page.tsx` | Required | Perfil + dirección de entrega |

**`/cuenta`** — página intermedia de cuenta:
- Si no autenticado → redirige a `/auth/login`
- Si autenticado → muestra grid de tiles neoplásticos:
  - Amarillo: **Perfil** → `/profile`
  - Paper: **Mis pedidos** → `/orders`
  - Rojo: **Panel admin** → `/admin` (solo si `role === 'admin'`)
  - Ink: **Cerrar sesión** → `signOut({ callbackUrl: '/' })`
- Layout: panel azul izquierdo (26%) + grid de tiles derecho
- Client component `CuentaTiles` en `src/app/cuenta/ui/CuentaTiles.tsx`

### Admin Routes (`src/app/(admin)/admin/`)

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard — live stat cards + Recharts charts |
| `/admin/categories` | Category CRUD |
| `/admin/products` | Product CRUD (slide-out drawer, price calculator) |
| `/admin/orders` | Paid orders — delivery toggle, filter tabs, full detail drawer |
| `/admin/customers` | Customer list + order history drawer |
| `/admin/users` | Admin users CRUD (enable/disable, cargo field) |
| `/admin/configuracion` | Settings panel |

**Admin layout**: sidebar ink (`#141210`), 240px ancho, logo Brand3DGE, badge "ADMIN" amarillo, nav items Space Mono con número (01–07), activo = texto amarillo + borde izquierdo amarillo. Header ink con nombre del usuario. Fondo del contenido: paper (`#f6f4ee`).

### State Management

| Layer | Tool | Persisted? |
|-------|------|-----------|
| Cart (items, quantities, totals) | Zustand `src/store/cart/` | Yes (localStorage) |
| UI state (sidebar, modals) | Zustand `src/store/ui/` | No |
| Saved address | Zustand `src/store/address/` | Yes (localStorage) |
| Server data | Server Actions + Prisma | Database |

Tax is calculated at 19% (`subTotal * 0.19`) in `PlaceOrder` and `checkout` pages.

---

## Payments — MercadoPago

**PayPal was removed.** The payment gateway is now **MercadoPago** using Checkout Bricks (Payment Brick).

### Payment Flow

1. `/orders/[id]` (server component) calls `createMercadoPagoPreference(orderId, total)` → gets `preferenceId`
2. Renders `<MercadoPagoPaymentBrick orderId amount preferenceId />` (client component)
3. Brick shows two options:
   - **Tarjeta de crédito/débito**: card form inline, processed via `processPayment()` server action → `payment.create()` → marks order paid
   - **Cuenta MercadoPago (wallet)**: opens Checkout Pro via `preferenceId`, redirects back to `/orders/[id]?payment_id=xxx&status=approved` → page auto-verifies via `verifyMercadoPagoPayment()`
4. "¿Ya pagaste con MercadoPago? Verificar estado →" button calls `checkOrderPaymentByReference()` as fallback when redirect doesn't happen (e.g. localhost without `auto_return`)

### Localhost vs Production

- On **localhost**: `auto_return` and `notification_url` are **omitted** (MP rejects localhost URLs). User must click "Volver" on MP's success page or use the "Verificar estado" button.
- On **production**: `auto_return: 'approved'` and `notification_url` are included automatically when `NEXT_PUBLIC_APP_URL` is not localhost.

### Webhook

`POST /api/payments/mercadopago` — receives MP payment notifications, verifies status, marks order paid.  
`GET /api/payments/mercadopago` — returns 200 (MP endpoint verification).

### SDK Initialization

`initMercadoPago(PUBLIC_KEY, { locale: 'es-CO' })` is called **once** in `Providers.tsx` via `useEffect` to avoid duplicate brick instances from React StrictMode double-mounting.

### Credentials

MP accounts in Colombia use `APP_USR-` prefix for BOTH test and production credentials. The "Credenciales de prueba" section may show production-level credentials — to test card payments, create "Cuentas de prueba" (test users) in the MP developer panel and use the seller test user's credentials.

### Key Payment Files

| File | Purpose |
|------|---------|
| `src/lib/mercadopago.ts` | `MercadoPagoConfig` singleton (server-side) |
| `src/actions/payments/mercadopago-payment.ts` | `createMercadoPagoPreference`, `processPayment`, `verifyMercadoPagoPayment`, `checkOrderPaymentByReference` |
| `src/components/mercadopago/MercadoPagoPaymentBrick.tsx` | Client component wrapping `@mercadopago/sdk-react` `Payment` brick |
| `src/app/api/payments/mercadopago/route.ts` | Webhook handler |

---

## 3DGE Design System

All public-facing pages use **CSS Modules** (not Tailwind) with the neoplastic design language.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--ink` | `#141210` | Background frame, borders, text, buttons |
| `--paper` | `#f6f4ee` | Content areas, form backgrounds |
| `--red` | `#e63b22` | CREA category, error states, feature blocks |
| `--yellow` | `#f5c200` | HEXA category, CTA text, accent, admin active |
| `--blue` | `#1f3fd6` | NEO category, focus states, brand panel |

### Grid Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--line` | `18px` (12px mobile) | Gap between grid cells |
| `--border` | `20px` (12px mobile) | Outer ink frame padding |

### Typography

| Font | CSS Variable | Weights | Usage |
|------|-------------|---------|-------|
| Bodoni Moda | `--font-bodoni-moda` | 400, 700, 900 | Headings, product titles, brand marks, tile labels |
| Space Mono | `--font-space-mono` | 400, 700 | Labels, navigation, prices, buttons, inputs, admin |
| Helvetica Neue | system | — | Body text |

### Neoplastic Full-Screen Page Pattern

All account/transactional pages use this layout (covers TopMenu with `z-index: 55`):

```css
.page {
  position: fixed; inset: 0; z-index: 55;
  background: var(--ink);
  display: flex; gap: var(--line); padding: var(--border);
}
/* Mobile ≤820px: keep position:fixed, change to column */
@media (max-width: 820px) {
  .page { flex-direction: column; }
  .left { flex-direction: row; min-height: 60–80px; }
  .right { overflow-y: auto; }
}
```

**Left panel** (26%): blue (`#1f3fd6`), flex column, `justify-content: space-between`:
- TOP: back link or brand mark
- MIDDLE: vertical label (hidden on mobile with `display: none`)
- BOTTOM: Brand3DGE mark or action button

**Right panel** (74%): paper (`#f6f4ee`), `overflow-y: auto`, content centered with `max-width`.

> **CRITICAL**: Never switch to `position: relative` on mobile for these pages — that exposes the `(shop)` layout's TopMenu underneath. Always keep `position: fixed; z-index: 55` and only change `flex-direction`.

### CSS Module Files

| File | Covers |
|------|--------|
| `src/app/(home)/hero.module.css` | Hero page — grid, blue block, nav overlay, cart button |
| `src/app/auth/auth.module.css` | Auth layout + all form field styles |
| `src/app/cuenta/cuenta.module.css` | `/cuenta` account hub — tile grid |
| `src/app/profile/profile.module.css` | `/profile` — two-panel, avatar, two forms |
| `src/app/(shop)/checkout/address/address.module.css` | `/checkout/address` — two-panel form |
| `src/app/(shop)/checkout/(checkout)/checkout.module.css` | `/checkout` — two-panel, products + summary |
| `src/app/(shop)/orders/orders.module.css` | `/orders` list + `/orders/[id]` detail (shared) |
| `src/app/(admin)/admin/ui/admin.module.css` | Admin sidebar — ink theme, nav items |
| `src/app/(catalog)/products/selector.module.css` | `/products` category selector |
| `src/app/(catalog)/products/[slug]/grid.module.css` | `/products/[slug]` grid layout |
| `src/app/(catalog)/products/[slug]/ui/card.module.css` | `NeoProductCard` |
| `src/app/(catalog)/products/crea/crea.module.css` | CREA configurador — dark panel + canvas |

### Neoplastic Form Inputs

```css
.input {
  border: 2px solid var(--ink); border-radius: 0;
  padding: 11px 14px; font-family: var(--mono); font-size: 13px;
  background: transparent; color: var(--ink);
}
.input:focus { border-color: var(--blue); box-shadow: inset 0 0 0 1px var(--blue); }
```

### Neoplastic Submit Button

```css
.submit {
  background: var(--ink); color: var(--yellow);
  font-family: var(--mono); font-weight: 700; letter-spacing: .06em;
  border: none; padding: 13px 22px; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between;
  transition: gap .3s, background .3s, color .3s;
}
.submit:hover:not(:disabled) { background: var(--blue); color: var(--paper); }
.submit:disabled { background: #ccc9c2; color: #9b9690; cursor: not-allowed; }
```

### Category Shapes (`/products` selector)

| Category | Shape | Color |
|----------|-------|-------|
| NEO | Tall vertical rectangle | Blue |
| HEXA | Hexagon `clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)` | Yellow |
| CREA | Hammer `clip-path: polygon(7% 0%, 93% 0%, 93% 33%, 63% 33%, 63% 100%, 37% 100%, 37% 33%, 7% 33%)` | Red |

### Hover Pattern

```css
.hoverable { transition: transform .35s cubic-bezier(.2,.8,.2,1); cursor: pointer; }
.hoverable::after { content:""; position:absolute; inset:0; box-shadow: inset 0 0 0 0 var(--ink); transition: box-shadow .35s; pointer-events: none; }
.hoverable:hover { transform: translateY(-4px); }
.hoverable:hover::after { box-shadow: inset 0 0 0 9px var(--ink); }
```

Photo/image cells zoom on hover: `.hoverable:hover .ph { transform: scale(1.045); }`

---

## Navigation & Auth Flow

### TopMenu (shop pages)

- Desktop: account icon (`LuUser`) is a `<Link href="/cuenta">` — navigates directly, no SideBar
- Mobile hamburger dropdown: "Mi cuenta" is a `<Link href="/cuenta">` — navigates directly
- Cart icon: opens `CartModal` via `useUIStore(state => state.openCart)`
- Logo: `logo.png` (3DGE logo, not the old UNIK logo_2.png)

### SideBar

Still rendered by `(shop)` layout but **no longer used for account navigation**. The account button in TopMenu now links to `/cuenta`. SideBar may open if other code calls `openSideMenu()`, but no buttons currently do.

### Protected Routes (middleware `src/auth.config.ts`)

```ts
const isOnUserRoute = path.startsWith('/profile')
  || path.startsWith('/orders')
  || path.startsWith('/checkout')
  || path.startsWith('/cuenta');  // ← added
const isOnAdminRoute = path.startsWith('/admin');
```

- Non-authenticated on user routes → `return false` → redirects to `/auth/login`
- Authenticated on `/auth/*` → redirect to `/`
- Non-admin on `/admin` → redirect to `/`

---

## Key Files

| File | Purpose |
|------|---------|
| `src/auth.ts` | NextAuth config — Credentials provider, bcryptjs, JWT strategy |
| `src/auth.config.ts` | **CRITICAL** — `jwt` + `session` + `authorized` callbacks (Edge-compatible) |
| `src/middleware.ts` | Route protection via NextAuth session |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/lib/mercadopago.ts` | MercadoPago SDK singleton (`MercadoPagoConfig`) |
| `src/lib/resend.ts` | Resend client + `FROM_EMAIL = '3DGE <noreply@3dge.co>'` |
| `src/config/fonts.ts` | All `next/font/google` exports |
| `src/actions/index.ts` | Barrel export for all server actions |
| `src/interfaces/index.ts` | Barrel export for all TypeScript interfaces |
| `src/utils/currencyFormat.ts` | Formats numbers as COP (`es-CO`, dots for thousands) |
| `src/seed/seed.ts` | 3DGE seed data (categories + products + users) |
| `src/seed/seed-database.ts` | Seed runner — clears and repopulates all tables |
| `src/components/ui/brand/Brand3DGE.tsx` | Logo component — `logo.png` + italic "3DGE" text |
| `src/app/cuenta/ui/CuentaTiles.tsx` | Client component for account tile grid |
| `src/app/(catalog)/products/crea/ui/CreaConfigurator.tsx` | CREA wall organizer builder (client component) |

---

## Database

### Docker Container

| Setting | Value |
|---------|-------|
| Container name | `3DGE_postgres` |
| Image | `postgres:17.6-alpine` |
| External port | **5433** (avoids conflict with local Postgres on 5432) |
| Database | `3dge_store` |
| Volume | `./postgres-3dge` |

### Seed Users

| Email | Password | Role |
|-------|----------|------|
| `camilo@3dge.co` | `123456` | admin |
| `cliente@3dge.co` | `123456` | user |

### Fixed Categories

| Name | Slug | Status |
|------|------|--------|
| NEO | `neo` | Active — 8 seed products |
| HEXA | `hexa` | Active — 5 seed products |
| CREA | `crea` | Active — configurador interactivo (no DB products) |

### Core Models

**`User`** — `id, name, email, emailVerified, password, role, image, isActive, cargo, createdAt`

**`Category`** — `id, name, slug, description, imageUrl, isActive, sortOrder`

**`Product`** — `id, title, description, inStock, price, slug, tags, categoryId`
- Relations: `images[]` (ProductImage), `orderItems[]`, `variants[]` (ProductVariant)

**`Order`** — `id, subTotal, tax, total, itemsInOrder, isPaid, paidAt, isDelivered, deliveredAt, createdAt, updatedAt, transactionId, userId`
- Relations (Prisma camelCase): `orderItems OrderItem[]`, `orderAddress OrderAddress?`, `user User`

**`OrderItem`** — `id, quantity, price, variantLabel, orderId, productId, productVariantId`
- Relations: `product Product`, `productVariant ProductVariant?`

**`OrderAddress`** / **`UserAddress`** — shipping/profile addresses with `Country` relation

> **CRITICAL — Prisma relation casing**: Always use camelCase for relation field names in `include`/`select`:
> - `order.orderAddress` ✅ (NOT `order.OrderAddress` ❌)
> - `order.orderItems` ✅ (NOT `order.OrderItem` ❌)
> - `product.images` ✅ (NOT `product.ProductImage` ❌)
> - `orderItem.variantLabel` ✅ (NOT `orderItem.size` ❌ — `size` was removed)

---

## Server Actions (`src/actions/`)

```
auth/           login, logout, register
address/        set-user-address, delete-user-address, get-user-address
order/          place-order, get-order-by-id, get-order-by-user,
                get-paginated-orders, update-order-delivery
payments/       mercadopago-payment
                  createMercadoPagoPreference  — creates MP preference (wallet option)
                  processPayment               — processes card payment via Payment Brick onSubmit
                  verifyMercadoPagoPayment     — verifies payment by payment_id (back_url redirect)
                  checkOrderPaymentByReference — searches MP for approved payment by orderId (wallet fallback)
product/        product-pagination, get-product-by-slug, get-stock-by-slug,
                create-update-product, delete-product, delete-product-image
category/       get-categories, create-update-category, delete-category
user/           get-paginated-users, change-user-role,
                create-update-admin-user, delete-admin-user,
                update-user-profile
contact/        send-contact-email  (Resend stub — activate when API key is set)
admin/          get-dashboard-stats (counts + monthly revenue/customers + top products)
country/        get-countries
```

---

## Components (`src/components/`)

### UI

| Component | Location | Notes |
|-----------|----------|-------|
| `TopMenu` | `ui/top-menu/` | Fixed navbar; account icon → `/cuenta`; cart → CartModal |
| `SideBar` | `ui/side-bar/` | Rendered by shop layout; no longer drives account navigation |
| `Footer` | `ui/footer/` | Logo: `logo.png`, copyright: "3DGE" |
| `Brand3DGE` | `ui/brand/Brand3DGE.tsx` | Logo cube + italic "3DGE" text; size prop in px |
| `NeoCartModal` | `cart/neo-cart/NeoCartModal.tsx` | Cart modal used in hero page |
| `CartModal` | `ui/cart/` | Cart modal used in (shop) layout |
| `Pagination` | `ui/pagination/` | `← Anterior / Siguiente →` |
| `MercadoPagoPaymentBrick` | `mercadopago/MercadoPagoPaymentBrick.tsx` | Payment Brick (credit/debit card + MP wallet) |

### Products

| Component | Notes |
|-----------|-------|
| `NeoProductCard` | `(catalog)/products/[slug]/ui/NeoProductCard.tsx` — neoplastic card |
| `ProductGrid` | Old grid — used in `(shop)` pages |
| `ProductGridItem` | Old card |
| `ProductSlideShow` | Product detail desktop (Swiper) |
| `ProductMobileSlideShow` | Product detail mobile (Swiper) |
| `ProductImage` | Handles local `/products/` prefix vs full URL |

### NeoProductCard

Located at `src/app/(catalog)/products/[slug]/ui/NeoProductCard.tsx`.
- `border: 2px solid var(--ink)`, no border-radius
- Title: Bodoni Moda, price: Space Mono
- "Agregar →": ink/yellow → hover: blue/paper
- "¡Agregado! ✓" feedback state (1.8s)
- Image: `name.startsWith('http') ? name : /products/${name}`

---

## NextAuth Critical Notes

**`jwt` and `session` callbacks MUST be in `src/auth.config.ts`** (Edge-compatible).  
Without this, `session.user.role` is always `undefined` → admin routes redirect to `/`.

`src/auth.ts` only contains: providers array + `session: { strategy: 'jwt' }`.

`(session.user as any).role` is needed when accessing role in server components (TypeScript doesn't know about custom JWT fields without augmentation).

---

## react-icons v5.5.0 — Lucide Naming

Icons follow `[Modifier][Noun]` order:

| ❌ Old (broken) | ✅ New (correct) |
|----------------|-----------------|
| `LuAlertCircle` | `LuCircleAlert` |
| `LuCheckCircle` | `LuCircleCheck` |
| `LuBarChart` | `LuChartBar` |

---

## Currency

All prices formatted as **COP (Colombian Pesos)** via `currencyFormat()`:
- Locale: `es-CO`, currency `COP`, 0 decimal places
- Output: `$ 45.000`, `$ 1.234.567`

---

## Admin Dashboard Charts

Uses **Recharts** (`npm install recharts --legacy-peer-deps`).  
All chart components are `'use client'` in `src/app/(admin)/admin/ui/`:
- `RevenueChart` — monthly bar chart for paid orders this year
- `CustomersChart` — monthly area chart for new registrations
- `TopProductsChart` — horizontal bar chart, top 8 products by units sold

---

## Product Images

Stored under `public/products/` in category subfolders:

```
public/products/
  neo/    neo_1.jpg  neo_2.jpg  neo_3.jpg
  hexa/   hexa_1.jpg hexa_2.jpg
public/imgs/
  logo.png      ← 3DGE logo cube (used in Brand3DGE, TopMenu, Footer, Admin)
  logo_2.png    ← OLD UNIK logo — DO NOT USE
```

---

## Contact & Email

- Contact email: `contacto@3dge.co`
- FROM_EMAIL (Resend): `3DGE <noreply@3dge.co>`
- Email templates: `src/emails/OrderConfirmationEmail.tsx`, `OrderNotificationEmail.tsx`
- Contact action stub: `src/actions/contact/send-contact-email.ts`

---

## Environment Variables (`.env`)

```
DB_USER=postgres
DB_NAME=3dge_store
DB_PASSWORD=123456
DATABASE_URL="postgresql://postgres:123456@localhost:5433/3dge_store?schema=public"

AUTH_SECRET=<openssl rand -base64 32>

# MercadoPago — use "Credenciales de prueba" from developer panel
# Both keys must come from the SAME application and SAME environment
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-...
MP_ACCESS_TOKEN=APP_USR-...
NEXT_PUBLIC_APP_URL=http://localhost:3000   # change to real domain in production

# Cloudflare R2 (image uploads)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
NEXT_PUBLIC_R2_PUBLIC_URL=

# Resend (contact form)
RESEND_API_KEY=
RESEND_FROM_EMAIL=3DGE <noreply@3dge.co>
```

> **MCP**: MercadoPago MCP Server is configured in the project's local `.claude.json` via `claude mcp add --transport http mercadopago https://mcp.mercadopago.com/mcp`

---

## Content Security Policy

MercadoPago Payment Brick requires the following CSP domains (configured in `next.config.ts`):
- `script-src`: `https://sdk.mercadopago.com https://*.mlstatic.com`
- `style-src`: `https://*.mlstatic.com`
- `connect-src`: `https://api.mercadopago.com https://*.mlstatic.com https://*.mercadopago.com https://*.mercadolibre.com`
- `frame-src`: `https://*.mercadopago.com https://*.mercadolibre.com https://*.mlstatic.com`

---

## TypeScript

Path alias `@/*` maps to `src/*`. Zod v4 is used for form validation alongside react-hook-form.

> **Known pre-existing TS errors** (non-blocking): Recharts tooltip props, some admin components with legacy typing, `src/app/(shop)/gender` (legacy page), `src/components/product/size-selector` (legacy). These don't affect the 3DGE public-facing pages.

> **Zod v4 API**: use `parsed.error.issues[0]?.message` — NOT `parsed.error.errors` (renamed in v4).

---

## Deployment — Railway

### package.json scripts (required)
```json
"postinstall": "prisma generate",
"migrate": "prisma migrate deploy"
```
`postinstall` regenerates the Prisma client for Linux after `npm install` in Railway (Windows binaries don't work on Linux). Run `npm run migrate` from Railway Shell after first deploy.

### next.config.ts (required)
```ts
eslint:     { ignoreDuringBuilds: true },
typescript: { ignoreBuildErrors: true },
```
Pre-existing lint/type errors in the project would break Railway builds without these.

### HTTPS redirect — middleware.ts
Railway does NOT auto-redirect HTTP→HTTPS. Add in `src/middleware.ts` before auth:
```ts
if (process.env.NODE_ENV === 'production') {
  const proto = request.headers.get('x-forwarded-proto');
  if (proto === 'http') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:'; url.port = '';
    return NextResponse.redirect(url, 301);
  }
}
```

### Middleware matcher — exclude static paths
Static files (`/imgs/`, `/products/`) MUST be excluded from the middleware matcher or Next.js image optimization breaks:
```ts
matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|imgs|products).*)']
```

### Port
Railway injects `PORT=8080` by default. Do NOT change it to 3000 in Railway's networking settings — the app listens on whatever PORT Railway injects.

### Environment variables for Railway
| Variable | Value |
|----------|-------|
| `DATABASE_URL` | auto-injected by Railway PostgreSQL |
| `AUTH_SECRET` | generate new: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `NEXT_PUBLIC_APP_URL` | `https://www.your-domain.com` |
| `NEXTAUTH_URL` | same as `NEXT_PUBLIC_APP_URL` |
| `AUTH_TRUST_HOST` | `true` |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | production MP public key |
| `MP_ACCESS_TOKEN` | production MP access token |
| `MP_WEBHOOK_SECRET` | from MP developer panel → Webhooks |
| `RESEND_API_KEY` | from resend.com |
| `RESEND_FROM_EMAIL` | `3DGE <noreply@3dge-co.com>` (verified domain) |
| `ADMIN_NOTIFICATION_EMAIL` | email to receive order alerts |
| R2 vars | same as local .env |

---

## NextAuth v5 — Production Critical

`trustHost: true` MUST be set in **both** `src/auth.ts` and `src/auth.config.ts` — not just as an env var. The edge runtime bakes the config at build time and ignores `AUTH_TRUST_HOST` env var at runtime.

```ts
// src/auth.config.ts
export default { trustHost: true, pages: { ... }, callbacks: { ... }, providers: [] }

// src/auth.ts
export const { auth, signIn, signOut, handlers } = NextAuth({ ...authConfig, trustHost: true, ... })
```

---

## Favicon

Place the logo as **`src/app/favicon.ico`** (PNG format is accepted). Do NOT put `favicon.ico` in `public/` — it conflicts with the app directory route. Do NOT rely on `metadata.icons` alone — Next.js injects its own default favicon.ico that takes priority.

---

## MercadoPago Webhook Signature

The webhook secret from MP developer panel goes in `MP_WEBHOOK_SECRET`. Verification uses HMAC-SHA256 on `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`. See `src/app/api/payments/mercadopago/route.ts`.

---

## Resend — Domain Verification

Without a verified domain on Resend, can only send TO the account email. Once `3dge-co.com` is verified on resend.com/domains:
- `RESEND_FROM_EMAIL=3DGE <noreply@3dge-co.com>`
- `ADMIN_NOTIFICATION_EMAIL` can be any address

---

## Custom Domain on Railway (GoDaddy)

1. Add `www.your-domain.com` in Railway → Railway gives CNAME + TXT records
2. In GoDaddy DNS: add CNAME `www` → Railway target, add TXT `_railway-verify` → verification value
3. Do NOT change nameservers — only add DNS records
4. Root domain (`@`): use GoDaddy domain forwarding → `https://www.your-domain.com` (301)
5. GoDaddy does not support CNAME at `@` — never try to add one
6. After domain verified (green ✓ in Railway): set `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` to the custom domain
