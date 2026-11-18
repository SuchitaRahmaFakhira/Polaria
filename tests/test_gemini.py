import io
import json
import urllib.error

import pytest
from fastapi.testclient import TestClient

import index
from _layanan import gemini

klien = TestClient(index.app)
KUNCI_PALSU = "AIzaPALSU-jangan-bocor-123"


class _Res(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def _balasan(obj, thought=False):
    bagian = [{"text": "pikiran internal", "thought": True}] if thought else []
    bagian.append({"text": json.dumps(obj)})
    return {"candidates": [{"content": {"parts": bagian}}]}


@pytest.fixture
def tiruan(monkeypatch):
    """Ganti urlopen; simpan permintaan terakhir."""
    catatan = {"balasan": _balasan({"pesan": "Ingat rumus pola ganjil.", "pertanyaan": "Berapa 2 × 30?"})}

    def urlopen_palsu(req, timeout=None):
        catatan["req"] = req
        catatan["badan"] = json.loads(req.data)
        if isinstance(catatan["balasan"], Exception):
            raise catatan["balasan"]
        return _Res(json.dumps(catatan["balasan"]).encode())

    monkeypatch.setenv("GEMINI_API_KEY", KUNCI_PALSU)
    monkeypatch.setattr(gemini.urllib.request, "urlopen", urlopen_palsu)
    index._JEJAK_IP.clear()
    return catatan


MASALAH = {"tipe": "soal_cerita", "parameter": {"jenis": "ganjil", "n": 30, "konteks": "rumah_kiri", "ukuran": "un"}}


def _tanya(**kw):
    badan = {"masalah": MASALAH, "tahap": "output", "isian": {"jawaban": "60"}, **kw}
    return klien.post("/api/rmt/tutor", json=badan)


def test_minta_tutor_format_permintaan(tiruan):
    hasil = gemini.minta_tutor("instruksi", [{"role": "user", "parts": [{"text": "hai"}]}], {"type": "object"})
    assert hasil["pertanyaan"] == "Berapa 2 × 30?"
    req = tiruan["req"]
    assert req.get_header("X-goog-api-key") == KUNCI_PALSU
    assert ":generateContent" in req.full_url and gemini.MODEL_BAWAAN in req.full_url
    assert tiruan["badan"]["systemInstruction"]["parts"][0]["text"] == "instruksi"
    assert tiruan["badan"]["generationConfig"]["responseMimeType"] == "application/json"


def test_lewati_bagian_thought(tiruan):
    tiruan["balasan"] = _balasan({"pesan": "a", "pertanyaan": "b"}, thought=True)
    assert gemini.minta_tutor("i", [], {}) == {"pesan": "a", "pertanyaan": "b"}


def test_model_dari_env(tiruan, monkeypatch):
    monkeypatch.setenv("GEMINI_MODEL", "gemini-uji")
    gemini.minta_tutor("i", [], {})
    assert "/models/gemini-uji:generateContent" in tiruan["req"].full_url


def test_galat_http_dibungkus(tiruan):
    tiruan["balasan"] = urllib.error.HTTPError("u", 429, "quota", {}, io.BytesIO(b"rahasia akun"))
    with pytest.raises(gemini.GalatAI) as e:
        gemini.minta_tutor("i", [], {})
    assert "rahasia" not in str(e.value)


def test_endpoint_memakai_gemini(tiruan):
    r = _tanya(tingkat=2, pesan="aku pakai 2n")
    data = r.json()
    assert r.status_code == 200
    assert data["sumber"] == "gemini"
    assert data["benar"] is False and data["kesulitan"] == "konsep_pola"
    assert data["tingkat_petunjuk"] == 2
    assert KUNCI_PALSU not in r.text
    konteks = tiruan["badan"]["contents"][-1]["parts"][0]["text"]
    assert "aku pakai 2n" in konteks and "RAHASIA" in konteks


def test_endpoint_menyaring_bocoran(tiruan):
    tiruan["balasan"] = _balasan({"pesan": "Jawabannya 59.", "pertanyaan": "Oke?"})
    data = _tanya().json()
    assert data["sumber"] == "aturan"
    assert "59" not in data["pesan"] + data["pertanyaan"]


def test_endpoint_cadangan_saat_gemini_gagal(tiruan):
    tiruan["balasan"] = urllib.error.URLError("offline")
    data = _tanya().json()
    assert data["sumber"] == "aturan" and data["pesan"]


def test_endpoint_tanpa_kunci(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    index._JEJAK_IP.clear()
    data = _tanya(isian={"jawaban": "59"}).json()
    assert data["benar"] and data["lanjut"] and data["sumber"] == "aturan" and data["tingkat_petunjuk"] == 0
    assert klien.get("/api/config").json()["ai_aktif"] is False


def test_config_tidak_membocorkan_kunci(tiruan):
    r = klien.get("/api/config")
    assert r.json()["ai_aktif"] is True
    assert KUNCI_PALSU not in r.text


def test_batas_laju(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    index._JEJAK_IP.clear()
    kode = [_tanya().status_code for _ in range(index.BATAS_PER_MENIT + 1)]
    assert kode[-1] == 429 and kode[0] == 200
    index._JEJAK_IP.clear()


def test_validasi_masukan(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    index._JEJAK_IP.clear()
    assert _tanya(tahap="hapus").status_code == 422
    assert _tanya(pesan="x" * 401).status_code == 422
    assert _tanya(isian={"jawaban": "1" * 301}).status_code == 422


def test_masalah_endpoint():
    data = klien.get("/api/rmt/masalah", params={"level": "sedang", "seed": 3}).json()
    assert data["tipe"] == "soal_cerita" and data["teks"]
    assert "jawaban" not in json.dumps(data["parameter"])


# ---------- Tanya AI ----------

def test_tanya_mengembalikan_jawaban_gemini(tiruan):
    tiruan["balasan"] = {"candidates": [{"content": {"parts": [{"text": "1. Pahami soalnya.\n2. Pakai Un = 2n."}]}}]}
    r = klien.post("/api/tanya", json={"pertanyaan": "Bagaimana mencari suku ke-20 pola genap?",
                                       "riwayat": [{"peran": "tutor", "teks": "halo"}, {"peran": "siswa", "teks": "apa itu pola?"}, {"peran": "tutor", "teks": "Pola adalah…"}]})
    assert r.status_code == 200
    data = r.json()
    assert data["sumber"] == "gemini" and data["jawaban"].startswith("1. Pahami")
    isi = tiruan["badan"]["contents"]
    assert isi[0]["role"] == "user"  # giliran tutor di awal dibuang
    assert isi[-1]["parts"][0]["text"].startswith("Bagaimana mencari")
    assert "Rigorous Mathematical Thinking" in tiruan["badan"]["systemInstruction"]["parts"][0]["text"]
    assert KUNCI_PALSU not in r.text


def test_tanya_tanpa_kunci_jujur_503(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    index._JEJAK_IP.clear()
    r = klien.post("/api/tanya", json={"pertanyaan": "Apa itu bilangan ganjil?"})
    assert r.status_code == 503 and "GEMINI_API_KEY" in r.json()["galat"]


def test_tanya_gemini_gagal_502(tiruan):
    tiruan["balasan"] = urllib.error.HTTPError("u", 403, "forbidden", {}, io.BytesIO(b"detail akun"))
    r = klien.post("/api/tanya", json={"pertanyaan": "Apa itu bilangan ganjil?"})
    assert r.status_code == 502 and "detail akun" not in r.text


def test_tanya_validasi(tiruan):
    assert klien.post("/api/tanya", json={"pertanyaan": "x"}).status_code == 422
    assert klien.post("/api/tanya", json={"pertanyaan": "a" * 601}).status_code == 422
