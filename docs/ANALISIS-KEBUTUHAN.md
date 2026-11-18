# Analisis Kebutuhan (Tahap *Analysis* ADDIE)

Dokumen ini merangkum hasil wawancara *cognitive load* dengan siswa SMP pada materi **pola bilangan ganjil dan genap**. Tujuannya menurunkan temuan wawancara menjadi prinsip desain dan fitur aplikasi **Polaria**, sehingga setiap fitur dapat dipertanggungjawabkan secara akademik.

Dokumen terkait: [PRD.md](../PRD.md) · [DESAIN.md](../DESAIN.md) · [README.md](../README.md)

---

## 1. Metode

| Aspek | Keterangan |
|---|---|
| Pendekatan | Wawancara semi-terstruktur berbasis *Cognitive Load Theory* (CLT) |
| Instrumen | Skrining (4 butir), Konteks (K01–K03), *Intrinsic Load* (IL01–IL05), *Extraneous Load* (EL01–EL05), *Germane Load* (GL01–GL05), Rekomendasi Desain (DS01–DS03), Penutup (3 butir) |
| Subjek | S01, siswa kelas VIII |
| Tanggal | 04 November 2026 |
| Durasi | ±22 menit (daring, panggilan video) |
| Pewawancara | Suchita Rahma Fakhira |
| Bukti pernah belajar | Buku catatan siswa |
| Artefak pemicu | Latihan soal (soal pemantik: Un dan Sn pola genap & ganjil) |

**Kode analisis:** K = konteks, IL = *intrinsic load* (kesulitan bawaan materi), EL = *extraneous load* (beban dari cara penyajian), GL = *germane load* (usaha membangun pemahaman), DS = rekomendasi desain.

---

## 2. Temuan per Kategori

### 2.1 Konteks Belajar (K)

| Kode | Kutipan verbatim | Interpretasi |
|---|---|---|
| Skrining | "Pernah mempelajari materi pola bilangan ganjil dan genap saat awal kelas VIII." | Siswa sudah pernah mendapat materi. |
| K01 | "Yang masih saya ingat rumusnya, kalau genap Un = 2n, kalau ganjil Un = 2n − 1." | Rumus dasar masih diingat sebagai hafalan. |
| K02 | "Biasanya guru menjelaskan dulu, terus dikasih latihan soal. Kadang juga mengerjakan secara kelompok." | Pola pembelajaran: penjelasan → latihan → diskusi. |
| K03 | "Kalau membedakan ganjil dan genap bisa dilihat dari angka terakhirnya, tetapi saya masih bingung menentukan rumus yang harus digunakan." | Mengenali jenis bilangan sudah bisa; **memilih rumus belum yakin**. |

### 2.2 Intrinsic Load (IL)

| Kode | Kutipan verbatim | Interpretasi |
|---|---|---|
| IL01 | "Yang paling sulit itu membedakan pola ganjil dan genap, terus menentukan rumusnya. Kadang saya tertukar dan lupa rumusnya." | **Kesulitan inti:** membedakan pola dan memilih rumus; rumus sering tertukar. |
| IL02 | "Saya memperhatikan angka-angkanya dan apa yang ditanyakan. Harus memahami konsepnya dulu, tetapi terkadang masih bingung menggunakan rumus." | Banyak unsur yang harus diolah bersamaan (angka, pertanyaan, rumus). |
| IL03 | "Materi perkalian dan kelipatan membantu saya memahami pola bilangan." | Prasyarat: perkalian dan kelipatan. |
| IL04 | "Kalau angkanya besar, saya agak kesulitan karena perkalian dan pengurangannya lebih sulit. Kalau hanya mencari angka selanjutnya, lebih mudah." | Kesulitan naik pada **bilangan besar**; melanjutkan pola terasa mudah. |
| IL05 | "Saya masih kesulitan menentukan rumus atau polanya. Kadang juga bingung kalau diminta mencari jumlah suku dari suku pertama sampai suku tertentu." | **Jumlah suku (Sn)** menjadi titik sulit berikutnya. |

### 2.3 Extraneous Load (EL)

| Kode | Kutipan verbatim | Interpretasi |
|---|---|---|
| EL01 | "Kadang saya tertinggal langkahnya karena penjelasan guru terlalu cepat." | Kecepatan penjelasan tidak bisa diatur siswa. |
| EL02 | "Kalau ada gambar atau tabel berwarna, saya lebih mudah memahami materi." | Visual (tabel, warna) membantu. |
| EL03 | "Kalau penjelasannya terlalu panjang, saya jadi bosan. Lebih suka penjelasan yang singkat, sederhana, dan jelas." | Teks harus ringkas. |
| EL04 | "Kalau belum paham, biasanya saya membaca dan mempelajarinya lagi supaya mengerti langkah-langkahnya." | Siswa butuh materi yang **bisa diulang**. |
| EL05 | "Kalau angkanya besar, saya lebih sulit mengerjakan perkalian dan pengurangannya." | Bilangan besar menambah beban hitung. |

### 2.4 Germane Load (GL)

| Kode | Kutipan verbatim | Interpretasi |
|---|---|---|
| GL01 | "Contoh soal membantu saya mengingat materi. Dari contoh itu, saya bisa mencoba mengerjakan soal yang lain." | **Contoh soal** adalah strategi utama. |
| GL02 | "Biasanya saya memeriksa kembali jawaban supaya tahu apakah ada langkah yang terlewat." | Ada kebiasaan memeriksa ulang. |
| GL03 | "Kalau ada contoh soal, saya lebih mudah mengerjakan soal baru yang bentuknya hampir sama." | Contoh yang mirip → mandiri. |
| GL04 | "Saya pernah menjelaskan rumus dan istilahnya kepada teman sebangku… karena saya sendiri masih belum sepenuhnya paham." | Menjelaskan ulang membantu, meski pemahaman belum kuat. |
| GL05 | "Kalau menemukan pola baru, biasanya saya mencocokkannya dengan soal yang pernah dikerjakan. Kalau mirip, saya menggunakan cara yang sama." | Transfer melalui pencocokan dengan contoh lama. |

### 2.5 Rekomendasi Desain dari Siswa (DS)

| Kode | Kutipan verbatim | Interpretasi |
|---|---|---|
| DS01 | "Saya paling membutuhkan latihan soal karena kalau sering mengerjakan soal yang mirip, saya lebih mudah mengingatnya." | Latihan soal bervariasi dan berulang. |
| DS02 | "Sebaiknya dijelaskan dulu bilangan ganjil dan genap, kemudian rumusnya, lalu diberikan contoh sebelum latihan soal." | Urutan: **konsep → rumus → contoh → latihan**. |
| DS03 | "Jangan terlalu banyak penjelasan panjang, gambar, atau animasi. Tampilannya sederhana, jelas, dan warnanya tidak terlalu terang." | Tampilan sederhana, warna lembut, animasi minimal. |

### 2.6 Penutup

| Butir | Kutipan verbatim |
|---|---|
| Kesulitan terbesar | "Kesulitan terbesar saya adalah membedakan pola dan menentukan rumus yang digunakan." |
| Paling membantu | "Yang paling membantu itu contoh soal dan penjelasan yang jelas." |

---

## 3. Sintesis Masalah

1. **Membedakan pola & memilih rumus** (IL01, K03, IL05, Penutup 1). Rumus Un = 2n dan Un = 2n − 1 dihafal tanpa makna sehingga mudah tertukar.
2. **Jumlah suku Sn** (IL05). Konsep menjumlah dari suku pertama sampai suku ke-n belum dikuasai.
3. **Beban hitung bilangan besar** (IL04, EL05). Kesalahan bukan karena konsep, melainkan karena perkalian/pengurangan.
4. **Penyajian terlalu cepat dan panjang** (EL01, EL03). Siswa tidak bisa mengatur kecepatan, dan teks panjang membuat bosan.
5. **Contoh soal dan latihan mirip** adalah jalur belajar yang paling efektif bagi siswa (GL01, GL03, GL05, DS01).

---

## 4. Matriks Keterlacakan: Temuan → Prinsip Desain → Fitur

Kode fitur (F-xx) merujuk ke [PRD.md](../PRD.md#6-kebutuhan-fungsional).

| Temuan | Prinsip CLT | Fitur |
|---|---|---|
| Rumus tertukar, sulit membedakan pola (IL01, K03) | Mengelola IL: bangun makna (2n = "kelipatan 2", 2n − 1 = "satu kurangnya dari genap"); *signaling* warna (genap ungu, ganjil biru) | F-03, F-04, F-09, F-13, F-14 |
| Mengenali ganjil/genap dari angka satuan, belum yakin memilih rumus (K03) | Menjembatani pengetahuan lama ke rumus: sisa bagi 2 → posisi suku ke-n | F-13 Kalkulator Ganjil Genap |
| Bingung Sn (IL05) | Mengelola IL: urutan sederhana → kompleks; Sn dipisah setelah Un; eksplorasi Sn dengan jumlah suku yang bisa diubah | F-05, F-14 Generator Pola |
| Bilangan besar sulit (IL04, EL05) | Mengelola IL: angka kecil dulu, naik bertahap; langkah hitung dipecah; alat bantu menampilkan langkah | F-06, F-07, F-13, F-14 |
| Prasyarat perkalian & kelipatan (IL03) | *Pre-training* | F-02 |
| Penjelasan terlalu cepat (EL01) | Mengurangi EL: segmentasi, kecepatan dikendalikan siswa | F-06 |
| Tabel/warna membantu (EL02) | Mengurangi EL: *signaling*, representasi visual | F-03, F-04, F-05 |
| Penjelasan panjang membosankan (EL03, DS03) | Mengurangi EL: teks ringkas, satu ide per layar | Semua modul (pedoman konten di DESAIN.md) |
| Ingin bisa mengulang (EL04) | Kendali belajar oleh siswa | F-01 (modul bisa dibuka ulang), F-09, F-16 Hasil Belajar |
| Animasi/warna terang mengganggu (DS03) | Mengurangi EL: hindari unsur dekoratif. Mockup ungu dipakai dengan latar lavender lembut, ilustrasi statis, tanpa animasi (DESAIN.md §1.4) | Sistem visual (DESAIN.md), F-17 mode gelap |
| Contoh soal paling membantu (GL01, GL03) | Meningkatkan GL: *worked example* → *completion* → mandiri | F-06, F-07 |
| Mencocokkan dengan soal mirip (GL05) | Meningkatkan GL: variasi bertahap dari soal yang mirip | F-07 |
| Memeriksa ulang jawaban (GL02) | Meningkatkan GL: refleksi / verifikasi | F-10 |
| Menjelaskan ke teman (GL04) | Meningkatkan GL: *self-explanation* | Pertanyaan "Kenapa?" di F-04, F-08 |
| Butuh banyak latihan (DS01) | Latihan berulang, soal acak | F-07, F-08 |
| Urutan konsep → rumus → contoh → latihan (DS02) | Urutan instruksional | Alur F-01 s.d. F-07 |
| Memeriksa ulang & mencocokkan dengan pola lama (GL02, GL05) | Eksplorasi terarah: siswa mengubah jenis/jumlah suku dan melihat hasilnya | F-14 Generator Pola |
| Tujuan literasi matematika | Penerapan pada konteks nyata | F-11 |
| Data untuk tahap Evaluation | — | F-00, F-12, F-15 Evaluasi (pre/post-test), F-16 |
| Siswa memakai smartphone, koneksi tidak stabil (persona) | Akses mudah tanpa toko aplikasi; tetap bisa belajar offline | F-18 Pasang aplikasi (PWA), F-17 Pengaturan |

---

## 4b. Kerangka Kedua: Rigorous Mathematical Thinking (RMT)

Selain CLT, desain memakai model RMT (Kinard & Kozulin). Temuan wawancara dipetakan ke unsur RMT berikut:

| Temuan | Unsur RMT | Fitur |
|---|---|---|
| Sulit membedakan pola & memilih rumus (IL01, K03) | Fungsi kognitif Elaborasi (membandingkan, mengklasifikasi); alat psikologis rumus & tabel | F-19 tahap Rencanakan, F-20 |
| Bingung apa yang ditanya: suku atau jumlah (IL05) | Fungsi kognitif Input (persepsi jelas, ketepatan data); analisis tugas | F-19 tahap Pahami, diagnosis `input_ditanya` |
| Kesulitan hitung bilangan besar (IL04, EL05) | Fungsi kognitif Output (presisi, hindari coba-coba) | F-19 tahap Kerjakan (langkah wajib ditulis) |
| Tertinggal karena penjelasan cepat (EL01) | MLE: mediasi bertahap, resiprositas | Tutor satu pertanyaan per giliran, siswa mengatur kecepatan |
| Contoh soal & soal mirip membantu (GL01, GL03, GL05) | MLE: transendensi; konsep sehari-hari → ilmiah | F-20 Makna & Transendensi, soal cerita |
| Memeriksa ulang jawaban (GL02) | Validasi; metakognisi | F-19 tahap Renungkan, F-21 jurnal |
| Menjelaskan ke teman membantu (GL04) | Bahasa matematika sebagai alat berpikir | "Jelaskan caramu ke tutor" |
| Data untuk tahap Evaluation | Asesmen dinamis (*sandwich* & *cake*) | Pre/post-test, petunjuk bertingkat, tabel `interaksi_tutor` |

## 5. Keterbatasan dan Rekomendasi

- **Baru satu responden (S01).** Temuan belum dapat digeneralisasi. Disarankan menambah 3–5 siswa dengan kemampuan berbeda, serta mewawancarai guru matematika, sebelum desain difinalkan.
- Temuan bersifat persepsi siswa. Perlu dikonfirmasi dengan data kinerja (hasil latihan di aplikasi, pre-test/post-test) pada tahap *Evaluation*.
- Wawancara dilakukan daring, sehingga observasi proses mengerjakan soal terbatas pada foto artefak.
