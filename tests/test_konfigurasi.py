import base64
import json

from fastapi.testclient import TestClient

from _logika import konfigurasi
from index import app

klien = TestClient(app)


def _jwt(role: str) -> str:
    isi = base64.urlsafe_b64encode(json.dumps({"role": role}).encode()).decode().rstrip("=")
    return f"eyJhbGciOiJIUzI1NiJ9.{isi}.tandatangan"


def test_baca_env():
    teks = """
# komentar
SUPABASE_URL=https://abc.supabase.co
export SUPABASE_ANON_KEY="kunci-anon"
KOSONG=
LAIN=nilai # catatan
"""
    env = konfigurasi.baca_env(teks)
    assert env["SUPABASE_URL"] == "https://abc.supabase.co"
    assert env["SUPABASE_ANON_KEY"] == "kunci-anon"
    assert env["KOSONG"] == ""
    assert env["LAIN"] == "nilai"


def test_kunci_publik_aman():
    assert konfigurasi.kunci_publik_aman(_jwt("anon"))
    assert konfigurasi.kunci_publik_aman("sb_publishable_abc123")
    assert not konfigurasi.kunci_publik_aman(_jwt("service_role"))
    assert not konfigurasi.kunci_publik_aman("sb_secret_abc123")
    assert not konfigurasi.kunci_publik_aman("")


def test_konfigurasi_publik():
    ok = konfigurasi.konfigurasi_publik({"SUPABASE_URL": "https://abc.supabase.co/", "SUPABASE_ANON_KEY": _jwt("anon")})
    assert ok["supabase_url"] == "https://abc.supabase.co"
    kosong = {"supabase_url": "", "supabase_anon_key": ""}
    assert konfigurasi.konfigurasi_publik({}) == kosong
    assert konfigurasi.konfigurasi_publik({"SUPABASE_URL": "https://abc.supabase.co", "SUPABASE_ANON_KEY": _jwt("service_role")}) == kosong
    assert konfigurasi.konfigurasi_publik({"SUPABASE_URL": "http://abc.supabase.co", "SUPABASE_ANON_KEY": _jwt("anon")}) == kosong


def test_endpoint_config(monkeypatch):
    monkeypatch.setenv("SUPABASE_URL", "https://abc.supabase.co")
    monkeypatch.setenv("SUPABASE_ANON_KEY", "sb_publishable_xyz")
    assert klien.get("/api/config").json() == {"supabase_url": "https://abc.supabase.co", "supabase_anon_key": "sb_publishable_xyz"}
    monkeypatch.setenv("SUPABASE_ANON_KEY", "sb_secret_xyz")
    assert klien.get("/api/config").json()["supabase_anon_key"] == ""
