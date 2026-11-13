# Desain Polaria — Instruksional & Antarmuka

Dokumen ini menerjemahkan temuan wawancara ([docs/ANALISIS-KEBUTUHAN.md](docs/ANALISIS-KEBUTUHAN.md)) dan kebutuhan ([PRD.md](PRD.md)) menjadi rancangan pembelajaran dan tampilan.

**Acuan tampilan:** [docs/referensi-tampilan.jpg](docs/referensi-tampilan.jpg) (mockup Beranda, Kalkulator Ganjil Genap, Generator Pola Bilangan, Latihan Soal). Gaya: ungu-lavender lembut, kartu putih bersudut bulat, ikon berwarna dalam kotak, navigasi bawah.

---

## 1. Prinsip Desain Berbasis *Cognitive Load Theory*

### 1.1 Mengurangi *Extraneous Load* (beban dari penyajian)

| Prinsip | Penerapan di Polaria | Dasar |
|---|---|---|
| Segmentasi | Satu ide per layar. Materi dipecah menjadi kartu kecil dengan tombol "Lanjut". | EL01, EL03 |
| Kecepatan diatur siswa | Tidak ada perpindahan otomatis. Siswa bisa kembali ke langkah sebelumnya. | EL01, EL04 |
| Teks ringkas | Maksimal 3 kalimat per layar, kalimat pendek. | EL03, DS03 |
| *Signaling* | Warna makna konsisten: **genap = ungu**, **ganjil = biru** (seperti tombol Genap/Ganjil di mockup). Angka yang sedang dibahas ditebalkan. | EL02 |
| Kedekatan (*spatial contiguity*) | Rumus diletakkan tepat di samping tabel/angka yang dijelaskan. | EL05 |
| Tanpa unsur dekoratif bergerak | Ilustrasi hanya statis dan kecil; tidak ada animasi hiasan, maskot, atau suara. | DS03 |
| Tidak redundan | Informasi tidak diulang dalam teks dan gambar sekaligus. | DS03 |

### 1.2 Mengelola *Intrinsic Load* (kesulitan bawaan materi)

| Prinsip | Penerapan | Dasar |
|---|---|---|
| *Pre-training* | Pemanasan prasyarat dan pengenalan istilah *suku*, *n*, *Un*, *Sn* sebelum rumus. | IL03 |
| Sederhana → kompleks | Jenis bilangan → melanjutkan pola → Un → cari n dari Un → Sn → soal cerita. | DS02, IL04 |
| Angka kecil dulu | Contoh dan latihan awal memakai n ≤ 10. | IL04, EL05 |
| Memisahkan unsur yang saling terkait | Un tuntas sebelum Sn. Pola genap dan ganjil disajikan berdampingan agar perbedaannya terlihat. | IL01, IL05 |
| Membangun makna rumus | 2n = "kelipatan 2"; 2n − 1 = "bilangan genap ke-n dikurangi 1". | IL01, K01 |
| Alat bantu hitung | Kalkulator dan Generator Pola menampilkan **langkah**, bukan hanya hasil, sehingga beban hitung bilangan besar berkurang tanpa menghilangkan proses berpikir. | IL04, EL05 |

### 1.3 Meningkatkan *Germane Load* (usaha membangun pemahaman)

| Prinsip | Penerapan | Dasar |
|---|---|---|
| *Worked example* | Setiap konsep diawali contoh soal langkah demi langkah. | GL01 |
| *Completion problem* & *fading* | Contoh berikutnya menyisakan satu langkah untuk diisi, lalu soal mandiri. | GL03 |
| Variasi bertahap | Latihan dimulai mirip contoh, lalu berubah bentuk. | GL05, DS01 |
| *Self-explanation* | Pertanyaan "Kenapa rumusnya 2n − 1?" setelah materi. | GL04 |
| Refleksi/verifikasi | "Cek jawabanmu" (substitusi n kecil); Kalkulator menunjukkan posisi suku. | GL02 |
| Eksplorasi terarah | Generator Pola: siswa mengubah jumlah suku dan melihat Un & Sn berubah. | GL05 |

### 1.4 Penyesuaian mockup terhadap temuan wawancara

Mockup dipakai sebagai acuan gaya, dengan penyesuaian berikut agar tetap sesuai DS03 ("tampilan sederhana, warna tidak terlalu terang, jangan banyak gambar/animasi"):

| Unsur mockup | Penyesuaian |
|---|---|
| Ilustrasi angka 1-2-3 dan ikon besar di kepala layar | Tetap ada tetapi **statis**, ukuran sedang, hanya di Beranda dan kepala layar alat bantu; tidak muncul di layar materi/latihan |
| Garis kilau/dekorasi di sekitar ikon | Dihilangkan atau sangat tipis |
| Warna ungu cerah | Ungu dipakai untuk tombol utama dan aksen; latar memakai lavender sangat muda agar tidak menyilaukan |
| Kalkulator hanya menentukan ganjil/genap | Ditambah posisi dalam pola (suku ke-n) untuk menjembatani ke rumus (IL01) |
| Generator Pola hanya menampilkan Un | Ditambah Sn dan langkahnya (IL05) |
| Latihan 5 soal | Menjadi 10 soal per sesi, tetap dengan bilah progres |

---

## 2. Struktur Navigasi & Alur

### 2.1 Navigasi bawah (selalu terlihat setelah masuk)

| Tab | Isi |
|---|---|
| **Beranda** | Kartu "Ayo mulai belajar!" + Menu Utama |
| **Materi** | Pemanasan, Modul 1–3, kartu rumus |
| **Nilai** | Hasil Belajar: skor latihan & evaluasi |
| **Pengaturan** | Profil, tampilan, pasang aplikasi |

### 2.2 Menu Utama (Beranda)

| Item | Ikon (warna kotak) | Subjudul | Tujuan |
|---|---|---|---|
| Materi | buku (biru) | Pelajari konsep dasar bilangan ganjil dan genap. | `#/materi` |
| Kalkulator Ganjil Genap | kalkulator (biru muda) | Cek bilangan dan lihat cara perhitungannya. | `#/kalkulator` |
| Generator Pola Bilangan | kotak 2×2 (hijau) | Buat pola bilangan secara otomatis. | `#/generator` |
| Latihan Soal | kotak 2×2 (jingga) | Kerjakan soal interaktif sesuai materi. | `#/latihan` |
| Evaluasi | piala (ungu) | Uji pemahamanmu dengan tes pilihan ganda. | `#/evaluasi` |
| Hasil Belajar | grafik batang (kuning) | Lihat perkembangan belajarmu. | `#/nilai` |

### 2.3 Alur belajar

```
 Masuk ─▶ Beranda ─┬─▶ Evaluasi: Pre-test (sekali, sebelum materi)
                   │
                   ├─▶ Materi: Pemanasan ─▶ Modul 1 ─▶ Modul 2 ─▶ Modul 3
                   │                                                │
                   ├─▶ Latihan: Mudah ─▶ Sedang ─▶ Menantang ◀──────┘
                   │                                   │
                   ├─▶ Evaluasi: Post-test (setelah semua modul)
                   │
                   ├─▶ Kalkulator / Generator Pola (kapan saja)
                   └─▶ Nilai (Hasil Belajar)
```

**Struktur di dalam setiap modul** (DS02): konsep singkat → contoh langkah demi langkah → contoh dengan satu langkah dikosongkan → 3–5 soal mirip → pertanyaan "Kenapa?" → ringkasan + kartu rumus.

Modul berikutnya terbuka setelah modul sebelumnya selesai; modul yang sudah terbuka bisa diulang kapan saja (EL04). Kalkulator dan Generator Pola selalu terbuka.

---

## 3. Wireframe

Lebar acuan 360 px. `[ ]` = tombol, `( )` = pilihan, `›` = chevron. Semua layar setelah Masuk memiliki navigasi bawah:

```
├──────────────────────────────┤
│  ⌂        📖       🏆     ⚙   │
│Beranda  Materi   Nilai Pengaturan│
└──────────────────────────────┘
```

### 3.1 Masuk
```
┌──────────────────────────────┐
│    [ilustrasi 1·2·3 kecil]   │
│ Pola Bilangan Ganjil Genap   │
│ Belajar, latihan, dan pahami │
│ pola bilangan dengan mudah!  │
│                              │
│ Nama lengkap                 │
│ ┌──────────────────────────┐ │
│ │                          │ │
│ └──────────────────────────┘ │
│ Tulis seperti di absen       │
│ Kelas                        │
│ ┌──────────────────────────┐ │
│ │ 8A                     ▾ │ │
│ └──────────────────────────┘ │
│ (        Mulai         )     │  ← tombol pil ungu
└──────────────────────────────┘
```

### 3.2 Beranda (sesuai mockup)
```
┌──────────────────────────────┐
│ Pola Bilangan      [1][2]    │
│ Ganjil Genap         [3]     │
│ Halo, Rina! Kelas 8A         │
│ ┌──────────────────────────┐ │
│ │ 💡 Ayo mulai belajar!   ›│ │  ← kartu lavender
│ │ Lanjut: Modul 2 Pola & Un│ │
│ └──────────────────────────┘ │
│ Menu Utama                   │
│ ┌──────────────────────────┐ │
│ │[📖] Materi              ›│ │
│ │     Pelajari konsep dasar│ │
│ ├──────────────────────────┤ │
│ │[🧮] Kalkulator Ganjil   ›│ │
│ │     Genap                │ │
│ ├──────────────────────────┤ │
│ │[▦ ] Generator Pola      ›│ │
│ ├──────────────────────────┤ │
│ │[▦ ] Latihan Soal        ›│ │
│ ├──────────────────────────┤ │
│ │[🏆] Evaluasi            ›│ │
│ ├──────────────────────────┤ │
│ │[📊] Hasil Belajar       ›│ │
│ └──────────────────────────┘ │
│ [ ⬇ Pasang Aplikasi ]        │  ← hanya jika belum terpasang
├──────────────────────────────┤
│ nav bawah                    │
└──────────────────────────────┘
```

### 3.3 Kalkulator Ganjil Genap (sesuai mockup + posisi suku)
```
┌──────────────────────────────┐
│ ‹   Kalkulator Ganjil Genap  │
│          [ikon 🧮]           │
│ Masukkan angka yang ingin    │
│ diperiksa                    │
│ Masukkan bilangan            │
│ ┌──────────────────────────┐ │
│ │ Contoh: 17             ⊗ │ │
│ └──────────────────────────┘ │
│ (        🧮 Hitung       )   │
│ ┌──────────────────────────┐ │
│ │     Hasil Perhitungan    │ │
│ │  ┌────────────────────┐  │ │
│ │  │  BILANGAN GANJIL   │  │ │  ← latar biru muda (ganjil)
│ │  │        17          │  │ │
│ │  └────────────────────┘  │ │
│ │ Cara Perhitungan:        │ │
│ │ 17 ÷ 2 = 8 sisa 1        │ │
│ │ Karena sisanya 1, maka 17│ │
│ │ termasuk bilangan ganjil.│ │
│ │ Posisi dalam pola:       │ │
│ │ n = (17 + 1) ÷ 2 = 9     │ │
│ │ 17 adalah suku ke-9      │ │
│ │ pola ganjil.             │ │
│ │   ✔ Perhitungan berhasil │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │💡 Ingat!                 │ │
│ │ Genap: sisa 0.           │ │
│ │ Ganjil: sisa 1.          │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```
Hasil genap memakai latar ungu muda. Bilangan 0: genap, tanpa posisi suku ("0 genap, tetapi bukan suku pola karena n dimulai dari 1"). Offline: kartu hasil diganti pesan "Butuh internet untuk menghitung."

### 3.4 Generator Pola Bilangan (sesuai mockup + Sn)
```
┌──────────────────────────────┐
│ ‹   Generator Pola Bilangan  │
│    [2][4][6][8][10] (statis) │
│ Pilih jenis pola dan tentukan│
│ jumlah suku.                 │
│ Jenis Pola                   │
│ ┌────────────┐┌────────────┐ │
│ │●● Genap  ✔ ││●● Ganjil   │ │  ← terpilih: garis ungu
│ └────────────┘└────────────┘ │
│ Jumlah Suku                  │
│ ┌──────────────────────────┐ │
│ │   (−)       5       (+)  │ │  ← 1–20
│ └──────────────────────────┘ │
│ (      ✦ Buat Pola       )   │
│ ┌──────────────────────────┐ │
│ │  Hasil Pola Bilangan Genap│ │
│ │  [2] [4] [6] [8] [10]    │ │  ← chip ungu
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ ⓘ Keterangan:            │ │
│ │ • Suku pertama = 2       │ │
│ │ • Beda = 2               │ │
│ │ • Rumus: Un = 2n         │ │
│ │ • Jumlah 5 suku:         │ │
│ │   S5 = 5 × (5 + 1) = 30  │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```
Label tombol memakai Bahasa Indonesia "Buat Pola" (mockup: "Generate Pola").

### 3.5 Materi (daftar modul)
```
┌──────────────────────────────┐
│ Materi                [Rumus]│
│ ┌──────────────────────────┐ │
│ │ ✔ Pemanasan        5/5  ›│ │
│ │ ✔ 1. Ganjil & Genap 4/5 ›│ │
│ │ ▶ 2. Pola & Un  sedang  ›│ │
│ │ 🔒 3. Jumlah Sn          │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

### 3.6 Layar Materi (contoh: Modul 2)
```
┌──────────────────────────────┐
│ ‹  2. Pola & Un     ●●○○○    │
│ ┌────────────┬─────────────┐ │
│ │ Genap      │ Ganjil      │ │
│ │ n │ Un     │ n │ Un      │ │
│ │ 1 │ 2      │ 1 │ 1       │ │
│ │ 2 │ 4      │ 2 │ 3       │ │
│ │ 3 │ 6      │ 3 │ 5       │ │
│ │ Un = 2n    │ Un = 2n − 1 │ │
│ └────────────┴─────────────┘ │
│ Bilangan ganjil selalu 1     │
│ kurangnya dari bilangan      │
│ genap di sebelahnya.         │
│ [ ‹ Kembali ]  ( Lanjut › )  │
└──────────────────────────────┘
```
Kolom genap berlatar ungu muda, kolom ganjil biru muda.

### 3.7 Contoh Langkah demi Langkah
```
┌──────────────────────────────┐
│ ‹ Contoh soal    Langkah 2/4 │
│ Tentukan suku ke-25 dari     │
│ pola 1, 3, 5, 7, …           │
│ ┌──────────────────────────┐ │
│ │1. Pola ini ganjil.       │ │
│ │   Rumusnya Un = 2n − 1   │ │
│ │2. Ganti n dengan 25:     │ │
│ │   U25 = 2 × 25 − 1       │ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░│ │  ← langkah 3 belum tampil
│ └──────────────────────────┘ │
│ [ ‹ Kembali ]  ( Lanjut › )  │
└──────────────────────────────┘
```

### 3.8 Latihan Soal (sesuai mockup)
```
┌──────────────────────────────┐
│ ‹        Latihan Soal        │
│ ┌──────────────────────────┐ │
│ │[📋] Latihan · Sedang     │ │
│ │ Kerjakan soal berikut    │ │
│ │ dengan tepat dan teliti! │ │
│ └──────────────────────────┘ │
│ ▓▓▓░░░░░░░░░░░░░░░   1/10    │
│ ┌──────────────────────────┐ │
│ │1. Bilangan berikut yang  │ │
│ │termasuk bilangan genap … │ │
│ │ (A) 7                  ○ │ │
│ │ (B) 12                 ◉ │ │  ← terpilih: garis ungu
│ │ (C) 15                 ○ │ │
│ │ (D) 21                 ○ │ │
│ └──────────────────────────┘ │
│ [Petunjuk] ( Selanjutnya → ) │
└──────────────────────────────┘
```
Soal isian memakai kotak angka (keyboard numerik, `inputmode="numeric"`) sebagai ganti pilihan A–D. Pilih level (Mudah/Sedang/Menantang) di layar sebelum sesi dimulai.

### 3.9 Umpan Balik
```
Benar:                          Salah:
┌────────────────────────────┐  ┌────────────────────────────┐
│ ✔ Benar!                   │  │ ✖ Belum tepat.             │
│ 12 ÷ 2 = 6 sisa 0 → genap  │  │ Petunjuk 1: Lihat angka    │
│ [Cek jawabanmu]            │  │ satuannya.                 │
│ ( Selanjutnya → )          │  │ [Coba lagi] [Petunjuk 2]   │
└────────────────────────────┘  │ [Lihat pembahasan]         │
                                └────────────────────────────┘
```
Muncul sebagai lembar bawah di layar latihan.

### 3.10 Evaluasi
```
┌──────────────────────────────┐
│ ‹          Evaluasi          │
│ ┌──────────────────────────┐ │
│ │[🏆] Pre-test             │ │
│ │ 15 soal · ±20 menit      │ │
│ │ Status: selesai · 9/15   │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │[🏆] Post-test            │ │
│ │ Terbuka setelah semua    │ │
│ │ modul selesai  🔒        │ │
│ └──────────────────────────┘ │
│ Tidak ada petunjuk selama    │
│ tes. Pembahasan muncul       │
│ setelah selesai.             │
└──────────────────────────────┘
```
Tampilan soal sama dengan Latihan (3.8) tanpa tombol Petunjuk.

### 3.11 Nilai (Hasil Belajar)
```
┌──────────────────────────────┐
│ Hasil Belajar                │
│ ┌────────────┐┌────────────┐ │
│ │ Pre-test   ││ Post-test  │ │
│ │   60       ││   87       │ │
│ └────────────┘└────────────┘ │
│ Latihan                      │
│ Mudah      ▓▓▓▓▓▓▓▓▓░ 9/10   │
│ Sedang     ▓▓▓▓▓▓▓░░░ 7/10   │
│ Menantang  belum dikerjakan  │
│ Per jenis soal               │
│ Membedakan pola    ✔ 5/5     │
│ Mencari Un         ✔ 4/5     │
│ Mencari Sn         ✖ 2/5     │
│ Soal cerita        ✔ 3/4     │
│ 💡 Ulangi Modul 3: Jumlah Sn │
└──────────────────────────────┘
```

### 3.12 Pengaturan
```
┌──────────────────────────────┐
│ Pengaturan                   │
│ Profil                       │
│  Nama: Rina Aulia     [Ubah] │
│  Kelas: 8A            [Ubah] │
│ Tampilan                     │
│  Mode gelap        [  ○ ]    │
│  Huruf besar       [  ○ ]    │
│ Aplikasi                     │
│  ⬇ Pasang di HP            › │
│  ⓘ Tentang Polaria          › │
└──────────────────────────────┘
```

### 3.13 Kartu Rumus (lembar bawah)
```
┌──────────────────────────────┐
│ Kartu Rumus            [ × ] │
│ GENAP  2, 4, 6, 8, …   (ungu)│
│   Un = 2n                    │
│   Sn = n(n + 1)              │
│ GANJIL 1, 3, 5, 7, …   (biru)│
│   Un = 2n − 1                │
│   Sn = n²                    │
└──────────────────────────────┘
```

### 3.14 Panduan Pasang (lembar bawah)
```
Android (Chrome):               iPhone (Safari):
┌────────────────────────────┐  ┌────────────────────────────┐
│ Pasang Polaria di HP-mu     │  │ Pasang Polaria di HP-mu     │
│ ( ⬇ Pasang Aplikasi )      │  │ 1. Ketuk ikon Bagikan ⬆    │
│ Ikon Polaria akan muncul di │  │ 2. Pilih "Tambahkan ke     │
│ layar utama.               │  │    Layar Utama"            │
└────────────────────────────┘  │ 3. Ketuk "Tambah"          │
                                └────────────────────────────┘
```

---

## 4. Sistem Visual

### 4.1 Warna (token CSS)

Diambil dari mockup, dilunakkan agar tidak terlalu terang (DS03).

| Token | Terang | Gelap | Kegunaan |
|---|---|---|---|
| `--bg` | `#F6F4FE` | `#15131F` | Latar halaman (lavender sangat muda) |
| `--surface` | `#FFFFFF` | `#1F1C2E` | Kartu |
| `--surface-lembut` | `#EFEBFE` | `#2A2640` | Kartu sorotan, kartu hasil |
| `--garis` | `#E6E2F5` | `#353049` | Tepi kartu, pembatas |
| `--teks` | `#1E1B39` | `#ECEAF7` | Teks utama |
| `--teks-redup` | `#6B6785` | `#A9A5C0` | Subjudul |
| `--primer` | `#6C5CE7` | `#A99BFF` | Tombol utama, tab aktif, progres |
| `--primer-tekan` | `#5A4BD1` | `#BDB2FF` | Tombol ditekan |
| `--genap` | `#7C5CF5` | `#B6A4FF` | Bilangan/pola genap |
| `--genap-lembut` | `#EFEAFF` | `#2F2850` | Latar genap |
| `--ganjil` | `#3B82F6` | `#8DB8FF` | Bilangan/pola ganjil |
| `--ganjil-lembut` | `#E7F0FF` | `#1F2D4A` | Latar ganjil |
| `--ikon-biru` / `-bg` | `#3B82F6` / `#E7F0FF` | `#8DB8FF` / `#1F2D4A` | Ikon Materi, Kalkulator |
| `--ikon-hijau` / `-bg` | `#22A65A` / `#E3F7EB` | `#7FD9A3` / `#1D3A2A` | Ikon Generator |
| `--ikon-jingga` / `-bg` | `#F08C1A` / `#FFF0DC` | `#FFBE73` / `#45311B` | Ikon Latihan |
| `--ikon-ungu` / `-bg` | `#7C5CF5` / `#EFEAFF` | `#B6A4FF` / `#2F2850` | Ikon Evaluasi |
| `--ikon-kuning` / `-bg` | `#E5A400` / `#FFF6D6` | `#FFD566` / `#40361A` | Ikon Hasil Belajar, "Ingat!" |
| `--benar` / `-bg` | `#16A34A` / `#E3F7EB` | `#6EDB9A` / `#1D3A2A` | Umpan balik benar |
| `--salah` / `-bg` | `#DC2626` / `#FDE8E8` | `#F28B8B` / `#45201F` | Umpan balik salah |

Mode gelap mengikuti `prefers-color-scheme` dengan sakelar manual di Pengaturan. Makna tidak disampaikan lewat warna saja: selalu ada label "Genap/Ganjil" atau ikon ✔/✖.

### 4.2 Tipografi
- Font: **Plus Jakarta Sans** (Google Fonts, bobot 400/600/700/800), cadangan `system-ui, sans-serif`.
- Ukuran: dasar 17 px (opsi "Huruf besar" 19 px); judul layar 20 px/700; judul Beranda 28 px/800; angka hasil kalkulator 40 px/800; chip angka 20 px/700.
- Rumus ditulis dengan karakter biasa (2n − 1, n², Uₙ) tanpa library matematika.

### 4.3 Bentuk & bayangan
- Radius: kartu 20 px, item menu 18 px, kotak ikon 14 px, tombol utama pil (999 px), chip 12 px.
- Bayangan halus: `0 4px 16px rgb(108 92 231 / 0.08)`.
- Jarak: gutter samping 16–20 px, jarak antar-kartu 12 px, padding kartu 16–20 px.

### 4.4 Komponen

| Komponen | Keterangan |
|---|---|
| Kepala layar | Tombol kembali `‹` dalam lingkaran lavender, judul di tengah |
| Item menu | Kotak ikon 48 px berwarna + judul 600 + subjudul redup + chevron dalam lingkaran |
| Kartu sorotan | Latar `--surface-lembut`, ikon kiri, chevron kanan ("Ayo mulai belajar!") |
| Tombol utama | Pil ungu penuh, tinggi 52 px, ikon kiri opsional |
| Tombol pilihan (Genap/Ganjil) | Kartu dua kolom; terpilih = garis `--primer` + centang di pojok |
| Stepper | Tombol − / + bulat di kiri-kanan angka |
| Chip angka | Kotak lavender berisi angka tebal (warna genap/ganjil) |
| Kartu hasil | Label pil "Hasil Perhitungan", kotak besar berisi jenis + angka |
| Badge status | Pil hijau "✔ Perhitungan berhasil" |
| Kotak "Ingat!" / "Keterangan" | Latar lavender, ikon lampu/ⓘ, teks kecil |
| Bilah progres | Tinggi 8 px, membulat, isi `--primer`, label "1/10" di kanan |
| Pilihan ganda | Baris A–D dengan huruf dalam lingkaran dan radio di kanan; terpilih = garis ungu |
| Navigasi bawah | 4 ikon + label; aktif berwarna `--primer` |
| Tabel pola | Dua kolom berdampingan (genap/ganjil) |
| Garis bilangan | 1–20, titik genap ungu & ganjil biru, bisa diketuk |
| Visual titik Sn | Susunan titik n × n (ganjil) dan n × (n + 1) (genap) dengan SVG |
| Lembar bawah | Kartu rumus, umpan balik, panduan pasang |

Ikon digambar sebagai **SVG inline** (tanpa library ikon) agar ringan dan bisa offline. Emoji di wireframe hanya penanda.

### 4.5 Gerak
Hanya transisi singkat (≤ 150 ms) saat berpindah layar dan membuka lembar bawah. Dimatikan jika `prefers-reduced-motion: reduce`. Tanpa animasi dekoratif (DS03).

---

## 5. PWA (Aplikasi yang Bisa Dipasang)

| Unsur | Rancangan |
|---|---|
| Nama | `name`: "Polaria — Pola Bilangan Ganjil Genap", `short_name`: "Polaria" |
| Ikon | Kotak ungu `#6C5CE7` bersudut bulat dengan angka "1 2 3" putih; ukuran 192, 512, dan versi *maskable* 512; `apple-touch-icon` 180 |
| Warna | `theme_color` `#6C5CE7`, `background_color` `#F6F4FE` |
| Tampilan | `display: standalone`, `orientation: portrait`, `start_url: "/#/beranda"` |
| Layar pembuka | Otomatis dari ikon + warna latar |
| Tombol pasang | Di Beranda (bawah Menu Utama) dan di Pengaturan; disembunyikan jika sudah berjalan sebagai aplikasi (`display-mode: standalone`) |
| Offline | App shell, materi, ikon, dan font di-*cache*; soal latihan disimpan per sesi |

---

## 6. Pedoman Konten

- Maksimal **3 kalimat** per layar; satu kalimat ≤ 15 kata.
- Bahasa sehari-hari siswa SMP; sapaan "kamu".
- Hindari istilah Inggris di antarmuka ("Buat Pola", bukan "Generate Pola").
- Istilah baru (suku, n, Un, Sn) dijelaskan saat pertama muncul dan tersedia di kartu rumus.
- Rumus selalu disertai maknanya, bukan hanya simbol.
- Contoh memakai angka kecil terlebih dahulu.
- Umpan balik salah tidak menghakimi: "Belum tepat, coba lihat petunjuk ini."

---

## 7. Spesifikasi Bank Soal

Soal latihan dibuat oleh **generator di API Python** (`/api/soal`) agar latihan tidak terbatas (DS01). Kunci dihitung dari rumus saat diperiksa (`/api/periksa`). Soal evaluasi (pre/post-test) memakai **set tetap** yang disimpan di frontend.

### 7.1 Tipe Soal

| Kode tipe | Tipe soal | Contoh | Bentuk jawaban |
|---|---|---|---|
| `jenis_bilangan` | Tentukan jenis bilangan | "Bilangan berikut yang termasuk bilangan genap adalah …" | Pilihan ganda |
| `jenis_pola` | Tentukan jenis pola | "Pola 11, 13, 15, 17 adalah pola bilangan …" | Pilihan ganda |
| `lanjut_pola` | Lanjutkan pola | "2, 4, 6, 8, … suku berikutnya?" | Isian angka |
| `pilih_rumus` | Pilih rumus Un | "Rumus suku ke-n dari 1, 3, 5, … adalah …" | Pilihan ganda |
| `cari_un` | Cari suku ke-n | "Suku ke-25 dari pola ganjil?" | Isian angka |
| `cari_n` | Cari n dari Un | "Bilangan genap 84 adalah suku ke berapa?" | Isian angka |
| `cari_sn` | Cari jumlah n suku pertama | "Jumlah 10 bilangan ganjil pertama?" | Isian angka |
| `soal_cerita` | Soal kontekstual (literasi) | "Rumah di sisi kanan jalan bernomor genap 2, 4, 6, … Berapa nomor rumah ke-15?" | Isian angka |

Pengecoh pilihan ganda dibuat dari kesalahan umum: rumus tertukar (2n ↔ 2n − 1), salah hitung ±1, Sn genap ↔ ganjil.

### 7.2 Parameter Generator per Level

| Level | Rentang n | Tipe soal | Bentuk |
|---|---|---|---|
| Mudah | 1–10 | `jenis_bilangan`, `jenis_pola`, `lanjut_pola`, `pilih_rumus`, `cari_un` | Satu jenis pola per sesi; soal awal sama bentuknya dengan contoh |
| Sedang | 1–50 | + `cari_n`, `cari_sn` (n ≤ 10), `soal_cerita` | Ganjil dan genap diacak dalam satu sesi |
| Menantang | 1–100 | Semua tipe, `cari_sn` hingga n = 50, `soal_cerita` dua langkah | Pola bisa dimulai dari tengah (15, 17, 19, …) |

Satu sesi = 10 soal: 3 soal mirip contoh → 4 soal variasi → 3 soal campuran/cerita.

### 7.3 Format Umpan Balik

| Kondisi | Isi |
|---|---|
| Benar | "✔ Benar!" + satu baris langkah (mis. "U30 = 2 × 30 = 60") + "Cek jawabanmu" |
| Salah, petunjuk 1 | Mengenali pola: "Pola ini genap atau ganjil? Lihat angka satuannya." |
| Salah, petunjuk 2 | Memilih rumus: "Untuk pola genap, rumusnya Un = 2n." |
| Salah, petunjuk 3 | Langkah hitung: "Ganti n dengan 30: 2 × 30 = …" |
| Pembahasan | Seluruh langkah seperti contoh soal |

Jumlah petunjuk dicatat di kolom `jumlah_petunjuk` (lihat [PRD.md §9](PRD.md#9-model-data-supabase)).

### 7.4 Rumus Acuan

| Pola | Barisan | Suku ke-n (Un) | Jumlah n suku pertama (Sn) | Posisi bilangan b |
|---|---|---|---|---|
| Genap | 2, 4, 6, 8, … | Un = 2n | Sn = n(n + 1) | n = b ÷ 2 |
| Ganjil | 1, 3, 5, 7, … | Un = 2n − 1 | Sn = n² | n = (b + 1) ÷ 2 |

Cek cepat: n = 5 → genap U5 = 10, S5 = 30 (2+4+6+8+10); ganjil U5 = 9, S5 = 25 (1+3+5+7+9). Bilangan 17 → ganjil, suku ke-9.
