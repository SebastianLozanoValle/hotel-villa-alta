# Villa Alta Guest House

Sitio web del Hotel Boutique Villa Alta Guest House en Cartagena de Indias, Colombia.

## 🚀 Tecnologías

- **Next.js 16.1.4** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **GSAP** - Animaciones
- **Multi-idioma** - Soporte para 11 idiomas

## 📦 Instalación

```bash
npm install
```

## 🛠️ Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Build para Producción

```bash
npm run build
npm start
```

## 🌍 Variables de Entorno

Crea un archivo `.env.local` con:

```env
NEXT_PUBLIC_APP_URL=https://hotelvillaalta.com
DEEPL_API_KEY=your-api-key (opcional, para traducciones)
```

## 📋 Características

- ✅ Diseño responsive
- ✅ Multi-idioma (11 idiomas)
- ✅ SEO optimizado
- ✅ Sitemap y robots.txt
- ✅ Imágenes optimizadas (Cloudbeds)
- ✅ Animaciones con GSAP
- ✅ Términos y Condiciones

## 🚢 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno `NEXT_PUBLIC_APP_URL`
3. Deploy automático en cada push

### Otros proveedores

El proyecto está listo para desplegarse en cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📝 Notas

- Las imágenes de Cloudbeds están configuradas en `next.config.ts`
- El sitemap incluye todas las rutas multi-idioma
- El build genera páginas estáticas para mejor rendimiento
