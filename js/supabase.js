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
      const tulis = () => (upsert ? sb.from(tabel).upsert(isi, { onConflict: upsert }) : sb.from(tabel).insert(isi));
      let { error } = await tulis();
      if (error?.code === "23503") {
        // Profil siswa belum ada di server: daftarkan lalu coba sekali lagi.
        await daftarkanProfil(sb, uid);
        ({ error } = await tulis());
      }
      if (error && galatPermanen(error)) {
        // Mis. tabel belum dibuat (schema.sql belum dijalankan ulang) atau data ditolak:
        // buang baris ini agar tidak menahan antrian selamanya.
        console.warn(`Baris ${tabel} dilewati (${error.code}): ${error.message}`);
      } else if (error) {
        throw error; // galat sementara (jaringan, token): coba lagi nanti
      }
      terkirim++;
    }
  } catch (galat) {
    console.warn("Sinkron Supabase tertunda:", galat?.message || galat);
  } finally {
    if (terkirim) buangDepan(terkirim);
    sedangSinkron = false;
  }
}

// Kode galat Postgres/PostgREST yang tidak akan berhasil walau dicoba ulang.
function galatPermanen(e) {
  return /^(22|23|42|PGRST)/.test(String(e?.code || ""));
}

async function daftarkanProfil(sb, id) {
  const profil = baca().profil;
  if (profil) await sb.from("siswa").upsert({ id, nama: profil.nama, kelas: profil.kelas }, { onConflict: "id" });
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

// Percakapan tutor (tanpa nama) untuk analisis tahap Evaluation.
export const simpanInteraksiTutor = (t) =>
  kirim("interaksi_tutor", {
    sesi_id: t.sesiId,
    masalah: t.masalah,
    tahap: t.tahap,
    kesulitan: t.kesulitan || null,
    tingkat_petunjuk: t.tingkat ?? 0,
    pesan_siswa: String(t.pesanSiswa ?? "").slice(0, 400),
    pesan_tutor: String(t.pesanTutor ?? "").slice(0, 800),
    sumber: t.sumber,
    benar: Boolean(t.benar),
    dibuat: new Date().toISOString(),
  });

export const simpanJurnal = (konteks, isi) =>
  kirim("jurnal_refleksi", { konteks, isi: String(isi).slice(0, 500), dibuat: new Date().toISOString() });
