# Student Work Submission Platform

Website pengumpulan karya siswa berbasis HTML + Tailwind CSS + Google Apps Script.

---

## Struktur Folder

```
student-work-submission/
  index.html          → Form pengumpulan karya
  gallery.html        → Galeri karya siswa
  script.js           → Logic JavaScript
  apps-script/
    Code.gs           → Backend Google Apps Script
  README.md
```

---

## Cara Deploy

### 1. Siapkan Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com) → buat spreadsheet baru
2. Rename sheet pertama menjadi **`Data Karya`**
3. Tambahkan header di baris pertama:

| No | Nama | Kelas | Judul Karya | Link Project | Deskripsi | Tanggal |

---

### 2. Setup Google Apps Script

1. Di spreadsheet, klik **Extensions → Apps Script**
2. Hapus kode default, paste isi file `apps-script/Code.gs`
3. Klik **Save**
4. Klik **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Klik **Deploy** → copy URL yang muncul

---

### 3. Pasang URL ke script.js

Buka `script.js`, ganti baris ini:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

Ganti `YOUR_SCRIPT_ID` dengan URL deployment kamu.

---

### 4. Jalankan Website

Buka `index.html` di browser, atau host di:
- GitHub Pages
- Netlify
- Vercel (static)

---

## Fitur

- Form pengumpulan karya dengan validasi
- Penyimpanan otomatis ke Google Spreadsheet
- Galeri karya dengan card grid
- Responsif di semua ukuran layar
- Loading state & pesan sukses/error
