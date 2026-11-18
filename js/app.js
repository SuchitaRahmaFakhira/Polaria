// Router berbasis hash + navigasi bawah + pendaftaran service worker.
import { h, isi } from "./util.js";
import { ikon } from "./ikon.js";
import { baca } from "./data.js";
import { terapkanTampilan } from "./tema.js";
import { panaskan, siapkanCadangan } from "./api.js";
import { sinkron } from "./supabase.js";
import { layarMasuk } from "./layar/masuk.js";
import { layarBeranda } from "./layar/beranda.js";
import { layarMateri } from "./layar/materi.js";
import { layarModul } from "./layar/modul.js";
import { layarKalkulator } from "./layar/kalkulator.js";
import { layarGenerator } from "./layar/generator.js";
import { layarPilihLevel, layarLatihan } from "./layar/latihan.js";
import { layarEvaluasi, layarTes } from "./layar/evaluasi.js";
import { layarNilai } from "./layar/nilai.js";
import { layarPengaturan } from "./layar/pengaturan.js";
import { layarPilihRmt, layarRmt } from "./layar/rmt.js";
import { layarTanya } from "./layar/tanya.js";

const app = document.getElementById("app");

const RUTE = {
  beranda: () => layarBeranda(),
  materi: () => layarMateri(),
  modul: (id) => layarModul(id),
  kalkulator: () => layarKalkulator(),
  generator: () => layarGenerator(),
  latihan: (level) => (level ? layarLatihan(level) : layarPilihLevel()),
  rmt: (level) => (level ? layarRmt(level) : layarPilihRmt()),
  tanya: () => layarTanya(),
  evaluasi: (jenis) => (jenis ? layarTes(jenis) : layarEvaluasi()),
  nilai: () => layarNilai(),
  pengaturan: () => layarPengaturan(),
};

const JUDUL = {
  beranda: "Beranda", materi: "Materi", modul: "Materi", kalkulator: "Kalkulator Ganjil Genap",
  generator: "Generator Pola Bilangan", latihan: "Latihan Soal", rmt: "Pemecahan Masalah", tanya: "Tanya AI", evaluasi: "Evaluasi",
  nilai: "Hasil Belajar", pengaturan: "Pengaturan", masuk: "Masuk",
};

const TAB = [
  { id: "beranda", label: "Beranda", ikon: "beranda", cocok: ["beranda", "kalkulator", "generator", "latihan", "rmt", "tanya", "evaluasi"] },
  { id: "materi", label: "Materi", ikon: "buku", cocok: ["materi", "modul"] },
  { id: "nilai", label: "Nilai", ikon: "piala", cocok: ["nilai"] },
  { id: "pengaturan", label: "Pengaturan", ikon: "gerigi", cocok: ["pengaturan"] },
];

const tautanTab = TAB.map((t) => h("a", { href: `#/${t.id}`, dataset: { tab: t.id } }, ikon(t.ikon, 24), t.label));
document.body.append(h("nav", { class: "nav-bawah", "aria-label": "Navigasi utama" }, h("ul", {}, tautanTab.map((a) => h("li", {}, a)))));

let layarAktif = null;

function tampilkan() {
  const jalur = location.hash.replace(/^#\/?/, "").split("?")[0];
  let [nama, param] = jalur.split("/");
  const punyaProfil = Boolean(baca().profil);

  if (!punyaProfil) nama = "masuk";
  else if (!RUTE[nama]) nama = "beranda";

  layarAktif?.bersihkan?.();
  document.querySelectorAll(".lembar, .tirai").forEach((el) => el.remove());

  layarAktif = nama === "masuk" ? layarMasuk() : RUTE[nama](param);
  isi(app, layarAktif);
  document.body.classList.toggle("tanpa-nav", nama === "masuk");
  document.title = `${JUDUL[nama] || "Polaria"} · Polaria`;

  const tab = TAB.find((t) => t.cocok.includes(nama));
  tautanTab.forEach((a) => (a.dataset.tab === tab?.id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));

  window.scrollTo({ top: 0 });
  app.focus({ preventScroll: true });
}

window.addEventListener("hashchange", tampilkan);
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", terapkanTampilan);

terapkanTampilan();
tampilkan();

// Kerja latar: bangunkan fungsi Python, simpan cadangan soal, kirim antrian.
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  panaskan().then(() => siapkanCadangan());
  sinkron();
});
