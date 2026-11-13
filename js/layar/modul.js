// Pemutar materi: satu ide per layar, maju-mundur diatur siswa (EL01, EL04).
import { h, huruf, isi } from "../util.js";
import { ikon } from "../ikon.js";
import { kepala, tombolRumus, garisBilangan, tabelPola, visualTitik, kotakIngat, legenda } from "../komponen.js";
import { cariModul, jumlahKuis, URUTAN_MODUL } from "../materi/konten.js";
import { statusModul, selesaikanModul } from "../progres.js";

function visual(v) {
  if (!v) return null;
  if (v.jenis === "garis") return garisBilangan(20);
  if (v.jenis === "tabel") return tabelPola(v.jenisPola, 4);
  if (v.jenis === "titik") return h("div", { class: "tumpuk" }, visualTitik(v.jenisPola, v.n), legendaTitik(v.jenisPola, v.n));
  if (v.jenis === "bagi") {
    const b = v.bilangan;
    const jenis = b % 2 === 0 ? "genap" : "ganjil";
    return h(
      "div",
      { class: `hasil-kotak ${jenis}` },
      h("p", { class: "rumus-besar" }, `${b} ÷ 2 = ${Math.floor(b / 2)} sisa ${b % 2}`),
      h("p", { class: "kecil" }, `Sisa ${b % 2} → ${jenis}`),
    );
  }
  if (v.jenis === "satuan") {
    return h(
      "div",
      { class: "tabel-pola" },
      h("div", { class: "kolom-pola genap tengah" }, h("h3", {}, "Genap"), h("p", { class: "rumus-besar" }, "0 2 4 6 8"), h("p", { class: "kecil" }, "contoh: 1.35", h("b", {}, "6"))),
      h("div", { class: "kolom-pola ganjil tengah" }, h("h3", {}, "Ganjil"), h("p", { class: "rumus-besar" }, "1 3 5 7 9"), h("p", { class: "kecil" }, "contoh: 2.04", h("b", {}, "7"))),
    );
  }
  if (v.jenis === "istilah") {
    return h(
      "div",
      { class: "kartu kartu-lembut tengah tumpuk-kecil" },
      h("div", { class: "chip-baris" }, [2, 4, 6, 8].map((x) => h("span", { class: "chip genap" }, x))),
      h("p", { class: "kecil" }, "U1 = 2 · U2 = 4 · U3 = 6 · U4 = 8"),
    );
  }
  return null;
}

function legendaTitik(jenis, n) {
  const deret = Array.from({ length: n }, (_, i) => (jenis === "genap" ? 2 * (i + 1) : 2 * i + 1));
  return h("p", { class: "tengah kecil redup" }, `Setiap lapisan warna = satu suku: ${deret.join(" + ")}`);
}

export function layarModul(id) {
  const modul = cariModul(id);
  if (!modul) return h("section", { class: "layar" }, kepala("Materi", "#/materi"), h("p", {}, "Modul tidak ditemukan."));
  if (statusModul(id) === "terkunci") {
    return h(
      "section",
      { class: "layar" },
      kepala(modul.judul, "#/materi"),
      kotakIngat("Modul masih terkunci", h("p", {}, "Selesaikan modul sebelumnya dulu, ya."), "info"),
      h("a", { class: "tombol", href: "#/materi" }, "Kembali ke Materi"),
    );
  }

  const slide = modul.slide;
  const totalKuis = jumlahKuis(modul);
  const jawaban = {}; // indeks slide → indeks pilihan pertama
  let indeks = 0;
  let langkahTampil = 1;
  let selesai = false;

  const wadah = h("div", { class: "tumpuk" });
  const layar = h("section", { class: "layar" }, kepala(modul.judul, "#/materi", tombolRumus()), wadah);

  const skor = () => Object.entries(jawaban).filter(([i, p]) => slide[i].kunci === p).length;

  function pergi(ke) {
    // Ringkasan prasyarat hanya muncul jika pemanasan banyak salah.
    while (slide[ke]?.jenis === "prasyarat" && skor() >= 3) ke++;
    if (ke >= slide.length) {
      selesai = true;
      selesaikanModul(modul.id, skor(), totalKuis);
    } else {
      indeks = ke;
      langkahTampil = 1;
    }
    gambar();
    window.scrollTo({ top: 0 });
  }

  function lanjut() {
    const s = slide[indeks];
    if (s.jenis === "contoh" && langkahTampil < s.langkah.length) {
      langkahTampil++;
      return gambar();
    }
    pergi(indeks + 1);
  }

  function kembali() {
    const s = slide[indeks];
    if (s.jenis === "contoh" && langkahTampil > 1) {
      langkahTampil--;
      return gambar();
    }
    if (indeks === 0) return (location.hash = "#/materi");
    let ke = indeks - 1;
    while (slide[ke]?.jenis === "prasyarat" && skor() >= 3) ke--;
    indeks = Math.max(0, ke);
    const t = slide[indeks];
    langkahTampil = t.jenis === "contoh" ? t.langkah.length : 1;
    gambar();
  }

  function pilihanGanda(s) {
    const dipilih = jawaban[indeks];
    const sudah = dipilih !== undefined;
    return h(
      "div",
      { class: "pilihan-ganda", role: "radiogroup" },
      s.pilihan.map((teks, i) => {
        let kelas = "opsi";
        if (sudah && i === s.kunci) kelas += " benar";
        else if (sudah && i === dipilih) kelas += " salah";
        return h(
          "button",
          {
            type: "button", class: kelas, role: "radio", "aria-checked": String(i === dipilih), disabled: sudah,
            onclick: () => {
              jawaban[indeks] = i;
              gambar();
            },
          },
          h("span", { class: "huruf-opsi" }, huruf(i)),
          h("span", { class: "isi-opsi" }, teks),
        );
      }),
    );
  }

  function umpan(s) {
    if (jawaban[indeks] === undefined) return null;
    const benar = jawaban[indeks] === s.kunci;
    return h(
      "div",
      { class: `umpan ${benar ? "benar" : "salah"}`, role: "status" },
      h("p", { class: "judul-umpan" }, ikon(benar ? "centang" : "silang", 20), benar ? "Benar!" : "Belum tepat."),
      h("p", {}, s.penjelasan),
    );
  }

  function isiSlide(s) {
    switch (s.jenis) {
      case "teks":
        return h(
          "div",
          { class: "kartu tumpuk" },
          h("h2", { class: "slide-judul" }, s.judul),
          h("div", { class: "paragraf" }, s.paragraf.map((p) => h("p", {}, p))),
          visual(s.visual),
        );
      case "contoh":
        return h(
          "div",
          { class: "kartu tumpuk" },
          h("div", { class: "baris-antara" }, h("span", { class: "label-pil" }, "Contoh soal"), h("span", { class: "kecil redup" }, `Langkah ${langkahTampil}/${s.langkah.length}`)),
          h("p", { class: "teks-soal" }, s.soal),
          h(
            "ol",
            { class: "langkah-contoh" },
            s.langkah.map((l, i) => h("li", { class: i < langkahTampil ? "" : "tertutup", "aria-hidden": String(i >= langkahTampil) }, i < langkahTampil ? l : "…")),
          ),
          h("p", { class: "kecil redup" }, langkahTampil < s.langkah.length ? "Ketuk Lanjut untuk langkah berikutnya." : "Semua langkah sudah tampil."),
        );
      case "lengkapi":
        return h(
          "div",
          { class: "kartu tumpuk" },
          h("span", { class: "label-pil" }, "Lengkapi langkahnya"),
          h("p", { class: "teks-soal" }, s.soal),
          h("ol", { class: "langkah-contoh" }, s.langkah.map((l) => h("li", {}, l))),
          pilihanGanda(s),
          umpan(s),
        );
      case "kuis":
      case "kenapa":
        return h(
          "div",
          { class: "kartu tumpuk" },
          h("span", { class: "label-pil" }, s.jenis === "kenapa" ? "Kenapa?" : "Coba kamu"),
          h("p", { class: "teks-soal" }, s.soal),
          pilihanGanda(s),
          umpan(s),
        );
      case "prasyarat":
        return h(
          "div",
          { class: "kartu tumpuk" },
          h("h2", { class: "slide-judul" }, s.judul),
          h("p", { class: "redup" }, "Beberapa jawabanmu belum tepat. Yuk, ingat lagi hal-hal ini:"),
          h("ul", { class: "paragraf", style: { paddingLeft: "20px", margin: 0 } }, s.poin.map((p) => h("li", {}, p))),
        );
      case "ringkasan":
        return h(
          "div",
          { class: "kartu tumpuk" },
          h("h2", { class: "slide-judul" }, s.judul),
          h("ul", { class: "paragraf", style: { paddingLeft: "20px", margin: 0 } }, s.poin.map((p) => h("li", {}, p))),
          legenda(),
        );
      default:
        return null;
    }
  }

  function layarSelesai() {
    const i = URUTAN_MODUL.indexOf(modul.id);
    const berikut = URUTAN_MODUL[i + 1] && cariModul(URUTAN_MODUL[i + 1]);
    const n = skor();
    return h(
      "div",
      { class: "kartu tumpuk tengah" },
      h("span", { class: "kotak-ikon besar hijau" }, ikon("centang", 40)),
      h("h2", { class: "slide-judul" }, `${modul.judul} selesai!`),
      h("p", {}, `Jawaban benar: ${n} dari ${totalKuis}`),
      h("p", { class: "redup kecil" }, n < totalKuis ? "Kamu bisa mengulang modul ini kapan saja." : "Luar biasa, semua benar!"),
      berikut
        ? h("a", { class: "tombol", href: `#/modul/${berikut.id}` }, `Lanjut: ${berikut.judul}`, ikon("kanan", 20))
        : h("a", { class: "tombol", href: "#/latihan" }, "Lanjut ke Latihan Soal", ikon("kanan", 20)),
      h("a", { class: "tombol-garis", href: "#/materi" }, "Kembali ke Materi"),
    );
  }

  function gambar() {
    if (selesai) return isi(wadah, layarSelesai());
    const s = slide[indeks];
    const perluJawab = ["kuis", "kenapa", "lengkapi"].includes(s.jenis) && jawaban[indeks] === undefined;
    const persen = ((indeks + 1) / slide.length) * 100;
    isi(wadah, 
      h("div", { class: "progres-baris" }, h("div", { class: "progres" }, h("i", { style: { width: `${persen}%` } })), h("span", { class: "kecil redup" }, `${indeks + 1}/${slide.length}`)),
      isiSlide(s),
      h(
        "div",
        { class: "tombol-baris" },
        h("button", { class: "tombol-garis", type: "button", onclick: kembali }, ikon("kiri", 20), "Kembali"),
        h("button", { class: "tombol", type: "button", onclick: lanjut, disabled: perluJawab }, indeks === slide.length - 1 ? "Selesai" : "Lanjut", ikon("kanan", 20)),
      ),
      perluJawab ? h("p", { class: "kecil redup tengah" }, "Pilih jawaban dulu untuk lanjut.") : null,
    );
  }

  gambar();
  return layar;
}
