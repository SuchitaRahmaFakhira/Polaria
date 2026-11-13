"""Pemeriksa jawaban: kunci, petunjuk bertahap, pembahasan, dan cek substitusi.

Kunci selalu dihitung ulang dari tipe + parameter soal, tidak pernah
dipercaya dari klien.
"""

from . import pola

MINUS = pola.MINUS
TIPE_SOAL = (
    "jenis_bilangan", "jenis_pola", "lanjut_pola", "pilih_rumus",
    "cari_un", "cari_n", "cari_sn", "soal_cerita",
)
KONTEKS = ("rumah_kanan", "rumah_kiri", "kursi", "ubin", "tabungan", "kelereng", "lompat")


# ---------- validasi parameter dari klien ----------

def _int(nilai, nama: str, bawah: int, atas: int) -> int:
    if isinstance(nilai, bool) or not isinstance(nilai, int):
        raise ValueError(f"Parameter '{nama}' harus bilangan bulat.")
    if not bawah <= nilai <= atas:
        raise ValueError(f"Parameter '{nama}' harus di antara {bawah} dan {atas}.")
    return nilai


def _jenis(p: dict, kunci: str = "jenis") -> str:
    jenis = p.get(kunci)
    if jenis not in pola.JENIS_POLA:
        raise ValueError("Jenis pola harus 'genap' atau 'ganjil'.")
    return jenis


def _ambil(soal: dict) -> tuple[str, dict]:
    tipe = soal.get("tipe")
    if tipe not in TIPE_SOAL:
        raise ValueError("Tipe soal tidak dikenal.")
    p = soal.get("parameter")
    if not isinstance(p, dict):
        raise ValueError("Parameter soal tidak lengkap.")
    return tipe, p


# ---------- kunci ----------

def hitung_kunci(soal: dict) -> str:
    tipe, p = _ambil(soal)

    if tipe == "jenis_bilangan":
        target = _jenis(p, "target")
        angka = p.get("angka")
        if not isinstance(angka, list) or not angka:
            raise ValueError("Daftar angka tidak lengkap.")
        for x in angka:
            _int(x, "angka", 0, 10**7)
        cocok = [x for x in angka if pola.jenis_bilangan(x) == target]
        if not cocok:
            raise ValueError("Tidak ada pilihan yang benar.")
        return str(cocok[0])

    jenis = _jenis(p)

    if tipe in ("jenis_pola", "lanjut_pola"):
        mulai = _int(p.get("mulai_n"), "mulai_n", 1, 1000)
        panjang = _int(p.get("panjang"), "panjang", 2, 20)
        if tipe == "jenis_pola":
            return jenis.capitalize()
        return str(pola.suku_ke(jenis, mulai + panjang))
    if tipe == "pilih_rumus":
        return pola.rumus_un(jenis)

    n = _int(p.get("n"), "n", 1, 1000)
    if tipe == "cari_un":
        return str(pola.suku_ke(jenis, n))
    if tipe == "cari_n":
        return str(n)
    if tipe == "cari_sn":
        return str(pola.jumlah_suku(jenis, n))

    # soal_cerita
    ukuran = p.get("ukuran")
    if ukuran == "un":
        return str(pola.suku_ke(jenis, n))
    if ukuran == "sn":
        return str(pola.jumlah_suku(jenis, n))
    if ukuran == "n":
        return str(n)
    raise ValueError("Ukuran soal cerita tidak dikenal.")


# ---------- petunjuk, pembahasan, cek ----------

def _petunjuk_rumus(jenis: str) -> str:
    return f"Untuk pola {jenis}, rumusnya {pola.rumus_un(jenis)}."


def buat_paket(soal: dict) -> dict:
    """Kunci + 3 petunjuk bertahap + pembahasan + cek substitusi."""
    tipe, p = _ambil(soal)
    kunci = hitung_kunci(soal)

    if tipe == "jenis_bilangan":
        target = p["target"]
        petunjuk = [
            "Lihat angka satuan (angka paling kanan) tiap bilangan.",
            "Bilangan genap berakhiran 0, 2, 4, 6, 8. Bilangan ganjil berakhiran 1, 3, 5, 7, 9.",
            "Coba bagi dengan 2. Genap jika sisanya 0, ganjil jika sisanya 1.",
        ]
        pembahasan = [
            f"{x} ÷ 2 = {x // 2} sisa {x % 2} → {pola.jenis_bilangan(x)}" for x in p["angka"]
        ] + [f"Jadi bilangan {target}nya adalah {kunci}."]
        ringkas = f"{kunci} ÷ 2 = {int(kunci) // 2} sisa {int(kunci) % 2} → {target}"
        cek = f"Angka satuan {kunci} adalah {int(kunci) % 10}, termasuk bilangan {target}. ✔"
        return _paket(kunci, petunjuk, pembahasan, ringkas, cek)

    jenis = p["jenis"]

    if tipe == "jenis_pola":
        deret = pola.barisan(jenis, p["panjang"], p["mulai_n"])
        a = deret[0]
        petunjuk = [
            "Lihat angka satuan suku-sukunya.",
            "Bedanya selalu 2. Apakah sukunya bilangan genap atau ganjil?",
            f"Coba bagi suku pertama dengan 2: {a} ÷ 2 = {a // 2} sisa {a % 2}.",
        ]
        pembahasan = [
            f"Suku pertama {a}: {a} ÷ 2 = {a // 2} sisa {a % 2}, jadi {jenis}.",
            "Setiap suku bertambah 2, sehingga semuanya tetap " + jenis + ".",
            f"Jadi ini pola bilangan {jenis}.",
        ]
        return _paket(kunci, petunjuk, pembahasan, f"Semua suku bilangan {jenis}.", None)

    if tipe == "lanjut_pola":
        deret = pola.barisan(jenis, p["panjang"], p["mulai_n"])
        akhir = deret[-1]
        petunjuk = [
            "Berapa selisih antara dua suku yang berurutan?",
            "Selisihnya selalu 2.",
            f"Tambahkan 2 pada suku terakhir: {akhir} + 2 = …",
        ]
        pembahasan = [
            f"Selisih tiap suku: {deret[1]} {MINUS} {deret[0]} = 2.",
            f"Suku berikutnya = {akhir} + 2 = {kunci}.",
        ]
        cek = f"{kunci} juga bilangan {jenis}, sama dengan suku lainnya. ✔"
        return _paket(kunci, petunjuk, pembahasan, f"{akhir} + 2 = {kunci}", cek)

    if tipe == "pilih_rumus":
        u1, u2 = pola.suku_ke(jenis, 1), pola.suku_ke(jenis, 2)
        petunjuk = [
            "Pola ini genap atau ganjil?",
            f"Coba n = 1. Suku pertamanya {u1}.",
            f"Cari rumus yang menghasilkan {u1} saat n = 1 dan {u2} saat n = 2.",
        ]
        pembahasan = [
            f"Un = 2n → U1 = 2, U2 = 4",
            f"Un = 2n {MINUS} 1 → U1 = 1, U2 = 3",
            "Un = n + 2 → U1 = 3, U2 = 4",
            "Un = n² → U1 = 1, U2 = 4",
            f"Yang cocok dengan {u1}, {u2}, … adalah {kunci}.",
        ]
        cek = f"Cek n = 3: suku ke-3 pola {jenis} adalah {pola.suku_ke(jenis, 3)}, dan {kunci} juga memberi {pola.suku_ke(jenis, 3)}. ✔"
        return _paket(kunci, petunjuk, pembahasan, f"Pola {jenis}: {kunci}", cek)

    n = p["n"]
    ukuran = {"cari_un": "un", "cari_n": "n", "cari_sn": "sn"}.get(tipe) or p.get("ukuran")

    if ukuran == "un":
        langkah = pola.langkah_un(jenis, n)
        petunjuk = [
            "Pola ini genap atau ganjil? Lihat angka satuannya.",
            _petunjuk_rumus(jenis),
            f"Ganti n dengan {n}: " + langkah[1].split("= ", 1)[1] + " = …",
        ]
        cek = (
            f"Cek n = 1: rumus memberi {pola.suku_ke(jenis, 1)}, sama dengan suku pertama. ✔"
        )
    elif ukuran == "n":
        b = pola.suku_ke(jenis, n)
        langkah = pola.langkah_cari_n(jenis, b)
        petunjuk = [
            f"Bilangan {b} termasuk pola genap atau ganjil?",
            "Pola genap: n = Un ÷ 2." if jenis == "genap" else f"Pola ganjil: n = (Un + 1) ÷ 2.",
            f"{b} ÷ 2 = …" if jenis == "genap" else f"({b} + 1) ÷ 2 = …",
        ]
        cek = f"Cek: U{n} = " + ("2 × " + str(n) if jenis == "genap" else f"2 × {n} {MINUS} 1") + f" = {b}. ✔"
    else:  # sn
        langkah = pola.langkah_sn(jenis, n)
        petunjuk = [
            "Yang ditanya jumlah, bukan satu suku. Pakai rumus Sn.",
            f"Untuk pola {jenis}, rumusnya {pola.rumus_sn(jenis)}.",
            (f"{n} × {n + 1} = …" if jenis == "genap" else f"{n} × {n} = …"),
        ]
        s2 = pola.jumlah_suku(jenis, 2)
        cek = (
            f"Cek n = 2: {pola.suku_ke(jenis, 1)} + {pola.suku_ke(jenis, 2)} = {s2}, "
            f"dan rumus memberi {s2}. ✔"
        )

    pembahasan = list(langkah)
    if tipe == "soal_cerita":
        deret = pola.barisan(jenis, 3)
        yang_ditanya = {"un": f"suku ke-{n}", "sn": f"jumlah {n} suku pertama", "n": "nomor urut suku"}[ukuran]
        petunjuk[0] = f"Barisannya {', '.join(map(str, deret))}, … Ini pola {jenis}. Yang ditanya: {yang_ditanya}."
        pembahasan.insert(0, f"Barisan {', '.join(map(str, deret))}, … adalah pola {jenis}; yang ditanya {yang_ditanya}.")
        if p.get("konteks") == "tabungan":
            pembahasan.append(f"Jadi total tabungannya {kunci} ribu rupiah (Rp{int(kunci) * 1000:,}).".replace(",", "."))
    ringkas = langkah[-1] if not langkah[-1].startswith("Cek") else langkah[-2]
    return _paket(kunci, petunjuk, pembahasan, ringkas, cek)


def _paket(kunci, petunjuk, pembahasan, ringkas, cek) -> dict:
    return {"kunci": kunci, "petunjuk": petunjuk, "pembahasan": pembahasan, "ringkas": ringkas, "cek": cek}


# ---------- pemeriksaan ----------

def normalisasi(teks: str) -> str:
    """Samakan penulisan: spasi, titik ribuan, tanda minus, huruf besar/kecil."""
    t = str(teks).strip().lower()
    t = t.replace(MINUS, "-").replace("–", "-")
    t = t.replace(" ", "")
    if t.replace(".", "").isdigit():
        t = t.replace(".", "").lstrip("0") or "0"
    return t


def periksa_jawaban(soal: dict, jawaban: str, petunjuk_ke: int = 0) -> dict:
    paket = buat_paket(soal)
    benar = normalisasi(jawaban) == normalisasi(paket["kunci"]) if str(jawaban).strip() else False
    petunjuk_ke = max(0, min(3, int(petunjuk_ke)))
    return {
        "benar": benar,
        "kunci": paket["kunci"],
        "petunjuk": paket["petunjuk"][:petunjuk_ke],
        "pembahasan": paket["pembahasan"],
        "ringkas": paket["ringkas"],
        "cek_substitusi": paket["cek"],
    }
