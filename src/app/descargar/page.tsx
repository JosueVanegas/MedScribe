import type { Metadata } from "next";
import { DownloadPage } from "@/components/downloads/DownloadPage";

export const metadata: Metadata = {
  title: "Descargar MedScribe",
  description:
    "Instala MedScribe en Windows, Android o iPhone. Gratis, con tu propio proveedor de IA.",
};

export default function Page() {
  return <DownloadPage />;
}
