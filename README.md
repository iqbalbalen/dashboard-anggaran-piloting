# Dashboard Anggaran Piloting

Prototype Next.js untuk monitoring pagu, realisasi, dan sisa anggaran.

## Fitur awal
- Tema navy gelap dan responsif untuk HP
- Upload Excel `.xlsx` / `.xls`
- Kartu Pagu, Realisasi, Sisa, dan Persentase
- Filter dan grafik realisasi per unit
- Rincian Unit → Program → Kegiatan → KRO → RO → Komponen → Subkomponen → Akun → Detail
- PWA dasar agar dapat ditambahkan ke Home Screen

## Menjalankan lokal
```bash
npm install
npm run dev
```
Buka `http://localhost:3000`.

## Deploy ke Vercel
1. Upload seluruh isi folder ini ke root repository GitHub.
2. Di Vercel pilih **Add New > Project**.
3. Import repository `dashboard-anggaran-piloting`.
4. Framework akan terdeteksi sebagai **Next.js**, lalu pilih **Deploy**.

## Batasan prototype
Upload Excel diproses di browser dan belum disimpan ke database. Karena itu, file yang di-upload pada laptop admin belum otomatis tampil pada perangkat pimpinan. Tahap berikutnya adalah menghubungkan Supabase untuk penyimpanan bersama dan login admin.

## Keamanan
File Excel dikecualikan melalui `.gitignore`. Jangan commit data realisasi ke GitHub.
