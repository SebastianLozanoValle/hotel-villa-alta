import { NextRequest, NextResponse } from 'next/server';
import { translateText, translateMultiple, type LanguageCode } from '@/src/lib/deepl';

// Headers de cache para Edge/CDN
const cacheHeaders = {
  'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
  'CDN-Cache-Control': 'public, s-maxage=86400',
  'Vary': 'Accept-Language',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, targetLang, sourceLang = 'es' } = body;

    if (!targetLang) {
      return NextResponse.json(
        { error: 'targetLang es requerido' },
        { status: 400 }
      );
    }

    if (texts && Array.isArray(texts)) {
      try {
        const translated = await translateMultiple(
          texts,
          targetLang as LanguageCode,
          sourceLang as LanguageCode
        );
        return NextResponse.json({ translated }, { headers: cacheHeaders });
      } catch (error) {
        return NextResponse.json({ translated: texts }, { headers: cacheHeaders });
      }
    } else if (text) {
      try {
        const translated = await translateText(
          text,
          targetLang as LanguageCode,
          sourceLang as LanguageCode
        );
        return NextResponse.json({ translated }, { headers: cacheHeaders });
      } catch (error) {
        return NextResponse.json({ translated: text }, { headers: cacheHeaders });
      }
    } else {
      return NextResponse.json(
        { error: 'text o texts es requerido' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error en API de traducción:', error);
    return NextResponse.json(
      { error: 'Error al traducir' },
      { status: 500 }
    );
  }
}
