"""Generator soal latihan per level (lihat DESAIN.md §7).

Soal hanya menyimpan tipe + parameter. Kunci, petunjuk, dan pembahasan
dihitung ulang dari rumus oleh modul `periksa`.
"""

import random

from . import pola

LEVEL = ("mudah", "sedang", "menantang")
MINUS = pola.MINUS

# Urutan 10 soal per sesi: 3 mirip contoh -> 4 variasi -> 3 campuran/cerita.
SUSUNAN = {
    "mudah": [
        "cari_un", "cari_un", "lanjut_pola",
        "jenis_bilangan", "jenis_pola", "pilih_rumus", "lanjut_pola",
        "cari_un", "jenis_bilangan", "pilih_rumus",
    ],
    "sedang": [
        "cari_un", "cari_un", "cari_n",
        "cari_sn", "jenis_pola", "pilih_rumus", "cari_n",
        "soal_cerita", "soal_cerita", "cari_sn",
    ],
    "menantang": [
        "cari_un", "cari_n", "cari_sn",
        "cari_sn", "lanjut_pola", "cari_n", "pilih_rumus",
        "soal_cerita", "soal_cerita", "soal_cerita",
    ],
}

BATAS_N = {"mudah": 10, "sedang": 50, "menantang": 100}
BATAS_N_SN = {"mudah": 10, "sedang": 10, "menantang": 50}
RENTANG_BILANGAN = {"mudah": (1, 99), "sedang": (100, 999), "menantang": (1000, 99999)}

PILIHAN_RUMUS = ["Un = 2n", f"Un = 2n {MINUS} 1", "Un = n + 2", "Un = n²"]

# Konteks soal cerita: (kode, jenis, ukuran) dengan ukuran un | sn | n
KONTEKS_CERITA = [
    ("rumah_kanan", "genap", "un"),
    ("rumah_kiri", "ganjil", "un"),
    ("kursi", "ganjil", "un"),
    ("ubin", "ganjil", "sn"),
    ("tabungan", "genap", "sn"),
    ("kelereng", "genap", "n"),
    ("lompat", "ganjil", "n"),
]


def _teks_barisan(deret: list[int]) -> str:
    return ", ".join(str(x) for x in deret) + ", …"


def teks_cerita(konteks: str, jenis: str, n: int) -> str:
    b = pola.suku_ke(jenis, n)
    teks = {
        "rumah_kanan": f"Rumah di sisi kanan jalan bernomor genap: 2, 4, 6, dan seterusnya. Berapa nomor rumah ke-{n}?",
        "rumah_kiri": f"Rumah di sisi kiri jalan bernomor ganjil: 1, 3, 5, dan seterusnya. Berapa nomor rumah ke-{n}?",
        "kursi": f"Kursi bioskop di lorong kiri bernomor ganjil: 1, 3, 5, dan seterusnya. Berapa nomor kursi ke-{n}?",
        "ubin": (
            "Rina menyusun ubin. Hari ke-1 ia memasang 1 ubin, hari ke-2 3 ubin, hari ke-3 5 ubin, "
            f"dan seterusnya. Berapa banyak ubin seluruhnya setelah {n} hari?"
        ),
        "tabungan": (
            "Dimas menabung Rp2.000 pada hari ke-1, Rp4.000 pada hari ke-2, Rp6.000 pada hari ke-3, "
            f"dan seterusnya. Berapa ribu rupiah total tabungannya setelah {n} hari?"
        ),
        "kelereng": (
            "Setiap hari Ani mengambil kelereng: hari ke-1 2 butir, hari ke-2 4 butir, hari ke-3 6 butir, "
            f"dan seterusnya. Pada hari ke berapa Ani mengambil {b} butir?"
        ),
        "lompat": (
            "Seekor katak melompat ke batu bernomor 1, 3, 5, 7, dan seterusnya. "
            f"Batu nomor {b} adalah lompatan ke berapa?"
        ),
    }
    return teks[konteks]


def _soal(rng: random.Random, tipe: str, teks: str, parameter: dict, pilihan: list[str] | None = None) -> dict:
    return {
        "id": f"{tipe}-{rng.randrange(16**8):08x}",
        "tipe": tipe,
        "bentuk": "pilihan" if pilihan else "isian",
        "teks": teks,
        "pilihan": pilihan,
        "parameter": parameter,
    }


def buat_soal(tipe: str, level: str, rng: random.Random, jenis: str | None = None) -> dict:
    if level not in LEVEL:
        raise ValueError("Level harus mudah, sedang, atau menantang.")
    jenis = jenis or rng.choice(pola.JENIS_POLA)
    batas = BATAS_N[level]

    if tipe == "jenis_bilangan":
        bawah, atas = RENTANG_BILANGAN[level]
        target = jenis
        benar = rng.randint(bawah, atas)
        if pola.jenis_bilangan(benar) != target:
            benar += 1
        pengecoh: set[int] = set()
        while len(pengecoh) < 3:
            x = rng.randint(bawah, atas)
            if pola.jenis_bilangan(x) == target:
                x += 1
            if x != benar:
                pengecoh.add(x)
        angka = [benar, *pengecoh]
        rng.shuffle(angka)
        return _soal(
            rng, tipe,
            f"Bilangan berikut yang termasuk bilangan {target} adalah …",
            {"target": target, "angka": angka},
            [str(x) for x in angka],
        )

    if tipe == "jenis_pola":
        mulai = 1 if level == "mudah" else rng.randint(2, 20)
        deret = pola.barisan(jenis, 4, mulai)
        return _soal(
            rng, tipe,
            f"Pola {_teks_barisan(deret)} adalah pola bilangan …",
            {"jenis": jenis, "mulai_n": mulai, "panjang": 4},
            ["Genap", "Ganjil"],
        )

    if tipe == "lanjut_pola":
        mulai = {"mudah": 1, "sedang": rng.randint(1, 10), "menantang": rng.randint(5, 40)}[level]
        deret = pola.barisan(jenis, 4, mulai)
        return _soal(
            rng, tipe,
            f"Suku berikutnya dari pola {_teks_barisan(deret)} adalah …",
            {"jenis": jenis, "mulai_n": mulai, "panjang": 4},
        )

    if tipe == "pilih_rumus":
        deret = pola.barisan(jenis, 4)
        pilihan = PILIHAN_RUMUS[:]
        rng.shuffle(pilihan)
        return _soal(
            rng, tipe,
            f"Rumus suku ke-n dari pola {_teks_barisan(deret)} adalah …",
            {"jenis": jenis},
            pilihan,
        )

    if tipe == "cari_un":
        n = rng.randint(3 if level == "mudah" else 11, batas)
        deret = pola.barisan(jenis, 4)
        return _soal(
            rng, tipe,
            f"Suku ke-{n} dari pola {_teks_barisan(deret)} adalah …",
            {"jenis": jenis, "n": n},
        )

    if tipe == "cari_n":
        n = rng.randint(5, batas)
        b = pola.suku_ke(jenis, n)
        return _soal(
            rng, tipe,
            f"Bilangan {jenis} {b} adalah suku ke berapa pada pola bilangan {jenis}?",
            {"jenis": jenis, "n": n},
        )

    if tipe == "cari_sn":
        n = rng.randint(3, BATAS_N_SN[level])
        return _soal(
            rng, tipe,
            f"Jumlah {n} bilangan {jenis} pertama adalah …",
            {"jenis": jenis, "n": n},
        )

    if tipe == "soal_cerita":
        konteks, jenis_cerita, ukuran = rng.choice(KONTEKS_CERITA)
        n = rng.randint(5, BATAS_N_SN[level] if ukuran == "sn" else batas)
        return _soal(
            rng, tipe,
            teks_cerita(konteks, jenis_cerita, n),
            {"jenis": jenis_cerita, "n": n, "konteks": konteks, "ukuran": ukuran},
        )

    raise ValueError(f"Tipe soal tidak dikenal: {tipe}")


def buat_sesi(level: str, jumlah: int = 10, seed: int | None = None) -> list[dict]:
    if level not in LEVEL:
        raise ValueError("Level harus mudah, sedang, atau menantang.")
    rng = random.Random(seed)
    susunan = SUSUNAN[level]
    # Level mudah memakai satu jenis pola per sesi agar mirip contoh.
    jenis_tetap = rng.choice(pola.JENIS_POLA) if level == "mudah" else None
    return [
        buat_soal(susunan[i % len(susunan)], level, rng, jenis_tetap)
        for i in range(jumlah)
    ]
