"""Rumus pola bilangan genap dan ganjil.

Genap : 2, 4, 6, ...  Un = 2n      Sn = n(n + 1)
Ganjil: 1, 3, 5, ...  Un = 2n - 1  Sn = n^2
"""

JENIS_POLA = ("genap", "ganjil")
MINUS = "−"  # tanda minus matematika untuk tampilan


def _cek_jenis(jenis: str) -> None:
    if jenis not in JENIS_POLA:
        raise ValueError("Jenis pola harus 'genap' atau 'ganjil'.")


def jenis_bilangan(b: int) -> str:
    return "genap" if b % 2 == 0 else "ganjil"


def suku_ke(jenis: str, n: int) -> int:
    _cek_jenis(jenis)
    return 2 * n if jenis == "genap" else 2 * n - 1


def jumlah_suku(jenis: str, n: int) -> int:
    _cek_jenis(jenis)
    return n * (n + 1) if jenis == "genap" else n * n


def posisi_suku(b: int) -> int | None:
    """Nomor urut b di dalam polanya sendiri. 0 bukan suku (n mulai dari 1)."""
    if b < 1:
        return None
    return b // 2 if b % 2 == 0 else (b + 1) // 2


def rumus_un(jenis: str) -> str:
    _cek_jenis(jenis)
    return "Un = 2n" if jenis == "genap" else f"Un = 2n {MINUS} 1"


def rumus_sn(jenis: str) -> str:
    _cek_jenis(jenis)
    return "Sn = n(n + 1)" if jenis == "genap" else "Sn = n²"


def barisan(jenis: str, jumlah: int, mulai_n: int = 1) -> list[int]:
    return [suku_ke(jenis, n) for n in range(mulai_n, mulai_n + jumlah)]


def langkah_un(jenis: str, n: int) -> list[str]:
    un = suku_ke(jenis, n)
    if jenis == "genap":
        return [rumus_un(jenis), f"U{n} = 2 × {n}", f"U{n} = {un}"]
    return [
        rumus_un(jenis),
        f"U{n} = 2 × {n} {MINUS} 1",
        f"U{n} = {2 * n} {MINUS} 1",
        f"U{n} = {un}",
    ]


def langkah_sn(jenis: str, n: int) -> list[str]:
    sn = jumlah_suku(jenis, n)
    if jenis == "genap":
        langkah = [rumus_sn(jenis), f"S{n} = {n} × ({n} + 1)", f"S{n} = {n} × {n + 1}", f"S{n} = {sn}"]
    else:
        langkah = [rumus_sn(jenis), f"S{n} = {n}²", f"S{n} = {n} × {n}", f"S{n} = {sn}"]
    if n <= 6:
        langkah.append("Cek: " + " + ".join(str(x) for x in barisan(jenis, n)) + f" = {sn} ✔")
    return langkah


def langkah_cari_n(jenis: str, b: int) -> list[str]:
    n = posisi_suku(b)
    if jenis == "genap":
        return ["Pola genap: Un = 2n, jadi n = Un ÷ 2", f"n = {b} ÷ 2", f"n = {n}"]
    return [
        f"Pola ganjil: Un = 2n {MINUS} 1, jadi n = (Un + 1) ÷ 2",
        f"n = ({b} + 1) ÷ 2",
        f"n = {b + 1} ÷ 2",
        f"n = {n}",
    ]


def buat_pola(jenis: str, jumlah: int) -> dict:
    """Data untuk layar Generator Pola Bilangan."""
    _cek_jenis(jenis)
    deret = barisan(jenis, jumlah)
    return {
        "jenis": jenis,
        "jumlah": jumlah,
        "barisan": deret,
        "suku_pertama": deret[0],
        "beda": 2,
        "rumus_un": rumus_un(jenis),
        "rumus_sn": rumus_sn(jenis),
        "suku_terakhir": deret[-1],
        "langkah_un": langkah_un(jenis, jumlah),
        "jumlah_sn": jumlah_suku(jenis, jumlah),
        "langkah_sn": langkah_sn(jenis, jumlah),
    }
