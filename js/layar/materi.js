import { h } from "../util.js";
import { ikon } from "../ikon.js";
import { baca } from "../data.js";
import { kepala, tombolRumus, bukaKartuRumus, kotakIngat } from "../komponen.js";
import { MODUL } from "../materi/konten.js";
import { statusModul } from "../progres.js";

const WARNA = { pemanasan: "kuning", modul1: "biru", modul2: "ungu", modul3: "hijau" };
const IKON = { pemanasan: "lampu", modul1: "kotak", modul2: "grafik", modul3: "tambah" };

export function layarMateri() {
  const progres = baca().progres;
  const daftar = MODUL.map((m) => {
    const status = statusModul(m.id);
    const p = progres[m.id];
    const label = { selesai: `Selesai · ${p?.skor ?? 0}/${p?.total ?? 0}`, terbuka: "Siap dipelajari", terkunci: "Selesaikan modul sebelumnya" }[status];
    const isi = [
      h("span", { class: `kotak-ikon ${WARNA[m.id]}` }, ikon(status === "selesai" ? "centang" : IKON[m.id], 24)),
      h(
        "span",
        { class: "item-teks" },
        h("span", { class: "item-judul", style: { display: "block" } }, m.judul),
        h("span", { class: "item-sub", style: { display: "block" } }, m.sub),
        h("span", { class: `status ${status === "terbuka" ? "sedang" : status}` }, label),
      ),
      h("span", { class: "chevron" }, ikon(status === "terkunci" ? "gembok" : "kanan", 18)),
    ];
    return status === "terkunci"
      ? h("div", { class: "item-menu", "aria-disabled": "true" }, isi)
      : h("a", { class: "item-menu", href: `#/modul/${m.id}` }, isi);
  });

  return h(
    "section",
    { class: "layar" },
    kepala("Materi", "#/beranda", tombolRumus()),
    kotakIngat("Belajar bertahap", h("p", {}, "Mulai dari pemanasan. Modul berikutnya terbuka setelah modul sebelumnya selesai. Kamu bisa mengulang kapan saja.")),
    h("div", { class: "menu daftar-modul" }, daftar),
    h("button", { class: "tombol-garis", type: "button", onclick: bukaKartuRumus }, ikon("buku", 20), "Buka Kartu Rumus"),
    h("a", { class: "tombol-garis", href: "#/tanya" }, ikon("tanda_tanya", 20), "Bingung? Tanya AI"),
  );
}
