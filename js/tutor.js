// Tutor pembimbing (Gemini lewat API Python, atau petunjuk bawaan bila AI tidak tersedia).
// Benar/salah selalu diputuskan server; tutor hanya membimbing proses berpikir.
import { h } from "./util.js";
import { ikon } from "./ikon.js";
import { bukaLembar } from "./komponen.js";
import { tanyaTutor } from "./api.js";
import { simpanInteraksiTutor } from "./supabase.js";

export function idSesi() {
  try {
    return crypto.randomUUID();
  } catch {
    return `sesi-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

// Kirim satu giliran ke tutor, catat riwayat & simpan log (tanpa nama siswa).
export async function mintaBimbingan({ masalah, tahap, isian, pesan = "", tingkat = 0, sudahSelesai = false, riwayat, sesiId }) {
  const respons = await tanyaTutor({
    masalah: { tipe: masalah.tipe, parameter: masalah.parameter },
    teks_soal: masalah.teks || "",
    tahap,
    isian: Object.fromEntries(Object.entries(isian || {}).map(([k, v]) => [k, String(v ?? "")])),
    pesan,
    riwayat: riwayat.slice(-8),
    tingkat,
    sudah_selesai: sudahSelesai,
  });
  const teksSiswa = pesan || ringkasIsian(isian);
  const teksTutor = `${respons.pesan} ${respons.pertanyaan}`.trim();
  if (teksSiswa) riwayat.push({ peran: "siswa", teks: teksSiswa.slice(0, 500) });
  riwayat.push({ peran: "tutor", teks: teksTutor.slice(0, 500) });
  simpanInteraksiTutor({
    sesiId, tahap, masalah: { tipe: masalah.tipe, parameter: masalah.parameter },
    kesulitan: respons.kesulitan, tingkat: respons.tingkat_petunjuk, pesanSiswa: teksSiswa,
    pesanTutor: teksTutor, sumber: respons.sumber, benar: respons.benar,
  });
  return respons;
}

function ringkasIsian(isian) {
  return Object.entries(isian || {})
    .filter(([, v]) => v !== "" && v != null)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}

// Gelembung pesan tutor: satu pesan singkat + satu pertanyaan (mengelola extraneous load).
export function gelembungTutor({ pesan, pertanyaan, sumber, judul = "Tutor" }) {
  return h(
    "div",
    { class: "gelembung-tutor", role: "status", "aria-live": "polite" },
    h(
      "div",
      { class: "gelembung-kepala" },
      h("span", { class: "avatar-tutor", "aria-hidden": "true" }, ikon("lampu", 18)),
      h("span", { class: "tebal" }, judul),
      sumber ? h("span", { class: "label-sumber" }, sumber === "gemini" ? "AI" : "Petunjuk") : null,
    ),
    pesan ? h("p", {}, pesan) : null,
    pertanyaan ? h("p", { class: "pertanyaan-tutor" }, pertanyaan) : null,
  );
}

// Lembar tutor untuk soal latihan yang dijawab salah.
export function bukaTutorLatihan(soal, jawabanAwal) {
  const riwayat = [];
  const sesiId = idSesi();
  let tingkat = 1;
  let jawaban = jawabanAwal;
  let sudahSelesai = false;

  bukaLembar("Tanya Tutor", () => {
    const wadahPesan = h("div", { class: "tumpuk" });
    const masukan = h("textarea", {
      class: "bidang area-teks", rows: 2, maxlength: 400,
      placeholder: "Jelaskan caramu atau bagian yang membingungkan…", "aria-label": "Pesan untuk tutor",
    });
    const tombolKirim = h("button", { class: "tombol", type: "button" }, "Kirim ke tutor");
    const tombolPetunjuk = h("button", { class: "tombol-garis", type: "button" }, ikon("lampu", 18), "Petunjuk berikutnya");

    async function giliran(pesan = "") {
      tombolKirim.disabled = tombolPetunjuk.disabled = true;
      const memuat = h("p", { class: "kecil redup" }, "Tutor sedang berpikir…");
      wadahPesan.append(memuat);
      try {
        const r = await mintaBimbingan({
          masalah: soal, tahap: "output", isian: { jawaban }, pesan, tingkat, sudahSelesai, riwayat, sesiId,
        });
        memuat.remove();
        if (pesan) wadahPesan.append(h("p", { class: "gelembung-siswa" }, pesan));
        wadahPesan.append(gelembungTutor(r));
        if (r.benar) sudahSelesai = true;
      } catch (e) {
        memuat.remove();
        wadahPesan.append(h("p", { class: "pesan-galat" }, e.message));
      } finally {
        tombolKirim.disabled = false;
        tombolPetunjuk.disabled = tingkat >= 3 || sudahSelesai;
      }
    }

    tombolKirim.addEventListener("click", () => {
      const pesan = masukan.value.trim();
      if (!pesan) return masukan.focus();
      // Jika siswa menulis angka saja, anggap sebagai jawaban baru.
      if (/^[\d.]+$/.test(pesan)) jawaban = pesan;
      masukan.value = "";
      giliran(pesan);
    });
    tombolPetunjuk.addEventListener("click", () => {
      tingkat = Math.min(3, tingkat + 1);
      giliran("");
    });

    giliran("");
    return h(
      "div",
      { class: "tumpuk" },
      h("p", { class: "kecil redup" }, soal.teks),
      wadahPesan,
      masukan,
      h("div", { class: "tombol-baris" }, tombolPetunjuk, tombolKirim),
      h("p", { class: "kecil redup" }, "Tutor membimbing langkah berpikirmu, bukan memberi jawaban langsung."),
    );
  });
}

// Ubah teks jawaban AI menjadi elemen aman (tanpa innerHTML):
// baris bernomor → <ol>, baris "-"/"•"/"*" → <ul>, **tebal** → <b>.
export function teksTerformat(teks) {
  const wadah = h("div", { class: "jawaban-ai" });
  let ol = null; // daftar bernomor yang sedang berjalan
  let liTerakhir = null; // butir bernomor terakhir (tempat sub-butir & baris lanjutan)
  let ul = null; // daftar butir yang sedang berjalan
  const sebaris = (s) =>
    s.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((b) => (b.startsWith("**") && b.endsWith("**") ? h("b", {}, b.slice(2, -2)) : b.replace(/\*/g, "")));
  for (const mentah of String(teks).split(/\r?\n/)) {
    const baris = mentah.trim();
    const menjorok = /^\s{2,}/.test(mentah);
    const bernomor = baris.match(/^(\d+)[.)]\s+(.*)$/);
    const butir = baris.match(/^[-•*]\s+(.*)$/);
    if (bernomor) {
      if (!ol) wadah.append((ol = h("ol", {})));
      // Pakai nomor asli dari teks agar penomoran tidak mengulang dari 1.
      liTerakhir = h("li", { value: bernomor[1] }, sebaris(bernomor[2]));
      ol.append(liTerakhir);
      ul = null;
      continue;
    }
    if (butir) {
      if (!ul) {
        ul = h("ul", {});
        // Sub-butir di bawah langkah bernomor ikut masuk ke langkah itu.
        (liTerakhir || wadah).append(ul);
      }
      ul.append(h("li", {}, sebaris(butir[1])));
      continue;
    }
    if (!baris) {
      ul = null;
      continue;
    }
    const judul = baris.match(/^#{1,4}\s+(.*)$/);
    if (liTerakhir && (menjorok || /^[A-Za-z]?\w*\s*=/.test(baris)) && !judul) {
      // Baris rumus/lanjutan setelah langkah bernomor: tetap bagian langkah itu.
      liTerakhir.append(h("div", { class: "lanjutan-langkah" }, sebaris(baris)));
      continue;
    }
    ol = liTerakhir = ul = null;
    wadah.append(judul ? h("p", { class: "tebal" }, sebaris(judul[1])) : h("p", {}, sebaris(baris)));
  }
  return wadah;
}
