import type { FileSaver } from "../types";

function isTouchDevice(): boolean {
  return window.matchMedia?.("(pointer: coarse)").matches ?? false;
}

function downloadWithLink(file: Blob, fileName: string) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Desktop browsers: classic download. Phones: the system share sheet, which
 * lets the doctor save to Files, send by WhatsApp/email, etc. (on iOS a plain
 * download of a .txt just opens it in a tab).
 */
export const webFileSaver: FileSaver = {
  async save(file, fileName) {
    const shareable = new File([file], fileName, { type: file.type });
    if (isTouchDevice() && navigator.canShare?.({ files: [shareable] })) {
      try {
        await navigator.share({ files: [shareable], title: fileName });
        return true;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return false;
        // Share failed for another reason: fall back to a download.
      }
    }
    downloadWithLink(file, fileName);
    return true;
  },
};
