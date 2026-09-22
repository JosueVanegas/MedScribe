import type { FileSaver } from "../types";

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Android share sheet: the doctor can save to Files/Drive or send the file by
 * WhatsApp or email. The temporary copy is removed afterwards.
 */
export const androidFileSaver: FileSaver = {
  async save(file, fileName) {
    const [{ Filesystem, Directory }, { Share }] = await Promise.all([
      import("@capacitor/filesystem"),
      import("@capacitor/share"),
    ]);

    const { uri } = await Filesystem.writeFile({
      path: `share/${fileName}`,
      data: await toBase64(file),
      directory: Directory.Cache,
      recursive: true,
    });

    try {
      await Share.share({ title: fileName, files: [uri] });
      return true;
    } catch {
      // Dismissing the share sheet rejects: treat it as "cancelled".
      return false;
    } finally {
      void Filesystem.deleteFile({ path: `share/${fileName}`, directory: Directory.Cache });
    }
  },
};
