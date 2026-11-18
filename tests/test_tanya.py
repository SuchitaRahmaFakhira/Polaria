from _logika import tanya


def test_bersihkan_latex():
    f = tanya.bersihkan_latex
    assert f(r"Cek $n = 1$: $(2 \times 1) - 1 = 1$") == "Cek n = 1: (2 × 1) − 1 = 1"
    assert f(r"$$S_n = n^2$$ dan n^{2}") == "S_n = n² dan n²"
    assert f(r"\frac{46}{2} = 23") == "(46) ÷ (2) = 23"
    assert f(r"Hasilnya \text{genap}") == "Hasilnya genap"
    assert f("Pakai Un = 2n − 1.") == "Pakai Un = 2n − 1."  # teks biasa tidak berubah
    assert f("Langkah 1 - pahami") == "Langkah 1 - pahami"  # tanda hubung kalimat tetap


def test_susun_isi_tanya():
    riwayat = [{"peran": "tutor", "teks": "Halo"}] + [{"peran": "siswa", "teks": f"t{i}"} for i in range(15)]
    isi = tanya.susun_isi_tanya("  Apa itu Sn?  ", riwayat)
    assert isi[0]["role"] == "user"
    assert len(isi) <= tanya.BATAS_RIWAYAT + 1
    assert isi[-1] == {"role": "user", "parts": [{"text": "Apa itu Sn?"}]}
    assert "LaTeX" in tanya.INSTRUKSI_TANYA and "Hanya bahas matematika" in tanya.INSTRUKSI_TANYA
