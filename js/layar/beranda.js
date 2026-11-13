import { h, isi } from "../util.js";
import { ikon, ilustrasiAngka } from "../ikon.js";
import { baca } from "../data.js";
import { itemMenu, bukaPanduanPasang } from "../komponen.js";
import { modulBerikutnya } from "../progres.js";
import { cariModul } from "../materi/konten.js";
import { sudahTerpasang, saatBerubah } from "../pasang.js";

export const MENU_UTAMA = [
  { judul: "Materi", sub: "Pelajari konsep dasar bilangan ganjil dan genap.", ikonNama: "buku", warna: "biru", href: "#/materi" },
  { judul: "Kalkulator Ganjil Genap", sub: "Cek bilangan dan lihat cara perhitungannya.", ikonNama: "kalkulator", warna: "biru", href: "#/kalkulator" },
  { judul: "Generator Pola Bilangan", sub: "Buat pola bilangan secara otomatis.", ikonNama: "kotak", warna: "hijau", href: "#/generator" },
  { judul: "Latihan Soal", sub: "Kerjakan soal interaktif sesuai materi.", ikonNama: "kotak", warna: "jingga", href: "#/latihan" },
  { judul: "Evaluasi", sub: "Uji pemahamanmu dengan tes pilihan ganda.", ikonNama: "piala", warna: "ungu", href: "#/evaluasi" },
  { judul: "Hasil Belajar", sub: "Lihat perkembangan belajarmu.", ikonNama: "grafik", warna: "kuning", href: "#/nilai" },
];

export function layarBeranda() {
  const { profil } = baca();
  const berikut = modulBerikutnya();
  const modul = berikut && cariModul(berikut);

  const sorot = h(
    "a",
    { class: "kartu-sorot", href: modul ? `#/modul/${modul.id}` : "#/latihan", style: { textDecoration: "none" } },
    h("span", { class: "kotak-ikon ungu" }, ikon("lampu", 28)),
    h(
      "span",
      { class: "item-teks" },
      h("span", { class: "item-judul", style: { display: "block" } }, modul ? "Ayo mulai belajar!" : "Hebat, materi selesai!"),
      h("span", { class: "item-sub", style: { display: "block" } }, modul ? `Lanjut: ${modul.judul}` : "Asah kemampuanmu di Latihan Soal."),
    ),
    h("span", { class: "chevron", style: { background: "var(--surface)" } }, ikon("kanan", 18)),
  );

  const wadahPasang = h("div");
  const gambarPasang = () => {
    isi(wadahPasang, 
      sudahTerpasang()
        ? ""
        : h("button", { class: "tombol-garis", type: "button", style: { width: "100%" }, onclick: bukaPanduanPasang }, ikon("unduh", 20), "Pasang Aplikasi di HP"),
    );
  };
  gambarPasang();
  const lepas = saatBerubah(gambarPasang);

  const layar = h(
    "section",
    { class: "layar" },
    h(
      "div",
      { class: "beranda-atas" },
      h(
        "div",
        {},
        h("h1", { class: "judul-besar" }, "Pola Bilangan", h("br"), "Ganjil Genap"),
        h("p", { class: "sapaan" }, `Halo, ${profil?.nama?.split(" ")[0] || "kamu"}! Kelas ${profil?.kelas || "-"}`),
      ),
      ilustrasiAngka(108),
    ),
    sorot,
    h("h2", { class: "judul-bagian" }, "Menu Utama"),
    h("nav", { class: "menu", "aria-label": "Menu utama" }, MENU_UTAMA.map(itemMenu)),
    wadahPasang,
  );
  layar.bersihkan = lepas;
  return layar;
}
