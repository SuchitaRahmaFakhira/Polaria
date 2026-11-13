// Set soal tetap untuk pre-test dan post-test (sama untuk semua siswa agar
// hasilnya bisa dibandingkan). Urutan pilihan diacak saat tes dimulai.
const M = "−";

export const SOAL_EVALUASI = [
  { id: "e01", tipe: "jenis_bilangan", soal: "Bilangan berikut yang termasuk bilangan ganjil adalah …", pilihan: ["24", "38", "57", "90"], kunci: "57", pembahasan: "57 berakhiran 7, jadi ganjil (57 ÷ 2 = 28 sisa 1)." },
  { id: "e02", tipe: "jenis_bilangan", soal: "Bilangan berikut yang termasuk bilangan genap adalah …", pilihan: ["135", "248", "371", "509"], kunci: "248", pembahasan: "248 berakhiran 8, jadi genap." },
  { id: "e03", tipe: "jenis_pola", soal: "Pola 2, 4, 6, 8, … adalah pola bilangan …", pilihan: ["Genap", "Ganjil", "Persegi", "Segitiga"], kunci: "Genap", pembahasan: "Semua sukunya habis dibagi 2." },
  { id: "e04", tipe: "jenis_pola", soal: "Pola 21, 23, 25, 27, … adalah pola bilangan …", pilihan: ["Genap", "Ganjil", "Persegi", "Segitiga"], kunci: "Ganjil", pembahasan: "Semua sukunya bersisa 1 jika dibagi 2." },
  { id: "e05", tipe: "lanjut_pola", soal: "Suku berikutnya dari pola 11, 13, 15, 17, … adalah …", pilihan: ["18", "19", "20", "21"], kunci: "19", pembahasan: "Selisihnya 2: 17 + 2 = 19." },
  { id: "e06", tipe: "pilih_rumus", soal: "Rumus suku ke-n pola bilangan ganjil adalah …", pilihan: ["Un = 2n", `Un = 2n ${M} 1`, "Un = n²", "Un = n + 1"], kunci: `Un = 2n ${M} 1`, pembahasan: `n = 1 → 2 × 1 ${M} 1 = 1, suku pertama pola ganjil.` },
  { id: "e07", tipe: "pilih_rumus", soal: "Rumus suku ke-n pola bilangan genap adalah …", pilihan: ["Un = 2n", `Un = 2n ${M} 1`, "Un = n²", "Un = n + 2"], kunci: "Un = 2n", pembahasan: "n = 1 → 2, n = 2 → 4, n = 3 → 6." },
  { id: "e08", tipe: "cari_un", soal: "Suku ke-12 pola bilangan genap adalah …", pilihan: ["12", "22", "24", "26"], kunci: "24", pembahasan: "U12 = 2 × 12 = 24." },
  { id: "e09", tipe: "cari_un", soal: "Suku ke-20 pola bilangan ganjil adalah …", pilihan: ["19", "39", "40", "41"], kunci: "39", pembahasan: `U20 = 2 × 20 ${M} 1 = 40 ${M} 1 = 39.` },
  { id: "e10", tipe: "cari_n", soal: "Bilangan ganjil 45 adalah suku ke …", pilihan: ["22", "23", "24", "45"], kunci: "23", pembahasan: "n = (45 + 1) ÷ 2 = 46 ÷ 2 = 23." },
  { id: "e11", tipe: "cari_n", soal: "Bilangan genap 64 adalah suku ke …", pilihan: ["30", "32", "34", "64"], kunci: "32", pembahasan: "n = 64 ÷ 2 = 32." },
  { id: "e12", tipe: "cari_sn", soal: "Jumlah 8 bilangan ganjil pertama adalah …", pilihan: ["15", "36", "64", "72"], kunci: "64", pembahasan: "S8 = 8² = 64." },
  { id: "e13", tipe: "cari_sn", soal: "Jumlah 6 bilangan genap pertama adalah …", pilihan: ["12", "36", "42", "48"], kunci: "42", pembahasan: "S6 = 6 × (6 + 1) = 6 × 7 = 42." },
  { id: "e14", tipe: "soal_cerita", soal: "Rumah di sisi kiri jalan bernomor ganjil: 1, 3, 5, dan seterusnya. Nomor rumah ke-30 adalah …", pilihan: ["31", "59", "60", "61"], kunci: "59", pembahasan: `Pola ganjil, suku ke-30: 2 × 30 ${M} 1 = 59.` },
  { id: "e15", tipe: "soal_cerita", soal: "Dimas menabung Rp2.000, Rp4.000, Rp6.000, dan seterusnya setiap hari. Total tabungannya setelah 10 hari adalah … ribu rupiah.", pilihan: ["20", "100", "110", "120"], kunci: "110", pembahasan: "Pola genap, ditanya jumlah: S10 = 10 × 11 = 110 ribu rupiah." },
];

export const LABEL_TIPE = {
  jenis_bilangan: "Jenis bilangan",
  jenis_pola: "Membedakan pola",
  lanjut_pola: "Melanjutkan pola",
  pilih_rumus: "Memilih rumus",
  cari_un: "Mencari Un",
  cari_n: "Mencari letak suku",
  cari_sn: "Mencari Sn",
  soal_cerita: "Soal cerita",
};
