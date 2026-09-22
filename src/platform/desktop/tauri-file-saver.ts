import type { FileSaver } from "../types";

function filterFor(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "txt") return { name: "Texto", extensions: ["txt"] };
  return { name: "Audio", extensions: [ext] };
}

/** Native "Save as…" dialog, then writes the file where the user chose. */
export const tauriFileSaver: FileSaver = {
  async save(file, fileName) {
    // Loaded on demand so the web build never pulls Tauri code.
    const [{ save }, { writeFile }] = await Promise.all([
      import("@tauri-apps/plugin-dialog"),
      import("@tauri-apps/plugin-fs"),
    ]);

    const path = await save({ defaultPath: fileName, filters: [filterFor(fileName)] });
    if (!path) return false;

    await writeFile(path, new Uint8Array(await file.arrayBuffer()));
    return true;
  },
};
