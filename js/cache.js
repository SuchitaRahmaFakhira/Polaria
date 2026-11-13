// Antrian offline: baris yang belum terkirim ke Supabase.
import { bacaJson, simpanJson } from "./data.js";

const KUNCI = "polaria:antrian";
let memori = null;

function ambil() {
  if (!memori) memori = bacaJson(KUNCI, []);
  return memori;
}

export function tambahAntrian(item) {
  const daftar = ambil();
  daftar.push(item);
  if (daftar.length > 2000) daftar.splice(0, daftar.length - 2000);
  simpanJson(KUNCI, daftar);
}

export function isiAntrian() {
  return [...ambil()];
}

export function buangDepan(jumlah) {
  const daftar = ambil();
  daftar.splice(0, jumlah);
  simpanJson(KUNCI, daftar);
}

export function jumlahAntrian() {
  return ambil().length;
}
