"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Monitor,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  TabletSmartphone,
} from "lucide-react";
import { PlatformCard } from "./PlatformCard";
import {
  ANDROID_CERT_SHA256,
  detectOs,
  downloads,
  type DeviceOs,
} from "@/lib/downloads";
import { staggerIndex } from "@/lib/utils";

const noopSubscribe = () => () => {};

function useDeviceOs(): DeviceOs | null {
  // null while prerendering, so the static HTML is neutral.
  return useSyncExternalStore(noopSubscribe, detectOs, () => null);
}

const primaryButton =
  "neu-primary flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold";

type Platform = "windows" | "android" | "ios";

export function DownloadPage() {
  const os = useDeviceOs();
  const recommended: Platform | null =
    os === "windows" || os === "android" || os === "ios" ? os : null;

  const cards: Record<Platform, (index: number) => ReactNode> = {
    windows: (index) => (
      <PlatformCard
        key="windows"
        index={index}
        icon={<Monitor className="size-6" />}
        title="Windows"
        requirement="Windows 10 u 11 · 64 bits · ~2 MB"
        recommended={recommended === "windows"}
        action={
          <a href={downloads.windows} className={primaryButton}>
            <Download className="size-4" />
            Descargar para Windows
          </a>
        }
        steps={[
          <>Abre el archivo <strong>MedScribe-Windows-setup.exe</strong> descargado.</>,
          <>
            Si aparece <em>“Windows protegió tu PC”</em>, pulsa{" "}
            <strong>Más información</strong> → <strong>Ejecutar de todas formas</strong>.
            Sale porque la app es nueva y todavía no tiene firma comercial.
          </>,
          <>Se instala solo para tu usuario, sin pedir permisos de administrador.</>,
          <>Abre MedScribe desde el menú Inicio y conecta tu proveedor de IA.</>,
        ]}
      />
    ),
    android: (index) => (
      <PlatformCard
        key="android"
        index={index}
        icon={<Smartphone className="size-6" />}
        title="Android"
        requirement="Android 7 o superior · ~4 MB"
        recommended={recommended === "android"}
        action={
          <a href={downloads.android} className={primaryButton}>
            <Download className="size-4" />
            Descargar APK para Android
          </a>
        }
        steps={[
          <>Abre el archivo <strong>MedScribe-Android.apk</strong> desde las descargas.</>,
          <>
            Si lo pide, permite <strong>Instalar apps desconocidas</strong> para tu
            navegador y vuelve atrás.
          </>,
          <>Pulsa <strong>Instalar</strong>.</>,
          <>
            Al grabar por primera vez, acepta el micrófono y las notificaciones: la
            grabación continúa aunque bloquees la pantalla.
          </>,
        ]}
        footnote={
          <details>
            <summary className="cursor-pointer font-medium">
              Verificar que el APK es auténtico
            </summary>
            <p className="mt-2">Huella SHA-256 del certificado de firma:</p>
            <code className="neu-inset-sm mt-1.5 block rounded-xl px-3 py-2 font-mono text-[10px] break-all">
              {ANDROID_CERT_SHA256}
            </code>
          </details>
        }
      />
    ),
    ios: (index) => (
      <PlatformCard
        key="ios"
        index={index}
        icon={<TabletSmartphone className="size-6" />}
        title="iPhone y iPad"
        requirement="iOS 16.4 o superior · se instala desde Safari"
        recommended={recommended === "ios"}
        action={
          <Link href="/" className={primaryButton}>
            Abrir MedScribe
          </Link>
        }
        steps={[
          <>Abre esta página en <strong>Safari</strong> y pulsa <strong>Abrir MedScribe</strong>.</>,
          <>Toca el botón <strong>Compartir</strong> (el cuadrado con la flecha hacia arriba).</>,
          <>Elige <strong>Añadir a pantalla de inicio</strong> → <strong>Añadir</strong>.</>,
          <>
            Abre MedScribe desde el icono. Mientras grabas, deja la pantalla
            encendida: la app evita que se apague sola.
          </>,
        ]}
        footnote="Apple no permite instalar apps descargadas desde una web; esta es la vía oficial y gratuita."
      />
    ),
  };

  // The visitor's platform goes first.
  const order: Platform[] = recommended
    ? [recommended, ...(["windows", "android", "ios"] as const).filter((p) => p !== recommended)]
    : ["windows", "android", "ios"];

  return (
    <div className="min-h-dvh overflow-y-auto">
      <header className="animate-fade px-4 pt-4 pb-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="neu-raised-sm flex size-10 items-center justify-center rounded-xl text-primary-600">
              <Stethoscope className="size-5" />
            </span>
            <span className="text-base font-semibold tracking-tight text-text">
              MedScribe
            </span>
          </Link>
          <Link
            href="/"
            className="neu-button flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-text-muted hover:text-primary-700"
          >
            <ArrowLeft className="size-3.5" />
            Usar en el navegador
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pt-8 pb-12">
        <div className="animate-enter text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            Instala MedScribe
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            Graba o sube la consulta y obtén un resumen clínico estructurado.
            Gratis: funciona con la cuenta de IA de tu clínica.
          </p>
          {os === "mac" && (
            <p className="neu-inset-sm mx-auto mt-4 max-w-md rounded-2xl px-4 py-2.5 text-xs text-text">
              La versión para Mac llegará pronto. Mientras tanto, MedScribe funciona
              completo en el navegador.
            </p>
          )}
        </div>

        <div className="grid items-start gap-6 md:grid-cols-3">
          {order.map((platform, i) => cards[platform](i))}
        </div>

        <div
          style={staggerIndex(4)}
          className="neu-inset stagger flex animate-enter flex-col gap-3 rounded-3xl p-5 text-xs leading-relaxed text-text-muted sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="flex gap-3">
            <ShieldCheck className="size-5 shrink-0 text-primary-600" />
            <span>
              Tus API keys se guardan solo en tu dispositivo y el audio viaja
              directamente a tu proveedor de IA. MedScribe no tiene servidores que
              vean los datos de tus pacientes.
            </span>
          </p>
          <a
            href={downloads.releasesPage}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1.5 font-medium text-primary-700 hover:underline"
          >
            Todas las versiones y checksums
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </main>
    </div>
  );
}
