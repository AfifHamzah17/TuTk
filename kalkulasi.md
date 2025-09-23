# Dashboard Monitoring Peremajaan Tanaman Kelapa Sawit Tahun 2025

## Deskripsi

Dashboard ini dirancang untuk memantau progress peremajaan tanaman kelapa sawit tahun 2025. Dashboard menampilkan berbagai visualisasi data dan statistik untuk membantu pemantauan dan pengambilan keputusan.

## Fitur

1. **Statistik Cards**: Menampilkan luas tanaman ulang dan progress tanam ulang
2. **Filter Data**: Filter berdasarkan kebun, AFD, dan pencarian
3. **Visualisasi Data**:
   - Bar Chart: Progress per kebun
   - Line Chart: Trend progress
   - Pie Chart: Distribusi progress
   - Radar Chart: Performa per aktivitas
4. **Data Grid**: Tabel detail data dengan kemampuan refresh

## Struktur Data

Data diambil dari Google Sheets melalui API. Berikut adalah struktur data yang digunakan:

### Kolom-kolom Penting

| No | Kolom | Keterangan | Index |
|----|-------|------------|-------|
| 1 | Kebun | Nama kebun | 1 |
| 2 | Paket | Nama paket | 2 |
| 3 | AFD | Nama Afdeling | 3 |
| 4 | Luas Paket | Luas paket dalam hektar | 4 |
| 5 | Ripper Rencana | Rencana Ripper (ha) | 4 |
| 6 | Ripper Realisasi | Realisasi Ripper (ha) | 6 |
| 7 | Luku Rencana | Rencana Luku (ha) | 8 |
| 8 | Luku Realisasi | Realisasi Luku (ha) | 10 |
| 9 | Tumbang/Chipping Rencana | Rencana Tumbang/Chipping (ha) | 12 |
| 10 | Tumbang/Chipping Realisasi | Realisasi Tumbang/Chipping (ha) | 14 |
| 11 | Pembuatan Parit Rencana | Rencana Pembuatan Parit (Mtr) | 16 |
| 12 | Pembuatan Parit Realisasi | Realisasi Pembuatan Parit (Mtr) | 18 |
| 13 | Menanam Mucuna Rencana | Rencana Menanam Mucuna (ha) | 20 |
| 14 | Menanam Mucuna Realisasi | Realisasi Menanam Mucuna (ha) | 22 |
| 15 | Lubang Tanam Rencana | Rencana Lubang Tanam (ha) | 24 |
| 16 | Lubang Tanam Realisasi | Realisasi Lubang Tanam (ha) | 26 |
| 17 | Mempupuk Lobang Rencana | Rencana Mempupuk Lobang (ha) | 28 |
| 18 | Mempupuk Lobang Realisasi | Realisasi Mempupuk Lobang (ha) | 30 |
| 19 | Menanam KS Rencana | Rencana Menanam KS (ha) | 32 |
| 20 | Menanam KS Realisasi | Realisasi Menanam KS (ha) | 34 |
| 21 | LC Rencana | Rencana LC | 37 |
| 22 | LC Realisasi | Realisasi LC | 38 |
| 23 | Tanggal SPPBJ | Tanggal SPPBJ | 35 |

## Perhitungan dan Kalkulasi

### 1. Progress Tanam Ulang (StatCard)

Progress tanam ulang dihitung berdasarkan rata-rata progress dari semua baris data:

```
Progress TU = (LC Realisasi / LC Rencana) × 100
```

Dimana:
- LC Rencana = nilai dari kolom 37 (index 37)
- LC Realisasi = nilai dari kolom 38 (index 38)

### 2. Total Luas Paket (StatCard)

Total luas paket dihitung dengan menjumlahkan semua nilai dari kolom 4:

```
Total Luas Paket = Σ(Luas Paket)
```

### 3. Bar Chart - Progress per Kebun

Bar chart menampilkan rata-rata progress per kebun:

```
Progress per Kebun = Σ(Progress TU per Kebun) / Jumlah AFD per Kebun
```

### 4. Pie Chart - Distribusi Progress

Pie chart mengkategorikan progress menjadi 4 kategori:
- 0-25%
- 26-50%
- 51-75%
- 76-100%

Setiap baris data dikategorikan berdasarkan nilai Progress TU.

### 5. Line Chart - Trend Progress

Line chart menampilkan trend progress untuk 3 kebun teratas selama 7 hari terakhir. Data hari ini menggunakan nilai aktual, sedangkan hari-hari sebelumnya dihitung dengan decrement 2% per hari.

### 6. Radar Chart - Performa per Aktivitas

Radar chart menampilkan rata-rata progress untuk setiap aktivitas:

```
Progress Aktivitas = (Realisasi / Rencana) × 100
```

Aktivitas-aktivitas yang dihitung:

1. **Ripper (ha)**
   - Rencana: kolom 5 (index 4)
   - Realisasi: kolom 7 (index 6)

2. **Luku (ha)**
   - Rencana: kolom 9 (index 8)
   - Realisasi: kolom 11 (index 10)

3. **Tumbang/Chipping (ha)**
   - Rencana: kolom 13 (index 12)
   - Realisasi: kolom 15 (index 14)

4. **Pembuatan Parit (Mtr)**
   - Rencana: kolom 17 (index 16)
   - Realisasi: kolom 19 (index 18)

5. **Menanam Mucuna (ha)**
   - Rencana: kolom 21 (index 20)
   - Realisasi: kolom 23 (index 22)

6. **Lubang Tanam (ha)**
   - Rencana: kolom 25 (index 24)
   - Realisasi: kolom 27 (index 26)

7. **Mempupuk Lobang (ha)**
   - Rencana: kolom 29 (index 28)
   - Realisasi: kolom 31 (index 30)

8. **Menanam KS (ha)**
   - Rencana: kolom 33 (index 32)
   - Realisasi: kolom 35 (index 34)

## Interaksi Chart

### Pie Chart dan Radar Chart

Kedua chart ini memiliki interaksi tambahan:

1. **Hover**: Saat mouse di atas bagian chart, akan muncul tooltip yang menampilkan:
   - Nama kategori/aktivitas
   - Nilai persentase
   - Daftar detail item (kebun, AFD, paket, dan progress masing-masing)

2. **Click**: Saat bagian chart diklik, akan muncul alert yang menampilkan informasi detail yang sama seperti tooltip.

## Filter Data

Dashboard memiliki fitur filter untuk mempersempit data yang ditampilkan:

1. **Filter Kebun**: Menampilkan data hanya untuk kebun yang dipilih
2. **Filter AFD**: Menampilkan data hanya untuk AFD yang dipilih
3. **Filter Pencarian**: Mencari data berdasarkan kata kunci

Filter akan mempengaruhi semua chart dan data grid yang ditampilkan.

## Penyimpanan Data Progress

Dashboard menyimpan data progress hari ini untuk perbandingan dengan hari berikutnya:

1. Data progress hari ini disimpan di localStorage
2. Saat dashboard dimuat ulang, data kemarin diambil dari localStorage
3. Perubahan progress dihitung berdasarkan perbandingan data hari ini dan kemarin

## Teknologi yang Digunakan

- **Frontend**: Vue.js 3 dengan Composition API
- **Chart**: Chart.js
- **Styling**: Tailwind CSS
- **Data Source**: Google Sheets API

## Instalasi dan Penggunaan

1. Clone repository
2. Install dependencies: `npm install`
3. Jalankan development server: `npm run dev`
4. Buka browser dan akses `http://localhost:3000`

## Struktur Folder

```
src/
├── components/          # Komponen Vue
│   ├── StatCard.vue
│   ├── DataGrid.vue
│   ├── BarChart.vue
│   ├── PieChart.vue
│   ├── LineChart.vue
│   └── RadarChart.vue
├── services/           # Service untuk API
│   └── sheetsService.js
├── utils/              # Utility functions
│   └── dateUtils.js
├── App.vue            # Komponen utama
├── main.js            # Entry point
└── assets/            # Assets seperti gambar, css
```

## Kontribusi

1. Fork repository
2. Buat branch baru: `git checkout -b fitur-baru`
3. Commit perubahan: `git commit -m 'Tambah fitur baru'`
4. Push ke branch: `git push origin fitur-baru`
5. Buat Pull Request

## Lisensi

MIT License# Dashboard Monitoring Peremajaan Tanaman Kelapa Sawit Tahun 2025

## Deskripsi

Dashboard ini dirancang untuk memantau progress peremajaan tanaman kelapa sawit tahun 2025. Dashboard menampilkan berbagai visualisasi data dan statistik untuk membantu pemantauan dan pengambilan keputusan.

## Fitur

1. **Statistik Cards**: Menampilkan luas tanaman ulang dan progress tanam ulang
2. **Filter Data**: Filter berdasarkan kebun, AFD, dan pencarian
3. **Visualisasi Data**:
   - Bar Chart: Progress per kebun
   - Line Chart: Trend progress
   - Pie Chart: Distribusi progress
   - Radar Chart: Performa per aktivitas
4. **Data Grid**: Tabel detail data dengan kemampuan refresh

## Struktur Data

Data diambil dari Google Sheets melalui API. Berikut adalah struktur data yang digunakan:

### Kolom-kolom Penting

| No | Kolom | Keterangan | Index |
|----|-------|------------|-------|
| 1 | Kebun | Nama kebun | 1 |
| 2 | Paket | Nama paket | 2 |
| 3 | AFD | Nama Afdeling | 3 |
| 4 | Luas Paket | Luas paket dalam hektar | 4 |
| 5 | Ripper Rencana | Rencana Ripper (ha) | 4 |
| 6 | Ripper Realisasi | Realisasi Ripper (ha) | 6 |
| 7 | Luku Rencana | Rencana Luku (ha) | 8 |
| 8 | Luku Realisasi | Realisasi Luku (ha) | 10 |
| 9 | Tumbang/Chipping Rencana | Rencana Tumbang/Chipping (ha) | 12 |
| 10 | Tumbang/Chipping Realisasi | Realisasi Tumbang/Chipping (ha) | 14 |
| 11 | Pembuatan Parit Rencana | Rencana Pembuatan Parit (Mtr) | 16 |
| 12 | Pembuatan Parit Realisasi | Realisasi Pembuatan Parit (Mtr) | 18 |
| 13 | Menanam Mucuna Rencana | Rencana Menanam Mucuna (ha) | 20 |
| 14 | Menanam Mucuna Realisasi | Realisasi Menanam Mucuna (ha) | 22 |
| 15 | Lubang Tanam Rencana | Rencana Lubang Tanam (ha) | 24 |
| 16 | Lubang Tanam Realisasi | Realisasi Lubang Tanam (ha) | 26 |
| 17 | Mempupuk Lobang Rencana | Rencana Mempupuk Lobang (ha) | 28 |
| 18 | Mempupuk Lobang Realisasi | Realisasi Mempupuk Lobang (ha) | 30 |
| 19 | Menanam KS Rencana | Rencana Menanam KS (ha) | 32 |
| 20 | Menanam KS Realisasi | Realisasi Menanam KS (ha) | 34 |
| 21 | LC Rencana | Rencana LC | 37 |
| 22 | LC Realisasi | Realisasi LC | 38 |
| 23 | Tanggal SPPBJ | Tanggal SPPBJ | 35 |

## Perhitungan dan Kalkulasi

### 1. Progress Tanam Ulang (StatCard)

Progress tanam ulang dihitung berdasarkan rata-rata progress dari semua baris data:

```
Progress TU = (LC Realisasi / LC Rencana) × 100
```

Dimana:
- LC Rencana = nilai dari kolom 37 (index 37)
- LC Realisasi = nilai dari kolom 38 (index 38)

### 2. Total Luas Paket (StatCard)

Total luas paket dihitung dengan menjumlahkan semua nilai dari kolom 4:

```
Total Luas Paket = Σ(Luas Paket)
```

### 3. Bar Chart - Progress per Kebun

Bar chart menampilkan rata-rata progress per kebun:

```
Progress per Kebun = Σ(Progress TU per Kebun) / Jumlah AFD per Kebun
```

### 4. Pie Chart - Distribusi Progress

Pie chart mengkategorikan progress menjadi 4 kategori:
- 0-25%
- 26-50%
- 51-75%
- 76-100%

Setiap baris data dikategorikan berdasarkan nilai Progress TU.

### 5. Line Chart - Trend Progress

Line chart menampilkan trend progress untuk 3 kebun teratas selama 7 hari terakhir. Data hari ini menggunakan nilai aktual, sedangkan hari-hari sebelumnya dihitung dengan decrement 2% per hari.

### 6. Radar Chart - Performa per Aktivitas

Radar chart menampilkan rata-rata progress untuk setiap aktivitas:

```
Progress Aktivitas = (Realisasi / Rencana) × 100
```

Aktivitas-aktivitas yang dihitung:

1. **Ripper (ha)**
   - Rencana: kolom 5 (index 4)
   - Realisasi: kolom 7 (index 6)

2. **Luku (ha)**
   - Rencana: kolom 9 (index 8)
   - Realisasi: kolom 11 (index 10)

3. **Tumbang/Chipping (ha)**
   - Rencana: kolom 13 (index 12)
   - Realisasi: kolom 15 (index 14)

4. **Pembuatan Parit (Mtr)**
   - Rencana: kolom 17 (index 16)
   - Realisasi: kolom 19 (index 18)

5. **Menanam Mucuna (ha)**
   - Rencana: kolom 21 (index 20)
   - Realisasi: kolom 23 (index 22)

6. **Lubang Tanam (ha)**
   - Rencana: kolom 25 (index 24)
   - Realisasi: kolom 27 (index 26)

7. **Mempupuk Lobang (ha)**
   - Rencana: kolom 29 (index 28)
   - Realisasi: kolom 31 (index 30)

8. **Menanam KS (ha)**
   - Rencana: kolom 33 (index 32)
   - Realisasi: kolom 35 (index 34)

## Interaksi Chart

### Pie Chart dan Radar Chart

Kedua chart ini memiliki interaksi tambahan:

1. **Hover**: Saat mouse di atas bagian chart, akan muncul tooltip yang menampilkan:
   - Nama kategori/aktivitas
   - Nilai persentase
   - Daftar detail item (kebun, AFD, paket, dan progress masing-masing)

2. **Click**: Saat bagian chart diklik, akan muncul alert yang menampilkan informasi detail yang sama seperti tooltip.

## Filter Data

Dashboard memiliki fitur filter untuk mempersempit data yang ditampilkan:

1. **Filter Kebun**: Menampilkan data hanya untuk kebun yang dipilih
2. **Filter AFD**: Menampilkan data hanya untuk AFD yang dipilih
3. **Filter Pencarian**: Mencari data berdasarkan kata kunci

Filter akan mempengaruhi semua chart dan data grid yang ditampilkan.

## Penyimpanan Data Progress

Dashboard menyimpan data progress hari ini untuk perbandingan dengan hari berikutnya:

1. Data progress hari ini disimpan di localStorage
2. Saat dashboard dimuat ulang, data kemarin diambil dari localStorage
3. Perubahan progress dihitung berdasarkan perbandingan data hari ini dan kemarin

## Teknologi yang Digunakan

- **Frontend**: Vue.js 3 dengan Composition API
- **Chart**: Chart.js
- **Styling**: Tailwind CSS
- **Data Source**: Google Sheets API

## Instalasi dan Penggunaan

1. Clone repository
2. Install dependencies: `npm install`
3. Jalankan development server: `npm run dev`
4. Buka browser dan akses `http://localhost:3000`

## Struktur Folder

```
src/
├── components/          # Komponen Vue
│   ├── StatCard.vue
│   ├── DataGrid.vue
│   ├── BarChart.vue
│   ├── PieChart.vue
│   ├── LineChart.vue
│   └── RadarChart.vue
├── services/           # Service untuk API
│   └── sheetsService.js
├── utils/              # Utility functions
│   └── dateUtils.js
├── App.vue            # Komponen utama
├── main.js            # Entry point
└── assets/            # Assets seperti gambar, css
```

## Kontribusi

1. Fork repository
2. Buat branch baru: `git checkout -b fitur-baru`
3. Commit perubahan: `git commit -m 'Tambah fitur baru'`
4. Push ke branch: `git push origin fitur-baru`
5. Buat Pull Request

## Lisensi

MIT License