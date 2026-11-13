"""API Polaria (FastAPI). Di Vercel berjalan sebagai Python serverless function.

Lokal:  LOKAL=1 uvicorn api.index:app --reload  → http://localhost:8000
"""

import os
import sys
from pathlib import Path
from typing import Any, Literal

from fastapi import FastAPI, Query, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _logika import kalkulator, konfigurasi, periksa, pola, soal  # noqa: E402

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
    """URL + kunci publik Supabase untuk browser. Kunci rahasia tidak pernah dikirim."""
    return konfigurasi.konfigurasi_publik(dict(os.environ))


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
