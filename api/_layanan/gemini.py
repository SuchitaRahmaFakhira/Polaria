"""Klien Gemini API (REST generateContent) memakai urllib bawaan Python.

GEMINI_API_KEY hanya dibaca di server dan tidak pernah dikirim ke browser.
"""

import json
import os
import urllib.error
import urllib.request

ALAMAT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
MODEL_BAWAAN = "gemini-3.5-flash-lite"
BATAS_WAKTU = 25  # detik; fungsi Vercel diberi maxDuration 30 di vercel.json


class GalatAI(Exception):
    """Gemini tidak bisa dipakai (kunci kosong, kuota habis, jaringan, format)."""


def aktif() -> bool:
    return bool(os.environ.get("GEMINI_API_KEY", "").strip())


def _model() -> str:
    return os.environ.get("GEMINI_MODEL", "").strip() or MODEL_BAWAAN


def _kirim(badan: dict) -> dict:
    kunci = os.environ.get("GEMINI_API_KEY", "").strip()
    if not kunci:
        raise GalatAI("GEMINI_API_KEY belum diatur.")
    permintaan = urllib.request.Request(
        ALAMAT.format(model=_model()),
        data=json.dumps(badan).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": kunci},
        method="POST",
    )
    try:
        with urllib.request.urlopen(permintaan, timeout=BATAS_WAKTU) as res:
            return json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        # Jangan bocorkan isi galat (bisa memuat detail akun) ke klien.
        raise GalatAI(f"Gemini membalas HTTP {e.code}.") from e
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
        raise GalatAI("Gemini tidak dapat dihubungi.") from e


def _ambil_teks(data: dict) -> str:
    """Gabungkan bagian jawaban, lewati bagian 'thought' milik model thinking."""
    try:
        bagian = data["candidates"][0]["content"]["parts"]
    except (KeyError, IndexError, TypeError) as e:
        raise GalatAI("Respons Gemini kosong atau diblokir.") from e
    teks = "".join(p.get("text", "") for p in bagian if not p.get("thought"))
    if not teks.strip():
        raise GalatAI("Respons Gemini kosong.")
    return teks


def _urai_json(teks: str) -> dict:
    teks = teks.strip()
    if teks.startswith("```"):
        teks = teks.strip("`").removeprefix("json").strip()
    try:
        hasil = json.loads(teks)
    except json.JSONDecodeError:
        # Model mengabaikan format JSON: pakai teksnya sebagai pesan.
        return {"pesan": teks, "pertanyaan": ""}
    if not isinstance(hasil, dict):
        raise GalatAI("Format respons Gemini tidak sesuai.")
    return hasil


def minta_teks(instruksi: str, isi: list[dict], maks_token: int = 900) -> str:
    """Jawaban teks bebas (fitur Tanya AI)."""
    badan = {
        "systemInstruction": {"parts": [{"text": instruksi}]},
        "contents": isi,
        "generationConfig": {"maxOutputTokens": maks_token},
    }
    return _ambil_teks(_kirim(badan)).strip()


def minta_tutor(instruksi: str, isi: list[dict], skema: dict) -> dict:
    badan = {
        "systemInstruction": {"parts": [{"text": instruksi}]},
        "contents": isi,
        "generationConfig": {
            "responseMimeType": "application/json",
            "responseJsonSchema": skema,
            "maxOutputTokens": 400,
        },
    }
    try:
        data = _kirim(badan)
    except GalatAI as e:
        # Beberapa model menolak responseJsonSchema: coba sekali tanpa skema.
        if "HTTP 400" not in str(e):
            raise
        badan["generationConfig"].pop("responseJsonSchema")
        data = _kirim(badan)
    return _urai_json(_ambil_teks(data))
