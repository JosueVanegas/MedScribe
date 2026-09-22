import type { Messages } from "./es";

const it: Messages = {
  common: {
    close: "Chiudi",
    retry: "Riprova",
    settings: "Impostazioni",
    done: "Fatto",
    cancel: "Annulla",
    save: "Salva",
    export: "Esporta",
    delete: "Elimina",
  },

  header: {
    tagline: "Riassunti delle visite con l'IA",
    settings: "Impostazioni",
  },

  status: {
    idle: "Pronto",
    recording: "Registrazione",
    transcribing: "Trascrizione",
    summarizing: "Riassunto",
    done: "Riassunto pronto",
  },

  language: {
    consultation: "Lingua della visita",
    app: "Lingua dell'app",
  },

  empty: {
    title: "Registratore di visite",
    description: "Registra la visita o carica un audio e ottieni un riassunto clinico strutturato.",
    setupTitle: "Collega il tuo provider di IA",
    setupBody: "Incolla la chiave API della clinica",
    setupPrivacy: "Resta solo su questo dispositivo.",
    testMic: "Prova microfono",
    history: (count) => `Cronologia (${count})`,
    downloadApp: "Scarica l'app",
  },

  upload: {
    title: "Audio da un altro dispositivo?",
    dragHint: "Trascina l'audio o fai clic per caricarlo.",
    tapHint: "Tocca per caricarlo.",
    formats: (mb) => `MP3, M4A, WAV, OGG… fino a ${mb} MB.`,
    button: "Carica audio",
  },

  tabs: {
    transcript: "Trascrizione",
    summary: "Riassunto",
    history: "Cronologia",
  },

  toolbar: {
    exportSummary: "Esporta riassunto",
  },

  control: {
    hints: {
      idle: "Tocca per registrare o carica un audio",
      recording: "Tocca per fermare e generare il riassunto",
      transcribing: "Trascrizione dell'audio…",
      summarizing: "Generazione del riassunto…",
      done: "Riassunto generato",
    },
    saveAudio: "Salva audio",
    newConsultation: "Nuova visita",
    startRecording: "Avvia registrazione",
    stopRecording: "Ferma registrazione",
  },

  transcript: {
    listening: "In ascolto... Inizia a parlare.",
    recordingNoCaptions: "Registrazione in corso. La trascrizione apparirà alla fine.",
    transcribingFile: (name) => `Trascrizione di "${name}"...`,
    transcribingRecording: "Trascrizione della registrazione...",
    idle: "Tocca il microfono per registrare o carica un audio.",
  },

  busy: {
    transcribing: "Trascrizione dell'audio della visita…",
    summarizing: "Generazione del riassunto clinico…",
  },

  summary: {
    patient: "Paziente",
    overview: "In sintesi",
    diagnosis: "Diagnosi",
    reason: "Motivo della visita",
    symptoms: "Sintomi",
    noSymptoms: "Nessun sintomo menzionato",
    findings: "Reperti",
    treatment: "Piano terapeutico",
    medications: "Farmaci",
    noMedications: "Nessun farmaco menzionato",
    followUp: "Follow-up",
    notes: "Note aggiuntive",
  },

  history: {
    empty: "Non ci sono ancora visite salvate.",
    recorded: "Registrata",
    recordedInApp: "Registrata nell'app",
    uploaded: "Audio caricato",
    fullTranscript: "Trascrizione completa",
    confirmDelete: "Eliminare? Tocca di nuovo",
  },

  micTest: {
    title: "Prova microfono",
    subtitle: "Niente viene registrato né inviato: misuriamo solo il suono.",
    requesting: "Richiesta di accesso al microfono…",
    speak: "Parla o di' qualcosa ad alta voce…",
    heard: "Ti sento! Il microfono funziona.",
    defaultDevice: "Microfono predefinito",
    insecure: "Questo browser non consente di usare il microfono qui (serve HTTPS).",
  },

  credit: {
    madeWith: "Fatto con",
    love: "amore",
    by: "da",
  },

  settings: {
    title: "Impostazioni",
    subtitle: "Lingua, provider di IA e chiave API della tua clinica.",
    privacy:
      "MedScribe è gratuito: funziona con l'account di IA della tua clinica. La tua chiave API viene salvata **solo su questo dispositivo** e l'audio delle visite va direttamente da qui al tuo provider, senza passare da alcun server di MedScribe.",
    transcription: "Trascrizione audio",
    transcriptionDescription: "Converte la registrazione in testo.",
    summary: "Riassunto clinico",
    summaryDescription: "Genera il riassunto strutturato a partire dal testo.",
    apiKeys: "Chiavi API",
    tips: [
      "Per i dati dei pazienti usa un piano a pagamento: nei piani gratuiti alcuni provider possono usare i dati per addestrare i loro modelli. Controlla l'informativa sui dati del tuo provider.",
      "Imposta un limite di spesa nell'account del provider per evitare sorprese in fattura.",
      "Non usare MedScribe su computer condivisi senza uscire dalla sessione: la chiave resta salvata in questo browser.",
    ],
    clearKeys: "Elimina le chiavi API da questo dispositivo",
  },

  models: {
    tags: {
      recommended: "consigliato",
      budget: "economico",
      accurate: "più preciso",
      fastBudget: "veloce ed economico",
    },
    other: "Altro modello…",
    provider: "provider",
    model: "modello",
    modelId: "ID del modello",
    customPlaceholder: "ID esatto del modello, es. gemini-3.6-flash",
  },

  apiKey: {
    label: (provider) => `Chiave API di ${provider}`,
    get: "Ottieni chiave",
    show: "Mostra chiave",
    hide: "Nascondi chiave",
    verify: "Verifica",
    verifying: "Verifica in corso…",
    valid: "Chiave valida",
    verifyFailed: "Impossibile verificare la chiave.",
  },

  errors: {
    invalidKey: "La chiave API non è valida. Controllala nelle Impostazioni.",
    rejected: (detail) => `Il provider ha rifiutato la richiesta: ${detail}`,
    unauthorized: "La chiave API non è valida o non ha i permessi. Controllala nelle Impostazioni.",
    modelNotFound:
      "Il modello scelto non esiste o il tuo account non vi ha accesso. Cambia modello nelle Impostazioni.",
    audioTooLargeForProvider: "L'audio è troppo grande per questo provider.",
    rateLimited:
      "L'account del provider ha raggiunto il limite di utilizzo o di credito. Attendi un momento o controlla la fatturazione.",
    overloaded: "Il provider è sovraccarico in questo momento. Tocca Riprova tra qualche secondo.",
    offline: "Nessuna connessione con il provider. Controlla la tua connessione internet.",
    transcribeFailed: "Impossibile trascrivere l'audio.",
    summarizeFailed: "Impossibile generare il riassunto.",
    missingKey: (provider) => `Manca la chiave API di ${provider}. Aggiungila nelle Impostazioni.`,
    cannotTranscribe: (provider) => `${provider} non può trascrivere audio.`,
    unknownProvider: (id) => `Provider sconosciuto: ${id}`,
    keyInvalidFor: (provider) => `La chiave API di ${provider} non è valida.`,
    cannotReach: (provider) =>
      `Impossibile contattare ${provider}. Controlla la tua connessione internet.`,
    providerError: (provider, status) => `${provider} ha risposto con un errore (${status}).`,
    unsupportedFormat: "Formato non supportato. Usa MP3, M4A, WAV, OGG, OPUS, WEBM, AAC o FLAC.",
    fileTooLarge: (mb) => `Il file supera il limite di ${mb} MB.`,
    noAudio: "Nessun audio registrato. Riprova.",
    micUnavailable: "Impossibile accedere al microfono.",
  },

  mic: {
    insecureContext: "Il microfono funziona solo su HTTPS o su localhost. Apri l'app con https://.",
    unsupported:
      "Questo browser non può registrare audio. Usa Chrome, Edge, Firefox o Safari aggiornati, oppure carica un audio.",
    denied: "Accesso al microfono negato. Consentilo dall'icona del lucchetto nella barra degli indirizzi.",
    notFound: "Nessun microfono trovato.",
    busy: "Il microfono è in uso da un'altra app. Chiudila e riprova.",
    generic: (detail) => `Impossibile accedere al microfono${detail ? `: ${detail}` : "."}`,
    androidDenied:
      "Permesso del microfono negato. Attivalo in Impostazioni → App → MedScribe → Autorizzazioni.",
    androidStartFailed: (detail) =>
      `Impossibile avviare la registrazione${detail ? `: ${detail}` : "."}`,
  },

  export: {
    heading: "RIASSUNTO DELLA VISITA MEDICA",
    generatedBy: "Generato da MedScribe",
    date: "Data",
    patient: "PAZIENTE",
    name: "Nome",
    age: "Età",
    sex: "Sesso",
    otherData: "Altri dati",
    overview: "IN SINTESI",
    reason: "MOTIVO DELLA VISITA",
    symptoms: "SINTOMI",
    findings: "REPERTI",
    diagnosis: "DIAGNOSI",
    treatment: "PIANO TERAPEUTICO",
    medications: "FARMACI",
    followUp: "FOLLOW-UP",
    notes: "NOTE AGGIUNTIVE",
    transcript: "TRASCRIZIONE COMPLETA",
    fileName: "visita",
    textFiles: "Testo",
    audioFiles: "Audio",
  },

  downloads: {
    title: "Installa MedScribe",
    intro:
      "Registra o carica la visita e ottieni un riassunto clinico strutturato. Gratis: funziona con l'account di IA della tua clinica.",
    macSoon:
      "La versione per Mac arriverà presto. Nel frattempo, MedScribe funziona completamente nel browser.",
    useInBrowser: "Usa nel browser",
    yourDevice: "Il tuo dispositivo",
    openApp: "Apri MedScribe",
    windows: {
      title: "Windows",
      requirement: "Windows 10 o 11 · 64 bit · ~2 MB",
      button: "Scarica per Windows",
      steps: [
        "Apri il file **MedScribe-Windows-setup.exe** scaricato.",
        "Se compare _“PC protetto da Windows”_, fai clic su **Ulteriori informazioni** → **Esegui comunque**. Appare perché l'app è nuova e non ha ancora una firma commerciale.",
        "Si installa solo per il tuo utente, senza chiedere permessi di amministratore.",
        "Apri MedScribe dal menu Start e collega il tuo provider di IA.",
      ],
    },
    android: {
      title: "Android",
      requirement: "Android 7 o successivo · ~4 MB",
      button: "Scarica l'APK per Android",
      steps: [
        "Apri il file **MedScribe-Android.apk** dai download.",
        "Se richiesto, consenti **Installa app sconosciute** per il tuo browser e torna indietro.",
        "Tocca **Installa**.",
        "Alla prima registrazione, consenti microfono e notifiche: la registrazione continua anche con lo schermo bloccato.",
      ],
      verifyTitle: "Verifica che l'APK sia autentico",
      verifyBody: "Impronta SHA-256 del certificato di firma:",
    },
    ios: {
      title: "iPhone e iPad",
      requirement: "iOS 16.4 o successivo · si installa da Safari",
      steps: [
        "Apri questa pagina in **Safari** e tocca **Apri MedScribe**.",
        "Tocca il pulsante **Condividi** (il quadrato con la freccia verso l'alto).",
        "Scegli **Aggiungi alla schermata Home** → **Aggiungi**.",
        "Apri MedScribe dall'icona. Durante la registrazione lascia lo schermo acceso: l'app evita che si spenga da solo.",
      ],
      footnote:
        "Apple non consente di installare app scaricate da un sito web; questa è la via ufficiale e gratuita.",
    },
    privacy:
      "Le tue chiavi API sono salvate solo sul tuo dispositivo e l'audio va direttamente al tuo provider di IA. MedScribe non ha server che vedono i dati dei tuoi pazienti.",
    allReleases: "Tutte le versioni e i checksum",
  },
};

export default it;
