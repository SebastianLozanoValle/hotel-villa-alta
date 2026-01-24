import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/locales';

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 1. Si es la raíz, redirigir al idioma por defecto
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // 2. Extraer el primer segmento
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];

  // 3. Verificar si el locale es válido
  const isValidLocale = locales.includes(firstSegment as any);

  if (!isValidLocale) {
    // Redirigir al default conservando el path
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
