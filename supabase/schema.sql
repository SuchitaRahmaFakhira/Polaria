-- Polaria: skema database Supabase.
-- Jalankan sekali di Supabase → SQL Editor.
-- Lalu aktifkan Authentication → Sign In / Providers → Anonymous Sign-ins.

create table if not exists public.siswa (
  id uuid primary key references auth.users (id) on delete cascade,
  nama text not null check (char_length(nama) between 2 and 60),
  kelas text not null check (char_length(kelas) between 1 and 20),
  dibuat timestamptz not null default now()
);

create table if not exists public.progres_modul (
  id bigint generated always as identity primary key,
  siswa_id uuid not null references public.siswa (id) on delete cascade,
  modul text not null,
  selesai boolean not null default false,
  skor int not null default 0,
  diperbarui timestamptz not null default now(),
  unique (siswa_id, modul)
);

create table if not exists public.jawaban_latihan (
  id bigint generated always as identity primary key,
  siswa_id uuid not null references public.siswa (id) on delete cascade,
  level text not null check (level in ('mudah', 'sedang', 'menantang')),
  tipe_soal text not null,
  soal jsonb not null,
  jawaban text not null default '',
  benar boolean not null,
  jumlah_petunjuk int not null default 0,
  durasi_detik int not null default 0,
  dijawab timestamptz not null default now()
);

create table if not exists public.hasil_evaluasi (
  id bigint generated always as identity primary key,
  siswa_id uuid not null references public.siswa (id) on delete cascade,
  jenis text not null check (jenis in ('pre', 'post')),
  skor int not null,
  jawaban jsonb not null,
  durasi_detik int not null default 0,
  dikerjakan timestamptz not null default now()
);

create index if not exists jawaban_latihan_siswa_idx on public.jawaban_latihan (siswa_id);
create index if not exists hasil_evaluasi_siswa_idx on public.hasil_evaluasi (siswa_id);

-- Row Level Security: setiap siswa hanya bisa membaca & menulis datanya sendiri.
alter table public.siswa enable row level security;
alter table public.progres_modul enable row level security;
alter table public.jawaban_latihan enable row level security;
alter table public.hasil_evaluasi enable row level security;

drop policy if exists "siswa_baca_sendiri" on public.siswa;
drop policy if exists "siswa_tambah_sendiri" on public.siswa;
drop policy if exists "siswa_ubah_sendiri" on public.siswa;
create policy "siswa_baca_sendiri" on public.siswa for select to authenticated using (auth.uid() = id);
create policy "siswa_tambah_sendiri" on public.siswa for insert to authenticated with check (auth.uid() = id);
create policy "siswa_ubah_sendiri" on public.siswa for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "progres_baca_sendiri" on public.progres_modul;
drop policy if exists "progres_tambah_sendiri" on public.progres_modul;
drop policy if exists "progres_ubah_sendiri" on public.progres_modul;
create policy "progres_baca_sendiri" on public.progres_modul for select to authenticated using (auth.uid() = siswa_id);
create policy "progres_tambah_sendiri" on public.progres_modul for insert to authenticated with check (auth.uid() = siswa_id);
create policy "progres_ubah_sendiri" on public.progres_modul for update to authenticated using (auth.uid() = siswa_id) with check (auth.uid() = siswa_id);

drop policy if exists "jawaban_baca_sendiri" on public.jawaban_latihan;
drop policy if exists "jawaban_tambah_sendiri" on public.jawaban_latihan;
create policy "jawaban_baca_sendiri" on public.jawaban_latihan for select to authenticated using (auth.uid() = siswa_id);
create policy "jawaban_tambah_sendiri" on public.jawaban_latihan for insert to authenticated with check (auth.uid() = siswa_id);

drop policy if exists "evaluasi_baca_sendiri" on public.hasil_evaluasi;
drop policy if exists "evaluasi_tambah_sendiri" on public.hasil_evaluasi;
create policy "evaluasi_baca_sendiri" on public.hasil_evaluasi for select to authenticated using (auth.uid() = siswa_id);
create policy "evaluasi_tambah_sendiri" on public.hasil_evaluasi for insert to authenticated with check (auth.uid() = siswa_id);

-- Tidak ada kebijakan DELETE: data tidak bisa dihapus dari aplikasi.
-- Peneliti membaca semua data lewat Table Editor / SQL Editor (memakai peran admin).
