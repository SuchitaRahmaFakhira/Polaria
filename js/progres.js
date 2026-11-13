// Aturan buka-kunci modul dan pencatatan progres.
import { baca, ubah } from "./data.js";
import { URUTAN_MODUL } from "./materi/konten.js";
import { simpanProgres } from "./supabase.js";

export function statusModul(id) {
  const progres = baca().progres;
  if (progres[id]?.selesai) return "selesai";
  const i = URUTAN_MODUL.indexOf(id);
  if (i <= 0) return "terbuka";
  return progres[URUTAN_MODUL[i - 1]]?.selesai ? "terbuka" : "terkunci";
}

export function modulBerikutnya() {
  return URUTAN_MODUL.find((id) => statusModul(id) !== "selesai") || null;
}

export function semuaModulSelesai() {
  return URUTAN_MODUL.every((id) => statusModul(id) === "selesai");
}

export function selesaikanModul(id, skor, total) {
  ubah((d) => {
    const lama = d.progres[id];
    d.progres[id] = {
      selesai: true,
      skor: Math.max(skor, lama?.skor ?? 0),
      total,
      diperbarui: new Date().toISOString(),
    };
  });
  simpanProgres(id, true, skor);
}
