// Latihan Soal (F-07, F-08, F-10, F-11): soal dari API Python, diperiksa oleh API.
import { h, huruf, isi } from "../util.js";
import { ikon } from "../ikon.js";
import { kepala, itemMenu, tombolRumus } from "../komponen.js";
import { ambilSesi, periksa } from "../api.js";
import { ubah } from "../data.js";
import { simpanJawaban } from "../supabase.js";
import { bukaTutorLatihan } from "../tutor.js";
import { LABEL_TIPE } from "../evaluasi/soal-tetap.js";

const LEVEL = {
  mudah: { judul: "Mudah", sub: "Bilangan kecil (n ≤ 10), satu jenis pola.", warna: "hijau" },
  sedang: { judul: "Sedang", sub: "Ganjil & genap diacak, Sn, dan soal cerita.", warna: "jingga" },
  menantang: { judul: "Menantang", sub: "Bilangan besar (n ≤ 100) dan soal cerita.", warna: "ungu" },
};
const URUTAN_LEVEL = ["mudah", "sedang", "menantang"];

export function layarPilihLevel() {
  return h(
    "section",
    { class: "layar" },
    kepala("Latihan Soal"),
    h(
      "div",
      { class: "kartu kartu-lembut baris" },
      h("span", { class: "kotak-ikon ungu" }, ikon("papan", 26)),
      h("div", {}, h("p", { class: "tebal" }, "Latihan Soal"), h("p", { class: "kecil redup" }, "Pilih level. Setiap sesi berisi 10 soal.")),
    ),
    h(
      "div",
      { class: "menu" },
      URUTAN_LEVEL.map((l) => itemMenu({ judul: LEVEL[l].judul, sub: LEVEL[l].sub, ikonNama: "main", warna: LEVEL[l].warna, href: `#/latihan/${l}` })),
    ),
    h("p", { class: "kecil redup tengah" }, "Saran: mulai dari Mudah, lalu naik level."),
  );
}

export function layarLatihan(level) {
  if (!LEVEL[level]) return layarPilihLevel();

  const wadah = h("div", { class: "tumpuk" }, h("div", { class: "memuat" }, "Menyiapkan soal…"));
  const layar = h("section", { class: "layar" }, kepala("Latihan Soal", "#/latihan", tombolRumus()), wadah);

  let daftar = [];
  let i = 0;
  let hasil = []; // per soal: { tipe, benar, petunjuk }
  let st; // keadaan soal aktif

  function mulaiSoal() {
    st = { jawaban: "", petunjukKe: 0, diperiksa: null, sudahDicatat: false, mulai: Date.now(), tampilBahas: false, tampilCek: false };
    gambar();
    window.scrollTo({ top: 0 });
  }

  ambilSesi(level)
    .then(({ soal, dariCadangan }) => {
      daftar = soal;
      layar.dariCadangan = dariCadangan;
      mulaiSoal();
    })
    .catch((e) =>
      isi(wadah, 
        h("div", { class: "kartu tumpuk tengah" }, h("p", {}, e.message), h("p", { class: "kecil redup" }, "Latihan butuh internet saat pertama kali dibuka. Setelah itu, beberapa sesi disimpan untuk dipakai offline."), h("a", { class: "tombol", href: "#/latihan" }, "Kembali")),
      ),
    );

  async function cekJawaban() {
    if (!String(st.jawaban).trim()) return;
    const soal = daftar[i];
    st.memeriksa = true;
    gambar();
    try {
      st.diperiksa = await periksa(soal, st.jawaban, st.petunjukKe);
    } catch (e) {
      st.galat = e.message;
    }
    st.memeriksa = false;
    if (st.diperiksa && !st.sudahDicatat) {
      st.sudahDicatat = true;
      const benar = st.diperiksa.benar;
      hasil[i] = { tipe: soal.tipe, benar, petunjuk: st.petunjukKe };
      simpanJawaban({
        level, tipe: soal.tipe, soal: { teks: soal.teks, parameter: soal.parameter }, jawaban: st.jawaban, benar,
        jumlahPetunjuk: st.petunjukKe, durasi: Math.round((Date.now() - st.mulai) / 1000),
      });
    }
    gambar();
  }

  function berikutnya() {
    if (!hasil[i]) hasil[i] = { tipe: daftar[i].tipe, benar: false, petunjuk: st.petunjukKe, dilewati: true };
    i++;
    if (i < daftar.length) return mulaiSoal();
    selesai();
  }

  function selesai() {
    const benar = hasil.filter((x) => x.benar).length;
    const perTipe = {};
    hasil.forEach((x) => {
      perTipe[x.tipe] ??= { benar: 0, total: 0 };
      perTipe[x.tipe].total++;
      if (x.benar) perTipe[x.tipe].benar++;
    });
    ubah((d) => d.latihan.push({ level, benar, total: daftar.length, perTipe, waktu: new Date().toISOString() }));
    const iLevel = URUTAN_LEVEL.indexOf(level);
    const levelBerikut = URUTAN_LEVEL[iLevel + 1];
    isi(wadah, 
      h(
        "div",
        { class: "kartu tumpuk tengah" },
        h("span", { class: "kotak-ikon besar kuning" }, ikon("piala", 40)),
        h("h2", { class: "slide-judul" }, `Latihan ${LEVEL[level].judul} selesai`),
        h("p", { class: "angka-besar" }, `${benar} / ${daftar.length}`),
        h("p", { class: "redup" }, "jawaban benar pada percobaan pertama"),
      ),
      h(
        "div",
        { class: "kartu tumpuk-kecil" },
        h("p", { class: "tebal" }, "Per jenis soal"),
        Object.entries(perTipe).map(([tipe, n]) =>
          h("div", { class: "baris-antara" }, h("span", {}, LABEL_TIPE[tipe] || tipe), h("span", { class: n.benar === n.total ? "tebal" : "redup" }, `${n.benar}/${n.total} ${n.benar === n.total ? "✔" : ""}`)),
        ),
      ),
      h(
        "div",
        { class: "tombol-baris" },
        h("a", { class: "tombol-garis", href: `#/latihan/${level}?ulang=${Date.now()}` }, ikon("ulang", 18), "Ulangi"),
        levelBerikut
          ? h("a", { class: "tombol", href: `#/latihan/${levelBerikut}` }, "Level berikut")
          : h("a", { class: "tombol", href: "#/nilai" }, "Lihat nilai"),
      ),
    );
  }

  function pilihanGanda(soal) {
    const kunci = st.diperiksa?.benar ? st.diperiksa.kunci : null;
    return h(
      "div",
      { class: "pilihan-ganda", role: "radiogroup", "aria-label": "Pilihan jawaban" },
      soal.pilihan.map((teks, k) => {
        const dipilih = st.jawaban === teks;
        let kelas = "opsi";
        if (st.diperiksa && dipilih) kelas += st.diperiksa.benar ? " benar" : " salah";
        if (st.tampilBahas && teks === st.diperiksa?.kunci) kelas += " benar";
        return h(
          "button",
          {
            type: "button", class: kelas, role: "radio", "aria-checked": String(dipilih), disabled: Boolean(st.diperiksa) || kunci !== null,
            onclick: () => {
              st.jawaban = teks;
              gambar();
            },
          },
          h("span", { class: "huruf-opsi" }, huruf(k)),
          h("span", { class: "isi-opsi" }, teks),
          h("span", { class: "radio", "aria-hidden": "true" }),
        );
      }),
    );
  }

  function isian() {
    const input = h("input", {
      class: "bidang", type: "text", inputmode: "numeric", autocomplete: "off", maxlength: 12,
      "aria-label": "Jawabanmu", placeholder: "Tulis jawabanmu", value: st.jawaban, disabled: Boolean(st.diperiksa),
      oninput: () => {
        st.jawaban = input.value.replace(/[^\d.]/g, "");
        input.value = st.jawaban;
        tombolUtama.disabled = !st.jawaban;
      },
      onkeydown: (e) => e.key === "Enter" && st.jawaban && cekJawaban(),
    });
    setTimeout(() => !st.diperiksa && input.focus({ preventScroll: true }), 0);
    return input;
  }

  function daftarPetunjuk(soal) {
    if (!st.petunjukKe) return null;
    return h(
      "div",
      { class: "tumpuk-kecil" },
      soal.paket.petunjuk.slice(0, st.petunjukKe).map((p, k) => h("p", { class: "petunjuk" }, h("b", {}, `Petunjuk ${k + 1}: `), p)),
    );
  }

  function umpanBalik() {
    const d = st.diperiksa;
    if (st.galat) return h("p", { class: "pesan-galat" }, st.galat);
    if (!d) return null;
    if (d.benar) {
      return h(
        "div",
        { class: "umpan benar", role: "status" },
        h("p", { class: "judul-umpan" }, ikon("centang", 20), "Benar!"),
        h("p", {}, d.ringkas),
        d.cek_substitusi
          ? st.tampilCek
            ? h("p", { class: "petunjuk" }, d.cek_substitusi)
            : h("button", { class: "tombol-teks", type: "button", style: { alignSelf: "flex-start", paddingLeft: 0 }, onclick: () => ((st.tampilCek = true), gambar()) }, ikon("centang", 18), " Cek jawabanmu")
          : null,
      );
    }
    return h(
      "div",
      { class: "umpan salah", role: "status" },
      h("p", { class: "judul-umpan" }, ikon("silang", 20), `Belum tepat. Jawabanmu: ${st.jawaban}`),
      st.tampilBahas
        ? h("div", { class: "tumpuk-kecil" }, h("p", { class: "tebal" }, "Pembahasan:"), h("ol", { class: "langkah-contoh" }, d.pembahasan.map((l) => h("li", {}, l))), h("p", {}, `Jawaban: ${d.kunci}`))
        : h(
            "div",
            { class: "baris", style: { flexWrap: "wrap", gap: "8px" } },
            h("button", { class: "tombol-garis", type: "button", onclick: cobaLagi }, ikon("ulang", 18), "Coba lagi"),
            st.petunjukKe < 3 ? h("button", { class: "tombol-garis", type: "button", onclick: tambahPetunjuk }, ikon("lampu", 18), `Petunjuk ${st.petunjukKe + 1}`) : null,
            h("button", { class: "tombol-garis", type: "button", onclick: () => bukaTutorLatihan(daftar[i], st.jawaban) }, ikon("orang", 18), "Tanya tutor"),
            h("button", { class: "tombol-teks", type: "button", onclick: () => ((st.tampilBahas = true), gambar()) }, "Lihat pembahasan"),
          ),
    );
  }

  function cobaLagi() {
    st.diperiksa = null;
    st.jawaban = "";
    st.galat = null;
    gambar();
  }

  function tambahPetunjuk() {
    st.petunjukKe = Math.min(3, st.petunjukKe + 1);
    if (st.diperiksa && !st.diperiksa.benar) {
      st.diperiksa = null;
      st.jawaban = "";
    }
    gambar();
  }

  let tombolUtama;

  function gambar() {
    const soal = daftar[i];
    const persen = ((i + 1) / daftar.length) * 100;
    const selesaiSoal = st.diperiksa?.benar || st.tampilBahas;

    tombolUtama = selesaiSoal || (st.diperiksa && !st.diperiksa.benar)
      ? h("button", { class: "tombol", type: "button", onclick: berikutnya }, i === daftar.length - 1 ? "Selesai" : "Selanjutnya", ikon("kanan", 20))
      : h("button", { class: "tombol", type: "button", onclick: cekJawaban, disabled: !st.jawaban || st.memeriksa }, st.memeriksa ? "Memeriksa…" : "Periksa");

    isi(wadah, 
      layar.dariCadangan ? h("p", { class: "pita-offline" }, "Mode offline: memakai soal yang tersimpan.") : null,
      h(
        "div",
        { class: "kartu kartu-lembut baris" },
        h("span", { class: "kotak-ikon ungu", style: { background: "var(--surface)" } }, ikon("papan", 26)),
        h("div", {}, h("p", { class: "tebal" }, `Latihan · ${LEVEL[level].judul}`), h("p", { class: "kecil redup" }, "Kerjakan soal berikut dengan tepat dan teliti!")),
      ),
      h("div", { class: "progres-baris" }, h("div", { class: "progres", role: "progressbar", "aria-valuenow": i + 1, "aria-valuemin": 1, "aria-valuemax": daftar.length }, h("i", { style: { width: `${persen}%` } })), h("span", { class: "tebal" }, `${i + 1}/${daftar.length}`)),
      h(
        "div",
        { class: "kartu tumpuk" },
        h("p", { class: "teks-soal" }, `${i + 1}. ${soal.teks}`),
        soal.bentuk === "pilihan" ? pilihanGanda(soal) : isian(),
        daftarPetunjuk(soal),
      ),
      umpanBalik(),
      h(
        "div",
        { class: "tombol-baris", style: !st.diperiksa && st.petunjukKe < 3 ? null : { gridTemplateColumns: "1fr" } },
        !st.diperiksa && st.petunjukKe < 3 ? h("button", { class: "tombol-garis", type: "button", onclick: tambahPetunjuk }, ikon("lampu", 18), "Petunjuk") : null,
        tombolUtama,
      ),
    );
  }

  return layar;
}
