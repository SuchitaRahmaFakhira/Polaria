// Sinkronisasi data ke Supabase (auth anonim + RLS).
// Semua penulisan masuk antrian dulu, lalu dikirim saat online.
// URL & kunci publik diambil dari /api/config (lihat js/config.js dan .env).
import { ambilKonfigurasi, konfigurasiTersimpan, lengkap } from "./config.js";
import { tambahAntrian, isiAntrian, buangDepan } from "./cache.js";
import { baca } from "./data.js";

const CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm";

// true = terhubung ke Supabase; false = mode lokal (data hanya di perangkat).
export const supabaseAktif = () => lengkap(konfigurasiTersimpan());

let klienJanji = null;
let sedangSinkron = false;

function klien(k) {
  if (!klienJanji) {
    klienJanji = import(CDN)
      .then(({ createClient }) =>
        createClient(k.supabase_url, k.supabase_anon_key, { auth: { persistSession: true, autoRefreshToken: true } }),
      )
      .catch((e) => {
        klienJanji = null;
        throw e;
      });
  }
  return klienJanji;
}

async function pastikanMasuk(sb) {
  const { data } = await sb.auth.getSession();
  if (data.session) return data.session.user.id;
  const { data: masuk, error } = await sb.auth.signInAnonymously();
  if (error) throw error;
  const id = masuk.user.id;
  // Akun anonim baru: daftarkan profil dulu agar foreign key terpenuhi.
  const profil = baca().profil;
  if (profil) {
    const { error: e } = await sb.from("siswa").upsert({ id, nama: profil.nama, kelas: profil.kelas }, { onConflict: "id" });
    if (e) throw e;
  }
  return id;
}

export async function sinkron() {
  if (sedangSinkron || !navigator.onLine) return;
  sedangSinkron = true;
  let terkirim = 0;
  try {
    const k = await ambilKonfigurasi();
    const daftar = isiAntrian();
    if (!lengkap(k)) {
      // Supabase belum diatur: mode lokal, antrian tidak perlu disimpan.
      if (konfigurasiTersimpan() && daftar.length) buangDepan(daftar.length);
      return;
    }
    if (!daftar.length) return;
    const sb = await klien(k);
    const uid = await pastikanMasuk(sb);
    for (const { tabel, baris, upsert } of daftar) {
      const kolomId = tabel === "siswa" ? "id" : "siswa_id";
      const isi = { ...baris, [kolomId]: uid };
      const q = sb.from(tabel);
      const { error } = upsert ? await q.upsert(isi, { onConflict: upsert }) : await q.insert(isi);
      if (error) throw error;
      terkirim++;
    }
  } catch (galat) {
    console.warn("Sinkron Supabase tertunda:", galat?.message || galat);
  } finally {
    if (terkirim) buangDepan(terkirim);
    sedangSinkron = false;
  }
}

function kirim(tabel, baris, upsert = null) {
  // Konfigurasi sudah diketahui kosong → mode lokal, tidak perlu antri.
  const k = konfigurasiTersimpan();
  if (k && !lengkap(k)) return;
  tambahAntrian({ tabel, baris, upsert });
  sinkron();
}

export const simpanSiswa = (nama, kelas) => kirim("siswa", { nama, kelas }, "id");

export const simpanProgres = (modul, selesai, skor) =>
  kirim("progres_modul", { modul, selesai, skor, diperbarui: new Date().toISOString() }, "siswa_id,modul");

export const simpanJawaban = (j) =>
  kirim("jawaban_latihan", {
    level: j.level,
    tipe_soal: j.tipe,
    soal: j.soal,
    jawaban: String(j.jawaban ?? ""),
    benar: j.benar,
    jumlah_petunjuk: j.jumlahPetunjuk,
    durasi_detik: j.durasi,
    dijawab: new Date().toISOString(),
  });

export const simpanEvaluasi = (e) =>
  kirim("hasil_evaluasi", {
    jenis: e.jenis,
    skor: e.skor,
    jawaban: e.jawaban,
    durasi_detik: e.durasi,
    dikerjakan: new Date().toISOString(),
  });

window.addEventListener("online", sinkron);
