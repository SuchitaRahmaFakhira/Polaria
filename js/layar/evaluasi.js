// Evaluasi pre-test & post-test (F-15). Set soal tetap, tanpa petunjuk.
import { h, huruf, acak, tanggal, isi } from "../util.js";
import { ikon } from "../ikon.js";
import { kepala, kotakIngat } from "../komponen.js";
import { baca, ubah } from "../data.js";
import { semuaModulSelesai } from "../progres.js";
import { simpanEvaluasi } from "../supabase.js";
import { SOAL_EVALUASI } from "../evaluasi/soal-tetap.js";

const NAMA = { pre: "Pre-test", post: "Post-test" };

export function layarEvaluasi() {
  const ev = baca().evaluasi;
  const postTerbuka = semuaModulSelesai();

  const kartu = (jenis) => {
    const hasil = ev[jenis];
    const terkunci = jenis === "post" && !postTerbuka && !hasil;
    const keterangan = hasil
      ? `Selesai · nilai ${hasil.nilai} (${hasil.skor}/${hasil.total}) · ${tanggal(hasil.waktu)}`
      : terkunci
        ? "Terbuka setelah semua modul selesai."
        : jenis === "pre"
          ? "Kerjakan sebelum mulai belajar materi."
          : "Siap dikerjakan.";
    const konten = [
      h("span", { class: "kotak-ikon ungu" }, ikon(terkunci ? "gembok" : "piala", 26)),
      h(
        "span",
        { class: "item-teks" },
        h("span", { class: "item-judul", style: { display: "block" } }, NAMA[jenis]),
        h("span", { class: "item-sub", style: { display: "block" } }, `${SOAL_EVALUASI.length} soal pilihan ganda · ±20 menit`),
        h("span", { class: "item-sub", style: { display: "block", color: hasil ? "var(--benar)" : null } }, keterangan),
      ),
      h("span", { class: "chevron" }, ikon(terkunci ? "gembok" : "kanan", 18)),
    ];
    return terkunci
      ? h("div", { class: "item-menu", "aria-disabled": "true" }, konten)
      : h("a", { class: "item-menu", href: `#/evaluasi/${jenis}` }, konten);
  };

  return h(
    "section",
    { class: "layar" },
    kepala("Evaluasi"),
    h("div", { class: "menu" }, kartu("pre"), kartu("post")),
    kotakIngat("Aturan tes", h("p", {}, "Tidak ada petunjuk selama tes. Kerjakan sendiri dengan teliti. Pembahasan muncul setelah selesai."), "info"),
  );
}

function hasilTes(jenis, hasil) {
  return h(
    "div",
    { class: "tumpuk" },
    h(
      "div",
      { class: "kartu tumpuk tengah" },
      h("span", { class: "kotak-ikon besar ungu" }, ikon("piala", 40)),
      h("h2", { class: "slide-judul" }, `${NAMA[jenis]} selesai`),
      h("p", { class: "angka-besar" }, hasil.nilai),
      h("p", { class: "redup" }, `${hasil.skor} dari ${hasil.total} soal benar`),
    ),
    h("h2", { class: "judul-bagian" }, "Pembahasan"),
    SOAL_EVALUASI.map((s, k) => {
      const jawab = hasil.jawaban[s.id];
      const benar = jawab === s.kunci;
      return h(
        "div",
        { class: `umpan ${benar ? "benar" : "salah"}` },
        h("p", { class: "judul-umpan" }, ikon(benar ? "centang" : "silang", 18), `${k + 1}. ${s.soal}`),
        h("p", { class: "kecil" }, `Jawabanmu: ${jawab ?? "(kosong)"} · Kunci: ${s.kunci}`),
        h("p", { class: "kecil" }, s.pembahasan),
      );
    }),
    h("a", { class: "tombol", href: "#/nilai" }, "Lihat Hasil Belajar"),
  );
}

export function layarTes(jenis) {
  if (!NAMA[jenis]) return layarEvaluasi();
  const tersimpan = baca().evaluasi[jenis];
  if (tersimpan) return h("section", { class: "layar" }, kepala(NAMA[jenis], "#/evaluasi"), hasilTes(jenis, tersimpan));
  if (jenis === "post" && !semuaModulSelesai()) return layarEvaluasi();

  const soal = SOAL_EVALUASI.map((s) => ({ ...s, pilihan: acak(s.pilihan) }));
  const jawaban = {};
  const mulai = Date.now();
  let i = 0;

  const wadah = h("div", { class: "tumpuk" });
  const layar = h("section", { class: "layar" }, kepala(NAMA[jenis], "#/evaluasi"), wadah);

  function kumpulkan() {
    const kosong = soal.length - Object.keys(jawaban).length;
    if (kosong > 0 && !confirm(`Masih ada ${kosong} soal yang belum dijawab. Kumpulkan sekarang?`)) return;
    const skor = soal.filter((s) => jawaban[s.id] === s.kunci).length;
    const hasil = {
      skor,
      total: soal.length,
      nilai: Math.round((skor / soal.length) * 100),
      jawaban: { ...jawaban },
      waktu: new Date().toISOString(),
      durasi: Math.round((Date.now() - mulai) / 1000),
    };
    ubah((d) => (d.evaluasi[jenis] = hasil));
    simpanEvaluasi({ jenis, skor, jawaban: hasil.jawaban, durasi: hasil.durasi });
    isi(wadah, hasilTes(jenis, hasil));
    window.scrollTo({ top: 0 });
  }

  function gambar() {
    const s = soal[i];
    const terakhir = i === soal.length - 1;
    isi(wadah, 
      h("div", { class: "progres-baris" }, h("div", { class: "progres" }, h("i", { style: { width: `${((i + 1) / soal.length) * 100}%` } })), h("span", { class: "tebal" }, `${i + 1}/${soal.length}`)),
      h(
        "div",
        { class: "kartu tumpuk" },
        h("p", { class: "teks-soal" }, `${i + 1}. ${s.soal}`),
        h(
          "div",
          { class: "pilihan-ganda", role: "radiogroup" },
          s.pilihan.map((teks, k) =>
            h(
              "button",
              {
                type: "button", class: "opsi", role: "radio", "aria-checked": String(jawaban[s.id] === teks),
                onclick: () => {
                  jawaban[s.id] = teks;
                  gambar();
                },
              },
              h("span", { class: "huruf-opsi" }, huruf(k)),
              h("span", { class: "isi-opsi" }, teks),
              h("span", { class: "radio", "aria-hidden": "true" }),
            ),
          ),
        ),
      ),
      h(
        "div",
        { class: "tombol-baris" },
        h("button", { class: "tombol-garis", type: "button", disabled: i === 0, onclick: () => (i--, gambar()) }, ikon("kiri", 18), "Sebelumnya"),
        terakhir
          ? h("button", { class: "tombol", type: "button", onclick: kumpulkan }, "Kumpulkan")
          : h("button", { class: "tombol", type: "button", onclick: () => (i++, gambar(), window.scrollTo({ top: 0 })) }, "Selanjutnya", ikon("kanan", 20)),
      ),
      h("p", { class: "kecil redup tengah" }, `Terjawab ${Object.keys(jawaban).length} dari ${soal.length} soal`),
    );
  }

  gambar();
  return layar;
}
