// Konfigurasi Supabase diambil dari API Python (/api/config), yang membaca
// file .env (lokal) atau Environment Variables (Vercel). Nilai TIDAK ditulis di sini.
// Salinan terakhir disimpan di perangkat agar tetap tersedia saat offline.
import { bacaJson, simpanJson } from "./data.js";

const KUNCI = "polaria:config";
const KOSONG = { supabase_url: "", supabase_anon_key: "" };
let janji = null;

export function konfigurasiTersimpan() {
  return bacaJson(KUNCI, null);
}

export function lengkap(k) {
  return Boolean(k?.supabase_url && k?.supabase_anon_key);
}

export function ambilKonfigurasi() {
  if (!janji) {
    janji = fetch("/api/config", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((k) => {
        simpanJson(KUNCI, k);
        return k;
      })
      .catch(() => {
        janji = null; // coba lagi lain kali
        return konfigurasiTersimpan() || KOSONG;
      });
  }
  return janji;
}
