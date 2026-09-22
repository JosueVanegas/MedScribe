import type { Metadata } from "next";
import { DownloadPage } from "@/components/downloads/DownloadPage";

const title = "Descargar MedScribe";
const description =
  "Instala MedScribe en Windows, Android o iPhone. Gratis, con tu propio proveedor de IA.";

export const metadata: Metadata = {
  title,
  description,
  // Replaces (not merges) the layout's social tags, so the image is repeated.
  alternates: { canonical: "/descargar" },
  openGraph: { title, description, url: "/descargar", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export default function Page() {
  return <DownloadPage />;
}
