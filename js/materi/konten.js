// Konten materi (statis agar bisa dibaca offline).
// Urutan tiap modul: konsep → contoh langkah demi langkah → contoh dikosongkan
// → latihan mirip → "Kenapa?" → ringkasan (DESAIN.md §2.3). Maks. 3 kalimat per layar.

const M = "−";

export const MODUL = [
  {
    id: "pemanasan",
    judul: "Pemanasan",
    sub: "Cek perkalian, kelipatan, dan angka satuan.",
    slide: [
      {
        jenis: "teks",
        judul: "Pemanasan dulu, yuk!",
        paragraf: ["Ada 5 soal singkat tentang perkalian dan kelipatan.", "Materi ini membantumu memahami pola bilangan."],
      },
      { jenis: "kuis", soal: "6 × 7 = …", pilihan: ["42", "36", "48", "13"], kunci: 0, penjelasan: "6 × 7 = 42." },
      { jenis: "kuis", soal: "Manakah yang merupakan kelipatan 2?", pilihan: ["9", "14", "21", "35"], kunci: 1, penjelasan: "14 = 2 × 7, jadi 14 kelipatan 2." },
      { jenis: "kuis", soal: "2 × 15 = …", pilihan: ["17", "25", "30", "215"], kunci: 2, penjelasan: "2 × 15 = 30." },
      { jenis: "kuis", soal: "Angka satuan dari 2.348 adalah …", pilihan: ["2", "3", "4", "8"], kunci: 3, penjelasan: "Angka satuan adalah angka paling kanan: 8." },
      { jenis: "kuis", soal: `2 × 9 ${M} 1 = …`, pilihan: ["17", "18", "19", "16"], kunci: 0, penjelasan: `Kali dulu: 2 × 9 = 18. Lalu 18 ${M} 1 = 17.` },
      {
        jenis: "prasyarat",
        judul: "Ingat kembali",
        poin: [
          "Kelipatan 2: 2, 4, 6, 8, 10, … (hasil 2 × bilangan).",
          "Angka satuan: angka paling kanan. Pada 2.348, angka satuannya 8.",
          `Kerjakan perkalian dulu, baru pengurangan: 2 × 9 ${M} 1 = 18 ${M} 1 = 17.`,
        ],
      },
    ],
  },
  {
    id: "modul1",
    judul: "1. Ganjil & Genap",
    sub: "Kenali bilangan ganjil dan genap.",
    slide: [
      {
        "jenis": "tujuan",
        "judul": "Setelah modul ini, kamu bisa…",
        "poin": [
          "Membedakan bilangan ganjil dan genap.",
          "Menjelaskan alasannya dengan sisa pembagian.",
          "Memakai angka satuan sebagai cara cepat."
        ]
      },
      {
        "jenis": "makna",
        "judul": "Dari keseharian ke matematika",
        "paragraf": [
          "Kamu sering melihatnya: nomor rumah di kiri dan kanan jalan.",
          "Sekarang kita beri nama dan aturan yang pasti."
        ]
      },
      {
        jenis: "teks",
        judul: "Bilangan genap",
        paragraf: ["Bilangan genap habis dibagi 2.", "Sisa pembagiannya 0."],
        visual: { jenis: "bagi", bilangan: 8 },
      },
      {
        jenis: "teks",
        judul: "Bilangan ganjil",
        paragraf: ["Bilangan ganjil tidak habis dibagi 2.", "Sisa pembagiannya selalu 1."],
        visual: { jenis: "bagi", bilangan: 7 },
      },
      {
        jenis: "teks",
        judul: "Lihat angka satuannya",
        paragraf: ["Cukup lihat angka paling kanan.", "Berakhiran 0, 2, 4, 6, 8 → genap.", "Berakhiran 1, 3, 5, 7, 9 → ganjil."],
        visual: { jenis: "satuan" },
      },
      {
        jenis: "teks",
        judul: "Selalu bergantian",
        paragraf: ["Ganjil dan genap selalu bergantian.", "Ketuk angka untuk melihat sisanya."],
        visual: { jenis: "garis" },
      },
      {
        jenis: "contoh",
        soal: "Apakah 2.357 bilangan ganjil atau genap?",
        fase: ["Input", "Elaborasi", "Output"],
        langkah: ["Lihat angka satuannya: 7.", "7 termasuk 1, 3, 5, 7, 9.", "Jadi 2.357 adalah bilangan ganjil."],
      },
      {
        jenis: "lengkapi",
        soal: "Apakah 1.034 bilangan ganjil atau genap?",
        langkah: ["Lihat angka satuannya: 4.", "4 termasuk 0, 2, 4, 6, 8.", "Jadi 1.034 adalah bilangan …"],
        pilihan: ["genap", "ganjil"],
        kunci: 0,
        penjelasan: "Angka satuan 4 → genap.",
      },
      { jenis: "kuis", soal: "Manakah bilangan genap?", pilihan: ["35", "57", "86", "91"], kunci: 2, penjelasan: "86 berakhiran 6, jadi genap." },
      { jenis: "kuis", soal: "Manakah bilangan ganjil?", pilihan: ["240", "318", "462", "573"], kunci: 3, penjelasan: "573 berakhiran 3, jadi ganjil." },
      { jenis: "kuis", soal: "15 ÷ 2 = 7 sisa …", pilihan: ["0", "1", "2", "5"], kunci: 1, penjelasan: "2 × 7 = 14, sisanya 15 − 14 = 1. Jadi 15 ganjil." },
      {
        jenis: "kenapa",
        soal: "Kenapa 0 termasuk bilangan genap?",
        pilihan: ["Karena 0 ÷ 2 = 0 sisa 0", "Karena 0 bilangan kecil", "Karena 0 bukan bilangan"],
        kunci: 0,
        penjelasan: "Sisanya 0, jadi 0 habis dibagi 2. Itu ciri bilangan genap.",
      },
      {
        "jenis": "transendensi",
        "judul": "Aturan ini juga berlaku di…",
        "paragraf": [
          "Ganjil-genap dipakai untuk membagi giliran dan mengatur kendaraan.",
          "Aturannya selalu sama: lihat sisa pembagian dengan 2."
        ],
        "contoh": [
          "Nomor rumah",
          "Kursi bioskop",
          "Plat ganjil-genap"
        ]
      },
      {
        jenis: "ringkasan",
        judul: "Ringkasan",
        poin: ["Genap: habis dibagi 2 (sisa 0).", "Ganjil: sisa 1 jika dibagi 2.", "Cara cepat: lihat angka satuannya."],
      },
      {
        "jenis": "refleksi",
        "pertanyaan": "Dengan kalimatmu sendiri: bagaimana cara membedakan bilangan ganjil dan genap?"
      },
    ],
  },
  {
    id: "modul2",
    judul: "2. Pola & Rumus Un",
    sub: "Temukan suku ke-n pola genap dan ganjil.",
    slide: [
      {
        "jenis": "tujuan",
        "judul": "Setelah modul ini, kamu bisa…",
        "poin": [
          "Menemukan aturan pola genap dan ganjil.",
          "Memakai rumus Un untuk mencari suku ke-n.",
          "Mencari letak suku dari sebuah bilangan."
        ]
      },
      {
        "jenis": "makna",
        "judul": "Kenapa perlu rumus?",
        "paragraf": [
          "Menulis 2, 4, 6, … sampai suku ke-100 itu melelahkan.",
          "Rumus membuatmu langsung tahu suku mana pun."
        ]
      },
      {
        jenis: "teks",
        judul: "Istilah penting",
        paragraf: ["Pola bilangan adalah barisan bilangan yang punya aturan.", "Setiap bilangan disebut suku.", "n = nomor urut suku. Un = suku ke-n."],
        visual: { jenis: "istilah" },
      },
      {
        jenis: "teks",
        judul: "Pola genap",
        paragraf: ["Pola genap: 2, 4, 6, 8, …", "Setiap suku = 2 × nomor urutnya.", "Jadi rumusnya Un = 2n."],
        visual: { jenis: "tabel", jenisPola: ["genap"] },
      },
      {
        jenis: "teks",
        judul: "Pola ganjil",
        paragraf: ["Bandingkan kedua tabel.", "Suku ganjil selalu 1 kurangnya dari suku genap.", `Jadi rumusnya Un = 2n ${M} 1.`],
        visual: { jenis: "tabel", jenisPola: ["genap", "ganjil"] },
      },
      {
        jenis: "contoh",
        soal: "Tentukan suku ke-25 dari pola 1, 3, 5, 7, …",
        fase: ["Elaborasi", "Output", "Output", "Output"],
        langkah: [
          `Pola ini ganjil. Rumusnya Un = 2n ${M} 1.`,
          `Ganti n dengan 25: U25 = 2 × 25 ${M} 1.`,
          "Kali dulu: 2 × 25 = 50.",
          `Lalu kurangi 1: 50 ${M} 1 = 49. Jadi U25 = 49.`,
        ],
      },
      {
        jenis: "contoh",
        soal: "Bilangan ganjil 35 adalah suku ke berapa?",
        fase: ["Elaborasi", "Output", "Output"],
        langkah: [`Pola ganjil: Un = 2n ${M} 1.`, `35 = 2n ${M} 1, jadi 2n = 36.`, "n = 36 ÷ 2 = 18. Jadi 35 adalah suku ke-18."],
      },
      {
        jenis: "lengkapi",
        soal: "Tentukan suku ke-30 dari pola 1, 3, 5, 7, …",
        langkah: [`Pola ganjil: Un = 2n ${M} 1.`, `U30 = 2 × 30 ${M} 1 = 60 ${M} 1.`, "Jadi U30 = …"],
        pilihan: ["59", "60", "61"],
        kunci: 0,
        penjelasan: `60 ${M} 1 = 59.`,
      },
      { jenis: "kuis", soal: "Suku ke-10 dari pola 2, 4, 6, 8, … adalah …", pilihan: ["12", "19", "20", "22"], kunci: 2, penjelasan: "Un = 2n → U10 = 2 × 10 = 20." },
      { jenis: "kuis", soal: "Rumus suku ke-n pola bilangan ganjil adalah …", pilihan: ["Un = 2n", `Un = 2n ${M} 1`, "Un = n + 1", "Un = n²"], kunci: 1, penjelasan: `Coba n = 1: 2 × 1 ${M} 1 = 1, suku pertama pola ganjil.` },
      { jenis: "kuis", soal: "Suku ke-15 dari pola 1, 3, 5, 7, … adalah …", pilihan: ["29", "30", "31", "15"], kunci: 0, penjelasan: `U15 = 2 × 15 ${M} 1 = 30 ${M} 1 = 29.` },
      { jenis: "kuis", soal: "Bilangan genap 40 adalah suku ke …", pilihan: ["10", "20", "40", "80"], kunci: 1, penjelasan: "Genap: n = Un ÷ 2 = 40 ÷ 2 = 20." },
      {
        jenis: "kenapa",
        soal: `Kenapa rumus pola ganjil adalah 2n ${M} 1?`,
        pilihan: ["Karena setiap bilangan ganjil 1 kurangnya dari bilangan genap 2n", "Karena pola ganjil dimulai dari 2", "Karena beda tiap sukunya 1"],
        kunci: 0,
        penjelasan: `Genap ke-n adalah 2n. Ganjil ke-n tepat 1 di bawahnya, yaitu 2n ${M} 1.`,
      },
      {
        "jenis": "transendensi",
        "judul": "Pola ini juga ada di…",
        "paragraf": [
          "Nomor kursi, nomor rumah, dan lompatan bilangan memakai aturan yang sama.",
          "Setiap pola yang bertambah 2 bisa dicari dengan 2n atau 2n − 1."
        ],
        "contoh": [
          "Nomor kursi",
          "Nomor rumah",
          "Tangga bilangan"
        ]
      },
      {
        jenis: "ringkasan",
        judul: "Ringkasan",
        poin: ["Pola genap: 2, 4, 6, … → Un = 2n.", `Pola ganjil: 1, 3, 5, … → Un = 2n ${M} 1.`, "Kerjakan perkalian dulu, baru pengurangan."],
      },
      {
        "jenis": "refleksi",
        "pertanyaan": "Kenapa rumus pola ganjil 2n − 1, bukan 2n? Jelaskan dengan kalimatmu."
      },
    ],
  },
  {
    id: "modul3",
    judul: "3. Jumlah Suku Sn",
    sub: "Hitung jumlah n suku pertama.",
    slide: [
      {
        "jenis": "tujuan",
        "judul": "Setelah modul ini, kamu bisa…",
        "poin": [
          "Membedakan satu suku (Un) dan jumlah suku (Sn).",
          "Memakai Sn = n² dan Sn = n(n + 1).",
          "Menyelesaikan soal cerita tentang jumlah."
        ]
      },
      {
        "jenis": "makna",
        "judul": "Menjumlah tanpa lelah",
        "paragraf": [
          "Menjumlah 1 + 3 + 5 + … sampai 20 suku itu lama.",
          "Susunan titik membantumu melihat jalan pintasnya."
        ]
      },
      {
        jenis: "teks",
        judul: "Un dan Sn berbeda",
        paragraf: ["Un adalah satu suku saja.", "Sn adalah jumlah n suku pertama.", "Contoh pola ganjil: S3 = 1 + 3 + 5 = 9."],
      },
      {
        jenis: "teks",
        judul: "Jumlah bilangan ganjil",
        paragraf: ["1 + 3 + 5 + 7 membentuk persegi 4 × 4 = 16.", "Jadi jumlah n bilangan ganjil pertama: Sn = n²."],
        visual: { jenis: "titik", jenisPola: "ganjil", n: 4 },
      },
      {
        jenis: "teks",
        judul: "Jumlah bilangan genap",
        paragraf: ["2 + 4 + 6 + 8 membentuk persegi panjang 4 × 5 = 20.", "Jadi jumlah n bilangan genap pertama: Sn = n(n + 1)."],
        visual: { jenis: "titik", jenisPola: "genap", n: 4 },
      },
      {
        jenis: "contoh",
        soal: "Berapa jumlah 10 bilangan ganjil pertama?",
        fase: ["Input", "Elaborasi", "Output"],
        langkah: ["Yang ditanya jumlah, jadi pakai Sn.", "Pola ganjil: Sn = n².", "S10 = 10² = 10 × 10 = 100."],
      },
      {
        jenis: "contoh",
        soal: "Berapa jumlah 12 bilangan genap pertama?",
        fase: ["Elaborasi", "Output", "Output"],
        langkah: ["Pola genap: Sn = n(n + 1).", "S12 = 12 × (12 + 1) = 12 × 13.", "12 × 13 = 156. Jadi S12 = 156."],
      },
      {
        jenis: "lengkapi",
        soal: "Berapa jumlah 7 bilangan genap pertama?",
        langkah: ["Pola genap: Sn = n(n + 1).", "S7 = 7 × (7 + 1) = 7 × 8.", "Jadi S7 = …"],
        pilihan: ["49", "56", "63"],
        kunci: 1,
        penjelasan: "7 × 8 = 56.",
      },
      { jenis: "kuis", soal: "Jumlah 5 bilangan ganjil pertama adalah …", pilihan: ["9", "25", "30", "15"], kunci: 1, penjelasan: "Sn = n² → S5 = 5 × 5 = 25. Cek: 1 + 3 + 5 + 7 + 9 = 25." },
      { jenis: "kuis", soal: "Jumlah 5 bilangan genap pertama adalah …", pilihan: ["10", "25", "30", "36"], kunci: 2, penjelasan: "Sn = n(n + 1) → S5 = 5 × 6 = 30." },
      {
        jenis: "kuis",
        soal: "Dimas menabung Rp2.000, Rp4.000, Rp6.000, dan seterusnya setiap hari. Berapa ribu rupiah tabungannya setelah 6 hari?",
        pilihan: ["12", "36", "42", "48"],
        kunci: 2,
        penjelasan: "Pola genap, ditanya jumlah: S6 = 6 × 7 = 42 ribu rupiah.",
      },
      { jenis: "kuis", soal: "Jumlah 20 bilangan ganjil pertama adalah …", pilihan: ["39", "40", "400", "420"], kunci: 2, penjelasan: "S20 = 20² = 400." },
      {
        jenis: "kenapa",
        soal: "Apa beda Un dan Sn?",
        pilihan: ["Un satu suku, Sn jumlah beberapa suku pertama", "Un dan Sn sama saja", "Sn selalu lebih kecil dari Un"],
        kunci: 0,
        penjelasan: "U3 pola ganjil = 5 (satu suku), sedangkan S3 = 1 + 3 + 5 = 9 (jumlah).",
      },
      {
        "jenis": "transendensi",
        "judul": "Jumlah pola juga ada di…",
        "paragraf": [
          "Tabungan yang bertambah tetap, susunan ubin, dan kursi seluruhnya.",
          "Kalau yang ditanya total, pakai Sn."
        ],
        "contoh": [
          "Tabungan",
          "Susunan ubin",
          "Kursi seluruhnya"
        ]
      },
      {
        jenis: "ringkasan",
        judul: "Ringkasan",
        poin: ["Ganjil: Sn = n².", "Genap: Sn = n(n + 1).", "Baca soalnya: ditanya satu suku (Un) atau jumlah (Sn)?"],
      },
      {
        "jenis": "refleksi",
        "pertanyaan": "Apa beda Un dan Sn? Kapan kamu memakai masing-masing?"
      },
    ],
  },
];

export const URUTAN_MODUL = MODUL.map((m) => m.id);

export function cariModul(id) {
  return MODUL.find((m) => m.id === id);
}

export function jumlahKuis(modul) {
  return modul.slide.filter((s) => ["kuis", "lengkapi", "kenapa"].includes(s.jenis)).length;
}
