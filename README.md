

# Dashboard Monitoring Tanaman Kelapa Sawit

Dashboard monitoring komprehensif untuk melacak progress tanaman ulang dan tanaman konversi di perkebunan kelapa sawit. Dashboard ini menampilkan data real-time dari Google Spreadsheet dengan visualisasi yang interaktif dan informatif.

## 🌟 Fitur Utama

### 📊 Monitoring Real-time
- Data diperbarui langsung dari Google Spreadsheet
- Update otomatis setiap detik dengan timestamp real-time
- Indikator perubahan progress harian

### 📈 Statistik Overview
- **Total Luas Paket**: Menampilkan total area dalam hektar (ha)
- **Total LC Rencana & Realisasi**: Monitoring target vs aktual
- **Progress Rata-rata**: Persentase keseluruhan dengan indikator perubahan

### 🔍 Sistem Filtering Canggih
- **Filter Kebun**: Pilih kebun spesifik untuk analisis mendalam
- **Filter Vendor**: Filter berdasarkan vendor/paket
- **Filter Kombinasi**: Gabungkan multiple filter untuk analisis presisi
- **Pencarian Teks**: Cari data spesifik dengan keyword

### 📊 Visualisasi Data Interaktif

#### 📊 Bar Chart - Progress per Kebun
- Menampilkan rata-rata progress untuk setiap kebun
- Tooltip interaktif dengan detail luas paket dan persentase
- Responsive design yang menyesuaikan ukuran layar

#### 🥧 Pie Chart dengan Needle (Gauge Chart)
- Menampilkan distribusi progress dengan visualisasi jarum penunjuk
- Indikator visual yang intuitif untuk pencapaian target

#### 🥧 Pie Chart - Distribusi Progress
- Kategori progress: 0-25%, 26-50%, 51-75%, 76-100%
- Tooltip detail dengan daftar kebun per kategori
- Visualisasi proporsional yang mudah dipahami

#### 🕸️ Radar Chart - Performa per Aktivitas
Monitoring detail untuk setiap aktivitas:
- Ripper (ha)
- Luku (ha)
- Tumbang/Chipping (ha)
- Menanam Mucuna (ha)
- Lubang Tanam (ha)
- Mempupuk Lubang (ha)
- Menanam KS (ha)

### 📋 Tabel Data Interaktif
- **Scroll Horizontal**: Untuk melihat semua kolom data
- **Progress Bar**: Visualisasi persentase dalam bar
- **Format Angka Indonesia**: Sesuai standar lokal
- **Fitur Pencarian**: Cari data spesifik dalam tabel
- **Fitur Ekspor**: Download data untuk analisis offline

## 🛠️ Teknologi yang Digunakan

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Vue.js** | 3.5.18 | Framework JavaScript dengan Composition API |
| **Vite** | 7.1.2 | Build tool yang cepat dan modern |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Chart.js** | 4.5.0 | Library untuk visualisasi data |
| **vue-chartjs** | 5.3.2 | Wrapper Chart.js untuk Vue |
| **Axios** | 1.12.2 | HTTP client untuk API requests |
| **Date-fns** | 4.1.0 | Library untuk manipulasi tanggal |
| **XLSX** | 0.18.5 | Library untuk export Excel |

## 📁 Struktur Folder

```
src/
├── assets/                  # Aset statis
│       vue.svg             # Logo Vue
├── components/              # Komponen Vue
│       BarChart.vue        # Grafik batang progress kebun
│       DataGrid.vue        # Tabel data utama dengan scroll
│       LineChart.vue       # Grafik garis trend
│       PieChart.vue        # Grafik pie distribusi
│       PieChartWithNeedle.vue # Grafik gauge dengan jarum
│       ProgressItem.vue    # Komponen item progress
│       RadarChart.vue      # Grafik radar performa aktivitas
│       RawDataTable.vue    # Tabel data mentah
│       StatCard.vue        # Kartu statistik dengan animasi
├── data/                   # File data statis
│       dashboardData.js    # Data sample untuk development
│       rantai.json         # Data mapping kodering
├── services/               # Layanan API
│       sheetsService.js    # Integrasi Google Sheets API
├── utils/                  # Fungsi utilitas
│       dataProcessor.js    # Pemrosesan dan transformasi data
│       dateUtils.js        # Utilitas manipulasi tanggal
│       exportUtils.js      # Utilitas ekspor data
├── App.vue                 # Komponen utama aplikasi
├── main.js                 # Entry point aplikasi
├── style.css               # CSS global dan custom
└── output.css              # CSS yang di-generate Tailwind
```

## 🚀 Instalasi & Setup

### Prasyarat
- **Node.js** (v14.0.0 atau lebih tinggi)
- **npm** atau **yarn**
- **Git**

### Langkah Instalasi

1. **Clone Repositori**
   ```bash
   git clone https://github.com/AfifHamzah17/TuTk.git
   cd dashboard-monitoring
   ```

2. **Install Dependensi**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Konfigurasi Environment**
   ```bash
   # Buat file .env
   cp .env.example .env
   # Edit file .env dengan konfigurasi Google Sheets API
   ```

4. **Jalankan Aplikasi**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Build untuk Production**
   ```bash
   npm run build
   # atau
   yarn build
   ```

6. **Preview Production Build**
   ```bash
   npm run preview
   # atau
   yarn preview
   ```

## 📖 Panduan Penggunaan

### 1. Memahami Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    HEADER SECTION                           │
│  Judul Dashboard | Deskripsi | Tanggal & Waktu Real-time    │
├─────────────────────────────────────────────────────────────┤
│                  STATISTICS CARDS                           │
│  [Luas Paket] [Progress Tanam Ulang] [Filter Toggle]       │
├─────────────────────────────────────────────────────────────┤
│                    FILTER SECTION                           │
│  [Kebun ▼] [Vendor ▼] [Search] [Apply] [Reset]            │
├─────────────────────────────────────────────────────────────┤
│                     CHARTS SECTION                         │
│  [Bar Chart] [Pie Chart with Needle]                       │
│  [Pie Chart] [Radar Chart]                                 │
├─────────────────────────────────────────────────────────────┤
│                    DATA TABLE SECTION                       │
│  [Search] [Export] [Refresh]                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Scrollable Data Table                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2. Menggunakan Filter

#### Filter Kebun
- Klik dropdown "Filter Kebun"
- Pilih satu atau多个 kebun
- Statistik dan chart akan update otomatis

#### Filter Vendor
- Klik dropdown "Filter Vendor"
- Pilih vendor untuk melihat progress per paket
- Cocok untuk monitoring vendor management

#### Filter Kombinasi
- Gunakan filter kebun dan vendor bersamaan
- Hasil akan menampilkan data yang sesuai dengan kedua filter

### 3. Membaca Visualisasi Data

#### Bar Chart Interpretation
- **Height**: Persentase progress
- **Color**: Indikator status (hijau=baik, kuning=warning, merah=critical)
- **Hover**: Detail tooltip dengan informasi lengkap

#### Pie Chart dengan Needle
- **Jarum**: Menunjukkan rata-rata progress keseluruhan
- **Segmen**: Distribusi progress per kategori
- **Hover**: Detail persentase untuk setiap segmen

#### Pie Chart Breakdown
- **Segments**: Kategori progress
- **Size**: Proporsi data per kategori
- **Hover**: Detail item dalam kategori

#### Radar Chart Performance
- **Axes**: 7 aktivitas utama (tanpa Pembuatan Parit)
- **Shape**: Pola performa keseluruhan
- **Area**: Luas area menunjukkan performa kumulatif
- **Spikes**: Identifikasi aktivitas yang perlu perhatian

### 4. Navigasi Tabel Data

#### Horizontal Scroll
```javascript
// Scroll untuk melihat semua kolom
.data-grid {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
```

#### Export Data
- Klik tombol "Export to Excel"
- Data akan di-download dalam format .xlsx
- Include semua filter yang aktif

## 🎨 Customization

### Menambahkan Kebun Baru

1. **Di Google Spreadsheet**
   - Tambahkan baris data baru
   - Pastikan format konsisten
   - Include semua kolom required

2. **Di Mapping Kodering** (`src/data/rantai.json`)
   ```json
   {
     "Kebun": "NAMA_KEBUN_BARU",
     "Kodering": "KODE_BARU"
   }
   ```

3. **Refresh Dashboard**
   - Data baru akan otomatis muncul
   - Filter akan update dengan kebun baru

### Mengubah Warna Tema

Edit `src/assets/style.css`:

```css
:root {
  --primary: #10b981;        /* Warna utama */
  --primary-dark: #059669;   /* Warna utama gelap */
  --secondary: #3b82f6;      /* Warna sekunder */
  --accent: #8b5cf6;         /* Warna aksen */
  --success: #10b981;        /* Warna sukses */
  --warning: #f59e0b;        /* Warna peringatan */
  --danger: #ef4444;         /* Warna bahaya */
  --light: #f3f4f6;          /* Warna background */
  --dark: #1f2937;           /* Warna teks gelap */
}
```

### Menambah Chart Baru

1. **Buat Komponen Chart**
   ```vue
   <!-- src/components/NewChart.vue -->
   <template>
     <div class="chart-container">
       <canvas ref="chartCanvas"></canvas>
     </div>
   </template>
   
   <script>
   import { Chart, registerables } from 'chart.js';
   
   export default {
     name: 'NewChart',
     props: ['data'],
     mounted() {
       Chart.register(...registerables);
       // Chart initialization logic
     }
   }
   </script>
   ```

2. **Import di App.vue**
   ```javascript
   import NewChart from './components/NewChart.vue';
   ```

3. **Tambahkan ke Template**
   ```vue
   <template>
     <div class="charts-section">
       <NewChart :data="chartData" />
     </div>
   </template>
   ```

4. **Prepare Data**
   ```javascript
   computed: {
     chartData() {
       // Data preparation logic
       return processedData;
     }
   }
   ```

### Konfigurasi Google Sheets API

1. **Enable Google Sheets API**
   - Go to Google Cloud Console
   - Enable Sheets API
   - Create credentials

2. **Share Spreadsheet**
   - Share dengan service account email
   - Set permission ke "Viewer"

3. **Update Service Configuration**
   ```javascript
   // src/services/sheetsService.js
   const API_KEY = 'YOUR_API_KEY';
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';
   ```

## 🔧 Troubleshooting

### Data Tidak Muncul

| Symptom | Possible Cause | Solution |
|---------|----------------|----------|
| Loading spinner terus berputar | Koneksi internet tidak stabil | Check koneksi dan refresh |
| Error 403 di console | API key invalid atau expired | Regenerate API key |
| Empty table | Spreadsheet tidak accessible | Check sharing permissions |

### Format Tanggal Tidak Sesuai

```javascript
// Expected format: MM/DD/YYYY
// Check src/utils/dateUtils.js
function isValidDateFormat(dateString) {
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  return regex.test(dateString);
}
```

### Chart Tidak Render

1. **Check Data Availability**
   ```javascript
   // Ensure data exists before rendering
   if (!chartData || chartData.length === 0) {
     console.error('No data available for chart');
     return;
   }
   ```

2. **Check Chart.js Registration**
   ```javascript
   import { Chart, registerables } from 'chart.js';
   Chart.register(...registerables);
   ```

3. **Check Canvas Element**
   ```javascript
   // Ensure canvas is mounted
   this.$nextTick(() => {
     const ctx = this.$refs.chartCanvas.getContext('2d');
     // Initialize chart
   });
   ```

### Performance Issues

1. **Implement Virtual Scrolling**
   ```vue
   <template>
     <RecycleScroller
       class="scroller"
       :items="items"
       :item-size="50"
       key-field="id"
       v-slot="{ item }"
     >
       <!-- Row content -->
     </RecycleScroller>
   </template>
   ```

2. **Debounce Search**
   ```javascript
   import { debounce } from 'lodash';
   
   methods: {
     search: debounce(function(query) {
       // Search logic
     }, 300)
   }
   ```

## 🤝 Kontribusi

Kami welcome kontribusi dari komunitas! Berikut cara berkontribusi:

### Development Workflow

1. **Fork Repository**
   ```bash
   # Fork di GitHub, then clone
   git clone https://github.com/USERNAME/TuTk.git
   cd TuTk
   ```

2. **Setup Development Environment**
   ```bash
   npm install
   npm run dev
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/nama-fitur-baru
   ```

4. **Make Changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

5. **Commit Changes**
   ```bash
   git commit -m "feat: tambah fitur baru untuk monitoring vendor"
   ```

6. **Push and Create PR**
   ```bash
   git push origin feature/nama-fitur-baru
   # Create Pull Request di GitHub
   ```

### Code Style Guidelines

- Use Vue 3 Composition API
- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update README for new features

### Issue Reporting

When reporting bugs, please include:
- Environment details (OS, browser)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console errors

## 📄 Lisensi

Proyek ini dilisensikan under [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 Afif Hamzah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 📞 Kontak

- **Developer**: Afif Hamzah
- **Email**: afifhamzah017@gmail.com
- **GitHub**: [@afifhamzah17](https://github.com/afifhamzah17)
- **LinkedIn**: [@afifhamzah17](https://www.linkedin.com/in/afifhamzah17)
- **Project**: https://github.com/AfifHamzah17/TuTk.git 

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Google Sheets API](https://developers.google.com/sheets/api) - Data source integration

---

**Made with ❤️ for Palm Oil Industry**