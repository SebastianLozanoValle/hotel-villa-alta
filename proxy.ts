import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Definimos locales directamente aquí para evitar importar archivos que puedan
// contener código no compatible con el Edge Runtime (como __dirname)
const locales = ['es', 'en', 'fr', 'de', 'it', 'pt'] as const;
const defaultLocale = 'es';

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 1. Si es la raíz, redirigir al idioma por defecto
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // 2. Extraer el primer segmento de la ruta
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];

  // 3. Verificar si el primer segmento es un locale válido
  const isValidLocale = locales.includes(firstSegment as any);

  // 4. Si no es un locale válido, redirigir al idioma por defecto
  if (!isValidLocale) {
    // Detectar idioma del navegador
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
    // Omitir rutas internas de Next.js (_next), archivos en public (favicon, etc) y API
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
