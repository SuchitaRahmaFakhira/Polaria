// Komponen tampilan yang dipakai ulang di banyak layar.
import { h, s, MINUS } from "./util.js";
import { ikon } from "./ikon.js";
import { perangkatIos, bisaPasangOtomatis, pasangSekarang, sudahTerpasang } from "./pasang.js";

export function kepala(judul, kembaliKe = "#/beranda", kanan = null) {
  return h(
    "header",
    { class: "kepala" },
    kembaliKe
      ? h("a", { class: "tombol-bulat", href: kembaliKe, "aria-label": "Kembali" }, ikon("kiri", 22))
      : h("span"),
    h("h1", {}, judul),
    kanan || h("span"),
  );
}

export function itemMenu({ judul, sub, ikonNama, warna, href, terkunci = false, onclick }) {
  const isi = [
    h("span", { class: `kotak-ikon ${warna}` }, ikon(ikonNama, 26)),
    h("span", { class: "item-teks" }, h("span", { class: "item-judul" }, judul), sub && h("span", { class: "item-sub", style: { display: "block" } }, sub)),
    h("span", { class: "chevron" }, ikon(terkunci ? "gembok" : "kanan", 18)),
  ];
  if (terkunci) return h("div", { class: "item-menu", "aria-disabled": "true" }, isi);
  if (href) return h("a", { class: "item-menu", href }, isi);
  return h("button", { class: "item-menu", type: "button", onclick }, isi);
}

export function kotakIngat(judul, isi, varian = "") {
  return h(
    "div",
    { class: `kotak-ingat ${varian}`.trim() },
    ikon(varian === "info" ? "info" : "lampu", 22),
    h("div", {}, h("strong", {}, judul), isi),
  );
}

// ---------- lembar bawah ----------

export function bukaLembar(judul, isi) {
  const sebelumnya = document.activeElement;
  const tirai = h("div", { class: "tirai" });
  const tutup = () => {
    tirai.remove();
    lembar.remove();
    document.removeEventListener("keydown", tekanTombol);
    sebelumnya?.focus?.();
  };
  const tekanTombol = (e) => e.key === "Escape" && tutup();
  const tombolTutup = h("button", { class: "tombol-bulat", type: "button", "aria-label": "Tutup", onclick: tutup }, ikon("silang", 20));
  const lembar = h(
    "div",
    { class: "lembar", role: "dialog", "aria-modal": "true", "aria-label": judul },
    h("div", { class: "lembar-kepala" }, h("h2", {}, judul), tombolTutup),
    typeof isi === "function" ? isi(tutup) : isi,
  );
  tirai.addEventListener("click", tutup);
  document.addEventListener("keydown", tekanTombol);
  document.body.append(tirai, lembar);
  tombolTutup.focus();
  return tutup;
}

export function bukaKartuRumus() {
  bukaLembar(
    "Kartu Rumus",
    h(
      "div",
      { class: "tumpuk" },
      h(
        "div",
        { class: "rumus-kartu genap" },
        h("h3", {}, "GENAP  ·  2, 4, 6, 8, …"),
        h("p", { class: "baris-rumus" }, "Un = 2n"),
        h("p", { class: "baris-rumus" }, "Sn = n(n + 1)"),
        h("p", { class: "kecil redup" }, "Posisi bilangan b: n = b ÷ 2"),
      ),
      h(
        "div",
        { class: "rumus-kartu ganjil" },
        h("h3", {}, "GANJIL  ·  1, 3, 5, 7, …"),
        h("p", { class: "baris-rumus" }, `Un = 2n ${MINUS} 1`),
        h("p", { class: "baris-rumus" }, "Sn = n²"),
        h("p", { class: "kecil redup" }, "Posisi bilangan b: n = (b + 1) ÷ 2"),
      ),
      h("p", { class: "kecil redup" }, "n = nomor urut suku · Un = suku ke-n · Sn = jumlah n suku pertama"),
    ),
  );
}

export function tombolRumus() {
  return h("button", { class: "tombol-bulat", type: "button", "aria-label": "Buka kartu rumus", onclick: bukaKartuRumus }, ikon("buku", 20));
}

export function bukaPanduanPasang() {
  if (sudahTerpasang()) {
    pemberitahuan("Polaria sudah terpasang di perangkat ini.");
    return;
  }
  if (bisaPasangOtomatis()) {
    pasangSekarang();
    return;
  }
  const ios = perangkatIos();
  bukaLembar(
    "Pasang Polaria di HP-mu",
    h(
      "div",
      { class: "tumpuk" },
      ios
        ? h(
            "ol",
            { class: "langkah-pasang" },
            h("li", {}, "Buka Polaria di ", h("b", {}, "Safari"), "."),
            h("li", {}, "Ketuk ikon ", h("b", {}, "Bagikan"), " ", ikon("bagikan", 18), " di bawah layar."),
            h("li", {}, "Pilih ", h("b", {}, "Tambahkan ke Layar Utama"), "."),
            h("li", {}, "Ketuk ", h("b", {}, "Tambah"), ". Ikon Polaria muncul di layar utama."),
          )
        : h(
            "ol",
            { class: "langkah-pasang" },
            h("li", {}, "Buka Polaria di ", h("b", {}, "Chrome"), "."),
            h("li", {}, "Ketuk menu ", h("b", {}, "⋮"), " di kanan atas."),
            h("li", {}, "Pilih ", h("b", {}, "Instal aplikasi"), " atau ", h("b", {}, "Tambahkan ke layar utama"), "."),
            h("li", {}, "Ketuk ", h("b", {}, "Pasang"), "."),
          ),
      h("p", { class: "kecil redup" }, "Tidak perlu Play Store atau App Store. Aplikasi tetap bisa dibuka saat sinyal lemah."),
    ),
  );
}

let waktuPemberitahuan;
export function pemberitahuan(teks) {
  document.querySelector(".pemberitahuan")?.remove();
  const el = h("div", { class: "pemberitahuan", role: "status" }, teks);
  document.body.append(el);
  clearTimeout(waktuPemberitahuan);
  waktuPemberitahuan = setTimeout(() => el.remove(), 2600);
}

// ---------- visual materi ----------

export function garisBilangan(sampai = 20) {
  const ket = h("p", { class: "tengah kecil redup", "aria-live": "polite" }, "Ketuk sebuah bilangan.");
  const tombol = [];
  for (let i = 1; i <= sampai; i++) {
    const jenis = i % 2 === 0 ? "genap" : "ganjil";
    const b = h("button", {
      type: "button",
      class: jenis,
      "aria-pressed": "false",
      "aria-label": `${i}, ${jenis}`,
      onclick: () => {
        tombol.forEach((t) => t.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        ket.textContent = `${i} ÷ 2 = ${Math.floor(i / 2)} sisa ${i % 2} → bilangan ${jenis}`;
      },
    }, String(i));
    tombol.push(b);
  }
  return h(
    "div",
    { class: "tumpuk" },
    h("div", { class: "garis-bilangan" }, tombol),
    legenda(),
    ket,
  );
}

export function legenda() {
  return h(
    "div",
    { class: "legenda" },
    h("span", {}, h("i", { style: { background: "var(--genap)" } }), "Genap"),
    h("span", {}, h("i", { style: { background: "var(--ganjil)" } }), "Ganjil"),
  );
}

function kolomPola(jenis, jumlah) {
  const baris = [];
  for (let n = 1; n <= jumlah; n++) {
    baris.push(h("tr", {}, h("td", {}, n), h("td", { class: "tebal" }, jenis === "genap" ? 2 * n : 2 * n - 1)));
  }
  return h(
    "div",
    { class: `kolom-pola ${jenis}` },
    h("h3", {}, jenis === "genap" ? "Genap" : "Ganjil"),
    h("table", {}, h("thead", {}, h("tr", {}, h("th", {}, "n"), h("th", {}, "Un"))), h("tbody", {}, baris)),
    h("p", { class: "rumus" }, jenis === "genap" ? "Un = 2n" : `Un = 2n ${MINUS} 1`),
  );
}

export function tabelPola(jenisDaftar = ["genap", "ganjil"], jumlah = 4) {
  return h(
    "div",
    { class: "tabel-pola", style: jenisDaftar.length === 1 ? { gridTemplateColumns: "1fr" } : null },
    jenisDaftar.map((j) => kolomPola(j, jumlah)),
  );
}

// Susunan titik: ganjil n×n (lapisan L), genap n×(n+1).
export function visualTitik(jenis, n) {
  const kolom = jenis === "genap" ? n + 1 : n;
  const jarak = 26;
  const r = 9;
  const titik = [];
  for (let baris = 0; baris < n; baris++) {
    for (let k = 0; k < kolom; k++) {
      // Lapisan ke-L: titik yang ditambahkan oleh suku ke-(L+1).
      const lapisan = jenis === "genap" ? Math.max(baris, k - 1) : Math.max(baris, k);
      const warna = lapisan % 2 === 0 ? `var(--${jenis})` : `var(--${jenis}-lembut)`;
      titik.push(
        s("circle", {
          cx: 14 + k * jarak,
          cy: 14 + baris * jarak,
          r,
          fill: warna,
          stroke: `var(--${jenis})`,
          "stroke-width": 1.5,
        }),
      );
    }
  }
  return h(
    "div",
    { class: "visual-titik" },
    s(
      "svg",
      {
        viewBox: `0 0 ${kolom * jarak + 2} ${n * jarak + 2}`,
        role: "img",
        "aria-label": jenis === "genap" ? `Susunan titik ${n} kali ${n + 1}` : `Susunan titik ${n} kali ${n}`,
      },
      titik,
    ),
  );
}

export function titikJenis(warna) {
  return h("span", { class: "titik-empat", style: { color: warna }, "aria-hidden": "true" }, h("i"), h("i"), h("i"), h("i"));
}
