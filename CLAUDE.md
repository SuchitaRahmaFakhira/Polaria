# CLAUDE.md

Panduan untuk asisten AI (Claude Code) saat mengerjakan proyek ini.

## Proyek

**Polaria** — aplikasi web (PWA) pembelajaran **pola bilangan ganjil dan genap** untuk siswa SMP kelas VIII. Tujuannya mengelola *cognitive load* agar literasi matematika siswa meningkat. Dikembangkan dengan model ADDIE sebagai proyek mata kuliah Algoritma dan Pemrograman. Model pembelajarannya **Rigorous Mathematical Thinking (RMT)** dengan tutor AI (Gemini). Bisa dipasang di HP **tanpa Play Store/App Store**.

**Sumber kebenaran** (baca sebelum menulis kode atau konten):
- [PRD.md](PRD.md): fitur F-00 s.d. F-18, endpoint API, model data, kebutuhan non-fungsional
- [DESAIN.md](DESAIN.md): prinsip CLT, navigasi, wireframe, token warna, komponen, PWA, bank soal
- [docs/referensi-tampilan.jpg](docs/referensi-tampilan.jpg): mockup acuan tampilan
- [docs/ANALISIS-KEBUTUHAN.md](docs/ANALISIS-KEBUTUHAN.md): dasar setiap keputusan desain

Jika permintaan bertentangan dengan dokumen di atas, tanyakan dulu kepada pengguna, lalu perbarui dokumennya.

## Stack

| Bagian | Teknologi |
|---|---|
| Frontend & PWA | HTML, CSS, **JavaScript** murni (ES modules), service worker, `manifest.json`. Tanpa framework, tanpa bundler, tanpa `npm install` |
| API | **Python 3.12 + FastAPI** di `api/index.py`, dijalankan sebagai Python serverless function Vercel |
| Data & auth | Supabase (Postgres + anonymous sign-in), diakses langsung dari JS dengan `supabase-js` v2 via CDN, versi dikunci (mis. `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm`) |
| Hosting | Vercel: file statis dari root + `/api/*` ke Python |
| Font | Plus Jakarta Sans (Google Fonts), cadangan `system-ui` |
| Tutor AI | Google Gemini API (REST `generateContent` lewat `urllib`, tanpa SDK), model dari `GEMINI_MODEL` (bawaan `gemini-3.5-flash-lite`) |

Pembagian tugas: **Python** = semua logika matematika (kalkulator, pola, generator soal, pemeriksa & pembahasan). **JavaScript** = tampilan, navigasi, PWA/offline, Supabase. Jangan menduplikasi logika matematika di JS, kecuali konten materi statis dan kunci set soal evaluasi.

## Struktur Folder

```
index.html                  satu halaman; layar diganti oleh router
manifest.json               PWA
sw.js                       service worker (cache app shell, materi, ikon, font)
vercel.json                 rewrite /api/(.*) → /api/index
requirements.txt            fastapi, pydantic (versi dikunci; dipakai Vercel)
pytest.ini                  pythonpath = api
.vercelignore               file yang tidak ikut deploy (tests, docs, .venv)
css/style.css               token warna (terang/gelap), komponen
.env / .env.example         SUPABASE_URL + SUPABASE_ANON_KEY + GEMINI_API_KEY + GEMINI_MODEL (.env tidak di-commit;
                            di Vercel pakai Environment Variables)
js/config.js                ambil konfigurasi dari /api/config + simpan salinan untuk offline
js/app.js                   router hash (#/beranda, #/materi, #/modul/:id, #/kalkulator,
                            #/generator, #/latihan/:level, #/evaluasi/:jenis, #/nilai,
                            #/pengaturan), navigasi bawah, daftar service worker
js/util.js                  h() pembuat elemen, isi() pengganti replaceChildren, normalisasi()
js/ikon.js                  ikon SVG inline + ilustrasi angka 1-2-3
js/komponen.js              kepala, item menu, lembar bawah, kartu rumus, panduan pasang,
                            garis bilangan, tabel pola, visual titik
js/data.js                  data lokal (profil, progres, latihan, evaluasi, pengaturan)
js/progres.js               aturan buka-kunci modul
js/tema.js                  mode gelap & huruf besar
js/api.js                   pemanggil /api/* + cadangan sesi soal untuk offline
js/supabase.js              auth anonim, simpanSiswa/Progres/Jawaban/Evaluasi, sinkron()
js/cache.js                 antrian offline di localStorage
js/pasang.js                beforeinstallprompt, deteksi iOS & mode standalone
js/tutor.js                 mintaBimbingan(), gelembungTutor(), lembar Tanya Tutor (Latihan)
js/layar/*.js               masuk, beranda, materi, modul, kalkulator, generator, latihan,
                            rmt (Pemecahan Masalah RMT), tanya (Tanya AI), evaluasi, nilai, pengaturan
js/materi/konten.js         konten statis pemanasan, modul1–3
js/evaluasi/soal-tetap.js   set soal pre-test & post-test
api/index.py                aplikasi FastAPI + routing /api/*
api/_logika/kalkulator.py   fungsi murni (folder diawali "_" agar tidak dijadikan
api/_logika/pola.py         fungsi terpisah oleh Vercel)
api/_logika/soal.py
api/_logika/periksa.py
api/_logika/rmt.py          tahap RMT, periksa_tahap, diagnosis, petunjuk_aturan, prompt, penyaring
api/_logika/konfigurasi.py  baca .env, tolak kunci Supabase rahasia
api/_logika/tanya.py        instruksi Tanya AI, susun riwayat, bersihkan_latex
api/_layanan/gemini.py      SATU-SATUNYA tempat I/O jaringan (Gemini); folder "_" juga
tests/test_*.py             pytest untuk api/_logika
supabase/schema.sql         tabel + kebijakan RLS
assets/ikon/                ikon PWA 180/192/512/maskable
docs/                       dokumen analisis & mockup
```

## Aturan Keamanan (wajib)

- Konfigurasi Supabase hanya di `.env` (lokal) / Environment Variables (Vercel), tidak pernah ditulis di kode. Browser mendapatkannya dari `/api/config`.
- **Jangan pernah** memakai `service_role` / *secret key*. `api/_logika/konfigurasi.py` menolaknya (`kunci_publik_aman`); jangan longgarkan pemeriksaan ini.
- Server lokal (`StatisAman` di `api/index.py`) tidak boleh menyajikan file tersembunyi (`.env`, `.venv`) maupun folder `api/`, `tests/`, `supabase/`.
- Setiap tabel **wajib** RLS: `auth.uid() = siswa_id` (tabel `siswa`: `auth.uid() = id`). Tidak ada kebijakan `delete`.
- API Python tidak menyimpan data. Satu-satunya kunci rahasia adalah `GEMINI_API_KEY`: hanya dibaca di `api/_layanan/gemini.py`, **tidak pernah** dikirim ke browser (termasuk `/api/config`, yang hanya memberi `ai_aktif`), tidak pernah ditulis di log atau pesan galat.
- Jangan pernah mengirim nama/kelas siswa ke Gemini.
- Data pribadi hanya `nama` dan `kelas`.
- Tampilkan teks dari pengguna dan dari API dengan `textContent`, jangan `innerHTML`.

## Aturan Matematika (wajib benar)

| Pola | Un | Sn | Posisi bilangan b |
|---|---|---|---|
| Genap (2, 4, 6, …) | 2n | n(n + 1) | n = b / 2 |
| Ganjil (1, 3, 5, …) | 2n − 1 | n² | n = (b + 1) / 2 |

- Kunci jawaban **dihitung di Python** dari rumus, tidak di-*hardcode*. `/api/periksa` selalu menghitung ulang dari tipe + parameter soal dan tidak memercayai data dari klien.
- `/api/soal` ikut mengirim `paket` (kunci, 3 petunjuk, pembahasan, cek) agar latihan tetap bisa diperiksa saat offline. Saat online, pemeriksaan tetap lewat `/api/periksa`.
- Gunakan `isi(el, ...)` dari `js/util.js`, bukan `el.replaceChildren(...)` (yang menulis `null` sebagai teks).
- Bilangan 0 adalah genap, tetapi bukan suku pola (n dimulai dari 1).
- Cek cepat: n = 5 → genap U5 = 10, S5 = 30; ganjil U5 = 9, S5 = 25. Bilangan 17 → ganjil, suku ke-9.
- Di tampilan, minus ditulis "−" (U+2212), pangkat "²", bagi "÷", kali "×".

## Aturan Tutor AI (wajib)

- Benar/salah **selalu** diputuskan `rmt.periksa_tahap` di Python. Gemini hanya merangkai kalimat bimbingan.
- Respons Gemini **wajib** lewat `rmt.saring_respons` (mengganti respons yang memuat jawaban akhir sebelum siswa benar). Jangan longgarkan penyaring ini.
- Teks soal cerita disusun ulang di server (`rmt.teks_soal`); pesan siswa diperlakukan sebagai data, bukan perintah.
- Tutor: maksimal 3 kalimat + 1 pertanyaan, petunjuk bertingkat 1–3, tidak memberi jawaban akhir, Bahasa Indonesia sapaan "kamu".
- Bila Gemini gagal/tidak dikonfigurasi, `/api/rmt/tutor` menjawab dengan `rmt.petunjuk_aturan` (`sumber: "aturan"`, label "Petunjuk"). `/api/tanya` **tidak** punya jawaban cadangan: kembalikan 503/502 dengan pesan jujur, jangan pernah membuat jawaban AI tiruan.
- Semua teks dari Gemini lewat `tanya.bersihkan_latex` sebelum dikirim ke browser; jawaban ditampilkan dengan `teksTerformat` (tanpa `innerHTML`).
- Galat Gemini dicatat dengan `print(...)` (tampil di Vercel Runtime Logs) tanpa kunci.
- Tes tidak boleh memanggil Gemini sungguhan: tiru `urllib.request.urlopen` (lihat `tests/test_gemini.py`).
- Risiko syarat usia Gemini (pengguna < 18 tahun) diterima pengembang; jangan hapus catatannya di PRD/README.

## Aturan Python

- Logika di `api/_logika/` berupa **fungsi murni** (tanpa I/O), mengembalikan `dict`/model Pydantic. I/O jaringan hanya di `api/_layanan/`. `api/index.py` hanya routing, validasi, dan merangkai keduanya.
- Nama fungsi/variabel Bahasa Indonesia, `snake_case` (`buat_soal`, `periksa_jawaban`, `hitung_sn`).
- Validasi masukan dengan Pydantic/`Query`: bilangan 0–1.000.000, jumlah suku 1–20, n 1–1000, level `mudah|sedang|menantang`.
- Pesan error ramah dalam Bahasa Indonesia (mis. "Masukkan bilangan bulat antara 0 dan 1.000.000.").
- Generator soal menerima `seed` opsional agar bisa diuji secara deterministik.
- Setiap fungsi di `api/_logika/` wajib punya tes pytest.
- Saat lokal (`LOKAL=1`), `api/index.py` juga menyajikan file statis dari root dengan `StaticFiles`, sehingga cukup satu server.

## Aturan JavaScript & PWA

- Nama fungsi/variabel Bahasa Indonesia, `camelCase` (`tampilkanHasil`, `simpanProgres`).
- Semua akses `localStorage` dibungkus `try/catch`.
- Semua panggilan Supabase dan API menangani error: Supabase gagal → antrian `js/cache.js`, kirim ulang saat event `online`; API gagal/offline → tampilkan pesan ramah ("Butuh internet untuk menghitung.").
- Setiap perubahan file yang di-*cache* → **naikkan versi cache** di `sw.js` (mis. `polaria-v3`).
- `fetch` ke `/api/*` memakai strategi *network-first*; app shell memakai *cache-first*.

## Aturan Konten & UI

- Ikuti mockup ([docs/referensi-tampilan.jpg](docs/referensi-tampilan.jpg)) dengan penyesuaian di DESAIN.md §1.4.
- Bahasa Indonesia sederhana, sapaan "kamu". Maksimal 3 kalimat per layar. Hindari istilah Inggris ("Buat Pola", bukan "Generate").
- Warna makna konsisten: genap = `--genap` (ungu), ganjil = `--ganjil` (biru), selalu dengan label teks.
- **Tanpa animasi dekoratif**, maskot, atau suara. Transisi ≤ 150 ms; hormati `prefers-reduced-motion`. Ilustrasi hanya statis.
- *Mobile-first* 360 px, target sentuh ≥ 44 px, font dasar 17 px. Ikon SVG inline.
- Setiap modul (lapisan RMT/MLE): Tujuan → Makna → konsep → contoh langkah demi langkah (berlabel fase) → contoh dikosongkan → latihan mirip → "Kenapa?" → Transendensi → ringkasan → Refleksi.

## Cara Menjalankan & Menguji

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt pytest uvicorn
pytest                          # tes logika Python
```
Jalankan server lokal (PowerShell), lalu buka http://localhost:8000:
```powershell
$env:LOKAL="1"; uvicorn api.index:app --reload
```
(Bash: `LOKAL=1 uvicorn api.index:app --reload`.) Alternatif: `vercel dev`.

Daftar uji:
- `pytest` lulus; generator diuji ±100 soal per tipe & level, semua kunci sesuai rumus dan rentang n.
- Tampilan di DevTools 360 px dan desktop, mode terang & gelap; bandingkan dengan mockup.
- Lighthouse / DevTools → Application: manifest valid, service worker aktif, aplikasi *installable*.
- Pasang di HP: Android (Chrome → "Pasang Aplikasi") dan iPhone (Safari → Bagikan → Tambahkan ke Layar Utama) dari URL Vercel (HTTPS).
- Masuk dengan nama + kelas → baris baru di tabel `siswa`.
- RLS: dua akun anonim berbeda tidak bisa membaca data satu sama lain.
- Offline: materi & latihan dari cache tetap jalan; jawaban tersinkron saat online; Kalkulator dan Pemecahan Masalah RMT menampilkan pesan offline.
- Tutor: tanpa `GEMINI_API_KEY` alur RMT 4 tahap tetap selesai (petunjuk bawaan); dengan kunci, respons ≤ 3 kalimat + 1 pertanyaan dan tidak memuat jawaban akhir; `curl /api/config` tidak memuat kunci Gemini.
