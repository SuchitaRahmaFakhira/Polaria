// Kalkulator Ganjil Genap (F-13) — perhitungan oleh API Python /api/kalkulator.
import { h, angka, isi } from "../util.js";
import { ikon } from "../ikon.js";
import { kepala, kotakIngat } from "../komponen.js";
import { kalkulator } from "../api.js";

export function layarKalkulator() {
  const hasil = h("div", { "aria-live": "polite" });
  const galat = h("p", { class: "pesan-galat", role: "alert" });
  const masukan = h("input", {
    class: "bidang", id: "bilangan", type: "text", inputmode: "numeric", autocomplete: "off",
    placeholder: "Contoh: 17", maxlength: 9,
    oninput: () => {
      masukan.value = masukan.value.replace(/[^\d]/g, "");
      galat.textContent = "";
    },
  });
  const hapus = h("button", {
    class: "bidang-hapus", type: "button", "aria-label": "Hapus",
    onclick: () => {
      masukan.value = "";
      isi(hasil);
      masukan.focus();
    },
  }, ikon("silang", 16));
  const tombol = h("button", { class: "tombol", type: "submit" }, ikon("kalkulator", 20), "Hitung");

  async function hitung(e) {
    e.preventDefault();
    galat.textContent = "";
    if (masukan.value === "") return (galat.textContent = "Masukkan sebuah bilangan dulu, ya.");
    tombol.disabled = true;
    isi(hasil, h("div", { class: "memuat" }, "Menghitung…"));
    try {
      tampilkan(await kalkulator(masukan.value));
    } catch (err) {
      isi(hasil);
      galat.textContent = err.message;
    } finally {
      tombol.disabled = false;
    }
  }

  function tampilkan(d) {
    const jenisBesar = d.jenis === "genap" ? "BILANGAN GENAP" : "BILANGAN GANJIL";
    isi(hasil, 
      h(
        "div",
        { class: "kartu tumpuk" },
        h("span", { class: "label-pil" }, "Hasil Perhitungan"),
        h("div", { class: `hasil-kotak ${d.jenis}` }, h("p", { class: "hasil-jenis" }, jenisBesar), h("p", { class: "hasil-angka" }, angka(d.bilangan))),
        h("div", { class: "tumpuk-kecil" }, h("p", { class: "tebal" }, "Cara Perhitungan:"), h("p", { class: "rumus-besar" }, d.cara)),
        h("p", {}, d.penjelasan),
        h(
          "div",
          { class: "tumpuk-kecil" },
          h("p", { class: "tebal" }, "Posisi dalam pola:"),
          d.posisi.langkah.length ? h("ul", { class: "langkah" }, d.posisi.langkah.map((l) => h("li", {}, l))) : null,
          h("p", {}, d.posisi.kalimat),
        ),
        h("span", { class: "badge" }, ikon("centang", 16), "Perhitungan berhasil"),
      ),
    );
  }

  return h(
    "section",
    { class: "layar" },
    kepala("Kalkulator Ganjil Genap"),
    h(
      "div",
      { class: "tengah tumpuk-kecil" },
      h("span", { class: "kotak-ikon besar ungu" }, ikon("kalkulator", 40)),
      h("h2", { class: "slide-judul" }, "Kalkulator Ganjil Genap"),
      h("p", { class: "redup kecil" }, "Masukkan angka yang ingin diperiksa"),
    ),
    h(
      "form",
      { class: "tumpuk", onsubmit: hitung, novalidate: true },
      h("label", { class: "label", for: "bilangan" }, "Masukkan bilangan"),
      h("div", { class: "bidang-bungkus" }, masukan, hapus),
      galat,
      tombol,
    ),
    hasil,
    kotakIngat("Ingat!", h("p", {}, "Bilangan genap memiliki sisa 0, sedangkan bilangan ganjil memiliki sisa 1 jika dibagi 2.")),
  );
}
