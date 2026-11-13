// Ikon SVG inline (tanpa library). Garis 2px, ujung membulat, warna currentColor.
import { s } from "./util.js";

const JALUR = {
  beranda: ["M3 10.5 12 3l9 7.5", "M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"],
  buku: ["M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5Z", "M12 6v13.5"],
  piala: ["M7 4h10v5a5 5 0 0 1-10 0Z", "M7 6H4a3 3 0 0 0 3 4", "M17 6h3a3 3 0 0 1-3 4", "M12 14v4", "M8 21h8", "M9 18h6"],
  gerigi: [
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z",
  ],
  kalkulator: ["M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z", "M8 6h8v4H8Z", "M8 14h.01", "M12 14h.01", "M16 14h.01", "M8 18h.01", "M12 18h.01", "M16 18h.01"],
  kotak: ["M4 4h6v6H4Z", "M14 4h6v6h-6Z", "M4 14h6v6H4Z", "M14 14h6v6h-6Z"],
  grafik: ["M4 20V12", "M10 20V6", "M16 20v-9", "M21 20H3"],
  lampu: ["M9 18h6", "M10 21h4", "M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3Z"],
  kanan: ["m9 6 6 6-6 6"],
  kiri: ["m15 6-6 6 6 6"],
  centang: ["m5 12.5 4.5 4.5L19 7.5"],
  silang: ["M6 6l12 12", "M18 6 6 18"],
  info: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 16v-5", "M12 8h.01"],
  papan: ["M9 3h6v3H9Z", "M8 4.5H6a2 2 0 0 0-2 2V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2h-2", "m8 12 2 2 4-4", "M8 18h8"],
  unduh: ["M12 3v12", "m7 10 5 5 5-5", "M4 21h16"],
  kilau: ["M12 3v4", "M12 17v4", "M3 12h4", "M17 12h4", "m6 6 2 2", "m16 16 2 2", "m6 18 2-2", "m16 8 2-2"],
  tambah: ["M12 5v14", "M5 12h14"],
  kurang: ["M5 12h14"],
  gembok: ["M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z", "M8 11V7a4 4 0 0 1 8 0v4"],
  main: ["M8 5v14l11-7Z"],
  bagikan: ["M12 15V3", "m7 8 5-5 5 5", "M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"],
  ulang: ["M3 12a9 9 0 1 0 3-6.7L3 8", "M3 3v5h5"],
  orang: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4 21a8 8 0 0 1 16 0"],
  bulan: ["M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"],
  huruf: ["M4 20 9 6l5 14", "M5.8 15h6.4", "M15 20l3-8 3 8", "M16 17.5h4"],
  tanda_tanya: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3", "M12 17h.01"],
};

export function ikon(nama, ukuran = 24, kelas = "") {
  const jalur = JALUR[nama] || JALUR.info;
  return s(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: ukuran,
      height: ukuran,
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      class: `ikon ${kelas}`.trim(),
    },
    jalur.map((d) => s("path", { d })),
  );
}

// Ilustrasi statis kotak angka 1-2-3 untuk Beranda & layar masuk (tanpa animasi).
export function ilustrasiAngka(ukuran = 120) {
  const kotak = (x, y, warna, angka, putar) =>
    s(
      "g",
      { transform: `translate(${x} ${y}) rotate(${putar} 22 22)` },
      s("rect", { width: 44, height: 44, rx: 10, fill: warna }),
      s("text", { x: 22, y: 31, "text-anchor": "middle", "font-size": 26, "font-weight": 800, fill: "#fff", "font-family": "Plus Jakarta Sans, system-ui, sans-serif" }, angka),
    );
  return s(
    "svg",
    { viewBox: "0 0 120 110", width: ukuran, height: ukuran * 0.92, "aria-hidden": "true", class: "ilustrasi" },
    s("ellipse", { cx: 62, cy: 62, rx: 54, ry: 26, fill: "none", stroke: "var(--garis-ilustrasi)", "stroke-width": 3 }),
    kotak(22, 6, "#7C5CF5", "1", -8),
    kotak(64, 22, "#3B82F6", "2", 8),
    kotak(36, 56, "#A78BFA", "3", -4),
  );
}
