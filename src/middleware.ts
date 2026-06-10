import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { NextResponse, type NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default function middleware(request: NextRequest) {
  // Force HTTPS in production — Railway terminates SSL at the edge and
  // forwards requests internally over HTTP with x-forwarded-proto: http.
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto');
    if (proto === 'http') {
      const url = request.nextUrl.clone();
      url.protocol = 'https:';
      url.port = '';
      return NextResponse.redirect(url, 301);
    }
  }

  // Auth middleware — delegates to `authorized` callback in auth.config.ts
  return (auth as any)(request);
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|imgs|products|public).*)',
  ],
};
