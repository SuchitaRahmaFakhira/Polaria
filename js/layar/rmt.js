// Pemecahan Masalah RMT (F-19): soal literasi dikerjakan lewat 4 tahap
// Pahami (Input) → Rencanakan (Elaborasi) → Kerjakan (Output) → Renungkan (Refleksi),
// dibimbing tutor (Gemini atau petunjuk bawaan). Lihat DESAIN.md §8.
import { h, isi, huruf } from "../util.js";
import { ikon } from "../ikon.js";
import { kepala, itemMenu, kotakIngat, tabelPola, garisBilangan, bukaKartuRumus, tombolRumus, pemberitahuan } from "../komponen.js";
import { ambilMasalahRmt } from "../api.js";
import { ambilKonfigurasi } from "../config.js";
import { ubah } from "../data.js";
import { simpanJurnal } from "../supabase.js";
import { mintaBimbingan, gelembungTutor, idSesi } from "../tutor.js";

const TAHAP = [
  { id: "input", nama: "Pahami", fase: "Input", tujuan: "Memahami masalah: apa yang diketahui dan apa yang ditanya." },
  { id: "elaborasi", nama: "Rencanakan", fase: "Elaborasi", tujuan: "Menyusun rencana: jenis pola, alat bantu, dan rumus." },
  { id: "output", nama: "Kerjakan", fase: "Output", tujuan: "Menjalankan rencana dengan teliti, langkah demi langkah." },
  { id: "refleksi", nama: "Renungkan", fase: "Refleksi", tujuan: "Memastikan jawaban benar dan melihat di mana aturan ini berlaku." },
];

const LEVEL = {
  mudah: { judul: "Mudah", sub: "Bilangan kecil, satu langkah.", warna: "hijau" },
  sedang: { judul: "Sedang", sub: "Suku, jumlah, dan letak suku.", warna: "jingga" },
  menantang: { judul: "Menantang", sub: "Bilangan besar dan konteks beragam.", warna: "ungu" },
};

export function layarPilihRmt() {
  const status = h("p", { class: "kecil redup" }, "Memeriksa tutor…");
  ambilKonfigurasi().then((k) => {
    status.textContent = k.ai_aktif
      ? "Tutor AI aktif. Tutor membimbing caramu berpikir, bukan memberi jawaban."
      : "Tutor memakai petunjuk bawaan (AI belum diaktifkan).";
  });
  return h(
    "section",
    { class: "layar" },
    kepala("Pemecahan Masalah"),
    h(
      "div",
      { class: "kartu kartu-lembut tumpuk-kecil" },
      h("p", { class: "tebal" }, "Selesaikan soal cerita lewat 4 tahap"),
      h(
        "ol",
        { class: "daftar-tahap" },
        TAHAP.map((t) => h("li", {}, h("b", {}, `${t.nama} `), h("span", { class: "redup" }, `(${t.fase})`))),
      ),
      status,
    ),
    h("div", { class: "menu" }, Object.entries(LEVEL).map(([id, l]) => itemMenu({ judul: l.judul, sub: l.sub, ikonNama: "lampu", warna: l.warna, href: `#/rmt/${id}` }))),
  );
}

export function layarRmt(level) {
  if (!LEVEL[level]) return layarPilihRmt();

  const wadah = h("div", { class: "tumpuk" }, h("div", { class: "memuat" }, "Menyiapkan soal…"));
  const layar = h("section", { class: "layar" }, kepala("Pemecahan Masalah", "#/rmt", tombolRumus()), wadah);

  const sesiId = idSesi();
  const riwayat = [];
  const isian = { input: {}, elaborasi: {}, output: {}, refleksi: {} };
  const catatan = Object.fromEntries(TAHAP.map((t) => [t.id, { percobaan: 0, petunjuk: 0, lulus: false }]));
  let masalah = null;
  let indeks = 0;
  let respons = null;
  let sibuk = false;
  let sudahSelesai = false;
  let selesai = false;

  ambilMasalahRmt(level)
    .then((m) => {
      masalah = m;
      respons = { pesan: `Halo! ${TAHAP[0].tujuan}`, pertanyaan: "Baca soalnya pelan-pelan. Barisan bilangan apa yang ada di soal?", sumber: null };
      gambar();
    })
    .catch((e) =>
      isi(wadah, h("div", { class: "kartu tumpuk tengah" }, h("p", {}, e.message), h("p", { class: "kecil redup" }, "Pemecahan masalah bersama tutor membutuhkan internet."), h("a", { class: "tombol", href: "#/rmt" }, "Kembali"))),
    );

  const tahapAktif = () => TAHAP[indeks];

  async function kirim({ minta = false, pesan = "" } = {}) {
    if (sibuk) return;
    const t = tahapAktif();
    const c = catatan[t.id];
    if (!minta && !pesan) {
      const kurang = validasi(t.id);
      if (kurang) return pemberitahuan(kurang);
      c.percobaan++;
    }
    // Petunjuk naik bertahap: diminta siswa, atau setelah percobaan yang salah (asesmen dinamis "cake").
    const tingkat = minta ? Math.min(3, c.petunjuk + 1) : Math.min(3, Math.max(c.petunjuk, c.percobaan > 1 ? c.percobaan - 1 : 0));
    sibuk = true;
    gambar();
    try {
      const r = await mintaBimbingan({ masalah, tahap: t.id, isian: isian[t.id], pesan, tingkat, sudahSelesai, riwayat, sesiId });
      c.petunjuk = Math.max(c.petunjuk, r.tingkat_petunjuk);
      if (r.benar && !minta && !pesan) c.lulus = true;
      if (t.id === "output" && r.benar) sudahSelesai = true;
      respons = { ...r, pesanSiswa: pesan };
    } catch (e) {
      respons = { pesan: e.message, pertanyaan: "", sumber: null, galat: true };
    }
    sibuk = false;
    gambar();
  }

  function validasi(id) {
    const v = isian[id];
    if (id === "input" && (!v.diketahui || !v.ditanya)) return "Jawab kedua pertanyaan dulu, ya.";
    if (id === "elaborasi" && (!v.pola || !v.rumus)) return "Pilih jenis pola dan rumusnya dulu, ya.";
    if (id === "output" && (v.langkah || "").trim().length < 3) return "Tulis langkah substitusinya dulu, jangan langsung menebak.";
    if (id === "output" && !(v.jawaban || "").trim()) return "Tulis jawaban akhirnya.";
    if (id === "refleksi" && (v.pesan || "").trim().length < 8) return "Ceritakan caramu memeriksa jawaban dengan kalimatmu sendiri.";
    return null;
  }

  function lanjut() {
    if (indeks < TAHAP.length - 1) {
      indeks++;
      const t = tahapAktif();
      respons = { pesan: `Tahap ${indeks + 1}: ${t.nama}. ${t.tujuan}`, pertanyaan: pertanyaanAwal(t.id), sumber: null };
      gambar();
      window.scrollTo({ top: 0 });
    } else {
      selesai = true;
      ubah((d) => d.rmt.push({ level, tahap: catatan, waktu: new Date().toISOString() }));
      gambar();
      window.scrollTo({ top: 0 });
    }
  }

  function pertanyaanAwal(id) {
    return {
      elaborasi: "Pola apa yang kamu lihat, dan alat bantu apa yang ingin kamu pakai?",
      output: "Ganti n pada rumusmu. Tulis langkahnya sebelum jawaban akhir.",
      refleksi: "Bagaimana kamu yakin jawabanmu benar?",
    }[id];
  }

  // ---------- komponen isian ----------

  function grupPilihan(label, pilihan, nilai, saatPilih) {
    return h(
      "div",
      { class: "tumpuk-kecil" },
      h("p", { class: "label" }, label),
      h(
        "div",
        { class: "pilihan-ganda", role: "radiogroup", "aria-label": label },
        pilihan.map((p, k) => {
          const nilaiOpsi = typeof p === "string" ? p : p.nilai;
          const teks = typeof p === "string" ? p : p.teks;
          return h(
            "button",
            {
              type: "button", class: "opsi", role: "radio", "aria-checked": String(nilai === nilaiOpsi),
              onclick: () => {
                saatPilih(nilaiOpsi);
                gambar();
              },
            },
            h("span", { class: "huruf-opsi" }, huruf(k)),
            h("span", { class: "isi-opsi" }, teks),
            h("span", { class: "radio", "aria-hidden": "true" }),
          );
        }),
      ),
    );
  }

  function areaTeks(label, nilai, saatUbah, atribut = {}) {
    const el = h("textarea", { class: "bidang area-teks", rows: 3, maxlength: 300, "aria-label": label, ...atribut });
    el.value = nilai || "";
    el.addEventListener("input", () => saatUbah(el.value));
    return h("label", { class: "tumpuk-kecil" }, h("span", { class: "label" }, label), el);
  }

  function formTahap(id) {
    const t = masalah.tahap[id];
    const v = isian[id];
    if (id === "input") {
      return [
        grupPilihan(t.tanya_diketahui, t.pilihan_diketahui, v.diketahui, (x) => (v.diketahui = x)),
        grupPilihan(t.tanya_ditanya, t.pilihan_ditanya, v.ditanya, (x) => (v.ditanya = x)),
      ];
    }
    if (id === "elaborasi") {
      const alat = {
        Tabel: () => tabelPola(["genap", "ganjil"], 4),
        "Garis bilangan": () => garisBilangan(20),
        Rumus: () => h("button", { class: "tombol-garis", type: "button", onclick: bukaKartuRumus }, ikon("buku", 18), "Buka Kartu Rumus"),
      };
      return [
        grupPilihan(t.tanya_pola, t.pilihan_pola, v.pola, (x) => (v.pola = x)),
        h(
          "div",
          { class: "tumpuk-kecil" },
          h("p", { class: "label" }, t.tanya_alat),
          h("div", { class: "chip-pilihan" }, t.pilihan_alat.map((a) => h("button", { type: "button", class: "chip-opsi", "aria-pressed": String(v.alat === a), onclick: () => ((v.alat = a), gambar()) }, a))),
          v.alat && alat[v.alat] ? h("div", { class: "alat-bantu" }, alat[v.alat]()) : null,
        ),
        grupPilihan(t.tanya_rumus, t.pilihan_rumus, v.rumus, (x) => (v.rumus = x)),
      ];
    }
    if (id === "output") {
      const jawaban = h("input", {
        class: "bidang", type: "text", inputmode: "numeric", maxlength: 12, "aria-label": t.tanya_jawaban,
        placeholder: "Tulis jawaban akhir", value: v.jawaban || "",
      });
      jawaban.addEventListener("input", () => {
        jawaban.value = jawaban.value.replace(/[^\d.]/g, "");
        v.jawaban = jawaban.value;
      });
      return [
        kotakIngat("Rencanamu", h("p", {}, `Pola ${isian.elaborasi.pola || "-"} · ${isian.elaborasi.rumus || "-"}`), "info"),
        areaTeks(t.tanya_langkah, v.langkah, (x) => (v.langkah = x), { placeholder: "Contoh: U5 = 2 × 5 = …" }),
        h("label", { class: "tumpuk-kecil" }, h("span", { class: "label" }, t.tanya_jawaban), jawaban),
      ];
    }
    return [areaTeks(t.tanya, v.pesan, (x) => (v.pesan = x), { placeholder: "Contoh: Saya cek dengan n = 1 …" })];
  }

  // ---------- tampilan ----------

  function stepper() {
    return h(
      "ol",
      { class: "stepper-rmt", "aria-label": "Tahap RMT" },
      TAHAP.map((t, k) =>
        h(
          "li",
          { class: k < indeks || catatan[t.id].lulus ? "selesai" : k === indeks ? "aktif" : "", "aria-current": k === indeks ? "step" : null },
          h("span", { class: "bulat-tahap" }, k < indeks ? ikon("centang", 14) : String(k + 1)),
          h("span", { class: "nama-tahap" }, t.nama),
        ),
      ),
    );
  }

  function tanyaBebas() {
    const area = h("textarea", { class: "bidang area-teks", rows: 2, maxlength: 400, placeholder: "Jelaskan caramu atau tanyakan bagian yang membingungkan…", "aria-label": "Pesan untuk tutor" });
    return h(
      "details",
      { class: "tanya-bebas" },
      h("summary", {}, "Jelaskan caramu ke tutor"),
      h(
        "div",
        { class: "tumpuk-kecil" },
        area,
        h("button", { class: "tombol-garis", type: "button", disabled: sibuk, onclick: () => {
          const pesan = area.value.trim();
          if (pesan.length < 3) return area.focus();
          kirim({ pesan });
        } }, "Kirim"),
      ),
    );
  }

  function layarSelesai() {
    const jurnal = h("textarea", { class: "bidang area-teks", rows: 3, maxlength: 500, "aria-label": "Jurnal refleksi", placeholder: "Apa yang kamu pelajari? Bagian mana yang masih membingungkan?" });
    const totalPetunjuk = TAHAP.reduce((n, t) => n + catatan[t.id].petunjuk, 0);
    return h(
      "div",
      { class: "tumpuk" },
      h(
        "div",
        { class: "kartu tumpuk tengah" },
        h("span", { class: "kotak-ikon besar hijau" }, ikon("centang", 40)),
        h("h2", { class: "slide-judul" }, "Masalah terpecahkan!"),
        h("p", { class: "redup" }, `Kamu memakai ${totalPetunjuk} petunjuk di seluruh tahap.`),
      ),
      h(
        "div",
        { class: "kartu tumpuk-kecil" },
        h("p", { class: "tebal" }, "Perjalanan berpikirmu"),
        TAHAP.map((t) =>
          h("div", { class: "baris-antara" }, h("span", {}, `${t.nama} (${t.fase})`), h("span", { class: "kecil redup" }, `${catatan[t.id].percobaan}× coba · ${catatan[t.id].petunjuk} petunjuk`)),
        ),
      ),
      h(
        "div",
        { class: "kartu tumpuk-kecil" },
        h("p", { class: "tebal" }, "Jurnal refleksi"),
        jurnal,
        h("button", { class: "tombol-garis", type: "button", onclick: (e) => {
          const teks = jurnal.value.trim();
          if (teks.length < 5) return jurnal.focus();
          ubah((d) => d.jurnal.push({ konteks: `rmt-${level}`, isi: teks, waktu: new Date().toISOString() }));
          simpanJurnal(`rmt-${level}`, teks);
          e.currentTarget.disabled = true;
          pemberitahuan("Jurnal tersimpan.");
        } }, "Simpan jurnal"),
      ),
      h(
        "div",
        { class: "tombol-baris" },
        h("a", { class: "tombol-garis", href: "#/nilai" }, "Lihat nilai"),
        h("a", { class: "tombol", href: `#/rmt/${level}?baru=${Date.now()}` }, "Soal baru"),
      ),
    );
  }

  function gambar() {
    if (selesai) return isi(wadah, layarSelesai());
    const t = tahapAktif();
    const c = catatan[t.id];
    const bolehLanjut = c.lulus;
    isi(
      wadah,
      stepper(),
      h("div", { class: "kartu kartu-soal tumpuk-kecil" }, h("span", { class: "label-pil" }, "Soal literasi"), h("p", { class: "teks-soal" }, masalah.teks)),
      h(
        "div",
        { class: "kartu tumpuk" },
        h("div", {}, h("h2", { class: "slide-judul" }, `${indeks + 1}. ${t.nama}`), h("p", { class: "kecil redup" }, `Fase ${t.fase} · ${t.tujuan}`)),
        formTahap(t.id),
      ),
      sibuk ? h("div", { class: "gelembung-tutor memuat-tutor" }, h("p", { class: "kecil redup" }, "Tutor sedang berpikir…")) : respons ? gelembungTutor(respons) : null,
      bolehLanjut
        ? h("button", { class: "tombol", type: "button", onclick: lanjut }, indeks === TAHAP.length - 1 ? "Selesai" : `Lanjut ke ${TAHAP[indeks + 1].nama}`, ikon("kanan", 20))
        : h(
            "div",
            { class: "tombol-baris" },
            h("button", { class: "tombol-garis", type: "button", disabled: sibuk || c.petunjuk >= 3, onclick: () => kirim({ minta: true }) }, ikon("lampu", 18), `Petunjuk ${Math.min(3, c.petunjuk + 1)}/3`),
            h("button", { class: "tombol", type: "button", disabled: sibuk, onclick: () => kirim() }, sibuk ? "Memeriksa…" : "Periksa"),
          ),
      tanyaBebas(),
    );
  }

  return layar;
}
