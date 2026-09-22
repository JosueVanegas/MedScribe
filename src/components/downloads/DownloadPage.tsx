"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Monitor,
  ShieldCheck,
  Smartphone,
  TabletSmartphone,
} from "lucide-react";
import { PlatformCard } from "./PlatformCard";
import { Credit } from "../Credit";
import {
  ANDROID_CERT_SHA256,
  detectOs,
  downloads,
  type DeviceOs,
} from "@/lib/downloads";
import { staggerIndex } from "@/lib/utils";
import { Rich } from "@/i18n/Rich";
import { useI18n } from "@/i18n/useI18n";

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
  const { t } = useI18n();
  const d = t.downloads;
  const recommended: Platform | null =
    os === "windows" || os === "android" || os === "ios" ? os : null;

  const steps = (list: string[]) => list.map((step) => <Rich key={step} text={step} />);

  const cards: Record<Platform, (index: number) => ReactNode> = {
    windows: (index) => (
      <PlatformCard
        key="windows"
        index={index}
        icon={<Monitor className="size-6" />}
        title={d.windows.title}
        requirement={d.windows.requirement}
        recommended={recommended === "windows"}
        action={
          <a href={downloads.windows} className={primaryButton}>
            <Download className="size-4" />
            {d.windows.button}
          </a>
        }
        steps={steps(d.windows.steps)}
      />
    ),
    android: (index) => (
      <PlatformCard
        key="android"
        index={index}
        icon={<Smartphone className="size-6" />}
        title={d.android.title}
        requirement={d.android.requirement}
        recommended={recommended === "android"}
        action={
          <a href={downloads.android} className={primaryButton}>
            <Download className="size-4" />
            {d.android.button}
          </a>
        }
        steps={steps(d.android.steps)}
        footnote={
          <details>
            <summary className="cursor-pointer font-medium">{d.android.verifyTitle}</summary>
            <p className="mt-2">{d.android.verifyBody}</p>
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
        title={d.ios.title}
        requirement={d.ios.requirement}
        recommended={recommended === "ios"}
        action={
          <Link href="/" className={primaryButton}>
            {d.openApp}
          </Link>
        }
        steps={steps(d.ios.steps)}
        footnote={d.ios.footnote}
      />
    ),
  };

  // The visitor's platform goes first.
  const order: Platform[] = recommended
    ? [recommended, ...(["windows", "android", "ios"] as const).filter((p) => p !== recommended)]
    : ["windows", "android", "ios"];

  return (
    <div className="min-h-dvh overflow-y-auto">
      <header className="animate-fade px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="neu-raised-sm flex size-10 items-center justify-center rounded-xl">
              <Image src="/logo.svg" alt="" width={24} height={22} unoptimized priority />
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
            {d.useInBrowser}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pt-6 pb-10 sm:gap-10 sm:pt-8 sm:pb-12">
        <div className="animate-enter text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-4xl">
            {d.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            {d.intro}
          </p>
          {os === "mac" && (
            <p className="neu-inset-sm mx-auto mt-4 max-w-md rounded-2xl px-4 py-2.5 text-xs text-text">
              {d.macSoon}
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
            <span>{d.privacy}</span>
          </p>
          <a
            href={downloads.releasesPage}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1.5 font-medium text-primary-700 hover:underline"
          >
            {d.allReleases}
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </main>

      <footer className="flex justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Credit />
      </footer>
    </div>
  );
}
