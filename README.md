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

## Publicar una versión

Los instaladores (Windows `.exe` y Android `.apk` firmado) los compila GitHub Actions y se publican en *Releases*. La página `/descargar` siempre enlaza a la última versión.

### Primera vez (solo una vez)

**1. Guardar la clave de firma de Android en GitHub.** Sin esto el APK no se puede firmar.

Copiar la clave al portapapeles (PowerShell):

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\Users\josue\claves\medscribe-release.jks")) | Set-Clipboard
```

En el repositorio: **Settings → Secrets and variables → Actions → New repository secret**, crear:

| Nombre | Valor |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Pegar lo copiado (Ctrl+V) |
| `ANDROID_KEYSTORE_PASSWORD` | Contraseña de la clave |
| `ANDROID_KEY_ALIAS` | `medscribe` |
| `ANDROID_KEY_PASSWORD` | Contraseña de la clave |

> La clave (`medscribe-release.jks`) y su contraseña deben tener copia de seguridad fuera del PC. Si se pierden, no se pueden publicar actualizaciones de Android.

**2. Publicar la web en Vercel.** En [vercel.com/new](https://vercel.com/new) importar el repositorio y pulsar **Deploy**, sin variables de entorno ni cambios de configuración. Cada push a `main` vuelve a desplegar la web automáticamente.

### Publicar

Con todos los cambios ya en un commit:

```bash
npm run release            # publica la versión que ya está en package.json (la primera: 1.0.0)
npm run release -- 1.0.1   # sube a 1.0.1, hace el commit y la publica
```

El comando crea la etiqueta `vX.Y.Z` y la sube. GitHub compila los instaladores en ~10-15 minutos (pestaña **Actions**) y los publica en **Releases**. Hasta la primera publicación, los botones de `/descargar` dan 404.

Para cada actualización, subir el número: `1.0.1`, `1.0.2`… (o `1.1.0` si hay novedades grandes). El comando no publica si hay cambios sin commit, si el número ya existe o si no tiene el formato `X.Y.Z`.

Si un paso sale en rojo en **Actions**, abrirlo para ver el error; normalmente es un secret que falta o está mal copiado.

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
