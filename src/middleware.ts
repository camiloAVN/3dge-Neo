
import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

// Especifica qué rutas proteger
export const config = {
  matcher: [
    // Protege todas las rutas excepto:
    // - api/auth (rutas de autenticación)
    // - _next/static (archivos estáticos)
    // - _next/image (optimización de imágenes)  
    // - favicon.ico, etc.
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};