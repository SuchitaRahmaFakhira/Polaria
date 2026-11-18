// Hasil Belajar / Nilai (F-16).
import { h, tanggal } from "../util.js";
import { ikon } from "../ikon.js";
import { kepala, kotakIngat } from "../komponen.js";
import { baca } from "../data.js";
import { LABEL_TIPE } from "../evaluasi/soal-tetap.js";

const SARAN = {
  jenis_bilangan: "Ulangi Modul 1: Ganjil & Genap.",
  jenis_pola: "Ulangi Modul 1 dan perhatikan angka satuan.",
  lanjut_pola: "Ingat: beda tiap suku selalu 2.",
  pilih_rumus: "Ulangi Modul 2 dan buka Kartu Rumus.",
  cari_un: "Ulangi Modul 2: Pola & Rumus Un.",
  cari_n: "Ulangi contoh mencari letak suku di Modul 2.",
  cari_sn: "Ulangi Modul 3: Jumlah Suku Sn.",
  soal_cerita: "Baca soal cerita pelan-pelan: tentukan pola dan yang ditanya.",
};

export function layarNilai() {
  const { latihan, evaluasi, rmt = [] } = baca();

  const kotakNilai = (jenis, label) =>
    h(
      "div",
      { class: "kartu tengah tumpuk-kecil" },
      h("p", { class: "kecil redup" }, label),
      h("p", { class: "angka-besar" }, evaluasi[jenis] ? evaluasi[jenis].nilai : "–"),
      h("p", { class: "kecil redup" }, evaluasi[jenis] ? tanggal(evaluasi[jenis].waktu) : "belum dikerjakan"),
    );

  const terakhir = (level) => [...latihan].reverse().find((x) => x.level === level);
  const barisLevel = (level, label) => {
    const x = terakhir(level);
    return h(
      "div",
      { class: "batang-baris" },
      h("span", {}, label),
      h("div", { class: "progres" }, h("i", { style: { width: x ? `${(x.benar / x.total) * 100}%` : "0%" } })),
      h("span", { class: "kecil redup" }, x ? `${x.benar}/${x.total}` : "–"),
    );
  };

  // Gabungan per jenis soal dari semua latihan.
  const perTipe = {};
  latihan.forEach((x) =>
    Object.entries(x.perTipe || {}).forEach(([tipe, n]) => {
      perTipe[tipe] ??= { benar: 0, total: 0 };
      perTipe[tipe].benar += n.benar;
      perTipe[tipe].total += n.total;
    }),
  );
  const daftarTipe = Object.entries(perTipe).sort((a, b) => a[1].benar / a[1].total - b[1].benar / b[1].total);
  const terlemah = daftarTipe.find(([, n]) => n.benar / n.total < 0.7);

  const naik = evaluasi.pre && evaluasi.post ? evaluasi.post.nilai - evaluasi.pre.nilai : null;

  return h(
    "section",
    { class: "layar" },
    kepala("Hasil Belajar"),
    h("div", { class: "dua-kolom" }, kotakNilai("pre", "Pre-test"), kotakNilai("post", "Post-test")),
    naik !== null
      ? kotakIngat(naik >= 0 ? "Nilaimu naik!" : "Ayo coba lagi", h("p", {}, naik >= 0 ? `Post-test ${naik} poin lebih tinggi dari pre-test.` : "Ulangi materi lalu kerjakan latihan lagi."), "info")
      : null,
    h(
      "div",
      { class: "kartu tumpuk" },
      h("p", { class: "tebal" }, "Latihan (sesi terakhir)"),
      barisLevel("mudah", "Mudah"),
      barisLevel("sedang", "Sedang"),
      barisLevel("menantang", "Menantang"),
      h("p", { class: "kecil redup" }, `${latihan.length} sesi latihan dikerjakan`),
    ),
    daftarTipe.length
      ? h(
          "div",
          { class: "kartu tumpuk-kecil" },
          h("p", { class: "tebal" }, "Per jenis soal"),
          daftarTipe.map(([tipe, n]) => {
            const baik = n.benar / n.total >= 0.7;
            return h(
              "div",
              { class: "baris-antara" },
              h("span", {}, LABEL_TIPE[tipe] || tipe),
              h("span", { style: { color: baik ? "var(--benar)" : "var(--salah)", fontWeight: 600 } }, baik ? ikon("centang", 16) : ikon("silang", 16), ` ${n.benar}/${n.total}`),
            );
          }),
        )
      : h("div", { class: "kartu tengah tumpuk" }, h("p", { class: "redup" }, "Belum ada latihan. Yuk mulai!"), h("a", { class: "tombol", href: "#/latihan" }, "Mulai Latihan")),
    terlemah ? kotakIngat("Saran belajar", h("p", {}, SARAN[terlemah[0]])) : null,
    kartuRmt(rmt),
  );
}

// Diagnosis fase RMT: tahap mana yang paling sering butuh petunjuk (Input/Elaborasi/Output).
const TAHAP_RMT = [
  ["input", "Pahami (Input)", "Latih membaca soal: tulis dulu apa yang diketahui dan apa yang ditanya."],
  ["elaborasi", "Rencanakan (Elaborasi)", "Sebelum menghitung, tentukan jenis pola dan rumusnya. Buka Kartu Rumus bila perlu."],
  ["output", "Kerjakan (Output)", "Tulis langkah substitusi satu per satu dan kerjakan perkalian lebih dulu."],
  ["refleksi", "Renungkan (Refleksi)", "Biasakan memeriksa jawaban dengan n = 1 dan menjelaskan caramu."],
];

function kartuRmt(rmt) {
  if (!rmt.length) {
    return h("div", { class: "kartu tengah tumpuk" }, h("p", { class: "redup" }, "Belum ada sesi Pemecahan Masalah RMT."), h("a", { class: "tombol-garis", href: "#/rmt" }, "Coba sekarang"));
  }
  const total = Object.fromEntries(TAHAP_RMT.map(([id]) => [id, 0]));
  rmt.forEach((s) => TAHAP_RMT.forEach(([id]) => (total[id] += s.tahap?.[id]?.petunjuk || 0)));
  const maks = Math.max(1, ...Object.values(total));
  const terberat = TAHAP_RMT.reduce((a, b) => (total[b[0]] > total[a[0]] ? b : a));
  return h(
    "div",
    { class: "kartu tumpuk" },
    h("p", { class: "tebal" }, "Pemecahan Masalah RMT"),
    h("p", { class: "kecil redup" }, `${rmt.length} soal terpecahkan · petunjuk yang dipakai per tahap`),
    TAHAP_RMT.map(([id, label]) =>
      h(
        "div",
        { class: "batang-baris" },
        h("span", { class: "kecil" }, label.split(" ")[0]),
        h("div", { class: "progres kuning" }, h("i", { style: { width: `${(total[id] / maks) * 100}%` } })),
        h("span", { class: "kecil redup" }, total[id]),
      ),
    ),
    total[terberat[0]] > 0 ? kotakIngat(`Paling butuh bantuan: ${terberat[1]}`, h("p", {}, terberat[2])) : h("p", { class: "kecil redup" }, "Hebat, kamu menyelesaikan semua tahap tanpa petunjuk!"),
  );
}
