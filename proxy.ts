import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/locales';

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 1. Si es la raíz, redirigir al idioma por defecto
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // 2. Extraer el primer segmento de la ruta
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. Si no tiene locale y no es un archivo público/api, redirigir
  if (pathnameIsMissingLocale) {
    const locale = defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Omitir rutas internas de Next.js (_next), archivos en public (favicon, etc) y API
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
