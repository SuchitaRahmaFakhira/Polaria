from fastapi.testclient import TestClient

from index import app

klien = TestClient(app)


def test_kesehatan():
    assert klien.get("/api/kesehatan").json() == {"status": "ok"}


def test_kalkulator():
    data = klien.get("/api/kalkulator", params={"bilangan": 17}).json()
    assert data["jenis"] == "ganjil"
    assert data["posisi"]["n"] == 9


def test_kalkulator_masukan_salah():
    r = klien.get("/api/kalkulator", params={"bilangan": -1})
    assert r.status_code == 422
    assert r.json()["galat"] == "Masukkan bilangan bulat antara 0 dan 1.000.000."
    assert klien.get("/api/kalkulator", params={"bilangan": "abc"}).status_code == 422


def test_pola():
    data = klien.get("/api/pola", params={"jenis": "ganjil", "jumlah": 5}).json()
    assert data["barisan"] == [1, 3, 5, 7, 9]
    assert data["jumlah_sn"] == 25
    assert klien.get("/api/pola", params={"jenis": "prima"}).status_code == 422
    assert klien.get("/api/pola", params={"jenis": "genap", "jumlah": 21}).status_code == 422


def test_soal_dan_periksa():
    data = klien.get("/api/soal", params={"level": "sedang", "seed": 7}).json()
    assert len(data["soal"]) == 10
    for s in data["soal"]:
        kunci = s["paket"]["kunci"]
        hasil = klien.post("/api/periksa", json={"soal": s, "jawaban": kunci}).json()
        assert hasil["benar"] is True
        assert hasil["kunci"] == kunci


def test_periksa_tidak_percaya_klien():
    s = {"tipe": "cari_un", "parameter": {"jenis": "genap", "n": 30}, "paket": {"kunci": "1"}}
    hasil = klien.post("/api/periksa", json={"soal": s, "jawaban": "1"}).json()
    assert hasil["benar"] is False
    assert hasil["kunci"] == "60"


def test_periksa_parameter_rusak():
    r = klien.post("/api/periksa", json={"soal": {"tipe": "cari_un", "parameter": {"jenis": "x", "n": 3}}, "jawaban": "6"})
    assert r.status_code == 422
    assert "galat" in r.json()
