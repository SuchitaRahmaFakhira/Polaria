// Pembuat elemen DOM kecil. Teks selalu lewat textContent (aman dari XSS).

export function h(tag, atribut = {}, ...anak) {
  const el = document.createElement(tag);
  for (const [kunci, nilai] of Object.entries(atribut || {})) {
    if (nilai === null || nilai === undefined || nilai === false) continue;
    if (kunci === "class") el.className = nilai;
    else if (kunci === "style" && typeof nilai === "object") Object.assign(el.style, nilai);
    else if (kunci.startsWith("on") && typeof nilai === "function") el.addEventListener(kunci.slice(2), nilai);
    else if (kunci === "dataset") Object.assign(el.dataset, nilai);
    else if (nilai === true) el.setAttribute(kunci, "");
    else el.setAttribute(kunci, nilai);
  }
  tambahAnak(el, anak);
  return el;
}

// Ganti seluruh isi elemen; null/false/undefined diabaikan
// (replaceChildren bawaan akan menulisnya sebagai teks "null").
export function isi(el, ...anak) {
  el.replaceChildren();
  tambahAnak(el, anak);
  return el;
}

function tambahAnak(el, anak) {
  for (const a of anak.flat(Infinity)) {
    if (a === null || a === undefined || a === false) continue;
    el.append(a instanceof Node ? a : document.createTextNode(String(a)));
  }
}

// Elemen SVG (untuk ikon & visual).
export function s(tag, atribut = {}, ...anak) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [kunci, nilai] of Object.entries(atribut || {})) {
    if (nilai !== null && nilai !== undefined) el.setAttribute(kunci, nilai);
  }
  for (const a of anak.flat(Infinity)) {
    if (a === null || a === undefined || a === false) continue;
    el.append(a instanceof Node ? a : document.createTextNode(String(a)));
  }
  return el;
}

export const MINUS = "−";

export function angka(n) {
  return Number(n).toLocaleString("id-ID");
}

export function acak(daftar) {
  const salinan = [...daftar];
  for (let i = salinan.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [salinan[i], salinan[j]] = [salinan[j], salinan[i]];
  }
  return salinan;
}

export function normalisasi(teks) {
  // Sama dengan periksa.normalisasi di Python.
  let t = String(teks ?? "").trim().toLowerCase().replaceAll(MINUS, "-").replaceAll("–", "-").replaceAll(" ", "");
  if (/^[\d.]+$/.test(t) && /\d/.test(t)) t = t.replaceAll(".", "").replace(/^0+/, "") || "0";
  return t;
}

export function tanggal(iso) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export function huruf(i) {
  return String.fromCharCode(65 + i);
}
