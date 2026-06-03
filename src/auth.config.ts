import type { NextAuthConfig } from 'next-auth';

export default {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.data as any;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as any)?.role === 'admin';

      const path = nextUrl.pathname;

      const isOnAdminRoute  = path.startsWith('/admin');
      const isOnUserRoute   = path.startsWith('/profile') || path.startsWith('/orders') || path.startsWith('/checkout');
      const isOnAuth        = path.startsWith('/auth');

      // Admin routes: need login + admin role
      if (isOnAdminRoute) {
        if (!isLoggedIn) return false;           // → redirect to /auth/login
        if (!isAdmin)    return Response.redirect(new URL('/', nextUrl));
        return true;
      }

      // Protected user routes: need login
      if (isOnUserRoute && !isLoggedIn) {
        return false; // → redirect to /auth/login
      }

      // Auth pages: redirect home if already logged in
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} as NextAuthConfig;
