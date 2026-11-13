// Pengaturan (F-17): profil, tampilan, pasang aplikasi.
import { h } from "../util.js";
import { ikon } from "../ikon.js";
import { kepala, bukaLembar, bukaPanduanPasang, pemberitahuan } from "../komponen.js";
import { baca, ubah } from "../data.js";
import { terapkanTampilan } from "../tema.js";
import { formProfil } from "./masuk.js";
import { supabaseAktif } from "../supabase.js";
import { jumlahAntrian } from "../cache.js";

export function layarPengaturan() {
  const { profil, pengaturan } = baca();

  const segmenTema = h(
    "div",
    { class: "segmen", role: "group", "aria-label": "Tema" },
    [["sistem", "Otomatis"], ["terang", "Terang"], ["gelap", "Gelap"]].map(([nilai, label]) =>
      h(
        "button",
        {
          type: "button", "aria-pressed": String(pengaturan.tema === nilai),
          onclick: (e) => {
            ubah((d) => (d.pengaturan.tema = nilai));
            terapkanTampilan();
            segmenTema.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === e.currentTarget)));
          },
        },
        label,
      ),
    ),
  );

  const hurufBesar = h("input", {
    type: "checkbox", role: "switch", "aria-label": "Huruf besar", checked: pengaturan.hurufBesar,
    onchange: () => {
      ubah((d) => (d.pengaturan.hurufBesar = hurufBesar.checked));
      terapkanTampilan();
    },
  });

  const ubahProfil = () =>
    bukaLembar("Ubah profil", (tutup) =>
      formProfil({
        tombolTeks: "Simpan",
        saatSimpan: () => {
          tutup();
          pemberitahuan("Profil tersimpan.");
          window.dispatchEvent(new HashChangeEvent("hashchange"));
        },
      }),
    );

  const tentang = () =>
    bukaLembar(
      "Tentang Polaria",
      h(
        "div",
        { class: "tumpuk-kecil" },
        h("p", {}, "Polaria membantu siswa SMP kelas VIII belajar pola bilangan ganjil dan genap secara bertahap."),
        h("p", { class: "kecil redup" }, "Dikembangkan oleh Suchita Rahma Fakhira (S1 Pendidikan Matematika) dengan model ADDIE dan Cognitive Load Theory."),
        h("p", { class: "kecil redup" }, supabaseAktif() ? `Data tersinkron ke server. Menunggu dikirim: ${jumlahAntrian()} catatan.` : "Mode lokal: data tersimpan di perangkat ini saja."),
      ),
    );

  const baris = (ikonNama, label, kanan) =>
    h("div", { class: "baris-atur" }, h("span", { class: "baris" }, h("span", { class: "redup" }, ikon(ikonNama, 20)), label), kanan);

  return h(
    "section",
    { class: "layar" },
    kepala("Pengaturan", null),
    h("h2", { class: "judul-bagian" }, "Profil"),
    h(
      "div",
      { class: "kartu", style: { paddingTop: "6px", paddingBottom: "6px" } },
      baris("orang", h("span", {}, h("span", { class: "tebal" }, profil?.nama || "-"), h("br"), h("span", { class: "kecil redup" }, `Kelas ${profil?.kelas || "-"}`)), h("button", { class: "tombol-teks", type: "button", onclick: ubahProfil }, "Ubah")),
    ),
    h("h2", { class: "judul-bagian" }, "Tampilan"),
    h(
      "div",
      { class: "kartu", style: { paddingTop: "6px", paddingBottom: "6px" } },
      baris("bulan", "Tema", segmenTema),
      baris("huruf", "Huruf besar", h("label", { class: "sakelar" }, hurufBesar, h("span"))),
    ),
    h("h2", { class: "judul-bagian" }, "Aplikasi"),
    h(
      "div",
      { class: "menu" },
      h("button", { class: "item-menu", type: "button", onclick: bukaPanduanPasang }, h("span", { class: "kotak-ikon ungu" }, ikon("unduh", 24)), h("span", { class: "item-teks item-judul" }, "Pasang di HP"), h("span", { class: "chevron" }, ikon("kanan", 18))),
      h("button", { class: "item-menu", type: "button", onclick: tentang }, h("span", { class: "kotak-ikon biru" }, ikon("info", 24)), h("span", { class: "item-teks item-judul" }, "Tentang Polaria"), h("span", { class: "chevron" }, ikon("kanan", 18))),
    ),
  );
}
