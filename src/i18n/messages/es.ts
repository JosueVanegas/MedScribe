/**
 * Spanish (default). This file defines the shape every other language must
 * match. `**bold**` and `_italic_` are rendered by <Rich>.
 */
const es = {
  common: {
    close: "Cerrar",
    retry: "Reintentar",
    settings: "Configuración",
    done: "Listo",
    cancel: "Cancelar",
    save: "Guardar",
    export: "Exportar",
    delete: "Eliminar",
  },

  header: {
    tagline: "Resumen de consultas con IA",
    settings: "Configuración",
  },

  status: {
    idle: "Listo",
    recording: "Grabando",
    transcribing: "Transcribiendo",
    summarizing: "Resumiendo",
    done: "Resumen listo",
  },

  language: {
    consultation: "Idioma de la consulta",
    app: "Idioma de la app",
  },

  empty: {
    title: "Grabador de consultas",
    description:
      "Graba la consulta o sube un audio y obtén un resumen clínico estructurado.",
    setupTitle: "Conecta tu proveedor de IA",
    setupBody: "Pega la API key de tu clínica",
    setupPrivacy: "Solo se guarda en este dispositivo.",
    testMic: "Probar micrófono",
    history: (count: number) => `Historial (${count})`,
    downloadApp: "Descargar app",
  },

  upload: {
    title: "¿Grabaste con otro dispositivo?",
    dragHint: "Arrastra el audio o pulsa para subirlo.",
    tapHint: "Pulsa para subirlo.",
    formats: (mb: number) => `MP3, M4A, WAV, OGG… hasta ${mb} MB.`,
    button: "Subir audio",
  },

  tabs: {
    transcript: "Transcripción",
    summary: "Resumen",
    history: "Historial",
  },

  toolbar: {
    exportSummary: "Exportar resumen",
  },

  control: {
    hints: {
      idle: "Pulsa para grabar o sube un audio",
      recording: "Pulsa para detener y generar el resumen",
      transcribing: "Transcribiendo audio…",
      summarizing: "Generando resumen…",
      done: "Resumen generado",
    },
    saveAudio: "Guardar audio",
    newConsultation: "Nueva consulta",
    startRecording: "Comenzar grabación",
    stopRecording: "Detener grabación",
  },

  transcript: {
    listening: "Escuchando... Comienza a hablar.",
    recordingNoCaptions: "Grabando audio. La transcripción aparecerá al terminar.",
    transcribingFile: (name: string) => `Transcribiendo "${name}"...`,
    transcribingRecording: "Transcribiendo la grabación...",
    idle: "Pulsa el micrófono para grabar o sube un audio.",
  },

  busy: {
    transcribing: "Transcribiendo el audio de la consulta…",
    summarizing: "Generando el resumen clínico…",
  },

  summary: {
    patient: "Paciente",
    overview: "En resumen",
    diagnosis: "Diagnóstico",
    reason: "Motivo de consulta",
    symptoms: "Síntomas",
    noSymptoms: "No se mencionaron síntomas",
    findings: "Hallazgos",
    treatment: "Plan de tratamiento",
    medications: "Medicación",
    noMedications: "No se mencionaron medicamentos",
    followUp: "Seguimiento",
    notes: "Notas adicionales",
  },

  history: {
    empty: "No hay consultas guardadas todavía.",
    recorded: "Grabada",
    recordedInApp: "Grabada en la app",
    uploaded: "Audio subido",
    fullTranscript: "Transcripción completa",
    confirmDelete: "¿Eliminar? Pulsa otra vez",
  },

  micTest: {
    title: "Probar micrófono",
    subtitle: "Nada se graba ni se envía: solo medimos el sonido.",
    requesting: "Pidiendo acceso al micrófono…",
    speak: "Habla o di algo en voz alta…",
    heard: "¡Te escucho! El micrófono funciona.",
    defaultDevice: "Micrófono predeterminado",
    insecure: "Este navegador no permite usar el micrófono aquí (hace falta HTTPS).",
  },

  credit: {
    madeWith: "Hecho con",
    love: "amor",
    by: "por",
  },

  settings: {
    title: "Configuración",
    subtitle: "Idioma, proveedor de IA y la API key de tu clínica.",
    privacy:
      "MedScribe es gratuito: funciona con la cuenta de IA de tu clínica. Tu API key se guarda **solo en este dispositivo** y el audio de las consultas viaja directamente de aquí a tu proveedor, sin pasar por ningún servidor de MedScribe.",
    transcription: "Transcripción de audio",
    transcriptionDescription: "Convierte la grabación en texto.",
    summary: "Resumen clínico",
    summaryDescription: "Genera el resumen estructurado a partir del texto.",
    apiKeys: "API keys",
    tips: [
      "Para datos de pacientes usa un plan de pago: en planes gratuitos algunos proveedores pueden usar los datos para entrenar sus modelos. Revisa la política de datos de tu proveedor.",
      "Configura un límite de gasto en la cuenta del proveedor para evitar sorpresas en la factura.",
      "No uses MedScribe en equipos compartidos sin cerrar sesión del sistema: la key queda guardada en este navegador.",
    ],
    clearKeys: "Borrar las API keys de este dispositivo",
  },

  models: {
    tags: {
      recommended: "recomendado",
      budget: "económico",
      accurate: "más preciso",
      fastBudget: "rápido y económico",
    },
    other: "Otro modelo…",
    provider: "proveedor",
    model: "modelo",
    modelId: "ID del modelo",
    customPlaceholder: "ID exacto del modelo, p. ej. gemini-3.6-flash",
  },

  apiKey: {
    label: (provider: string) => `API key de ${provider}`,
    get: "Obtener key",
    show: "Mostrar key",
    hide: "Ocultar key",
    verify: "Verificar",
    verifying: "Verificando…",
    valid: "Key válida",
    verifyFailed: "No se pudo verificar la key.",
  },

  errors: {
    invalidKey: "La API key no es válida. Revísala en Configuración.",
    rejected: (detail: string) => `El proveedor rechazó la petición: ${detail}`,
    unauthorized: "La API key no es válida o no tiene permisos. Revísala en Configuración.",
    modelNotFound:
      "El modelo elegido no existe o tu cuenta no tiene acceso. Cambia de modelo en Configuración.",
    audioTooLargeForProvider: "El audio es demasiado grande para este proveedor.",
    rateLimited:
      "Se alcanzó el límite de uso o saldo de tu cuenta del proveedor. Espera un momento o revisa tu facturación.",
    overloaded: "El proveedor está saturado en este momento. Pulsa Reintentar en unos segundos.",
    offline: "Sin conexión con el proveedor. Revisa tu internet.",
    transcribeFailed: "No se pudo transcribir el audio.",
    summarizeFailed: "No se pudo generar el resumen.",
    missingKey: (provider: string) => `Falta la API key de ${provider}. Añádela en Configuración.`,
    cannotTranscribe: (provider: string) => `${provider} no puede transcribir audio.`,
    unknownProvider: (id: string) => `Proveedor desconocido: ${id}`,
    keyInvalidFor: (provider: string) => `La API key de ${provider} no es válida.`,
    cannotReach: (provider: string) =>
      `No se pudo contactar con ${provider}. Revisa tu conexión a internet.`,
    providerError: (provider: string, status: number) =>
      `${provider} respondió con un error (${status}).`,
    unsupportedFormat: "Formato no soportado. Usa MP3, M4A, WAV, OGG, OPUS, WEBM, AAC o FLAC.",
    fileTooLarge: (mb: number) => `El archivo supera el límite de ${mb} MB.`,
    noAudio: "No se capturó audio. Intenta de nuevo.",
    micUnavailable: "No se pudo acceder al micrófono.",
  },

  mic: {
    insecureContext:
      "El micrófono solo funciona en HTTPS o en localhost. Abre la app con https://.",
    unsupported:
      "Este navegador no permite grabar audio. Usa Chrome, Edge, Firefox o Safari actualizados, o sube un audio.",
    denied:
      "Acceso al micrófono denegado. Permítelo desde el icono del candado en la barra de direcciones.",
    notFound: "No se encontró ningún micrófono conectado.",
    busy: "El micrófono está en uso por otra aplicación. Ciérrala e inténtalo de nuevo.",
    generic: (detail: string) => `No se pudo acceder al micrófono${detail ? `: ${detail}` : "."}`,
    androidDenied:
      "Permiso de micrófono denegado. Actívalo en Ajustes → Apps → MedScribe → Permisos.",
    androidStartFailed: (detail: string) =>
      `No se pudo iniciar la grabación${detail ? `: ${detail}` : "."}`,
  },

  export: {
    heading: "RESUMEN DE CONSULTA MÉDICA",
    generatedBy: "Generado por MedScribe",
    date: "Fecha",
    patient: "PACIENTE",
    name: "Nombre",
    age: "Edad",
    sex: "Sexo",
    otherData: "Otros datos",
    overview: "EN RESUMEN",
    reason: "MOTIVO DE CONSULTA",
    symptoms: "SÍNTOMAS",
    findings: "HALLAZGOS",
    diagnosis: "DIAGNÓSTICO",
    treatment: "PLAN DE TRATAMIENTO",
    medications: "MEDICACIÓN",
    followUp: "SEGUIMIENTO",
    notes: "NOTAS ADICIONALES",
    transcript: "TRANSCRIPCIÓN COMPLETA",
    fileName: "consulta",
    textFiles: "Texto",
    audioFiles: "Audio",
  },

  downloads: {
    title: "Instala MedScribe",
    intro:
      "Graba o sube la consulta y obtén un resumen clínico estructurado. Gratis: funciona con la cuenta de IA de tu clínica.",
    macSoon:
      "La versión para Mac llegará pronto. Mientras tanto, MedScribe funciona completo en el navegador.",
    useInBrowser: "Usar en el navegador",
    yourDevice: "Tu dispositivo",
    openApp: "Abrir MedScribe",
    windows: {
      title: "Windows",
      requirement: "Windows 10 u 11 · 64 bits · ~2 MB",
      button: "Descargar para Windows",
      steps: [
        "Abre el archivo **MedScribe-Windows-setup.exe** descargado.",
        "Si aparece _“Windows protegió tu PC”_, pulsa **Más información** → **Ejecutar de todas formas**. Sale porque la app es nueva y todavía no tiene firma comercial.",
        "Se instala solo para tu usuario, sin pedir permisos de administrador.",
        "Abre MedScribe desde el menú Inicio y conecta tu proveedor de IA.",
      ],
    },
    android: {
      title: "Android",
      requirement: "Android 7 o superior · ~4 MB",
      button: "Descargar APK para Android",
      steps: [
        "Abre el archivo **MedScribe-Android.apk** desde las descargas.",
        "Si lo pide, permite **Instalar apps desconocidas** para tu navegador y vuelve atrás.",
        "Pulsa **Instalar**.",
        "Al grabar por primera vez, acepta el micrófono y las notificaciones: la grabación continúa aunque bloquees la pantalla.",
      ],
      verifyTitle: "Verificar que el APK es auténtico",
      verifyBody: "Huella SHA-256 del certificado de firma:",
    },
    ios: {
      title: "iPhone y iPad",
      requirement: "iOS 16.4 o superior · se instala desde Safari",
      steps: [
        "Abre esta página en **Safari** y pulsa **Abrir MedScribe**.",
        "Toca el botón **Compartir** (el cuadrado con la flecha hacia arriba).",
        "Elige **Añadir a pantalla de inicio** → **Añadir**.",
        "Abre MedScribe desde el icono. Mientras grabas, deja la pantalla encendida: la app evita que se apague sola.",
      ],
      footnote:
        "Apple no permite instalar apps descargadas desde una web; esta es la vía oficial y gratuita.",
    },
    privacy:
      "Tus API keys se guardan solo en tu dispositivo y el audio viaja directamente a tu proveedor de IA. MedScribe no tiene servidores que vean los datos de tus pacientes.",
    allReleases: "Todas las versiones y checksums",
  },
};

export type Messages = typeof es;
export default es;
