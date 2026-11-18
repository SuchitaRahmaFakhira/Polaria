// Pemanggil API Python (/api/*) + cadangan sesi soal untuk offline.
import { bacaJson, simpanJson } from "./data.js";
import { normalisasi } from "./util.js";

const KUNCI_SOAL = "polaria:soal";
const CADANGAN_PER_LEVEL = 2;

export class GalatApi extends Error {
  constructor(pesan, offline = false) {
    super(pesan);
    this.offline = offline;
  }
}

async function panggil(jalur, { metode = "GET", isi, batas = 9000 } = {}) {
  if (!navigator.onLine) throw new GalatApi("Butuh internet untuk ini. Coba lagi saat sinyal tersedia.", true);
  const pengendali = new AbortController();
  const waktu = setTimeout(() => pengendali.abort(), batas);
  try {
    const res = await fetch(jalur, {
      method: metode,
      headers: isi ? { "Content-Type": "application/json" } : undefined,
      body: isi ? JSON.stringify(isi) : undefined,
      signal: pengendali.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new GalatApi(data.galat || "Terjadi kesalahan. Coba lagi, ya.");
    return data;
  } catch (e) {
    if (e instanceof GalatApi) throw e;
    throw new GalatApi("Tidak bisa terhubung ke server. Periksa internetmu.", true);
  } finally {
    clearTimeout(waktu);
  }
}

export const panaskan = () => panggil("/api/kesehatan").catch(() => null);

export const kalkulator = (bilangan) => panggil(`/api/kalkulator?bilangan=${encodeURIComponent(bilangan)}`);

export const buatPola = (jenis, jumlah) => panggil(`/api/pola?jenis=${jenis}&jumlah=${jumlah}`);

// ---------- sesi soal ----------

function cadangan() {
  return bacaJson(KUNCI_SOAL, {});
}

async function isiCadangan(level) {
  const semua = cadangan();
  const daftar = semua[level] || [];
  while (daftar.length < CADANGAN_PER_LEVEL) {
    const data = await panggil(`/api/soal?level=${level}&jumlah=10`);
    daftar.push(data.soal);
  }
  semua[level] = daftar;
  simpanJson(KUNCI_SOAL, semua);
}

export async function siapkanCadangan() {
  for (const level of ["mudah", "sedang", "menantang"]) {
    try {
      await isiCadangan(level);
    } catch {
      return;
    }
  }
}

export async function ambilSesi(level) {
  try {
    const data = await panggil(`/api/soal?level=${level}&jumlah=10`);
    isiCadangan(level).catch(() => {});
    return { soal: data.soal, dariCadangan: false };
  } catch (e) {
    const semua = cadangan();
    const sesi = (semua[level] || []).shift();
    if (!sesi) throw e;
    simpanJson(KUNCI_SOAL, semua);
    return { soal: sesi, dariCadangan: true };
  }
}

// ---------- pemeriksaan ----------

function periksaLokal(soal, jawaban, petunjukKe) {
  const p = soal.paket;
  return {
    benar: String(jawaban).trim() !== "" && normalisasi(jawaban) === normalisasi(p.kunci),
    kunci: p.kunci,
    petunjuk: p.petunjuk.slice(0, petunjukKe),
    pembahasan: p.pembahasan,
    ringkas: p.ringkas,
    cek_substitusi: p.cek,
    lokal: true,
  };
}

export async function periksa(soal, jawaban, petunjukKe = 0) {
  try {
    return await panggil("/api/periksa", {
      metode: "POST",
      isi: { soal: { tipe: soal.tipe, parameter: soal.parameter }, jawaban: String(jawaban), petunjuk_ke: petunjukKe },
      batas: 6000,
    });
  } catch (e) {
    if (soal.paket) return periksaLokal(soal, jawaban, petunjukKe);
    throw e;
  }
}

// ---------- Pemecahan Masalah RMT + tutor (selalu butuh internet) ----------

export const ambilMasalahRmt = (level) => panggil(`/api/rmt/masalah?level=${encodeURIComponent(level)}`);

export const tanyaTutor = (badan) => panggil("/api/rmt/tutor", { metode: "POST", isi: badan, batas: 20000 });

// Tanya AI (jawaban asli dari Gemini lewat server; butuh internet).
export const tanyaAI = (pertanyaan, riwayat) =>
  panggil("/api/tanya", { metode: "POST", isi: { pertanyaan, riwayat: riwayat.slice(-10) }, batas: 32000 });
