import { h } from "../util.js";
import { ilustrasiAngka } from "../ikon.js";
import { baca, ubah } from "../data.js";
import { simpanSiswa } from "../supabase.js";

export const DAFTAR_KELAS = [
  ...["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((x) => `8${x}`),
  "Lainnya",
];

export function formProfil({ tombolTeks, saatSimpan }) {
  const profil = baca().profil || {};
  const galat = h("p", { class: "pesan-galat", role: "alert" });
  const nama = h("input", {
    class: "bidang", id: "nama", name: "nama", autocomplete: "name", maxlength: 60, required: true,
    placeholder: "Contoh: Rina Aulia", value: profil.nama || "",
  });
  const kelas = h(
    "select",
    { class: "bidang", id: "kelas", name: "kelas", required: true },
    h("option", { value: "" }, "Pilih kelas"),
    DAFTAR_KELAS.map((k) => h("option", { value: k, selected: profil.kelas === k }, k)),
  );
  return h(
    "form",
    {
      class: "tumpuk",
      novalidate: true,
      onsubmit: (e) => {
        e.preventDefault();
        const n = nama.value.trim().replace(/\s+/g, " ");
        if (n.length < 2) return (galat.textContent = "Tulis nama lengkapmu dulu, ya.");
        if (!kelas.value) return (galat.textContent = "Pilih kelasmu dulu, ya.");
        ubah((d) => (d.profil = { nama: n, kelas: kelas.value }));
        simpanSiswa(n, kelas.value);
        saatSimpan();
      },
    },
    h("div", { class: "tumpuk-kecil" }, h("label", { class: "label", for: "nama" }, "Nama lengkap"), nama, h("span", { class: "kecil redup" }, "Tulis seperti di absen.")),
    h("div", { class: "tumpuk-kecil" }, h("label", { class: "label", for: "kelas" }, "Kelas"), kelas),
    galat,
    h("button", { class: "tombol", type: "submit" }, tombolTeks),
  );
}

export function layarMasuk() {
  return h(
    "section",
    { class: "layar", style: { paddingTop: "24px" } },
    h("div", { class: "tengah" }, h("div", { style: { display: "flex", justifyContent: "center" } }, ilustrasiAngka(110))),
    h(
      "div",
      { class: "tengah tumpuk-kecil" },
      h("h1", { class: "judul-besar" }, "Pola Bilangan Ganjil Genap"),
      h("p", { class: "redup" }, "Belajar, latihan, dan pahami pola bilangan dengan mudah!"),
    ),
    h("div", { class: "kartu" }, formProfil({ tombolTeks: "Mulai", saatSimpan: () => (location.hash = "#/beranda") })),
  );
}
