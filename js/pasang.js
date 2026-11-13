// Pemasangan PWA: Android/Chrome lewat beforeinstallprompt, iPhone lewat panduan manual.

let promptTertunda = null;
const pendengar = new Set();

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  promptTertunda = e;
  pendengar.forEach((f) => f());
});

window.addEventListener("appinstalled", () => {
  promptTertunda = null;
  pendengar.forEach((f) => f());
});

export function sudahTerpasang() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

export function perangkatIos() {
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

export function bisaPasangOtomatis() {
  return Boolean(promptTertunda);
}

export async function pasangSekarang() {
  if (!promptTertunda) return false;
  promptTertunda.prompt();
  const { outcome } = await promptTertunda.userChoice;
  promptTertunda = null;
  pendengar.forEach((f) => f());
  return outcome === "accepted";
}

export function saatBerubah(fungsi) {
  pendengar.add(fungsi);
  return () => pendengar.delete(fungsi);
}
