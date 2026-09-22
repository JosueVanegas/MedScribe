import type { Messages } from "./es";

const en: Messages = {
  common: {
    close: "Close",
    retry: "Retry",
    settings: "Settings",
    done: "Done",
    cancel: "Cancel",
    save: "Save",
    export: "Export",
    delete: "Delete",
  },

  header: {
    tagline: "AI consultation summaries",
    settings: "Settings",
  },

  status: {
    idle: "Ready",
    recording: "Recording",
    transcribing: "Transcribing",
    summarizing: "Summarizing",
    done: "Summary ready",
  },

  language: {
    consultation: "Consultation language",
    app: "App language",
  },

  empty: {
    title: "Consultation recorder",
    description: "Record the consultation or upload audio and get a structured clinical summary.",
    setupTitle: "Connect your AI provider",
    setupBody: "Paste your clinic's API key",
    setupPrivacy: "It's only stored on this device.",
    testMic: "Test microphone",
    history: (count) => `History (${count})`,
    downloadApp: "Download app",
  },

  upload: {
    title: "Recorded on another device?",
    dragHint: "Drop the audio here or click to upload it.",
    tapHint: "Tap to upload it.",
    formats: (mb) => `MP3, M4A, WAV, OGG… up to ${mb} MB.`,
    button: "Upload audio",
  },

  tabs: {
    transcript: "Transcript",
    summary: "Summary",
    history: "History",
  },

  toolbar: {
    exportSummary: "Export summary",
  },

  control: {
    hints: {
      idle: "Tap to record or upload audio",
      recording: "Tap to stop and generate the summary",
      transcribing: "Transcribing audio…",
      summarizing: "Generating summary…",
      done: "Summary generated",
    },
    saveAudio: "Save audio",
    newConsultation: "New consultation",
    startRecording: "Start recording",
    stopRecording: "Stop recording",
  },

  transcript: {
    listening: "Listening... Start speaking.",
    recordingNoCaptions: "Recording audio. The transcript will appear when you finish.",
    transcribingFile: (name) => `Transcribing "${name}"...`,
    transcribingRecording: "Transcribing the recording...",
    idle: "Tap the microphone to record or upload audio.",
  },

  busy: {
    transcribing: "Transcribing the consultation audio…",
    summarizing: "Generating the clinical summary…",
  },

  summary: {
    patient: "Patient",
    overview: "Overview",
    diagnosis: "Diagnosis",
    reason: "Reason for visit",
    symptoms: "Symptoms",
    noSymptoms: "No symptoms were mentioned",
    findings: "Findings",
    treatment: "Treatment plan",
    medications: "Medications",
    noMedications: "No medications were mentioned",
    followUp: "Follow-up",
    notes: "Additional notes",
  },

  history: {
    empty: "No saved consultations yet.",
    recorded: "Recorded",
    recordedInApp: "Recorded in the app",
    uploaded: "Uploaded audio",
    fullTranscript: "Full transcript",
    confirmDelete: "Delete? Tap again",
  },

  micTest: {
    title: "Test microphone",
    subtitle: "Nothing is recorded or sent: we only measure the sound.",
    requesting: "Requesting microphone access…",
    speak: "Speak or say something out loud…",
    heard: "I can hear you! The microphone works.",
    defaultDevice: "Default microphone",
    insecure: "This browser doesn't allow the microphone here (HTTPS is required).",
  },

  credit: {
    madeWith: "Made with",
    love: "love",
    by: "by",
  },

  settings: {
    title: "Settings",
    subtitle: "Language, AI provider and your clinic's API key.",
    privacy:
      "MedScribe is free: it works with your clinic's AI account. Your API key is stored **only on this device** and consultation audio travels straight from here to your provider, without passing through any MedScribe server.",
    transcription: "Audio transcription",
    transcriptionDescription: "Turns the recording into text.",
    summary: "Clinical summary",
    summaryDescription: "Generates the structured summary from the text.",
    apiKeys: "API keys",
    tips: [
      "Use a paid plan for patient data: on free plans some providers may use the data to train their models. Check your provider's data policy.",
      "Set a spending limit on your provider account to avoid billing surprises.",
      "Don't use MedScribe on shared computers without signing out of the system: the key stays saved in this browser.",
    ],
    clearKeys: "Delete the API keys from this device",
  },

  models: {
    tags: {
      recommended: "recommended",
      budget: "budget",
      accurate: "most accurate",
      fastBudget: "fast and cheap",
    },
    other: "Other model…",
    provider: "provider",
    model: "model",
    modelId: "model ID",
    customPlaceholder: "Exact model ID, e.g. gemini-3.6-flash",
  },

  apiKey: {
    label: (provider) => `${provider} API key`,
    get: "Get a key",
    show: "Show key",
    hide: "Hide key",
    verify: "Verify",
    verifying: "Verifying…",
    valid: "Valid key",
    verifyFailed: "The key couldn't be verified.",
  },

  errors: {
    invalidKey: "The API key isn't valid. Check it in Settings.",
    rejected: (detail) => `The provider rejected the request: ${detail}`,
    unauthorized: "The API key isn't valid or lacks permissions. Check it in Settings.",
    modelNotFound:
      "The chosen model doesn't exist or your account has no access to it. Pick another model in Settings.",
    audioTooLargeForProvider: "The audio is too large for this provider.",
    rateLimited:
      "Your provider account hit its usage or credit limit. Wait a moment or check your billing.",
    overloaded: "The provider is overloaded right now. Tap Retry in a few seconds.",
    offline: "Can't reach the provider. Check your internet connection.",
    transcribeFailed: "The audio couldn't be transcribed.",
    summarizeFailed: "The summary couldn't be generated.",
    missingKey: (provider) => `The ${provider} API key is missing. Add it in Settings.`,
    cannotTranscribe: (provider) => `${provider} can't transcribe audio.`,
    unknownProvider: (id) => `Unknown provider: ${id}`,
    keyInvalidFor: (provider) => `The ${provider} API key isn't valid.`,
    cannotReach: (provider) => `Couldn't reach ${provider}. Check your internet connection.`,
    providerError: (provider, status) => `${provider} returned an error (${status}).`,
    unsupportedFormat: "Unsupported format. Use MP3, M4A, WAV, OGG, OPUS, WEBM, AAC or FLAC.",
    fileTooLarge: (mb) => `The file exceeds the ${mb} MB limit.`,
    noAudio: "No audio was captured. Please try again.",
    micUnavailable: "The microphone couldn't be accessed.",
  },

  mic: {
    insecureContext: "The microphone only works over HTTPS or on localhost. Open the app with https://.",
    unsupported:
      "This browser can't record audio. Use an up-to-date Chrome, Edge, Firefox or Safari, or upload audio.",
    denied: "Microphone access denied. Allow it from the padlock icon in the address bar.",
    notFound: "No microphone was found.",
    busy: "The microphone is being used by another app. Close it and try again.",
    generic: (detail) => `The microphone couldn't be accessed${detail ? `: ${detail}` : "."}`,
    androidDenied:
      "Microphone permission denied. Enable it in Settings → Apps → MedScribe → Permissions.",
    androidStartFailed: (detail) => `Recording couldn't start${detail ? `: ${detail}` : "."}`,
  },

  export: {
    heading: "MEDICAL CONSULTATION SUMMARY",
    generatedBy: "Generated by MedScribe",
    date: "Date",
    patient: "PATIENT",
    name: "Name",
    age: "Age",
    sex: "Sex",
    otherData: "Other data",
    overview: "OVERVIEW",
    reason: "REASON FOR VISIT",
    symptoms: "SYMPTOMS",
    findings: "FINDINGS",
    diagnosis: "DIAGNOSIS",
    treatment: "TREATMENT PLAN",
    medications: "MEDICATIONS",
    followUp: "FOLLOW-UP",
    notes: "ADDITIONAL NOTES",
    transcript: "FULL TRANSCRIPT",
    fileName: "consultation",
    textFiles: "Text",
    audioFiles: "Audio",
  },

  downloads: {
    title: "Install MedScribe",
    intro:
      "Record or upload the consultation and get a structured clinical summary. Free: it works with your clinic's AI account.",
    macSoon: "The Mac version is coming soon. Meanwhile, MedScribe works fully in the browser.",
    useInBrowser: "Use in the browser",
    yourDevice: "Your device",
    openApp: "Open MedScribe",
    windows: {
      title: "Windows",
      requirement: "Windows 10 or 11 · 64-bit · ~2 MB",
      button: "Download for Windows",
      steps: [
        "Open the downloaded **MedScribe-Windows-setup.exe** file.",
        "If _“Windows protected your PC”_ appears, click **More info** → **Run anyway**. It shows up because the app is new and doesn't have a commercial signature yet.",
        "It installs just for your user, without asking for administrator rights.",
        "Open MedScribe from the Start menu and connect your AI provider.",
      ],
    },
    android: {
      title: "Android",
      requirement: "Android 7 or later · ~4 MB",
      button: "Download APK for Android",
      steps: [
        "Open **MedScribe-Android.apk** from your downloads.",
        "If asked, allow **Install unknown apps** for your browser and go back.",
        "Tap **Install**.",
        "When you record for the first time, allow the microphone and notifications: recording continues even with the screen locked.",
      ],
      verifyTitle: "Verify the APK is genuine",
      verifyBody: "SHA-256 fingerprint of the signing certificate:",
    },
    ios: {
      title: "iPhone and iPad",
      requirement: "iOS 16.4 or later · installed from Safari",
      steps: [
        "Open this page in **Safari** and tap **Open MedScribe**.",
        "Tap the **Share** button (the square with the up arrow).",
        "Choose **Add to Home Screen** → **Add**.",
        "Open MedScribe from the icon. While recording, keep the screen on: the app stops it from turning off by itself.",
      ],
      footnote:
        "Apple doesn't allow installing apps downloaded from a website; this is the official, free way.",
    },
    privacy:
      "Your API keys are stored only on your device and audio goes straight to your AI provider. MedScribe has no servers that see your patients' data.",
    allReleases: "All versions and checksums",
  },
};

export default en;
