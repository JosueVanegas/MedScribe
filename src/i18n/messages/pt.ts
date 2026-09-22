import type { Messages } from "./es";

const pt: Messages = {
  common: {
    close: "Fechar",
    retry: "Tentar novamente",
    settings: "Configurações",
    done: "Pronto",
    cancel: "Cancelar",
    save: "Salvar",
    export: "Exportar",
    delete: "Excluir",
  },

  header: {
    tagline: "Resumo de consultas com IA",
    settings: "Configurações",
  },

  status: {
    idle: "Pronto",
    recording: "Gravando",
    transcribing: "Transcrevendo",
    summarizing: "Resumindo",
    done: "Resumo pronto",
  },

  language: {
    consultation: "Idioma da consulta",
    app: "Idioma do app",
  },

  empty: {
    title: "Gravador de consultas",
    description: "Grave a consulta ou envie um áudio e receba um resumo clínico estruturado.",
    setupTitle: "Conecte seu provedor de IA",
    setupBody: "Cole a chave de API da sua clínica",
    setupPrivacy: "Ela fica salva só neste dispositivo.",
    testMic: "Testar microfone",
    history: (count) => `Histórico (${count})`,
    downloadApp: "Baixar app",
  },

  upload: {
    title: "Gravou em outro dispositivo?",
    dragHint: "Arraste o áudio ou clique para enviá-lo.",
    tapHint: "Toque para enviá-lo.",
    formats: (mb) => `MP3, M4A, WAV, OGG… até ${mb} MB.`,
    button: "Enviar áudio",
  },

  tabs: {
    transcript: "Transcrição",
    summary: "Resumo",
    history: "Histórico",
  },

  toolbar: {
    exportSummary: "Exportar resumo",
  },

  control: {
    hints: {
      idle: "Toque para gravar ou envie um áudio",
      recording: "Toque para parar e gerar o resumo",
      transcribing: "Transcrevendo áudio…",
      summarizing: "Gerando resumo…",
      done: "Resumo gerado",
    },
    saveAudio: "Salvar áudio",
    newConsultation: "Nova consulta",
    startRecording: "Iniciar gravação",
    stopRecording: "Parar gravação",
  },

  transcript: {
    listening: "Ouvindo... Comece a falar.",
    recordingNoCaptions: "Gravando áudio. A transcrição aparecerá ao terminar.",
    transcribingFile: (name) => `Transcrevendo "${name}"...`,
    transcribingRecording: "Transcrevendo a gravação...",
    idle: "Toque no microfone para gravar ou envie um áudio.",
  },

  busy: {
    transcribing: "Transcrevendo o áudio da consulta…",
    summarizing: "Gerando o resumo clínico…",
  },

  summary: {
    patient: "Paciente",
    overview: "Em resumo",
    diagnosis: "Diagnóstico",
    reason: "Motivo da consulta",
    symptoms: "Sintomas",
    noSymptoms: "Nenhum sintoma foi mencionado",
    findings: "Achados",
    treatment: "Plano de tratamento",
    medications: "Medicação",
    noMedications: "Nenhum medicamento foi mencionado",
    followUp: "Acompanhamento",
    notes: "Observações adicionais",
  },

  history: {
    empty: "Ainda não há consultas salvas.",
    recorded: "Gravada",
    recordedInApp: "Gravada no app",
    uploaded: "Áudio enviado",
    fullTranscript: "Transcrição completa",
    confirmDelete: "Excluir? Toque de novo",
  },

  micTest: {
    title: "Testar microfone",
    subtitle: "Nada é gravado nem enviado: só medimos o som.",
    requesting: "Pedindo acesso ao microfone…",
    speak: "Fale ou diga algo em voz alta…",
    heard: "Estou ouvindo você! O microfone funciona.",
    defaultDevice: "Microfone padrão",
    insecure: "Este navegador não permite usar o microfone aqui (é preciso HTTPS).",
  },

  credit: {
    madeWith: "Feito com",
    love: "amor",
    by: "por",
  },

  settings: {
    title: "Configurações",
    subtitle: "Idioma, provedor de IA e a chave de API da sua clínica.",
    privacy:
      "O MedScribe é gratuito: funciona com a conta de IA da sua clínica. Sua chave de API fica salva **só neste dispositivo** e o áudio das consultas vai direto daqui para o seu provedor, sem passar por nenhum servidor do MedScribe.",
    transcription: "Transcrição de áudio",
    transcriptionDescription: "Converte a gravação em texto.",
    summary: "Resumo clínico",
    summaryDescription: "Gera o resumo estruturado a partir do texto.",
    apiKeys: "Chaves de API",
    tips: [
      "Para dados de pacientes, use um plano pago: em planos gratuitos alguns provedores podem usar os dados para treinar seus modelos. Confira a política de dados do seu provedor.",
      "Defina um limite de gastos na conta do provedor para evitar surpresas na fatura.",
      "Não use o MedScribe em computadores compartilhados sem sair da sessão do sistema: a chave fica salva neste navegador.",
    ],
    clearKeys: "Apagar as chaves de API deste dispositivo",
  },

  models: {
    tags: {
      recommended: "recomendado",
      budget: "econômico",
      accurate: "mais preciso",
      fastBudget: "rápido e econômico",
    },
    other: "Outro modelo…",
    provider: "provedor",
    model: "modelo",
    modelId: "ID do modelo",
    customPlaceholder: "ID exato do modelo, ex.: gemini-3.6-flash",
  },

  apiKey: {
    label: (provider) => `Chave de API do ${provider}`,
    get: "Obter chave",
    show: "Mostrar chave",
    hide: "Ocultar chave",
    verify: "Verificar",
    verifying: "Verificando…",
    valid: "Chave válida",
    verifyFailed: "Não foi possível verificar a chave.",
  },

  errors: {
    invalidKey: "A chave de API não é válida. Confira em Configurações.",
    rejected: (detail) => `O provedor recusou a solicitação: ${detail}`,
    unauthorized: "A chave de API não é válida ou não tem permissões. Confira em Configurações.",
    modelNotFound:
      "O modelo escolhido não existe ou sua conta não tem acesso. Troque de modelo em Configurações.",
    audioTooLargeForProvider: "O áudio é grande demais para este provedor.",
    rateLimited:
      "A conta do provedor atingiu o limite de uso ou de saldo. Aguarde um momento ou confira seu faturamento.",
    overloaded: "O provedor está sobrecarregado agora. Toque em Tentar novamente em alguns segundos.",
    offline: "Sem conexão com o provedor. Verifique sua internet.",
    transcribeFailed: "Não foi possível transcrever o áudio.",
    summarizeFailed: "Não foi possível gerar o resumo.",
    missingKey: (provider) => `Falta a chave de API do ${provider}. Adicione-a em Configurações.`,
    cannotTranscribe: (provider) => `${provider} não consegue transcrever áudio.`,
    unknownProvider: (id) => `Provedor desconhecido: ${id}`,
    keyInvalidFor: (provider) => `A chave de API do ${provider} não é válida.`,
    cannotReach: (provider) =>
      `Não foi possível contatar ${provider}. Verifique sua conexão com a internet.`,
    providerError: (provider, status) => `${provider} respondeu com um erro (${status}).`,
    unsupportedFormat: "Formato não suportado. Use MP3, M4A, WAV, OGG, OPUS, WEBM, AAC ou FLAC.",
    fileTooLarge: (mb) => `O arquivo excede o limite de ${mb} MB.`,
    noAudio: "Nenhum áudio foi capturado. Tente novamente.",
    micUnavailable: "Não foi possível acessar o microfone.",
  },

  mic: {
    insecureContext: "O microfone só funciona em HTTPS ou em localhost. Abra o app com https://.",
    unsupported:
      "Este navegador não permite gravar áudio. Use Chrome, Edge, Firefox ou Safari atualizados, ou envie um áudio.",
    denied: "Acesso ao microfone negado. Permita pelo ícone do cadeado na barra de endereços.",
    notFound: "Nenhum microfone foi encontrado.",
    busy: "O microfone está sendo usado por outro app. Feche-o e tente novamente.",
    generic: (detail) => `Não foi possível acessar o microfone${detail ? `: ${detail}` : "."}`,
    androidDenied:
      "Permissão de microfone negada. Ative-a em Configurações → Apps → MedScribe → Permissões.",
    androidStartFailed: (detail) =>
      `Não foi possível iniciar a gravação${detail ? `: ${detail}` : "."}`,
  },

  export: {
    heading: "RESUMO DE CONSULTA MÉDICA",
    generatedBy: "Gerado pelo MedScribe",
    date: "Data",
    patient: "PACIENTE",
    name: "Nome",
    age: "Idade",
    sex: "Sexo",
    otherData: "Outros dados",
    overview: "EM RESUMO",
    reason: "MOTIVO DA CONSULTA",
    symptoms: "SINTOMAS",
    findings: "ACHADOS",
    diagnosis: "DIAGNÓSTICO",
    treatment: "PLANO DE TRATAMENTO",
    medications: "MEDICAÇÃO",
    followUp: "ACOMPANHAMENTO",
    notes: "OBSERVAÇÕES ADICIONAIS",
    transcript: "TRANSCRIÇÃO COMPLETA",
    fileName: "consulta",
    textFiles: "Texto",
    audioFiles: "Áudio",
  },

  downloads: {
    title: "Instale o MedScribe",
    intro:
      "Grave ou envie a consulta e receba um resumo clínico estruturado. Grátis: funciona com a conta de IA da sua clínica.",
    macSoon:
      "A versão para Mac chegará em breve. Enquanto isso, o MedScribe funciona completo no navegador.",
    useInBrowser: "Usar no navegador",
    yourDevice: "Seu dispositivo",
    openApp: "Abrir o MedScribe",
    windows: {
      title: "Windows",
      requirement: "Windows 10 ou 11 · 64 bits · ~2 MB",
      button: "Baixar para Windows",
      steps: [
        "Abra o arquivo **MedScribe-Windows-setup.exe** baixado.",
        "Se aparecer _“O Windows protegeu o computador”_, clique em **Mais informações** → **Executar assim mesmo**. Isso acontece porque o app é novo e ainda não tem assinatura comercial.",
        "Ele é instalado só para o seu usuário, sem pedir permissões de administrador.",
        "Abra o MedScribe pelo menu Iniciar e conecte seu provedor de IA.",
      ],
    },
    android: {
      title: "Android",
      requirement: "Android 7 ou superior · ~4 MB",
      button: "Baixar APK para Android",
      steps: [
        "Abra o arquivo **MedScribe-Android.apk** nos downloads.",
        "Se for pedido, permita **Instalar apps desconhecidos** para o seu navegador e volte.",
        "Toque em **Instalar**.",
        "Na primeira gravação, aceite o microfone e as notificações: a gravação continua mesmo com a tela bloqueada.",
      ],
      verifyTitle: "Verificar se o APK é autêntico",
      verifyBody: "Impressão digital SHA-256 do certificado de assinatura:",
    },
    ios: {
      title: "iPhone e iPad",
      requirement: "iOS 16.4 ou superior · instalado pelo Safari",
      steps: [
        "Abra esta página no **Safari** e toque em **Abrir o MedScribe**.",
        "Toque no botão **Compartilhar** (o quadrado com a seta para cima).",
        "Escolha **Adicionar à Tela de Início** → **Adicionar**.",
        "Abra o MedScribe pelo ícone. Durante a gravação, mantenha a tela ligada: o app evita que ela se apague sozinha.",
      ],
      footnote:
        "A Apple não permite instalar apps baixados de um site; este é o caminho oficial e gratuito.",
    },
    privacy:
      "Suas chaves de API ficam salvas só no seu dispositivo e o áudio vai direto para o seu provedor de IA. O MedScribe não tem servidores que vejam os dados dos seus pacientes.",
    allReleases: "Todas as versões e checksums",
  },
};

export default pt;
