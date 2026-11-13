// Generator Pola Bilangan (F-14) — data dari API Python /api/pola.
import { h, isi } from "../util.js";
import { ikon } from "../ikon.js";
import { kepala, kotakIngat, titikJenis } from "../komponen.js";
import { buatPola } from "../api.js";

export function layarGenerator() {
  let jenis = "genap";
  let jumlah = 5;

  const hasil = h("div", { class: "tumpuk", "aria-live": "polite" });
  const galat = h("p", { class: "pesan-galat", role: "alert" });
  const keluaran = h("output", { "aria-live": "polite" }, String(jumlah));

  const opsi = ["genap", "ganjil"].map((j) =>
    h(
      "button",
      {
        type: "button", class: "opsi-jenis", "aria-pressed": String(j === jenis),
        onclick: () => {
          jenis = j;
          opsi.forEach((o) => o.setAttribute("aria-pressed", String(o.dataset.jenis === jenis)));
        },
        dataset: { jenis: j },
      },
      titikJenis(`var(--${j})`),
      j === "genap" ? "Genap" : "Ganjil",
      h("span", { class: "centang" }, ikon("centang", 14)),
    ),
  );

  const ubahJumlah = (d) => {
    jumlah = Math.min(20, Math.max(1, jumlah + d));
    keluaran.textContent = String(jumlah);
  };

  const tombol = h("button", { class: "tombol", type: "button", onclick: buat }, ikon("kilau", 20), "Buat Pola");

  async function buat() {
    galat.textContent = "";
    tombol.disabled = true;
    isi(hasil, h("div", { class: "memuat" }, "Membuat pola…"));
    try {
      const d = await buatPola(jenis, jumlah);
      const nama = d.jenis === "genap" ? "Genap" : "Ganjil";
      isi(hasil, 
        h(
          "div",
          { class: "kartu tumpuk" },
          h("h3", { class: "tengah tebal" }, `Hasil Pola Bilangan ${nama}`),
          h("div", { class: "chip-baris" }, d.barisan.map((x) => h("span", { class: `chip ${d.jenis}` }, x))),
        ),
        kotakIngat(
          "Keterangan:",
          h(
            "ul",
            {},
            h("li", {}, `Suku pertama = ${d.suku_pertama}`),
            h("li", {}, `Beda = ${d.beda}`),
            h("li", {}, `Rumus: ${d.rumus_un}`),
            h("li", {}, `Suku ke-${d.jumlah}: U${d.jumlah} = ${d.langkah_un.slice(1).map((l) => l.replace(`U${d.jumlah} = `, "")).join(" = ")}`),
          ),
          "info",
        ),
        h(
          "div",
          { class: "kartu tumpuk-kecil" },
          h("p", { class: "tebal" }, `Jumlah ${d.jumlah} suku pertama (S${d.jumlah})`),
          h("ul", { class: "langkah" }, d.langkah_sn.map((l) => h("li", {}, l))),
        ),
      );
    } catch (err) {
      isi(hasil);
      galat.textContent = err.message;
    } finally {
      tombol.disabled = false;
    }
  }

  return h(
    "section",
    { class: "layar" },
    kepala("Generator Pola Bilangan"),
    h(
      "div",
      { class: "tengah tumpuk-kecil" },
      h("div", { class: "chip-baris", "aria-hidden": "true" }, [2, 4, 6, 8, 10].map((x) => h("span", { class: "chip genap" }, x))),
      h("h2", { class: "slide-judul" }, "Generator Pola Bilangan"),
      h("p", { class: "redup kecil" }, "Pilih jenis pola dan tentukan jumlah suku."),
    ),
    h("div", { class: "tumpuk-kecil" }, h("p", { class: "label" }, "Jenis Pola"), h("div", { class: "pilih-jenis" }, opsi)),
    h(
      "div",
      { class: "tumpuk-kecil" },
      h("p", { class: "label" }, "Jumlah Suku"),
      h(
        "div",
        { class: "stepper" },
        h("button", { class: "tombol-bulat", type: "button", "aria-label": "Kurangi", onclick: () => ubahJumlah(-1) }, ikon("kurang", 20)),
        keluaran,
        h("button", { class: "tombol-bulat", type: "button", "aria-label": "Tambah", onclick: () => ubahJumlah(1) }, ikon("tambah", 20)),
      ),
      h("p", { class: "kecil redup" }, "Pilih 1 sampai 20 suku."),
    ),
    tombol,
    galat,
    hasil,
  );
}
