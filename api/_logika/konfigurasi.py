"""Membaca konfigurasi Supabase dari file .env / environment variable.

Hanya URL dan kunci publik (anon/publishable) yang boleh diserahkan ke browser.
Kunci service_role / secret selalu ditolak.
"""

import base64
import json


def baca_env(teks: str) -> dict[str, str]:
    """Urai isi file .env sederhana: KUNCI=nilai, baris # diabaikan."""
    hasil: dict[str, str] = {}
    for baris in teks.splitlines():
        baris = baris.strip()
        if not baris or baris.startswith("#") or "=" not in baris:
            continue
        kunci, nilai = baris.split("=", 1)
        kunci = kunci.strip().removeprefix("export ").strip()
        nilai = nilai.strip()
        if len(nilai) >= 2 and nilai[0] == nilai[-1] and nilai[0] in "\"'":
            nilai = nilai[1:-1]
        elif " #" in nilai:
            nilai = nilai.split(" #", 1)[0].strip()
        hasil[kunci] = nilai
    return hasil


def kunci_publik_aman(kunci: str) -> bool:
    """True jika kunci boleh dipakai di browser (anon / publishable)."""
    if not kunci or kunci.startswith("sb_secret_"):
        return False
    bagian = kunci.split(".")
    if len(bagian) == 3:  # format JWT lama: cek klaim "role"
        try:
            isi = json.loads(base64.urlsafe_b64decode(bagian[1] + "=" * (-len(bagian[1]) % 4)))
            return isi.get("role") != "service_role"
        except (ValueError, json.JSONDecodeError):
            return False
    return True


def konfigurasi_publik(env: dict[str, str]) -> dict:
    url = env.get("SUPABASE_URL", "").strip().rstrip("/")
    kunci = env.get("SUPABASE_ANON_KEY", "").strip()
    if not url.startswith("https://") or not kunci_publik_aman(kunci):
        return {"supabase_url": "", "supabase_anon_key": ""}
    return {"supabase_url": url, "supabase_anon_key": kunci}
