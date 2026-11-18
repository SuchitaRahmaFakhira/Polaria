// Data lokal siswa: profil, progres, riwayat nilai, pengaturan.
// Disimpan di localStorage; jika tidak tersedia, cukup di memori.

const KUNCI = "polaria:data";
let memori = null;

function bawaan() {
  return {
    profil: null, // { nama, kelas }
    progres: {}, // { [modulId]: { selesai, skor, total, diperbarui } }
    latihan: [], // [{ level, benar, total, perTipe, waktu }]
    evaluasi: {}, // { pre: {...}, post: {...} }
    rmt: [], // [{ level, tahap: { input: { percobaan, petunjuk } , … }, waktu }]
    jurnal: [], // [{ konteks, isi, waktu }]
    pengaturan: { tema: "sistem", hurufBesar: false },
  };
}

export function baca() {
  if (memori) return memori;
  try {
    const teks = localStorage.getItem(KUNCI);
    memori = teks ? { ...bawaan(), ...JSON.parse(teks) } : bawaan();
  } catch {
    memori = bawaan();
  }
  return memori;
}

export function ubah(fungsi) {
  const data = baca();
  fungsi(data);
  try {
    localStorage.setItem(KUNCI, JSON.stringify(data));
  } catch {
    /* mode privat / penyimpanan penuh: tetap jalan di memori */
  }
  return data;
}

export function bacaJson(kunci, cadangan) {
  try {
    const teks = localStorage.getItem(kunci);
    return teks ? JSON.parse(teks) : cadangan;
  } catch {
    return cadangan;
  }
}

export function simpanJson(kunci, nilai) {
  try {
    localStorage.setItem(kunci, JSON.stringify(nilai));
  } catch {
    /* abaikan */
  }
}
