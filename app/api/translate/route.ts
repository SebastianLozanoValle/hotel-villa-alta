import { NextResponse } from 'next/server';
import { translateText, type LanguageCode } from '@/lib/deepl';

export async function POST(request: Request) {
  try {
    const { text, targetLang, sourceLang } = await request.json();
    const translated = await translateText(text, targetLang as LanguageCode, sourceLang as LanguageCode);
    return NextResponse.json({ translated });
  } catch (error) {
    console.error('API Translate Error:', error);
    return NextResponse.json({ error: 'Error al traducir' }, { status: 500 });
  }
}
