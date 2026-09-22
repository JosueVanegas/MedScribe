import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { providers } from "@/core/ai/providers";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { PlatformProvider } from "@/platform/PlatformProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedScribe - Resumen de consultas con IA",
  description:
    "Graba o sube el audio de una consulta médica y obtén un resumen clínico estructurado. Gratis, con tu propio proveedor de IA.",
  applicationName: "MedScribe",
  appleWebApp: {
    capable: true,
    title: "MedScribe",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ecf0f4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * API keys live in this origin's storage, so only the app itself and the
 * clinic's AI providers may be contacted. (Dev mode needs eval for HMR.)
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self'",
  // ipc: is the Tauri desktop bridge (native save dialog); unused on the web.
  `connect-src 'self' ipc: http://ipc.localhost ${providers.map((p) => p.apiOrigin).join(" ")}`,
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy} />
        )}
      </head>
      <body className="h-full">
        <PlatformProvider>
          {children}
          <ServiceWorkerRegistration />
        </PlatformProvider>
      </body>
    </html>
  );
}
