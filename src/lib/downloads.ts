/**
 * Installers are published as assets of GitHub Releases (see
 * .github/workflows/release.yml). `releases/latest/download/<name>` always
 * points at the newest release, so these links never change between versions.
 */
const REPO = "JosueVanegas/MedScribe";
const latest = (asset: string) =>
  `https://github.com/${REPO}/releases/latest/download/${asset}`;

export const downloads = {
  releasesPage: `https://github.com/${REPO}/releases/latest`,
  windows: latest("MedScribe-Windows-setup.exe"),
  android: latest("MedScribe-Android.apk"),
  checksums: latest("SHA256SUMS.txt"),
};

/** SHA-256 of the Android signing certificate — lets anyone verify the APK is genuine. */
export const ANDROID_CERT_SHA256 =
  "05:6E:74:67:04:38:8C:FF:C1:F4:D7:3D:40:96:B5:7B:92:8A:F5:CC:BC:46:C7:3F:A1:B1:13:90:21:BD:69:13";

export type DeviceOs = "windows" | "android" | "ios" | "mac" | "other";

export function detectOs(): DeviceOs {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  // iPadOS 13+ presents itself as a Mac with a touch screen.
  if (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  if (/windows/i.test(ua)) return "windows";
  if (/macintosh/i.test(ua)) return "mac";
  return "other";
}
