"""Kalkulator Ganjil Genap: jenis bilangan, cara hitung, dan posisinya dalam pola."""

from . import pola


def periksa_bilangan(b: int) -> dict:
    if b < 0:
        raise ValueError("Bilangan tidak boleh negatif.")
    jenis = pola.jenis_bilangan(b)
    hasil_bagi, sisa = divmod(b, 2)
    n = pola.posisi_suku(b)

    if n is None:
        posisi = {
            "n": None,
            "langkah": [],
            "kalimat": "0 termasuk genap, tetapi bukan suku pola karena n dimulai dari 1.",
        }
    else:
        posisi = {
            "n": n,
            "langkah": pola.langkah_cari_n(jenis, b),
            "kalimat": f"{b} adalah suku ke-{n} pola bilangan {jenis}.",
        }

    return {
        "bilangan": b,
        "jenis": jenis,
        "hasil_bagi": hasil_bagi,
        "sisa": sisa,
        "cara": f"{b} ÷ 2 = {hasil_bagi} sisa {sisa}",
        "penjelasan": f"Karena sisanya {sisa}, maka {b} termasuk bilangan {jenis}.",
        "angka_satuan": b % 10,
        "posisi": posisi,
    }
