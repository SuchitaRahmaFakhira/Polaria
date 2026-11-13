# PRD — Polaria: Aplikasi Belajar Pola Bilangan Ganjil & Genap

**Versi:** 0.2 (draf perencanaan) · **Tanggal:** 13 November 2026 · **Penyusun:** Suchita Rahma Fakhira

Dokumen terkait: [docs/ANALISIS-KEBUTUHAN.md](docs/ANALISIS-KEBUTUHAN.md) · [DESAIN.md](DESAIN.md) · [CLAUDE.md](CLAUDE.md) · [README.md](README.md)

**Perubahan v0.2:** aplikasi menjadi **PWA** yang bisa dipasang di HP tanpa Play Store/App Store; logika matematika dipindah ke **API Python (FastAPI)**; menu dan tampilan mengikuti mockup ([docs/referensi-tampilan.jpg](docs/referensi-tampilan.jpg)); fitur baru F-13 s.d. F-18.

---

## 1. Latar Belakang

Wawancara *cognitive load* dengan siswa kelas VIII (S01) menunjukkan bahwa kesulitan terbesar pada materi pola bilangan ganjil dan genap adalah:

> "Kesulitan terbesar saya adalah membedakan pola dan menentukan rumus yang digunakan." (Penutup 1)

Siswa menghafal rumus Un = 2n dan Un = 2n − 1 tetapi sering tertukar (IL01), bingung saat mencari jumlah suku Sn (IL05), dan kesulitan menghitung jika bilangannya besar (IL04, EL05). Dari sisi penyajian, penjelasan guru terasa terlalu cepat (EL01) dan penjelasan panjang membosankan (EL03). Yang paling membantu siswa adalah **contoh soal dan penjelasan yang jelas** (Penutup 2, GL01).

Polaria adalah aplikasi web yang menyajikan materi secara bertahap, ringkas, visual, dan dengan kecepatan yang diatur siswa sendiri, untuk menekan beban kognitif yang tidak perlu dan memperkuat pemahaman. Tujuan akhirnya adalah meningkatkan literasi matematika siswa.

## 2. Teknologi (ringkas)

| Bagian | Teknologi | Peran |
|---|---|---|
| Tampilan | HTML, CSS, **JavaScript** | Antarmuka, navigasi, PWA (service worker, manifest), akses Supabase |
| Logika matematika | **Python 3.12 + FastAPI** | API: kalkulator, generator pola, generator soal, pemeriksa jawaban & pembahasan |
| Data & login | Supabase | Auth anonim, penyimpanan progres, jawaban, evaluasi |
| Hosting | Vercel | File statis + Python serverless function (`/api/*`), HTTPS otomatis |
| Pemasangan di HP | PWA | "Tambahkan ke layar utama" dari Chrome (Android) atau Safari (iPhone), tanpa toko aplikasi |

## 3. Tujuan

| Tujuan | Indikator keberhasilan |
|---|---|
| Siswa dapat membedakan pola ganjil dan genap | ≥ 80% benar pada soal "tentukan jenis pola" di level sedang |
| Siswa dapat memilih dan memakai rumus Un yang tepat | ≥ 75% benar pada soal "cari Un ke-n" |
| Siswa dapat menghitung jumlah suku Sn | ≥ 70% benar pada soal Sn |
| Siswa dapat menerapkan pola pada soal cerita (literasi) | ≥ 60% benar pada soal kontekstual |
| Hasil belajar meningkat | Skor post-test > pre-test (F-15) |
| Beban kognitif penyajian rendah | Skor *extraneous load* pada kuesioner CL rendah |
| Sesi belajar tidak melelahkan | Satu modul selesai ≤ 15 menit |

> Angka target masih usulan dan perlu disesuaikan dengan KKM sekolah atau saran dosen.

## 4. Pengguna Sasaran

**Persona: "Siswa kelas VIII" (berdasarkan S01)**
- Sudah pernah belajar materi di kelas, masih ingat rumus sebagai hafalan.
- Bisa mengenali bilangan ganjil/genap dari angka satuan, tetapi ragu memilih rumus.
- Belajar paling baik dari contoh soal lalu mencoba soal yang mirip.
- Mudah bosan dengan teks panjang; suka tabel/warna tetapi tidak suka tampilan ramai.
- Memakai smartphone dengan layar kecil dan koneksi yang kadang tidak stabil.
- Tidak selalu punya email; tidak semua HP punya ruang untuk aplikasi besar.

## 5. Pemetaan ADDIE

| Tahap | Kegiatan | Keluaran |
|---|---|---|
| **A**nalysis | Wawancara CL siswa S01 | [docs/ANALISIS-KEBUTUHAN.md](docs/ANALISIS-KEBUTUHAN.md) |
| **D**esign | Penyusunan kebutuhan, desain instruksional, dan UI | PRD.md, DESAIN.md, CLAUDE.md |
| **D**evelopment | Pembuatan PWA (JS) + API (Python) + Supabase, validasi ahli materi & media | Polaria di Vercel |
| **I**mplementation | Uji coba ke siswa SMP kelas VIII; siswa memasang aplikasi di HP | Data penggunaan di Supabase |
| **E**valuation | Pre-test/post-test (F-15), kuesioner *cognitive load*, wawancara ulang | Laporan evaluasi & revisi |

## 6. Kebutuhan Fungsional

Kolom "Dasar" merujuk ke kode wawancara di [docs/ANALISIS-KEBUTUHAN.md](docs/ANALISIS-KEBUTUHAN.md). Kolom "API" menandai fitur yang memakai API Python.

### 6.1 Akses & navigasi

| Kode | Fitur | Deskripsi | Dasar | API |
|---|---|---|---|---|
| F-00 | Layar masuk | Siswa mengisi **nama** dan memilih **kelas** (mis. "8A"). Tanpa email/kata sandi. Sesi tersimpan di browser. | Persona, data tahap E | — |
| F-01 | Beranda & navigasi | Judul, kartu "Ayo mulai belajar!" (melanjutkan modul terakhir), **Menu Utama** 6 item: Materi, Kalkulator Ganjil Genap, Generator Pola Bilangan, Latihan Soal, Evaluasi, Hasil Belajar. **Navigasi bawah**: Beranda, Materi, Nilai, Pengaturan. | DS02, EL04 | — |
| F-17 | Pengaturan | Ubah nama/kelas, mode gelap, ukuran huruf (normal/besar), panduan pasang aplikasi, tentang aplikasi. | Aksesibilitas | — |
| F-18 | Pasang aplikasi (PWA) | Android/Chrome: tombol **"Pasang Aplikasi"** (memakai `beforeinstallprompt`). iPhone/Safari: panduan bergambar *Bagikan → Tambahkan ke Layar Utama*. Tombol disembunyikan jika sudah terpasang. | Persona | — |

### 6.2 Materi (menu "Materi")

| Kode | Fitur | Deskripsi | Dasar | API |
|---|---|---|---|---|
| F-02 | Pemanasan prasyarat | 5 soal singkat: perkalian, kelipatan 2, angka satuan. Jika banyak salah, tampilkan ringkasan prasyarat. | IL03 | — |
| F-03 | Modul 1 — Mengenal ganjil & genap | Ciri bilangan genap/ganjil lewat angka satuan dan sisa bagi 2; garis bilangan 1–20 berwarna. | K03, EL02 | — |
| F-04 | Modul 2 — Pola & rumus Un | Tabel n–Un genap dan ganjil berdampingan. Makna: genap = 2 × n; ganjil = genap dikurangi 1 → 2n − 1. Pertanyaan "Kenapa?". | IL01, K01, GL04 | — |
| F-05 | Modul 3 — Jumlah suku Sn | Sn ganjil = n² (susunan titik persegi); Sn genap = n(n + 1) (persegi panjang). Setelah Un dikuasai. | IL05, EL02 | — |
| F-06 | Contoh langkah demi langkah | Langkah tampil satu per satu dengan tombol "Lanjut"; bisa kembali. Perhitungan dipecah (2 × 25 = 50, lalu 50 − 1 = 49). | EL01, GL01, IL04 | — |
| F-09 | Kartu rumus | Ringkasan Un dan Sn (ganjil & genap) yang bisa dibuka dari layar mana pun. | IL01 | — |

Konten materi bersifat statis (file JS) agar bisa dibaca saat offline.

### 6.3 Alat bantu

| Kode | Fitur | Deskripsi | Dasar | API |
|---|---|---|---|---|
| F-13 | **Kalkulator Ganjil Genap** | Siswa memasukkan bilangan (0–1.000.000) → hasil "BILANGAN GANJIL/GENAP", cara perhitungan dengan sisa bagi (17 ÷ 2 = 8 sisa 1), penjelasan, dan **posisinya dalam pola** (17 adalah suku ke-9 pola ganjil, karena n = (17 + 1) ÷ 2 = 9). Kotak "Ingat!". | K03, IL01 | ✔ `/api/kalkulator` |
| F-14 | **Generator Pola Bilangan** | Pilih Genap/Ganjil + jumlah suku (1–20 dengan tombol − / +) → barisan sebagai chip angka, keterangan suku pertama, beda, rumus Un, **dan jumlah Sn** beserta langkah hitungnya. | IL01, IL05, EL02 | ✔ `/api/pola` |

### 6.4 Latihan, evaluasi, dan nilai

| Kode | Fitur | Deskripsi | Dasar | API |
|---|---|---|---|---|
| F-07 | Latihan Soal | 3 level (mudah/sedang/menantang), 10 soal per sesi, bilah progres "1/10", pilihan ganda A–D dan isian angka, tombol "Selanjutnya →". Soal dibuat acak oleh API. Diawali soal mirip contoh, lalu bervariasi. | DS01, GL03, GL05, IL04 | ✔ `/api/soal` |
| F-08 | Umpan balik & petunjuk | Benar/salah langsung. Jika salah: petunjuk bertahap (pola apa? → rumus mana? → langkah hitung) lalu pembahasan lengkap. | GL03, EL01 | ✔ `/api/periksa` |
| F-10 | Cek jawabanmu | Verifikasi dengan substitusi n kecil (n = 1: 2(1) − 1 = 1 ✔). | GL02 | ✔ `/api/periksa` |
| F-11 | Soal cerita (literasi) | Konteks nyata: nomor rumah, kursi bioskop, susunan ubin, tabungan. Termasuk dalam tipe soal latihan. | Tujuan literasi | ✔ |
| F-15 | **Evaluasi** | Pre-test dan post-test pilihan ganda dengan **set soal tetap** (sama untuk semua siswa) agar hasil bisa dibandingkan. Tanpa petunjuk; pembahasan tampil setelah selesai. | ADDIE tahap E | — |
| F-16 | **Hasil Belajar / Nilai** | Riwayat skor latihan per level dan skor pre/post-test, serta ringkasan per tipe soal (mis. "Mencari Un: 4/5"). | EL04, GL02 | — |
| F-12 | Penyimpanan data | Progres, jawaban latihan, dan hasil evaluasi disimpan ke Supabase; antrian offline di localStorage. | Data tahap E | — |

### 6.5 Alur utama
Masuk → Beranda → Materi (Pemanasan → Modul 1 → Modul 2 → Modul 3) → Latihan (3 level) → Hasil Belajar.
Evaluasi: pre-test sebelum Materi pertama kali, post-test setelah semua modul selesai.
Setiap modul: **konsep singkat → contoh langkah demi langkah → latihan mirip → latihan variasi** (DS02).

## 7. API Python

Semua endpoint di bawah `/api`, dijalankan oleh FastAPI di `api/index.py`. API **stateless**: setiap soal membawa parameternya sendiri, sehingga kunci jawaban dihitung ulang saat diperiksa.

| Metode & path | Masukan | Keluaran |
|---|---|---|
| `GET /api/kalkulator?bilangan=17` | bilangan 0–1.000.000 | `jenis`, `hasil_bagi`, `sisa`, `langkah[]`, `posisi_suku` (n, atau `null` untuk 0) |
| `GET /api/pola?jenis=genap&jumlah=5` | jenis `genap`/`ganjil`, jumlah 1–20 | `barisan[]`, `suku_pertama`, `beda`, `rumus_un`, `jumlah_sn`, `langkah_sn[]` |
| `GET /api/soal?level=mudah&jumlah=10` | level, jumlah 1–20, `seed` opsional | `soal[]`: `id`, `tipe`, `bentuk`, `teks`, `pilihan[]` (jika pilihan ganda), `parameter` (jenis, n, dll.), `paket` (kunci, petunjuk, pembahasan — untuk mode offline) |
| `POST /api/periksa` | `soal` (tipe + parameter), `jawaban`, `petunjuk_ke` | `benar`, `kunci`, `petunjuk`, `pembahasan[]`, `cek_substitusi` |
| `GET /api/kesehatan` | — | `{"status": "ok"}` (untuk uji dan memanaskan fungsi) |
| `GET /api/config` | — | `supabase_url`, `supabase_anon_key` dari `.env`/Environment Variables; kosong jika belum diatur atau jika kuncinya rahasia |

Validasi masukan dengan Pydantic; error dikembalikan dengan pesan berbahasa Indonesia yang ramah.

## 8. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|---|---|
| Pemasangan | **PWA**: `manifest.json` (nama, ikon 192 & 512 px, ikon *maskable*, `display: standalone`, warna tema ungu), service worker, HTTPS (Vercel). Lolos kriteria *installable* Chrome. Tidak perlu Play Store/App Store |
| Perangkat | *Mobile-first*, nyaman dari lebar 360 px; juga berjalan di browser desktop; Android (Chrome) & iPhone (Safari 16.4+) |
| Kinerja | Halaman awal termuat < 3 detik di 4G; respons API < 1 detik (setelah *warm*) |
| Koneksi | Materi, kartu rumus, dan latihan dari soal yang sudah di-*cache* tetap bisa dipakai offline. Kalkulator & Generator Pola menampilkan pesan "Butuh internet" saat offline |
| Aksesibilitas | Kontras WCAG AA, font dasar 17–18 px, target sentuh ≥ 44 px, `prefers-reduced-motion`, makna tidak hanya lewat warna |
| Keamanan | RLS di setiap tabel Supabase; `service_role` key tidak pernah ada di frontend maupun API; API Python tidak menyimpan data |
| Privasi | Data pribadi minimal: hanya nama dan kelas |
| Bahasa | Bahasa Indonesia yang sederhana dan akrab bagi siswa SMP |

## 9. Model Data (Supabase)

| Tabel | Kolom | Keterangan |
|---|---|---|
| `siswa` | `id` uuid (PK, = `auth.uid()`), `nama` text, `kelas` text, `dibuat` timestamptz | Dibuat saat siswa pertama kali masuk |
| `progres_modul` | `id` bigint (PK), `siswa_id` uuid (FK), `modul` text, `selesai` boolean, `skor` int, `diperbarui` timestamptz | Unik per (`siswa_id`, `modul`) |
| `jawaban_latihan` | `id` bigint (PK), `siswa_id` uuid (FK), `level` text, `tipe_soal` text, `soal` jsonb, `jawaban` text, `benar` boolean, `jumlah_petunjuk` int, `durasi_detik` int, `dijawab` timestamptz | Satu baris per jawaban |
| `hasil_evaluasi` | `id` bigint (PK), `siswa_id` uuid (FK), `jenis` text (`pre`/`post`), `skor` int, `jawaban` jsonb, `durasi_detik` int, `dikerjakan` timestamptz | Bahan perbandingan pre/post-test |

**Kebijakan RLS** (semua tabel): `select`, `insert`, `update` hanya jika `auth.uid() = siswa_id` (tabel `siswa`: `auth.uid() = id`). Tidak ada `delete` dari aplikasi.

**Autentikasi:** *Anonymous sign-in* Supabase. Nama dan kelas disimpan di tabel `siswa`, bukan sebagai kredensial.

**Keterbatasan:** jika siswa berganti perangkat atau menghapus data browser, akun anonim baru akan dibuat. Data lama tetap ada dan dapat dicocokkan peneliti melalui nama + kelas.

## 10. Di Luar Cakupan MVP

- Dashboard guru dan kode kelas (peneliti melihat data lewat Table Editor/SQL Supabase)
- Pola bilangan lain (persegi, segitiga, Fibonacci, dll.)
- Rilis di Play Store/App Store, notifikasi push
- Papan peringkat, suara, dan animasi dekoratif
- Login email/Google

## 11. Rencana Evaluasi (Tahap E)

1. **Pre-test & post-test** di dalam aplikasi (F-15): membedakan pola, Un, Sn, dan soal cerita.
2. **Kuesioner *cognitive load*** — adaptasi skala Leppink dkk. (IL/EL/GL) atau skala usaha mental Paas, diisi setelah menggunakan aplikasi.
3. **Data penggunaan** dari `jawaban_latihan`: persentase benar per tipe soal, jumlah petunjuk, durasi.
4. **Wawancara ulang** dengan instrumen yang sama.
5. **Validasi ahli** materi dan media sebelum uji coba.

## 12. Risiko

| Risiko | Mitigasi |
|---|---|
| *Cold start* fungsi Python di Vercel (respons pertama lambat) | Panggil `/api/kesehatan` saat aplikasi dibuka; ambil soal satu sesi sekaligus dan simpan di cache |
| iPhone tidak menampilkan tombol pasang otomatis | Panduan manual bergambar di Pengaturan dan saat pertama membuka di Safari |
| Siswa mengisi nama tidak konsisten | Petunjuk "Tulis nama lengkap seperti di absen"; kelas dipilih dari daftar |
| Akun anonim hilang saat ganti perangkat | Dicatat sebagai keterbatasan; data dicocokkan manual |
| Kuota gratis Supabase/Vercel | Skala uji coba kecil; data berukuran kecil |
| Baru satu responden analisis | Tambah responden sebelum finalisasi desain |
