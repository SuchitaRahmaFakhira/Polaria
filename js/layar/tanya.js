// Tanya AI (F-22): siswa bertanya matematika dengan bebas; Gemini menjelaskan
// materi dan membimbing langkah penyelesaian (Pahami → Rencanakan → Kerjakan → Periksa).
import { h, isi } from "../util.js";
import { ikon } from "../ikon.js";
import { kepala, kotakIngat, tombolRumus } from "../komponen.js";
import { tanyaAI } from "../api.js";
import { ambilKonfigurasi } from "../config.js";
import { teksTerformat } from "../tutor.js";

const KUNCI_SESI = "polaria:tanya";
const CONTOH = [
  "Apa bedanya pola bilangan ganjil dan genap?",
  "Bagaimana cara mencari suku ke-20 pola ganjil?",
  "Apa beda Un dan Sn?",
  "Jumlah 15 bilangan genap pertama berapa? Bantu langkahnya.",
];

function bacaRiwayat() {
  try {
    return JSON.parse(sessionStorage.getItem(KUNCI_SESI) || "[]");
  } catch {
    return [];
  }
}

function simpanRiwayat(r) {
  try {
    sessionStorage.setItem(KUNCI_SESI, JSON.stringify(r.slice(-20)));
  } catch {
    /* abaikan */
  }
}

export function layarTanya() {
  const riwayat = bacaRiwayat();
  let sibuk = false;

  const status = h("p", { class: "kecil redup" }, "Memeriksa tutor AI…");
  const daftarPesan = h("div", { class: "tumpuk percakapan", "aria-live": "polite" });
  const galat = h("p", { class: "pesan-galat", role: "alert" });
  const masukan = h("textarea", {
    class: "bidang area-teks", rows: 3, maxlength: 600, id: "pertanyaan-ai",
    placeholder: "Tulis pertanyaan matematikamu…", "aria-label": "Pertanyaan untuk tutor AI",
  });
  const tombol = h("button", { class: "tombol", type: "submit" }, ikon("kilau", 20), "Tanya");
  const saran = h(
    "div",
    { class: "chip-pilihan" },
    CONTOH.map((c) => h("button", { type: "button", class: "chip-opsi", "aria-pressed": "false", onclick: () => kirim(c) }, c)),
  );

  ambilKonfigurasi().then((k) => {
    status.textContent = k.ai_aktif
      ? "Tutor AI aktif. Ia menjelaskan materi dan membimbing langkahmu."
      : "Tutor AI belum aktif di server (GEMINI_API_KEY belum diatur).";
    status.classList.toggle("pesan-galat", !k.ai_aktif);
  });

  function gambar() {
    isi(
      daftarPesan,
      riwayat.length
        ? riwayat.map((g) =>
            g.peran === "siswa"
              ? h("p", { class: "gelembung-siswa" }, g.teks)
              : h(
                  "div",
                  { class: "gelembung-tutor" },
                  h(
                    "div",
                    { class: "gelembung-kepala" },
                    h("span", { class: "avatar-tutor", "aria-hidden": "true" }, ikon("lampu", 18)),
                    h("span", { class: "tebal" }, "Tutor Polaria"),
                    h("span", { class: "label-sumber" }, "AI"),
                  ),
                  teksTerformat(g.teks),
                ),
          )
        : null,
      sibuk ? h("div", { class: "gelembung-tutor memuat-tutor" }, h("p", { class: "kecil redup" }, "Tutor sedang berpikir…")) : null,
    );
    tombol.disabled = sibuk;
    saran.hidden = riwayat.length > 0;
  }

  async function kirim(teks) {
    const pertanyaan = String(teks ?? masukan.value).trim();
    galat.textContent = "";
    if (sibuk) return;
    if (pertanyaan.length < 2) return masukan.focus();
    const sebelumnya = riwayat.slice();
    riwayat.push({ peran: "siswa", teks: pertanyaan });
    masukan.value = "";
    sibuk = true;
    gambar();
    daftarPesan.lastElementChild?.scrollIntoView({ block: "end", behavior: "smooth" });
    try {
      const r = await tanyaAI(pertanyaan, sebelumnya);
      riwayat.push({ peran: "tutor", teks: r.jawaban });
      simpanRiwayat(riwayat);
    } catch (e) {
      riwayat.pop();
      masukan.value = pertanyaan;
      galat.textContent = e.message;
    }
    sibuk = false;
    gambar();
    daftarPesan.lastElementChild?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  gambar();
  return h(
    "section",
    { class: "layar" },
    kepala("Tanya AI", "#/beranda", tombolRumus()),
    h(
      "div",
      { class: "kartu kartu-lembut baris" },
      h("span", { class: "kotak-ikon biru", style: { background: "var(--surface)" } }, ikon("tanda_tanya", 26)),
      h("div", {}, h("p", { class: "tebal" }, "Tanya apa saja tentang matematika"), status),
    ),
    saran,
    daftarPesan,
    h(
      "form",
      { class: "tumpuk-kecil", onsubmit: (e) => (e.preventDefault(), kirim()) },
      masukan,
      galat,
      h(
        "div",
        { class: "tombol-baris" },
        h("button", { class: "tombol-garis", type: "button", onclick: () => { riwayat.length = 0; simpanRiwayat(riwayat); gambar(); } }, ikon("ulang", 18), "Baru"),
        tombol,
      ),
    ),
    kotakIngat("Tips", h("p", {}, "Tulis soalnya lengkap. Untuk soal latihan, tutor membimbing langkahnya dan memintamu menyelesaikan hitungan terakhir."), "info"),
  );
}
