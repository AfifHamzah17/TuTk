# Dashboard Monitoring Tanaman

Dashboard monitoring untuk melacak progress tanaman ulang dan tanaman konversi di perkebunan kelapa sawit. Dashboard ini menampilkan data real-time dari Google Spreadsheet dengan visualisasi yang interaktif dan informatif.

## Fitur
- **Monitoring Real-time**: Data diperbarui langsung dari Google Spreadsheet
- **Statistik Overview**: Menampilkan total luas paket, total LC rencana & realisasi, dan progress rata-rata
- **Filter Data**: Filter berdasarkan kebun, AFD, dan pencarian teks
- **Visualisasi Data**:
  - **Bar Chart**: Progress per kebun
  - **Line Chart**: Trend progress
  - **Pie Chart**: Distribusi progress dengan detail saat hover
  - **Radar Chart**: Performa per aktivitas
  - **Tabel Data Interaktif**: Menampilkan detail data dengan kemampuan scroll horizontal
- **Responsif Design**: Tampilan yang optimal di berbagai ukuran layar
- **Update Otomatis**: Menampilkan tanggal dan waktu real-time

## Teknologi yang Digunakan
- **Framework**: Vue.js 3 dengan Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js dengan vue-chartjs
- **HTTP Client**: Axios
- **Date Processing**: Date-fns
- **Icons**: Heroicons

## Struktur Folder
src/
├── assets/          # Aset statis
│   └── vue.svg
├── components/      # Komponen Vue
│   ├── BarChart.vue          # Komponen untuk grafik batang
│   ├── Card.vue              # Komponen kartu umum
│   ├── DataGrid.vue         # Tabel data utama
│   ├── KebunDetail.vue      # Detail per kebun
│   ├── KebunTable.vue       # Tabel ringkasan kebun
│   ├── LCChart.vue          # Grafik Total LC
│   ├── LineChart.vue        # Grafik garis
│   ├── PieChart.vue        # Grafik pie
│   ├── ProgressBar.vue     # Bar progress
│   ├── ProgressCard.vue    # Kartu progress
│   ├── ProgressChart.vue   # Grafik progress
│   ├── RadarChart.vue      # Grafik radar
│   ├── RawDataTable.vue    # Tabel data mentah
│   ├── StatCard.vue        # Kartu statistik
│   ├── SummaryCard.vue     # Kartu ringkasan
│   └── SummaryTable.vue    # Tabel ringkasan
├── data/            # File data statis
│   └── dashboardData.js
├── services/        # Layanan API
│   └── sheetsService.js    # Layanan untuk Google Sheets
├── utils/           # Fungsi utilitas
│   ├── dataProcessor.js     # Pemrosesan data
│   └── dateUtils.js        # Utilitas tanggal
├── App.vue         # Komponen utama
├── main.js         # Entry point
├── style.css       # CSS global
└── output.css      # CSS yang dihasilkan


## Instalasi

### Prasyarat
- **Node.js** (v14.0.0 atau lebih tinggi)
- **npm** atau **yarn**

### Langkah-langkah
1. **Clone repositori**
   ```bash
   git clone <repository-url>
   cd dashboard-monitoring
    ```
2. **Install dependensi**
  ```bash
    npm install
  ```

3. **Jalankan aplikasi**
```bash
npm run dev
```

4. **Buka browser dan akses http://localhost:5173**

## Penggunaan

### 1. Memahami Dashboard
Dashboard terdiri dari beberapa bagian utama:

- **Header**: Menampilkan judul dashboard, deskripsi, serta tanggal dan waktu real-time.
- **Statistik Cards**: Menampilkan metrik utama seperti total luas paket, total LC rencana dan realisasi, serta progress rata-rata.
- **Filter**: Memfilter data berdasarkan kebun, AFD, atau kata kunci.
- **Charts**: Visualisasi data dalam berbagai bentuk grafik.
- **Data Grid**: Tabel detail yang dapat di-scroll horizontal.

### 2. Menggunakan Filter
- **Filter Kebun**: Pilih kebun spesifik untuk melihat data hanya dari kebun tersebut.
- **Filter AFD**: Pilih AFD spesifik untuk mempersempit data.
- **Pencarian**: Gunakan kotak pencarian untuk mencari data spesifik.
- Klik tombol **"Terapkan Filter"** untuk menerapkan filter.

### 3. Memahami Visualisasi Data
- **Bar Chart** - Progress per Kebun: Menampilkan rata-rata progress untuk setiap kebun. Setiap batang mewakili satu kebun dengan tinggi batang menunjukkan persentase progress.
- **Line Chart** - Trend Progress: Menampilkan tren progress selama 7 hari terakhir untuk 3 kebun teratas. Grafik ini membantu mengidentifikasi apakah progress meningkat atau menurun dari waktu ke waktu.
- **Pie Chart** - Distribusi Progress: Menampilkan distribusi progress dalam kategori:
  - 0-25%
  - 26-50%
  - 51-75%
  - 76-100%
  Saat hover pada setiap bagian pie chart, akan muncul informasi detail tentang:
  - Persentase kategori
  - Jumlah entri dalam kategori tersebut
  - Daftar kebun dan AFD yang termasuk dalam kategori tersebut
- **Radar Chart** - Performa per Aktivitas: Menampilkan performa rata-rata untuk setiap aktivitas seperti:
  - Ripper
  - Luku
  - Tumbang/Chipping
  - Pembuatan Parit
  - Menanam Mucuna
  - Lubang Tanam
  - Menanam KS
  Radar chart ini membantu mengidentifikasi aktivitas mana yang perlu diperhatikan karena progressnya rendah.

### 4. Membaca Data Grid
Tabel menampilkan detail data dengan kolom-kolom berikut:
- **No**: Nomor urut
- **Kebun**: Nama kebun
- **AFD**: Nama AFD
- **Luas Paket (ha)**: Luas area paket
- **Rencana dan Realisasi**: Untuk setiap aktivitas
- **Total LC**: Total LC dengan rencana dan realisasi
- **Tanggal SPPBJ**: Tanggal terbit SPPBJ
- **Hari Kerja**: Jumlah hari kerja (dihitung otomatis dari tanggal SPPBJ hingga hari ini)

## Komponen Utama

### 1. **App.vue**
Komponen utama yang mengatur seluruh aplikasi. Bertanggung jawab untuk:
- Mengambil data dari Google Sheets
- Memproses data untuk statistik
- Mengelola state aplikasi
- Menyusun layout dashboard

### 2. **DataGrid.vue**
Komponen untuk menampilkan data dalam bentuk tabel dengan fitur:
- **Scroll horizontal** untuk melihat semua kolom
- **Sub-grid** untuk setiap aktivitas
- **Progress bar** untuk visualisasi persentase
- **Format angka** sesuai standar Indonesia

### 3. **Komponen Chart**
- **BarChart.vue**: Grafik batang untuk menampilkan progress per kebun.
- **LineChart.vue**: Grafik garis untuk menampilkan tren progress.
- **PieChart.vue**: Grafik pie untuk menampilkan distribusi progress.
- **RadarChart.vue**: Grafik radar untuk menampilkan performa per aktivitas.

### 4. **StatCard.vue**
Komponen untuk menampilkan kartu statistik dengan ikon dan nilai.

### 5. **sheetsService.js**
Layanan untuk mengambil data dari Google Spreadsheet API.

### 6. **dateUtils.js**
Utilitas untuk memproses tanggal:
- `calculateDaysDifference()`: Menghitung selisih hari antara dua tanggal.
- `formatDate()`: Memformat tanggal menjadi format yang lebih mudah dibaca.
- `isValidDateFormat()`: Validasi format tanggal.

## Customisasi

### Menambahkan Kebun atau AFD Baru
Data diambil langsung dari Google Spreadsheet. Untuk menambahkan kebun atau AFD baru:
1. Tambahkan data baru di Google Spreadsheet.
2. Refresh dashboard dengan menekan tombol **"Refresh Data"**.
3. Data baru akan otomatis muncul di dashboard.

### Mengubah Warna Tema
Untuk mengubah warna tema, edit file `src/assets/style.css` dengan mengubah nilai variabel CSS:

```css
:root {
  --primary: #10b981;
  --primary-dark: #059669;
  --secondary: #3b82f6;
  --accent: #8b5cf6;
  --light: #f3f4f6;
  --dark: #1f2937;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
}
```

## Menambahkan Chart Baru

Untuk menambahkan tipe chart baru:

1. **Buat Komponen Chart Baru**
   - Buat komponen chart baru di folder `src/components/`.

2. **Import Komponen di App.vue**
   - Setelah komponen chart baru dibuat, import komponen tersebut ke dalam file `App.vue`.

3. **Tambahkan Komponen ke Charts Section di App.vue**
   - Tambahkan komponen chart baru di bagian **Charts Section** pada `App.vue` untuk menampilkan grafik tersebut.

4. **Siapkan Data untuk Chart Baru**
   - Siapkan data yang diperlukan untuk chart baru di bagian `computed` property pada `App.vue` agar grafik dapat menerima dan memproses data dengan benar.

---

## Troubleshooting

### 1. **Data Tidak Muncul**

Jika data tidak muncul di dashboard, coba langkah-langkah berikut:

- **Periksa Koneksi Internet**: Pastikan koneksi internet Anda stabil.
- **Pastikan Google Spreadsheet Dapat Diakses**: Pastikan Anda memiliki izin akses ke Google Spreadsheet yang digunakan.
- **Periksa Console Browser untuk Error**: Buka developer tools di browser (F12) dan periksa console untuk error yang mungkin terjadi.
- **Periksa Format Data di Spreadsheet**: Pastikan data yang ada di Google Spreadsheet sesuai dengan format yang diharapkan.

### 2. **Format Tanggal Tidak Sesuai**

Jika format tanggal tidak sesuai, lakukan hal berikut:

- **Pastikan Format Tanggal di Spreadsheet adalah MM/DD/YYYY**: Periksa dan pastikan format tanggal yang ada di spreadsheet sesuai dengan format **MM/DD/YYYY**.
- **Periksa Fungsi `calculateDaysDifference` di `src/utils/dateUtils.js`**: Pastikan fungsi ini berfungsi dengan benar untuk menghitung selisih tanggal.
- **Refresh Browser**: Setelah perbaikan, coba refresh halaman browser untuk memastikan perubahan diterapkan.

### 3. **Chart Tidak Muncul**

Jika chart tidak muncul di dashboard, coba langkah-langkah berikut:

- **Periksa Apakah Data Tersedia untuk Chart**: Pastikan data yang dibutuhkan untuk chart sudah tersedia dan terhubung dengan benar.
- **Periksa Console Browser untuk Error Terkait Chart.js**: Periksa console di browser untuk melihat apakah ada error terkait dengan penggunaan Chart.js.
- **Pastikan Semua Dependensi Sudah Terinstall dengan Benar**: Jalankan `npm install` untuk memastikan bahwa semua dependensi telah terpasang dengan benar.

---

## Kontribusi

Untuk berkontribusi pada proyek ini, ikuti langkah-langkah berikut:

1. **Fork Repositori**: Klik tombol "Fork" di halaman repositori untuk membuat salinan pribadi dari repositori ini.
2. **Buat Branch Fitur Baru**: Gunakan perintah berikut untuk membuat branch baru:
```bash
   git checkout -b feature/AmazingFeature
```
3. **Commit Perubahan**: Setelah melakukan perubahan, commit dengan pesan yang sesuai:
```bash
git commit -m 'Add some AmazingFeature'
```

4. **Push ke Branch**: Push perubahan ke branch baru Anda:
```bash
git push origin feature/AmazingFeature
```

5. **Buka Pull Request**: Buka pull request untuk menggabungkan perubahan Anda ke branch utama.

## Lisensi

Proyek ini didistribusikan di bawah [MIT License](https://opensource.org/licenses/MIT). Lihat [LICENSE](LICENSE) untuk informasi lebih lanjut.

## Kontak

Nama Pembuat - [@afifhamzah17] - afifhamzah017@gmail.com

Project Link: https://github.com/AfifHamzah17/TuTk