import type { Messages } from "./es";

const fr: Messages = {
  common: {
    close: "Fermer",
    retry: "Réessayer",
    settings: "Paramètres",
    done: "Terminé",
    cancel: "Annuler",
    save: "Enregistrer",
    export: "Exporter",
    delete: "Supprimer",
  },

  header: {
    tagline: "Résumés de consultations par IA",
    settings: "Paramètres",
  },

  status: {
    idle: "Prêt",
    recording: "Enregistrement",
    transcribing: "Transcription",
    summarizing: "Résumé",
    done: "Résumé prêt",
  },

  language: {
    consultation: "Langue de la consultation",
    app: "Langue de l'app",
  },

  empty: {
    title: "Enregistreur de consultations",
    description: "Enregistrez ou importez la consultation et obtenez un résumé clinique structuré.",
    setupTitle: "Connectez votre IA",
    setupBody: "Collez la clé API de votre cabinet",
    setupPrivacy: "Elle reste sur cet appareil.",
    testMic: "Tester le micro",
    history: (count) => `Historique (${count})`,
    downloadApp: "Télécharger l'app",
  },

  upload: {
    title: "Audio d'un autre appareil ?",
    dragHint: "Glissez l'audio ou cliquez pour l'importer.",
    tapHint: "Touchez pour l'importer.",
    formats: (mb) => `MP3, M4A, WAV, OGG… jusqu'à ${mb} Mo.`,
    button: "Importer un audio",
  },

  tabs: {
    transcript: "Transcription",
    summary: "Résumé",
    history: "Historique",
  },

  toolbar: {
    exportSummary: "Exporter le résumé",
  },

  control: {
    hints: {
      idle: "Touchez pour enregistrer ou importez un audio",
      recording: "Touchez pour arrêter et générer le résumé",
      transcribing: "Transcription de l'audio…",
      summarizing: "Génération du résumé…",
      done: "Résumé généré",
    },
    saveAudio: "Enregistrer l'audio",
    newConsultation: "Nouvelle consultation",
    startRecording: "Démarrer l'enregistrement",
    stopRecording: "Arrêter l'enregistrement",
  },

  transcript: {
    listening: "À l'écoute... Commencez à parler.",
    recordingNoCaptions: "Enregistrement en cours. La transcription apparaîtra à la fin.",
    transcribingFile: (name) => `Transcription de « ${name} »...`,
    transcribingRecording: "Transcription de l'enregistrement...",
    idle: "Touchez le micro pour enregistrer ou importez un audio.",
  },

  busy: {
    transcribing: "Transcription de l'audio de la consultation…",
    summarizing: "Génération du résumé clinique…",
  },

  summary: {
    patient: "Patient",
    overview: "En bref",
    diagnosis: "Diagnostic",
    reason: "Motif de consultation",
    symptoms: "Symptômes",
    noSymptoms: "Aucun symptôme mentionné",
    findings: "Examen clinique",
    treatment: "Plan de traitement",
    medications: "Médicaments",
    noMedications: "Aucun médicament mentionné",
    followUp: "Suivi",
    notes: "Notes complémentaires",
  },

  history: {
    empty: "Aucune consultation enregistrée pour l'instant.",
    recorded: "Enregistrée",
    recordedInApp: "Enregistrée dans l'app",
    uploaded: "Audio importé",
    fullTranscript: "Transcription complète",
    confirmDelete: "Supprimer ? Touchez à nouveau",
  },

  micTest: {
    title: "Tester le micro",
    subtitle: "Rien n'est enregistré ni envoyé : nous mesurons seulement le son.",
    requesting: "Demande d'accès au micro…",
    speak: "Parlez ou dites quelque chose à voix haute…",
    heard: "Je vous entends ! Le micro fonctionne.",
    defaultDevice: "Micro par défaut",
    insecure: "Ce navigateur n'autorise pas le micro ici (HTTPS requis).",
  },

  credit: {
    madeWith: "Fait avec",
    love: "amour",
    by: "par",
  },

  settings: {
    title: "Paramètres",
    subtitle: "Langue, fournisseur d'IA et clé API de votre cabinet.",
    privacy:
      "MedScribe est gratuit : il fonctionne avec le compte d'IA de votre cabinet. Votre clé API est enregistrée **uniquement sur cet appareil** et l'audio des consultations va directement d'ici à votre fournisseur, sans passer par aucun serveur MedScribe.",
    transcription: "Transcription audio",
    transcriptionDescription: "Convertit l'enregistrement en texte.",
    summary: "Résumé clinique",
    summaryDescription: "Génère le résumé structuré à partir du texte.",
    apiKeys: "Clés API",
    tips: [
      "Pour les données de patients, utilisez une offre payante : avec les offres gratuites, certains fournisseurs peuvent utiliser les données pour entraîner leurs modèles. Consultez la politique de données de votre fournisseur.",
      "Définissez une limite de dépenses sur le compte du fournisseur pour éviter les mauvaises surprises.",
      "N'utilisez pas MedScribe sur des ordinateurs partagés sans fermer la session : la clé reste enregistrée dans ce navigateur.",
    ],
    clearKeys: "Supprimer les clés API de cet appareil",
  },

  models: {
    tags: {
      recommended: "recommandé",
      budget: "économique",
      accurate: "plus précis",
      fastBudget: "rapide et économique",
    },
    other: "Autre modèle…",
    provider: "fournisseur",
    model: "modèle",
    modelId: "ID du modèle",
    customPlaceholder: "ID exact du modèle, p. ex. gemini-3.6-flash",
  },

  apiKey: {
    label: (provider) => `Clé API ${provider}`,
    get: "Obtenir une clé",
    show: "Afficher la clé",
    hide: "Masquer la clé",
    verify: "Vérifier",
    verifying: "Vérification…",
    valid: "Clé valide",
    verifyFailed: "Impossible de vérifier la clé.",
  },

  errors: {
    invalidKey: "La clé API n'est pas valide. Vérifiez-la dans les Paramètres.",
    rejected: (detail) => `Le fournisseur a refusé la requête : ${detail}`,
    unauthorized:
      "La clé API n'est pas valide ou n'a pas les autorisations. Vérifiez-la dans les Paramètres.",
    modelNotFound:
      "Le modèle choisi n'existe pas ou votre compte n'y a pas accès. Changez de modèle dans les Paramètres.",
    audioTooLargeForProvider: "L'audio est trop volumineux pour ce fournisseur.",
    rateLimited:
      "Le compte du fournisseur a atteint sa limite d'utilisation ou de crédit. Patientez un instant ou vérifiez votre facturation.",
    overloaded: "Le fournisseur est surchargé en ce moment. Touchez Réessayer dans quelques secondes.",
    offline: "Pas de connexion avec le fournisseur. Vérifiez votre connexion internet.",
    transcribeFailed: "Impossible de transcrire l'audio.",
    summarizeFailed: "Impossible de générer le résumé.",
    missingKey: (provider) => `La clé API ${provider} est manquante. Ajoutez-la dans les Paramètres.`,
    cannotTranscribe: (provider) => `${provider} ne peut pas transcrire l'audio.`,
    unknownProvider: (id) => `Fournisseur inconnu : ${id}`,
    keyInvalidFor: (provider) => `La clé API ${provider} n'est pas valide.`,
    cannotReach: (provider) =>
      `Impossible de contacter ${provider}. Vérifiez votre connexion internet.`,
    providerError: (provider, status) => `${provider} a renvoyé une erreur (${status}).`,
    unsupportedFormat: "Format non pris en charge. Utilisez MP3, M4A, WAV, OGG, OPUS, WEBM, AAC ou FLAC.",
    fileTooLarge: (mb) => `Le fichier dépasse la limite de ${mb} Mo.`,
    noAudio: "Aucun audio n'a été capturé. Réessayez.",
    micUnavailable: "Impossible d'accéder au micro.",
  },

  mic: {
    insecureContext: "Le micro ne fonctionne qu'en HTTPS ou sur localhost. Ouvrez l'app avec https://.",
    unsupported:
      "Ce navigateur ne peut pas enregistrer l'audio. Utilisez Chrome, Edge, Firefox ou Safari à jour, ou importez un audio.",
    denied: "Accès au micro refusé. Autorisez-le depuis l'icône du cadenas dans la barre d'adresse.",
    notFound: "Aucun micro n'a été trouvé.",
    busy: "Le micro est utilisé par une autre application. Fermez-la et réessayez.",
    generic: (detail) => `Impossible d'accéder au micro${detail ? ` : ${detail}` : "."}`,
    androidDenied:
      "Autorisation du micro refusée. Activez-la dans Paramètres → Applis → MedScribe → Autorisations.",
    androidStartFailed: (detail) =>
      `Impossible de démarrer l'enregistrement${detail ? ` : ${detail}` : "."}`,
  },

  export: {
    heading: "RÉSUMÉ DE CONSULTATION MÉDICALE",
    generatedBy: "Généré par MedScribe",
    date: "Date",
    patient: "PATIENT",
    name: "Nom",
    age: "Âge",
    sex: "Sexe",
    otherData: "Autres données",
    overview: "EN BREF",
    reason: "MOTIF DE CONSULTATION",
    symptoms: "SYMPTÔMES",
    findings: "EXAMEN CLINIQUE",
    diagnosis: "DIAGNOSTIC",
    treatment: "PLAN DE TRAITEMENT",
    medications: "MÉDICAMENTS",
    followUp: "SUIVI",
    notes: "NOTES COMPLÉMENTAIRES",
    transcript: "TRANSCRIPTION COMPLÈTE",
    fileName: "consultation",
    textFiles: "Texte",
    audioFiles: "Audio",
  },

  downloads: {
    title: "Installer MedScribe",
    intro:
      "Enregistrez ou importez la consultation et obtenez un résumé clinique structuré. Gratuit : fonctionne avec le compte d'IA de votre cabinet.",
    macSoon:
      "La version Mac arrive bientôt. En attendant, MedScribe fonctionne entièrement dans le navigateur.",
    useInBrowser: "Utiliser dans le navigateur",
    yourDevice: "Votre appareil",
    openApp: "Ouvrir MedScribe",
    windows: {
      title: "Windows",
      requirement: "Windows 10 ou 11 · 64 bits · ~2 Mo",
      button: "Télécharger pour Windows",
      steps: [
        "Ouvrez le fichier **MedScribe-Windows-setup.exe** téléchargé.",
        "Si _« Windows a protégé votre ordinateur »_ apparaît, cliquez sur **Informations complémentaires** → **Exécuter quand même**. Ce message s'affiche car l'app est récente et n'a pas encore de signature commerciale.",
        "Elle s'installe uniquement pour votre utilisateur, sans demander de droits d'administrateur.",
        "Ouvrez MedScribe depuis le menu Démarrer et connectez votre fournisseur d'IA.",
      ],
    },
    android: {
      title: "Android",
      requirement: "Android 7 ou ultérieur · ~4 Mo",
      button: "Télécharger l'APK pour Android",
      steps: [
        "Ouvrez le fichier **MedScribe-Android.apk** depuis vos téléchargements.",
        "Si demandé, autorisez **Installer des applis inconnues** pour votre navigateur puis revenez en arrière.",
        "Touchez **Installer**.",
        "Au premier enregistrement, autorisez le micro et les notifications : l'enregistrement continue même écran verrouillé.",
      ],
      verifyTitle: "Vérifier que l'APK est authentique",
      verifyBody: "Empreinte SHA-256 du certificat de signature :",
    },
    ios: {
      title: "iPhone et iPad",
      requirement: "iOS 16.4 ou ultérieur · s'installe depuis Safari",
      steps: [
        "Ouvrez cette page dans **Safari** et touchez **Ouvrir MedScribe**.",
        "Touchez le bouton **Partager** (le carré avec la flèche vers le haut).",
        "Choisissez **Sur l'écran d'accueil** → **Ajouter**.",
        "Ouvrez MedScribe depuis l'icône. Pendant l'enregistrement, laissez l'écran allumé : l'app l'empêche de s'éteindre tout seul.",
      ],
      footnote:
        "Apple ne permet pas d'installer des apps téléchargées depuis un site web ; c'est la voie officielle et gratuite.",
    },
    privacy:
      "Vos clés API sont enregistrées uniquement sur votre appareil et l'audio va directement à votre fournisseur d'IA. MedScribe n'a aucun serveur qui voit les données de vos patients.",
    allReleases: "Toutes les versions et checksums",
  },
};

export default fr;
