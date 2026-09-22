import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.josuevanegas.medscribe",
  appName: "MedScribe",
  // Static export from `next build`; the same bundle the web and desktop use.
  webDir: "out",
  backgroundColor: "#ecf0f4",
  // WebView debugging stays at Capacitor's default: on for debug builds,
  // off for the release APK that clinics install.
};

export default config;
