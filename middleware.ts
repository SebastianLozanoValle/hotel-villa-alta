import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './src/lib/locales';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Verificar si el pathname ya tiene un locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Ignorar archivos en public, api routes, etc.
  if (
    pathname.includes('.') || 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/')
  ) {
    return;
  }

  // Redirigir a defaultLocale si no hay locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Omitir rutas internas de Next.js (_next)
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|images|.*\\..*).*)',
  ],
};
