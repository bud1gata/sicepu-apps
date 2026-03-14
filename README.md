# SICEPU - Sistem Informasi Pengumuman Kelulusan Digital

Aplikasi ringan, cepat, dan modern berbasis website untuk pengumuman kelulusan siswa sekolah. Aplikasi ini didesain menggunakan pendekatan **Vanilla JS + Vanilla CSS** di atas **Vite** agar menghasilkan performa yang maksimal dan tahan banting saat diakses oleh banyak siswa secara serentak (spike-traffic).

## 🚀 Fitur Utama
- **Tampilan Elegan**: Menggunakan konsep *Dark Mode* dan *Glassmorphism* yang terlihat futuristik dan premium.
- **Waktu Hitung Mundur (Countdown)**: Siswa hanya dapat mengecek hasil jika waktu pengumuman yang ditentukan telah tiba.
- **Pencarian Cepat**: Menggunakan verifikasi *NISN* dan *Tanggal Lahir*.
- **Cetak SKL Langsung (PDF)**: Siswa yang lulus dapat langsung mengunduh Surat Keterangan Lulus dalam format PDF beserta QR Code untuk verifikasi.
- **Panel Admin Instan**: Admin dapat dengan mudah mengunggah (upload) data terbaru melalui file berformat **.CSV**.

## 🛠️ Tech Stack
- **Framework & Build Tool:** Vite + Vanilla Javascript
- **Styling:** Vanilla CSS (CSS Variables untuk Design System)
- **Icons:** Lucide Icons
- **PDF Generation:** jsPDF & html2canvas
- **QR Code:** qrcode
- **Data Parsing:** PapaParse (untuk membaca CSV)

---

## 💻 Cara Instalasi & Menjalankan (Local Development)

Mengingat menggunakan Vite, cara menjalankan project ini sangat mudah:

1. **Pastikan sudah menginstal Node.js** di perangkat Anda.
2. Buka terminal di dalam folder project (SICEPU).
3. Jalankan perintah instalasi dependensi (hanya perlu sekali):
   ```bash
   npm install
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```
5. Akses aplikasi melalui URL yang tertera di terminal (biasanya `http://localhost:5173`).

---

## 📖 Cara Penggunaan

Aplikasi ini dibagi menjadi 2 sisi: Bagian **Siswa** dan Bagian **Admin**.

### 1. Bagi Siswa (Halaman Utama)
1. Akses halaman utama. Anda akan melihat **Countdown Timer**. 
2. Jika waktu pengumuman sudah tiba, tombol **CEK KELULUSAN SEKARANG** akan bisa diklik.
3. Masukkan **NISN** dan **Tanggal Lahir** yang sesuai.
4. Tunggu sesaat. Jika lulus, siswa akan diarahkan ke halaman hasil kelulusan hijau (Terdapat tombol download cetak SKL PDF). Jika tidak lulus, siswa akan diarahkan ke halaman bernuansa merah dengan pesan suportif.

> **Catatan Uji Coba (Bila belum ada data admin):** 
> Sistem memiliki *dummy logic*. Jika angka terakhir NISN adalah angka **genap**, maka status LULUS. Bila **ganjil**, maka TIDAK LULUS.

### 2. Bagi Admin (Panel & Upload CSV)
Admin dapat memperbarui data menggunakan **File .CSV (*Comma Separated Values*)** . Format ini sangat mudah, ringan, dan dapat di-*export* langsung dari Microsoft Excel atau Google Sheets.

#### **Akses Panel Admin**
1. Buka halaman admin melalui URL: `http://localhost:5173/admin/login.html`
2. Klik tombol masuk untuk melihat **Dashboard**.
3. Pilih menu **Upload Data** dari sidebar.

#### **Cara Upload Data (.CSV)**
1. Klik tombol **Download Template CSV** pada halaman tersebut untuk mendapatkan contoh struktur file yang benar.
2. Isi data sesuai kolom di aplikasi seperti Microsoft Excel:
   - `NISN`
   - `Nama Siswa`
   - `Tanggal Lahir` (Format YYYY-MM-DD sangat dianjurkan)
   - `Kelas`
   - `B. Indonesia`
   - `Matematika`
   - `B. Inggris`
   - `Status` (Isi dengan: LULUS atau TIDAK LULUS)
3. Masukkan / Seret (*Drag & Drop*) file `.CSV` ke dalam kotak unggah.
4. Cek bagian **Preview Data** di bawah untuk memastikan kolom terbaca dengan benar.
5. Jika sudah sesuai, klik tombol **Simpan ke Database**.
6. Data siap diakses oleh siswa melalui fitur pencarian (`search.html`)!

---
*© 2026 SICEPU v1.0 - Build with dedication by bud1gata and friends AI, xixixixi*
