import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/locales';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Si es la raíz, redirigir al idioma por defecto
  if (pathname === '/') {
    const newUrl = new URL(`/${defaultLocale}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Extraer el primer segmento de la ruta
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];

  // Verificar si el primer segmento es un locale válido
  const isValidLocale = locales.includes(firstSegment as any);

  // Si no es un locale válido, redirigir al idioma por defecto
  if (!isValidLocale) {
    // Detectar idioma del navegador (opcional, aquí usamos el default)
    const acceptLanguage = request.headers.get('accept-language') || '';
    let detectedLocale = defaultLocale;

    for (const locale of locales) {
      if (acceptLanguage.includes(locale)) {
        detectedLocale = locale;
        break;
      }
    }

    // Redirigir a la ruta con locale conservando el resto de la ruta
    const newUrl = new URL(`/${detectedLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Aplicar a todas las rutas excepto archivos estáticos, api y favicon
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
