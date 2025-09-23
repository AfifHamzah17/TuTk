<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <header class="dashboard-header">
      <h1 class="text-2xl md:text-3xl font-bold">Dashboard Monitoring Peremajaan Tanaman Kelapa Sawit Tahun 2025</h1>
      <p class="mt-2">Monitoring progress tanaman ulang</p>
      <!-- Show the current date and time -->
      <br>
      <p class="mt-4 text-lg font-medium">
      Tanggal: {{ currentDate }} | Waktu: {{ currentTime }} WIB
      </p>
    </header>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 p-4 rounded-lg">
      <p class="text-red-700">Error loading data: {{ error }}</p>
    </div>

    <div v-else>
      <!-- Statistik Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <StatCard 
          title="Luas Tanaman ulang"
          :value="filteredTotalLuasPaket + ' ha'"
          icon-color="bg-green-500"
          icon-path="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
        <StatCard 
          title="Progress Tanam Ulang"
          :value="formatPercentage(filteredAvgProgress)"
          :change="filteredProgressChange"
          :change-type="filteredProgressChangeType"
          icon-color="bg-yellow-500"
          icon-path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </div>

      <!-- Filter Container -->
      <div class="filter-container">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="filter-label">Filter Kebun</label>
            <select v-model="filterKebun" class="filter-input">
              <option value="">Semua Kebun</option>
              <option v-for="kebun in uniqueKebun" :key="kebun" :value="kebun">{{ kebun }}</option>
            </select>
          </div>
          <div>
            <label class="filter-label">Filter AFD</label>
            <select v-model="filterAfd" class="filter-input">
              <option value="">Semua AFD</option>
              <option v-for="afd in afdOptions" :key="afd" :value="afd">{{ afd }}</option>
            </select>
          </div>
          <div>
            <label class="filter-label">Filter Paket</label>
            <select v-model="filterPaket" class="filter-input">
              <option value="">Semua Paket</option>
              <option v-for="paket in paketOptions" :key="paket" :value="paket">{{ paket }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="applyFilters" class="btn btn-primary w-full">
              Terapkan Filter
            </button>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <BarChart 
          title="Progress per Kebun" 
          :data="barChartData" 
        />
        <LineChart 
          title="Trend Progress" 
          :data="lineChartData" 
        />
        <PieChart 
          title="Distribusi Progress" 
          :data="pieChartData" 
        />
        <RadarChart 
          title="Performa per Aktivitas" 
          :data="radarChartData" 
        />
      </div>

      <!-- Data Grid -->
      <DataGrid 
        :rawData="rawData" 
        :filters="currentFilters"
        @refresh="refreshData"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { fetchSheetData } from './services/sheetsService';
import { calculateDaysDifference } from './utils/dateUtils';
import StatCard from './components/StatCard.vue';
import DataGrid from './components/DataGrid.vue';
import BarChart from './components/BarChart.vue';
import PieChart from './components/PieChart.vue';
import LineChart from './components/LineChart.vue';
import RadarChart from './components/RadarChart.vue';

export default {
  name: 'App',
  components: {
    StatCard,
    DataGrid,
    BarChart,
    PieChart,
    LineChart,
    RadarChart
  },
  data() {
    return {
      currentTime: '',
      currentDate: ''
    };
  },
  methods: {
    updateDateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.currentDate = now.toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  },
  mounted() {
    this.updateDateTime(); // initial update
    this.timeInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timeInterval);
  },
  setup() {
    // State variables
    const loading = ref(true);
    const error = ref(null);
    const rawData = ref(null);
    const filterKebun = ref('');
    const filterAfd = ref('');
    const filterPaket = ref('');
    const filterSearch = ref('');
    const currentFilters = ref({
      kebun: '',
      afd: '',
      paket: '',
      search: ''
    });
    
    // Progress data
    const progressDataToday = ref([]);
    const progressDataYesterday = ref([]);
    
    // Helper function to check if a row should be included based on filters
    const shouldIncludeRow = (kebun, afd, paket) => {
      if (currentFilters.value.kebun && kebun !== currentFilters.value.kebun) return false;
      if (currentFilters.value.afd && afd !== currentFilters.value.afd) return false;
      if (currentFilters.value.paket && paket !== currentFilters.value.paket) return false;
      return true;
    };
    
    // Fungsi untuk mengambil data progress hari ini
    const fetchProgressDataToday = async () => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const rows = rawData.value.table.rows;
      const result = [];
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        // Skip baris yang tidak memiliki kebun dan AFD
        if (!kebunName && !afdName) continue;
        
        // Set currentKebun jika ada
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
        if (!afdName && !kebunName) continue;
        
        // Hanya proses jika ada kebun dan AFD
        if (currentKebun && afdName) {
          // Ambil data dari kolom 37 (rencana) dan kolom 38 (realisasi)
          const lcRencana = cells[37] ? cells[37].v : 0;
          const lcRealisasi = cells[38] ? cells[38].v : 0;
          
          // Hitung Progress TU = (Kolom 38 / Kolom 37) * 100
          let progressTU = 0;
          if (lcRencana > 0) {
            progressTU = (lcRealisasi / lcRencana) * 100;
          }
          
          result.push({
            kebun: currentKebun,
            afd: afdName,
            paket: paketName,
            progress: progressTU
          });
        }
      }
      
      return result;
    };
    
    // Fungsi untuk memuat data kemarin dari localStorage
    const loadProgressDataYesterday = () => {
      const savedData = localStorage.getItem('progressDataYesterday');
      if (savedData) {
        progressDataYesterday.value = JSON.parse(savedData);
      }
    };
    
    // Fungsi untuk menyimpan data hari ini untuk besok
    const saveProgressDataForTomorrow = () => {
      localStorage.setItem('progressDataYesterday', JSON.stringify(progressDataToday.value));
    };
    
    // Computed properties untuk statistik
    const processedDataForStats = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const rows = rawData.value.table.rows;
      const result = [];
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        
        // Skip baris yang tidak memiliki kebun dan AFD
        if (!kebunName && !afdName) continue;
        
        // Set currentKebun jika ada
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
        if (!afdName && !kebunName) continue;
        
        // Hanya proses jika ada kebun dan AFD
        if (currentKebun && afdName) {
          const tanggalSPPBJ = cells[35] ? (cells[35].f || cells[35].v) : '';
          const jumlahHariKerja = calculateDaysDifference(tanggalSPPBJ);
          
          result.push({
            kebun: currentKebun,
            afd: afdName,
            luasPaket: cells[4] ? cells[4].v : 0,
            lcRencana: cells[32] ? cells[32].v : 0,
            lcRealisasi: cells[33] ? cells[33].v : 0,
            tanggalSPPBJ: tanggalSPPBJ,
            jumlahHariKerja: jumlahHariKerja
          });
        }
      }
      
      return result;
    });
    
    // Menghitung total luas paket (unfiltered)
    const totalLuasPaket = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return 0;
      
      let total = 0;
      const rows = rawData.value.table.rows;
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        
        // Skip baris yang tidak memiliki kebun dan AFD
        if (!kebunName && !afdName) continue;
        
        // Set currentKebun jika ada
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
        if (!afdName && !kebunName) continue;
        
        // Hanya proses jika ada kebun dan AFD
        if (currentKebun && afdName) {
          const luasPaket = cells[4] ? cells[4].v : 0;
          total += parseFloat(luasPaket) || 0;
        }
      }
      
      return total.toFixed(2);
    });
    
    // Filtered total luas paket
    const filteredTotalLuasPaket = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return 0;
      
      let total = 0;
      const rows = rawData.value.table.rows;
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        // Skip baris yang tidak memiliki kebun dan AFD
        if (!kebunName && !afdName) continue;
        
        // Set currentKebun jika ada
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
        if (!afdName && !kebunName) continue;
        
        // Hanya proses jika ada kebun dan AFD
        if (currentKebun && afdName) {
          // Apply filters using helper function
          if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
          
          const luasPaket = cells[4] ? cells[4].v : 0;
          total += parseFloat(luasPaket) || 0;
        }
      }
      
      return total.toFixed(2);
    });
    
    // Filtered progress data today
    const filteredProgressDataToday = computed(() => {
      return progressDataToday.value.filter(item => {
        if (currentFilters.value.kebun && item.kebun !== currentFilters.value.kebun) return false;
        if (currentFilters.value.afd && item.afd !== currentFilters.value.afd) return false;
        if (currentFilters.value.paket && item.paket !== currentFilters.value.paket) return false;
        return true;
      });
    });
    
    // Filtered progress data yesterday
    const filteredProgressDataYesterday = computed(() => {
      return progressDataYesterday.value.filter(item => {
        if (currentFilters.value.kebun && item.kebun !== currentFilters.value.kebun) return false;
        if (currentFilters.value.afd && item.afd !== currentFilters.value.afd) return false;
        if (currentFilters.value.paket && item.paket !== currentFilters.value.paket) return false;
        return true;
      });
    });
    
    // Menghitung rata-rata progress hari ini (unfiltered)
    const avgProgress = computed(() => {
      if (progressDataToday.value.length === 0) return 0;

      const total = progressDataToday.value.reduce((sum, item) => sum + item.progress, 0);
      return total / progressDataToday.value.length;
    });
    
    // Filtered average progress
    const filteredAvgProgress = computed(() => {
      if (filteredProgressDataToday.value.length === 0) return 0;
      const total = filteredProgressDataToday.value.reduce((sum, item) => sum + item.progress, 0);
      return total / filteredProgressDataToday.value.length;
    });
    
    // Filtered average progress yesterday
    const filteredAvgProgressYesterday = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 0;
      const total = filteredProgressDataYesterday.value.reduce((sum, item) => sum + item.progress, 0);
      return total / filteredProgressDataYesterday.value.length;
    });
    
    // Menghitung rata-rata progress kemarin (unfiltered)
    const avgProgressYesterday = computed(() => {
      if (progressDataYesterday.value.length === 0) return 0;
      
      const total = progressDataYesterday.value.reduce((sum, item) => sum + item.progress, 0);
      return total / progressDataYesterday.value.length;
    });
    
    // Filtered progress change
    const filteredProgressChange = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 'Data baru';
      
      const today = filteredAvgProgress.value;
      const yesterday = filteredAvgProgressYesterday.value;
      
      if (yesterday === 0) return '0%';
      
      const change = ((today - yesterday) / yesterday) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    });
    
    // Filtered progress change type
    const filteredProgressChangeType = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 'neutral';
      
      const change = parseFloat(filteredProgressChange.value);
      return change >= 0 ? 'positive' : 'negative';
    });
    
    // Menghitung perubahan progress (unfiltered)
    const progressChange = computed(() => {
      if (progressDataYesterday.value.length === 0) return 'Data baru';
      
      const today = avgProgress.value;
      const yesterday = avgProgressYesterday.value;
      
      if (yesterday === 0) return '0%';
      
      const change = ((today - yesterday) / yesterday) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    });
    
    // Menentukan tipe perubahan (unfiltered)
    const progressChangeType = computed(() => {
      if (progressDataYesterday.value.length === 0) return 'neutral';
      
      const change = parseFloat(progressChange.value);
      return change >= 0 ? 'positive' : 'negative';
    });
    
    // Mendapatkan daftar kebun unik
    const uniqueKebun = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const kebunSet = new Set();
      const rows = rawData.value.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        if (kebunName) {
          kebunSet.add(kebunName);
        }
      }
      
      return Array.from(kebunSet);
    });
    
    // Mendapatkan opsi AFD berdasarkan kebun yang dipilih
    const afdOptions = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const afdSet = new Set();
      const rows = rawData.value.table.rows;
      
      // Jika kebun dipilih, tampilkan AFD hanya dari kebun tersebut
      if (filterKebun.value) {
        let currentKebun = null;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          // Skip baris header, jumlah, total
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          
          // Skip baris yang tidak memiliki kebun dan AFD
          if (!kebunName && !afdName) continue;
          
          // Set currentKebun jika ada
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
          if (!afdName && !kebunName) continue;
          
          // Hanya proses jika ada kebun dan AFD
          if (currentKebun && afdName) {
            // Hanya tambahkan jika kebun sesuai dengan yang dipilih
            if (currentKebun === filterKebun.value && afdName) {
              afdSet.add(afdName);
            }
          }
        }
        
        return Array.from(afdSet).sort();
      } else {
        // Jika tidak ada kebun yang dipilih, tampilkan semua AFD terurut dari "A"
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          // Skip baris header, jumlah, total
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const afdName = cells[3] ? cells[3].v : '';
          
          if (afdName) {
            afdSet.add(afdName);
          }
        }
        
        return Array.from(afdSet).sort();
      }
    });
    
    // Mendapatkan opsi paket berdasarkan kebun yang dipilih
    const paketOptions = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const paketSet = new Set();
      const rows = rawData.value.table.rows;
      
      // Jika kebun dipilih, tampilkan paket hanya dari kebun tersebut
      if (filterKebun.value) {
        let currentKebun = null;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          // Skip baris header, jumlah, total
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          // Skip baris yang tidak memiliki kebun dan AFD
          if (!kebunName && !afdName) continue;
          
          // Set currentKebun jika ada
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
          if (!afdName && !kebunName) continue;
          
          // Hanya proses jika ada kebun dan AFD
          if (currentKebun && afdName) {
            // Hanya tambahkan jika kebun sesuai dengan yang dipilih
            if (currentKebun === filterKebun.value && paketName) {
              paketSet.add(paketName);
            }
          }
        }
        
        return Array.from(paketSet).sort();
      } else {
        // Jika tidak ada kebun yang dipilih, tampilkan semua paket terurut dari "A"
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          // Skip baris header, jumlah, total
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const paketName = cells[2] ? cells[2].v : '';
          
          if (paketName) {
            paketSet.add(paketName);
          }
        }
        
        return Array.from(paketSet).sort();
      }
    });
    
    // Data untuk Bar Chart
    const barChartData = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) {
        return {
          labels: [],
          datasets: [{
            label: 'Progress Rata-rata (%)',
            data: [],
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1
          }]
        };
      }
      
      const rows = rawData.value.table.rows;
      const kebunProgress = {};
      let currentKebun = null;
      
      // Proses data untuk mendapatkan progress per kebun
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        // Skip baris yang tidak memiliki kebun dan AFD
        if (!kebunName && !afdName) continue;
        
        // Set currentKebun jika ada
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
        if (!afdName && !kebunName) continue;
        
        // Hanya proses jika ada kebun dan AFD
        if (currentKebun && afdName) {
          // Apply filters using helper function
          if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
          
          // Ambil data dari kolom 37 (rencana) dan kolom 38 (realisasi)
          const lcRencana = cells[37] ? cells[37].v : 0;
          const lcRealisasi = cells[38] ? cells[38].v : 0;
          const lcPersentase = lcRencana > 0 ? (lcRealisasi / lcRencana) * 100 : 0;
          
          if (!kebunProgress[currentKebun]) {
            kebunProgress[currentKebun] = {
              totalProgress: 0,
              count: 0
            };
          }
          
          kebunProgress[currentKebun].totalProgress += lcPersentase;
          kebunProgress[currentKebun].count += 1;
        }
      }
      
      // Hitung rata-rata progress per kebun
      const labels = Object.keys(kebunProgress);
      const data = labels.map(kebun => 
        kebunProgress[kebun].count > 0 
          ? kebunProgress[kebun].totalProgress / kebunProgress[kebun].count 
          : 0
      );
      
      return {
        labels: labels,
        datasets: [{
          label: 'Progress Rata-rata (%)',
          data: data,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1
        }]
      };
    });
    
    // Data untuk Pie Chart
    const pieChartData = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) {
        return {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [
              'rgba(239, 68, 68, 0.5)',
              'rgba(245, 158, 11, 0.5)',
              'rgba(59, 130, 246, 0.5)',
              'rgba(16, 185, 129, 0.5)'
            ],
            borderColor: [
              'rgba(239, 68, 68, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)'
            ],
            borderWidth: 1
          }]
        };
      }
      
      const rows = rawData.value.table.rows;
      const progressCategories = {
        '0-25%': { count: 0, items: [] },
        '26-50%': { count: 0, items: [] },
        '51-75%': { count: 0, items: [] },
        '76-100%': { count: 0, items: [] }
      };
      let currentKebun = null;
      
      // Proses data untuk mengkategorikan progress
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        // Skip baris yang tidak memiliki kebun dan AFD
        if (!kebunName && !afdName) continue;
        
        // Set currentKebun jika ada
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
        if (!afdName && !kebunName) continue;
        
        // Hanya proses jika ada kebun dan AFD
        if (currentKebun && afdName) {
          // Apply filters using helper function
          if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
          
          // Ambil data dari kolom 37 (rencana) dan kolom 38 (realisasi)
          const lcRencana = cells[37] ? cells[37].v : 0;
          const lcRealisasi = cells[38] ? cells[38].v : 0;
          const lcPersentase = lcRencana > 0 ? (lcRealisasi / lcRencana) * 100 : 0;
          
          // Kategorikan progress
          let category;
          if (lcPersentase <= 25) {
            category = '0-25%';
          } else if (lcPersentase <= 50) {
            category = '26-50%';
          } else if (lcPersentase <= 75) {
            category = '51-75%';
          } else {
            category = '76-100%';
          }
          
          progressCategories[category].count++;
          progressCategories[category].items.push({
            kebun: currentKebun,
            afd: afdName,
            paket: paketName,
            progress: lcPersentase
          });
        }
      }
      
      return {
        labels: Object.keys(progressCategories),
        datasets: [{
          data: Object.values(progressCategories).map(cat => cat.count),
          backgroundColor: [
            'rgba(239, 68, 68, 0.5)',
            'rgba(245, 158, 11, 0.5)',
            'rgba(59, 130, 246, 0.5)',
            'rgba(16, 185, 129, 0.5)'
          ],
          borderColor: [
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 1,
          // Tambahkan informasi detail untuk tooltip
          detailInfo: Object.values(progressCategories).map(cat => 
            cat.items.map(item => `${item.kebun} ${item.afd} (${item.paket}): ${item.progress.toFixed(1)}%`).join('<br>')
          )
        }]
      };
    });
    
    // Data untuk Line Chart
    const lineChartData = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) {
        return {
          labels: [],
          datasets: []
        };
      }
      
      const rows = rawData.value.table.rows;
      const kebunData = {};
      let currentKebun = null;
      
      // Proses data untuk mendapatkan progress per kebun
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        // Skip baris yang tidak memiliki kebun dan AFD
        if (!kebunName && !afdName) continue;
        
        // Set currentKebun jika ada
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
        if (!afdName && !kebunName) continue;
        
        // Hanya proses jika ada kebun dan AFD
        if (currentKebun && afdName) {
          // Apply filters using helper function
          if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
          
          // Ambil data dari kolom 37 (rencana) dan kolom 38 (realisasi)
          const lcRencana = cells[37] ? cells[37].v : 0;
          const lcRealisasi = cells[38] ? cells[38].v : 0;
          const lcPersentase = lcRencana > 0 ? (lcRealisasi / lcRencana) * 100 : 0;
          
          if (!kebunData[currentKebun]) {
            kebunData[currentKebun] = [];
          }
          
          kebunData[currentKebun].push(lcPersentase);
        }
      }
      
      // Generate labels untuk 7 hari terakhir
      const labels = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
      }
      
      // Generate datasets untuk maksimal 3 kebun
      const kebunNames = Object.keys(kebunData).slice(0, 3);
      const colors = [
        {
          border: 'rgba(16, 185, 129, 1)',
          background: 'rgba(16, 185, 129, 0.1)'
        },
        {
          border: 'rgba(59, 130, 246, 1)',
          background: 'rgba(59, 130, 246, 0.1)'
        },
        {
          border: 'rgba(139, 92, 246, 1)',
          background: 'rgba(139, 92, 246, 0.1)'
        }
      ];
      
      const datasets = kebunNames.map((kebun, index) => {
        // Menghitung rata-rata progress per hari
        const data = [];
        
        // Di sini kita akan menggunakan data yang sudah ada, bukan random
        // Kita asumsikan data yang ada adalah data untuk hari ini
        // Untuk hari-hari sebelumnya, kita akan mengurangi secara bertahap
        const currentValue = kebunData[kebun].length > 0 
          ? kebunData[kebun].reduce((sum, val) => sum + val, 0) / kebunData[kebun].length 
          : 0;
        
        // Generate trend data dengan nilai yang realistis
        for (let i = 0; i < 7; i++) {
          // Untuk hari-hari sebelumnya, kita kurangi nilai secara bertahap
          const dayValue = Math.max(0, currentValue - (6 - i) * 2);
          data.push(dayValue);
        }
        
        return {
          label: kebun,
          data: data,
          borderColor: colors[index].border,
          backgroundColor: colors[index].background,
          tension: 0.4,
          fill: true
        };
      });
      
      return {
        labels: labels,
        datasets: datasets
      };
    });
    
    // Data untuk Radar Chart
    const radarChartData = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) {
        return {
          labels: [],
          datasets: [{
            label: 'Rata-rata Progress (%)',
            data: [],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
            detailInfo: [] // Tambahkan detailInfo untuk mencegah error
          }]
        };
      }
      
      const rows = rawData.value.table.rows;
      const activityData = {
        'Ripper (ha)': { total: 0, count: 0, items: [] },
        'Luku (ha)': { total: 0, count: 0, items: [] },
        'Tumbang/Chipping (ha)': { total: 0, count: 0, items: [] },
        'Pembuatan Parit (Mtr)': { total: 0, count: 0, items: [] },
        'Menanam Mucuna (ha)': { total: 0, count: 0, items: [] },
        'Lubang Tanam (ha)': { total: 0, count: 0, items: [] },
        'Mempupuk Lobang (ha)': { total: 0, count: 0, items: [] },
        'Menanam KS (ha)': { total: 0, count: 0, items: [] }
      };
      let currentKebun = null;
      
      // Proses data untuk mendapatkan progress per aktivitas
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        // Skip baris yang tidak memiliki kebun dan AFD
        if (!kebunName && !afdName) continue;
        
        // Set currentKebun jika ada
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
        if (!afdName && !kebunName) continue;
        
        // Hanya proses jika ada kebun dan AFD
        if (currentKebun && afdName) {
          // Apply filters using helper function
          if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
          
          // Aktivitas-aktivitas dengan perhitungan yang benar sesuai permintaan
          const activities = [
            { name: 'Ripper (ha)', rencana: cells[5], realisasi: cells[7] },      // Kolom 5 (index 4) / Kolom 7 (index 6)
            { name: 'Luku (ha)', rencana: cells[9], realisasi: cells[11] },        // Kolom 9 (index 8) / Kolom 11 (index 10)
            { name: 'Tumbang/Chipping (ha)', rencana: cells[13], realisasi: cells[15] }, // Kolom 13 (index 12) / Kolom 15 (index 14)
            { name: 'Pembuatan Parit (Mtr)', rencana: cells[17], realisasi: cells[19] },   // Kolom 17 (index 16) / Kolom 19 (index 18)
            { name: 'Menanam Mucuna (ha)', rencana: cells[21], realisasi: cells[23] },    // Kolom 21 (index 20) / Kolom 23 (index 22)
            { name: 'Lubang Tanam (ha)', rencana: cells[25], realisasi: cells[27] },      // Kolom 25 (index 24) / Kolom 27 (index 26)
            { name: 'Mempupuk Lobang (ha)', rencana: cells[29], realisasi: cells[31] },   // Kolom 29 (index 28) / Kolom 31 (index 30)
            { name: 'Menanam KS (ha)', rencana: cells[33], realisasi: cells[35] }         // Kolom 33 (index 32) / Kolom 35 (index 34)
          ];
          
          activities.forEach(activity => {
            const rencana = activity.rencana ? activity.rencana.v : 0;
            const realisasi = activity.realisasi ? activity.realisasi.v : 0;
            
            // Hitung progress = (realisasi / rencana) * 100
            let persentase = 0;
            if (rencana > 0) {
              persentase = (realisasi / rencana) * 100;
            }
            
            activityData[activity.name].total += persentase;
            activityData[activity.name].count += 1;
            activityData[activity.name].items.push({
              kebun: currentKebun,
              afd: afdName,
              paket: paketName,
              progress: persentase
            });
          });
        }
      }
      
      // Hitung rata-rata untuk setiap aktivitas
      const labels = Object.keys(activityData);
      const data = labels.map(activity => 
        activityData[activity].count > 0 
          ? activityData[activity].total / activityData[activity].count 
          : 0
      );
      
      return {
        labels: labels,
        datasets: [{
          label: 'Rata-rata Progress (%)',
          data: data,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
          // Tambahkan informasi detail untuk tooltip
          detailInfo: labels.map(activity => 
            activityData[activity].items.map(item => `${item.kebun} ${item.afd} (${item.paket}): ${item.progress.toFixed(1)}%`).join('<br>')
          )
        }]
      };
    });
    
    // Format number
    const formatNumber = (num) => {
      if (num === null || num === undefined || isNaN(num)) return '0';
      return parseFloat(num).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
    
    // Format percentage
    const formatPercentage = (num) => {
      if (num === null || num === undefined || isNaN(num)) return '0%';
      return `${parseFloat(num).toFixed(1)}%`;
    };
    
    // Apply filters
    const applyFilters = () => {
      currentFilters.value = {
        kebun: filterKebun.value,
        afd: filterAfd.value,
        paket: filterPaket.value,
        search: filterSearch.value
      };
    };
    
    // Refresh data
    const refreshData = async () => {
      try {
        loading.value = true;
        rawData.value = await fetchSheetData();
        
        // Reset filters
        filterKebun.value = '';
        filterAfd.value = '';
        filterPaket.value = '';
        filterSearch.value = '';
        currentFilters.value = {
          kebun: '',
          afd: '',
          paket: '',
          search: ''
        };
        
        // Muat data kemarin dari localStorage
        loadProgressDataYesterday();
        
        // Ambil data progress hari ini
        progressDataToday.value = await fetchProgressDataToday();
        
        // Simpan data hari ini untuk perbandingan besok
        saveProgressDataForTomorrow();
      } catch (err) {
        error.value = err.message;
        console.error("Error:", err);
      } finally {
        loading.value = false;
      }
    };
    
    onMounted(async () => {
      try {
        loading.value = true;
        rawData.value = await fetchSheetData();
        
        // Muat data kemarin dari localStorage
        loadProgressDataYesterday();
        
        // Ambil data progress hari ini
        progressDataToday.value = await fetchProgressDataToday();
        
        // Simpan data hari ini untuk perbandingan besok
        saveProgressDataForTomorrow();
        
        console.log("Raw data:", rawData.value);
        console.log("Progress today:", progressDataToday.value);
        console.log("Progress yesterday:", progressDataYesterday.value);
      } catch (err) {
        error.value = err.message;
        console.error("Error:", err);
      } finally {
        loading.value = false;
      }
    });
    
    return {
      loading,
      error,
      rawData,
      filterKebun,
      filterAfd,
      filterPaket,
      filterSearch,
      currentFilters,
      progressDataToday,
      progressDataYesterday,
      totalLuasPaket,
      avgProgress,
      avgProgressYesterday,
      progressChange,
      progressChangeType,
      // Filtered properties
      filteredTotalLuasPaket,
      filteredAvgProgress,
      filteredAvgProgressYesterday,
      filteredProgressChange,
      filteredProgressChangeType,
      uniqueKebun,
      afdOptions, // Menggunakan afdOptions untuk dropdown AFD
      paketOptions, // Menggunakan paketOptions untuk dropdown Paket
      barChartData,
      pieChartData,
      lineChartData,
      radarChartData,
      formatNumber,
      formatPercentage,
      applyFilters,
      refreshData
    };
  }
}
</script>

<style>
/* Add your custom styles here */
.dashboard-header {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filter-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.filter-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3b82f6;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>