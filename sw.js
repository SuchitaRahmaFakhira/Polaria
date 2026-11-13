// Service worker Polaria. Naikkan VERSI setiap kali file di bawah berubah.
const VERSI = "polaria-v1";
const CACHE_LUAR = "polaria-luar-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/style.css",
  "/js/app.js",
  "/js/api.js",
  "/js/cache.js",
  "/js/config.js",
  "/js/data.js",
  "/js/ikon.js",
  "/js/komponen.js",
  "/js/pasang.js",
  "/js/progres.js",
  "/js/supabase.js",
  "/js/tema.js",
  "/js/util.js",
  "/js/materi/konten.js",
  "/js/evaluasi/soal-tetap.js",
  "/js/layar/beranda.js",
  "/js/layar/evaluasi.js",
  "/js/layar/generator.js",
  "/js/layar/kalkulator.js",
  "/js/layar/latihan.js",
  "/js/layar/masuk.js",
  "/js/layar/materi.js",
  "/js/layar/modul.js",
  "/js/layar/nilai.js",
  "/js/layar/pengaturan.js",
  "/assets/ikon/ikon-192.png",
  "/assets/ikon/ikon-512.png",
  "/assets/ikon/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((kunci) => Promise.all(kunci.filter((k) => k !== VERSI && k !== CACHE_LUAR).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function ambilLaluSimpan(req, namaCache) {
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") {
    const c = await caches.open(namaCache);
    c.put(req, res.clone());
  }
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // API Python selalu ke jaringan; cadangan offline diurus js/api.js.
  if (url.origin === location.origin && url.pathname.startsWith("/api/")) return;

  // Supabase (data) tidak di-cache.
  if (url.hostname.endsWith("supabase.co")) return;

  // Halaman: coba jaringan, jika offline pakai index.html dari cache.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("/index.html")));
    return;
  }

  // Font Google & library CDN: cache lalu perbarui di latar.
  if (url.origin !== location.origin) {
    e.respondWith(
      caches.match(req).then((tersimpan) => {
        const baru = ambilLaluSimpan(req, CACHE_LUAR).catch(() => tersimpan);
        return tersimpan || baru;
      }),
    );
    return;
  }

  // File aplikasi: cache dulu, perbarui di latar (stale-while-revalidate).
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((tersimpan) => {
      const baru = ambilLaluSimpan(req, VERSI).catch(() => tersimpan);
      return tersimpan || baru;
    }),
  );
});
