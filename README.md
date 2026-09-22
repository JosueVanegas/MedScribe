# MedScribe

Graba (o sube) el audio de una consulta médica y obtén un resumen clínico estructurado.

**Gratis y sin servidor:** cada clínica conecta su propio proveedor de IA (Google Gemini, OpenAI, Anthropic Claude, Groq o Mistral AI) con su propia API key. La key se guarda solo en el dispositivo y el audio viaja directamente del dispositivo al proveedor; no pasa por ningún servidor de MedScribe.

## Desarrollo

```bash
npm install
npm run dev
```

Abre la app, pulsa el engranaje ⚙ y pega una API key. No hace falta ningún `.env`.

> El micrófono solo funciona en `https://` o `localhost`. Para probar desde el móvil en tu red local: `npm run dev -- --experimental-https`.

## Build y despliegue

```bash
npm run build   # genera un sitio 100% estático en out/
```

`out/` se puede publicar gratis en Cloudflare Pages, Netlify, GitHub Pages o cualquier hosting estático (debe servirse por HTTPS). Es una PWA: se puede instalar en Android, iOS ("Añadir a pantalla de inicio"), Windows y macOS.

## Arquitectura

```
src/core/            Lógica sin dependencias de UI (funciona en navegador, Node o app nativa)
  consultation/      Contratos (AudioTranscriber, ConsultationSummarizer), prompt y esquema
  ai/providers/      Un archivo por proveedor + registro en index.ts
  ai/                Adaptadores del AI SDK, ajustes, fábrica de servicios y errores
src/lib/             Grabadora, subtítulos en vivo, API de consulta, almacenamiento, exportación
src/hooks/           Estado de React (flujo de consulta, historial, ajustes)
src/components/      UI
```

### Añadir un proveedor

1. `npm i @ai-sdk/<proveedor>`
2. Crea `src/core/ai/providers/<proveedor>.ts` implementando `ProviderDefinition` (modelos, cómo crear el cliente con la key y cómo verificarla).
3. Añádelo a la lista de `src/core/ai/providers/index.ts`.

La UI de configuración, la CSP y el resto de la app lo recogen automáticamente.
