import random

import pytest

from _logika import kalkulator, periksa, pola, soal


# ---------- pola ----------

def test_rumus_cek_cepat():
    assert pola.suku_ke("genap", 5) == 10
    assert pola.suku_ke("ganjil", 5) == 9
    assert pola.jumlah_suku("genap", 5) == 30
    assert pola.jumlah_suku("ganjil", 5) == 25


@pytest.mark.parametrize("jenis", ["genap", "ganjil"])
def test_sn_sama_dengan_penjumlahan(jenis):
    for n in range(1, 60):
        assert pola.jumlah_suku(jenis, n) == sum(pola.barisan(jenis, n))


def test_posisi_suku():
    assert pola.posisi_suku(17) == 9
    assert pola.posisi_suku(84) == 42
    assert pola.posisi_suku(0) is None
    for n in range(1, 200):
        assert pola.posisi_suku(pola.suku_ke("genap", n)) == n
        assert pola.posisi_suku(pola.suku_ke("ganjil", n)) == n


def test_buat_pola():
    data = pola.buat_pola("genap", 5)
    assert data["barisan"] == [2, 4, 6, 8, 10]
    assert data["suku_pertama"] == 2
    assert data["beda"] == 2
    assert data["jumlah_sn"] == 30
    assert data["langkah_sn"][-1].startswith("Cek: 2 + 4 + 6 + 8 + 10 = 30")


def test_jenis_salah():
    with pytest.raises(ValueError):
        pola.suku_ke("prima", 3)


# ---------- kalkulator ----------

def test_kalkulator_17():
    hasil = kalkulator.periksa_bilangan(17)
    assert hasil["jenis"] == "ganjil"
    assert hasil["cara"] == "17 ÷ 2 = 8 sisa 1"
    assert hasil["posisi"]["n"] == 9
    assert hasil["posisi"]["kalimat"] == "17 adalah suku ke-9 pola bilangan ganjil."


def test_kalkulator_nol_dan_genap():
    assert kalkulator.periksa_bilangan(0)["posisi"]["n"] is None
    assert kalkulator.periksa_bilangan(0)["jenis"] == "genap"
    assert kalkulator.periksa_bilangan(1_000_000)["posisi"]["n"] == 500_000


def test_kalkulator_negatif():
    with pytest.raises(ValueError):
        kalkulator.periksa_bilangan(-3)


# ---------- generator soal + pemeriksa ----------

RENTANG = {"mudah": 10, "sedang": 50, "menantang": 100}


@pytest.mark.parametrize("level", soal.LEVEL)
def test_sesi_soal_valid(level):
    for seed in range(100):
        sesi = soal.buat_sesi(level, 10, seed)
        assert len(sesi) == 10
        assert [s["tipe"] for s in sesi] == soal.SUSUNAN[level]
        for s in sesi:
            kunci = periksa.hitung_kunci(s)
            p = s["parameter"]
            if "n" in p:
                assert 1 <= p["n"] <= RENTANG[level]
            if s["bentuk"] == "pilihan":
                # tepat satu pilihan benar
                benar = [x for x in s["pilihan"] if periksa.normalisasi(x) == periksa.normalisasi(kunci)]
                assert len(benar) == 1, s
            else:
                assert kunci.isdigit()
            hasil = periksa.periksa_jawaban(s, kunci)
            assert hasil["benar"] is True
            assert len(periksa.buat_paket(s)["petunjuk"]) == 3


def test_level_mudah_satu_jenis():
    for seed in range(30):
        jenis = {s["parameter"].get("jenis") or s["parameter"].get("target") for s in soal.buat_sesi("mudah", 10, seed)}
        assert len(jenis) == 1


def test_kunci_sesuai_rumus():
    rng = random.Random(1)
    for _ in range(200):
        s = soal.buat_soal("cari_un", "menantang", rng)
        p = s["parameter"]
        assert periksa.hitung_kunci(s) == str(pola.suku_ke(p["jenis"], p["n"]))
        s = soal.buat_soal("cari_sn", "menantang", rng)
        p = s["parameter"]
        assert periksa.hitung_kunci(s) == str(pola.jumlah_suku(p["jenis"], p["n"]))


def test_periksa_contoh_u25_ganjil():
    s = {"tipe": "cari_un", "parameter": {"jenis": "ganjil", "n": 25}}
    assert periksa.periksa_jawaban(s, "49")["benar"]
    salah = periksa.periksa_jawaban(s, "50", petunjuk_ke=2)
    assert not salah["benar"]
    assert salah["kunci"] == "49"
    assert len(salah["petunjuk"]) == 2
    assert salah["pembahasan"][-1] == "U25 = 49"


def test_normalisasi_jawaban():
    s = {"tipe": "cari_sn", "parameter": {"jenis": "ganjil", "n": 40}}
    assert periksa.periksa_jawaban(s, " 1.600 ")["benar"]
    s = {"tipe": "pilih_rumus", "parameter": {"jenis": "ganjil"}}
    assert periksa.periksa_jawaban(s, "Un = 2n - 1")["benar"]
    assert periksa.periksa_jawaban(s, "un=2n−1")["benar"]
    assert not periksa.periksa_jawaban(s, "")["benar"]


def test_parameter_klien_tidak_valid():
    with pytest.raises(ValueError):
        periksa.hitung_kunci({"tipe": "cari_un", "parameter": {"jenis": "genap", "n": "5"}})
    with pytest.raises(ValueError):
        periksa.hitung_kunci({"tipe": "hapus_data", "parameter": {}})
    with pytest.raises(ValueError):
        periksa.hitung_kunci({"tipe": "cari_un", "parameter": {"jenis": "genap", "n": 10**9}})
