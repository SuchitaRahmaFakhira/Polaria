"""API Polaria (FastAPI). Di Vercel berjalan sebagai Python serverless function.

Lokal:  LOKAL=1 uvicorn api.index:app --reload  → http://localhost:8000
"""

import os
import sys
import time
from collections import defaultdict, deque
from pathlib import Path
from typing import Any, Literal

from fastapi import FastAPI, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _layanan import gemini  # noqa: E402
from _logika import kalkulator, konfigurasi, periksa, pola, rmt, soal, tanya  # noqa: E402

AKAR = Path(__file__).resolve().parent.parent


def _muat_env() -> None:
    """Muat .env di akar proyek (untuk lokal). Di Vercel, isi Environment Variables."""
    berkas = AKAR / ".env"
    if berkas.is_file():
        for kunci, nilai in konfigurasi.baca_env(berkas.read_text(encoding="utf-8")).items():
            os.environ.setdefault(kunci, nilai)


_muat_env()

app = FastAPI(title="Polaria API", version="1.0.0", docs_url="/api/docs", openapi_url="/api/openapi.json")


def _galat(pesan: str, status: int = 422) -> JSONResponse:
    return JSONResponse({"galat": pesan}, status_code=status)


@app.exception_handler(RequestValidationError)
async def _validasi_gagal(_: Request, exc: RequestValidationError) -> JSONResponse:
    lokasi = exc.errors()[0].get("loc", ["", "masukan"])[-1] if exc.errors() else "masukan"
    pesan = {
        "bilangan": "Masukkan bilangan bulat antara 0 dan 1.000.000.",
        "jumlah": "Jumlah harus di antara 1 dan 20.",
        "jenis": "Pilih jenis pola: genap atau ganjil.",
        "level": "Level harus mudah, sedang, atau menantang.",
    }.get(str(lokasi), "Masukan belum sesuai. Periksa lagi, ya.")
    return _galat(pesan)


@app.exception_handler(ValueError)
async def _nilai_salah(_: Request, exc: ValueError) -> JSONResponse:
    return _galat(str(exc))


@app.get("/api/kesehatan")
def kesehatan() -> dict:
    return {"status": "ok"}


@app.get("/api/config")
def api_config() -> dict:
    """URL + kunci publik Supabase untuk browser. Kunci rahasia tidak pernah dikirim.

    `ai_aktif` hanya memberi tahu apakah tutor Gemini tersedia; kuncinya tetap di server.
    """
    return {**konfigurasi.konfigurasi_publik(dict(os.environ)), "ai_aktif": gemini.aktif()}


@app.get("/api/kalkulator")
def api_kalkulator(bilangan: int = Query(..., ge=0, le=1_000_000)) -> dict:
    return kalkulator.periksa_bilangan(bilangan)


@app.get("/api/pola")
def api_pola(
    jenis: Literal["genap", "ganjil"] = Query(...),
    jumlah: int = Query(5, ge=1, le=20),
) -> dict:
    return pola.buat_pola(jenis, jumlah)


@app.get("/api/soal")
def api_soal(
    level: Literal["mudah", "sedang", "menantang"] = Query("mudah"),
    jumlah: int = Query(10, ge=1, le=20),
    seed: int | None = Query(None),
) -> dict:
    daftar = soal.buat_sesi(level, jumlah, seed)
    # Paket (kunci, petunjuk, pembahasan) ikut dikirim agar latihan tetap
    # berjalan saat offline. Saat online, pemeriksaan tetap lewat /api/periksa.
    for s in daftar:
        s["paket"] = periksa.buat_paket(s)
    return {"level": level, "soal": daftar}


class SoalMasuk(BaseModel):
    tipe: str
    parameter: dict[str, Any]


class PermintaanPeriksa(BaseModel):
    soal: SoalMasuk
    jawaban: str = Field("", max_length=50)
    petunjuk_ke: int = Field(0, ge=0, le=3)


@app.post("/api/periksa")
def api_periksa(data: PermintaanPeriksa) -> dict:
    return periksa.periksa_jawaban(data.soal.model_dump(), data.jawaban, data.petunjuk_ke)


# ---------- Pemecahan Masalah RMT + tutor ----------

@app.get("/api/rmt/masalah")
def api_rmt_masalah(
    level: Literal["mudah", "sedang", "menantang"] = Query("mudah"),
    seed: int | None = Query(None),
) -> dict:
    return rmt.buat_masalah(level, seed)


class GiliranRiwayat(BaseModel):
    peran: Literal["siswa", "tutor"]
    teks: str = Field("", max_length=600)


class PermintaanTutor(BaseModel):
    masalah: SoalMasuk
    teks_soal: str = Field("", max_length=600)
    tahap: Literal["input", "elaborasi", "output", "refleksi"]
    isian: dict[str, str] = Field(default_factory=dict)
    pesan: str = Field("", max_length=400)
    riwayat: list[GiliranRiwayat] = Field(default_factory=list, max_length=12)
    tingkat: int = Field(0, ge=0, le=3)
    sudah_selesai: bool = False


class GiliranTanya(BaseModel):
    peran: Literal["siswa", "tutor"]
    teks: str = Field("", max_length=4000)


class PermintaanTanya(BaseModel):
    pertanyaan: str = Field(..., min_length=2, max_length=tanya.BATAS_PERTANYAAN)
    riwayat: list[GiliranTanya] = Field(default_factory=list, max_length=20)


# Batas laju sederhana per alamat IP (per instance serverless; upaya terbaik).
_JEJAK_IP: dict[str, deque] = defaultdict(deque)
BATAS_PER_MENIT = 30


def _boleh(request: Request) -> bool:
    ip = (request.headers.get("x-forwarded-for", "").split(",")[0].strip()
          or (request.client.host if request.client else "?"))
    sekarang = time.monotonic()
    jejak = _JEJAK_IP[ip]
    while jejak and sekarang - jejak[0] > 60:
        jejak.popleft()
    if len(jejak) >= BATAS_PER_MENIT:
        return False
    jejak.append(sekarang)
    return True


@app.post("/api/tanya")
def api_tanya(data: PermintaanTanya, request: Request) -> JSONResponse:
    """Tanya AI: jawaban asli dari Gemini. Tidak ada jawaban cadangan palsu."""
    if not _boleh(request):
        return _galat("Terlalu banyak pertanyaan. Tunggu sebentar, lalu coba lagi.", 429)
    if not gemini.aktif():
        return _galat("Tanya AI belum aktif: GEMINI_API_KEY belum diatur di server.", 503)
    try:
        jawaban = gemini.minta_teks(
            tanya.INSTRUKSI_TANYA,
            tanya.susun_isi_tanya(data.pertanyaan, [g.model_dump() for g in data.riwayat]),
        )
    except gemini.GalatAI as e:
        print(f"[tanya] Gemini gagal: {e}")  # muncul di Vercel Runtime Logs, tanpa kunci
        return _galat("Tutor AI sedang tidak dapat dihubungi. Coba lagi sebentar lagi.", 502)
    return JSONResponse({"jawaban": tanya.bersihkan_latex(jawaban), "sumber": "gemini", "model": gemini._model()})


@app.post("/api/rmt/tutor")
def api_rmt_tutor(data: PermintaanTutor, request: Request) -> JSONResponse:
    if not _boleh(request):
        return _galat("Terlalu banyak permintaan. Tunggu sebentar, lalu coba lagi.", 429)

    masalah = data.masalah.model_dump()
    masalah["teks"] = rmt.teks_soal(masalah, data.teks_soal)
    for nilai in data.isian.values():
        if len(nilai) > 300:
            return _galat("Isian terlalu panjang.")

    hasil = rmt.periksa_tahap(masalah, data.tahap, data.isian)
    sudah_selesai = data.sudah_selesai or (data.tahap == "output" and hasil["benar"])
    # Salah → minimal petunjuk tingkat 1; siswa bisa meminta hingga tingkat 3.
    tingkat = 0 if hasil["benar"] else max(1, data.tingkat)
    acuan = rmt.petunjuk_aturan(masalah, data.tahap, hasil["kesulitan"], tingkat or 1)

    cadangan = rmt.tanggapi_pesan(acuan, data.pesan, hasil["benar"])
    respons, sumber = cadangan, "aturan"
    if gemini.aktif():
        try:
            isi = rmt.susun_isi(
                masalah, data.tahap, data.isian, data.pesan, hasil, tingkat,
                [g.model_dump() for g in data.riwayat], acuan, sudah_selesai,
            )
            mentah = gemini.minta_tutor(rmt.INSTRUKSI_SISTEM, isi, rmt.SKEMA_RESPONS)
            respons, disaring = rmt.saring_respons(mentah, masalah, sudah_selesai, cadangan)
            sumber = "aturan" if disaring else "gemini"
        except gemini.GalatAI as e:
            print(f"[rmt/tutor] Gemini gagal, memakai petunjuk bawaan: {e}")
            respons, sumber = cadangan, "aturan"

    return JSONResponse({
        "tahap": data.tahap,
        "benar": hasil["benar"],
        "lanjut": hasil["lanjut"],
        "kesulitan": hasil["kesulitan"],
        "tingkat_petunjuk": tingkat,
        "tujuan": rmt.INFO_TAHAP[data.tahap]["tujuan"],
        "pesan": tanya.bersihkan_latex(respons["pesan"]),
        "pertanyaan": tanya.bersihkan_latex(respons["pertanyaan"]),
        "sumber": sumber,
    })


# Saat lokal, sajikan juga file statis agar cukup satu server.
if os.environ.get("LOKAL") == "1":
    from fastapi.staticfiles import StaticFiles

    class StatisAman(StaticFiles):
        """Jangan sajikan .env, .venv, kode Python, atau tes."""

        TERLARANG = ("api", "tests", "supabase")

        def lookup_path(self, path: str):
            bagian = Path(path).parts
            if any(b.startswith(".") for b in bagian) or (bagian and bagian[0] in self.TERLARANG):
                return "", None
            return super().lookup_path(path)

    app.mount("/", StatisAman(directory=AKAR, html=True), name="statis")
