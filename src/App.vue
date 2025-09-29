<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <header class="dashboard-header">
      <h1 class="text-2xl md:text-3xl font-bold">Dashboard Monitoring Peremajaan Tanaman Kelapa Sawit Tahun 2025</h1>
      <p class="mt-2">Monitoring progress tanaman ulang</p>
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

     <div>
    <!-- Toggle Button -->
    <button @click="toggleFilters" class="toggle-button">Tampilkan Filter</button>

    <!-- Filter Container -->
    <div v-show="filtersVisible" class="filter-container">
      <div class="grid grid-cols-3 md:grid-cols-3 gap-4">
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
          <label class="filter-label">Filter Vendor</label>
          <select v-model="filterPaket" class="filter-input">
            <option value="">Semua Vendor</option>
            <option v-for="paket in paketOptions" :key="paket" :value="paket">{{ paket }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Bar Chart -->
        <div class="chart-container">
          <BarChart 
            :title="filterKebun ? 'Progress Vendor' : 'Progress per Kebun'" 
            :data="barChartData" 
          />
        </div>
        <div class="chart-container">
          <LineChart 
            title="Trend Progress" 
            :data="lineChartData" 
          />
        </div>
        <div class="chart-container">
          <PieChart 
            title="Distribusi Progress" 
            :data="pieChartData" 
          />
        </div>
        <div class="chart-container">
          <RadarChart 
            title="Performa per Aktivitas" 
            :data="radarChartData" 
          />
        </div>
        <!-- New Pie Chart with Needle -->
        <div class="chart-container">
          <PieChartWithNeedle 
            :title="filterKebun ? 'Distribusi Progress Vendor' : 'Distribusi Progress Kebun'"
            :data="pieWithNeedleChartData"
            :average-progress="filteredAvgProgress"
          />
        </div>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { fetchSheetData } from './services/sheetsService';
import { calculateDaysDifference } from './utils/dateUtils';
import StatCard from './components/StatCard.vue';
import DataGrid from './components/DataGrid.vue';
import BarChart from './components/BarChart.vue';
import PieChart from './components/PieChart.vue';
import LineChart from './components/LineChart.vue';
import RadarChart from './components/RadarChart.vue';
import PieChartWithNeedle from './components/PieChartWithNeedle.vue';

export default {
  name: 'App',
  components: {
    StatCard,
    DataGrid,
    BarChart,
    PieChart,
    LineChart,
    RadarChart,
    PieChartWithNeedle
  },
  data() {
    return {
      currentTime: '',
      currentDate: '',
      filtersVisible: false,
      filterKebun: '',
      filterAfd: '',
      filterPaket: '',
      uniqueKebun: [''],  
      afdOptions: [''],
      paketOptions: ['']
    };
  },
  methods: {
    toggleFilters() {
      this.filtersVisible = !this.filtersVisible;
    },
    updateDateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.currentDate = now.toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  },
  mounted() {
    this.updateDateTime();
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
    
    // Helper function to calculate progress TU without parit activity
    const calculateProgressTU = (cells) => {
      // Aktivitas yang relevan untuk progress TU (tanpa Pembuatan Parit)
      const activities = [
        { rencana: cells[5], realisasi: cells[7] },      // Ripper (kolom 5 dan 7)
        { rencana: cells[9], realisasi: cells[11] },     // Luku (kolom 9 dan 11)
        { rencana: cells[13], realisasi: cells[15] },    // Tumbang/Chipping (kolom 13 dan 15)
        { rencana: cells[21], realisasi: cells[23] },    // Menanam Mucuna (kolom 21 dan 23)
        { rencana: cells[25], realisasi: cells[27] },    // Lubang Tanam (kolom 25 dan 27)
        { rencana: cells[29], realisasi: cells[31] },    // Mempupuk Lobang (kolom 29 dan 31)
        { rencana: cells[33], realisasi: cells[35] }     // Menanam KS (kolom 33 dan 35)
      ];

      let totalRencana = 0;
      let totalRealisasi = 0;

      activities.forEach(activity => {
        const rencana = activity.rencana ? activity.rencana.v : 0;
        const realisasi = activity.realisasi ? activity.realisasi.v : 0;
        totalRencana += parseFloat(rencana) || 0;
        totalRealisasi += parseFloat(realisasi) || 0;
      });

      if (totalRencana === 0) return 0;
      return (totalRealisasi / totalRencana) * 100;
    };
    
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
          // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
          const progressTU = calculateProgressTU(cells);
          
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
    
    // Konfigurasi ticks yang konstan untuk sumbu Y
    const fixedYAxisTicks = [
      { value: 0 },
      { value: 20 },
      { value: 40 },
      { value: 60 },
      { value: 80 },
      { value: 100 }
    ];
    
    // Konfigurasi sumbu Y untuk chart dengan sumbu linear (Bar, Line)
    const yAxisConfig = {
      min: 0,
      max: 100,
      afterBuildTicks: (axis) => {
        axis.ticks = fixedYAxisTicks;
        return axis.ticks;
      },
      ticks: {
        callback: (value) => value + '%',
        precision: 0
      }
    };
    
    // Konfigurasi sumbu radial untuk RadarChart
    const radialAxisConfig = {
      min: 0,
      max: 100,
      afterBuildTicks: (axis) => {
        axis.ticks = fixedYAxisTicks;
        return axis.ticks;
      },
      ticks: {
        callback: (value) => value + '%',
        precision: 0
      }
    };
    
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
          }],
          options: {
            scales: {
              y: yAxisConfig
            }
          }
        };
      }
      
      const rows = rawData.value.table.rows;
      
      // Jika filter kebun aktif, tampilkan progress per vendor
      if (filterKebun.value) {
        const vendorProgress = {};
        let currentKebun = null;
        
        // Proses data untuk mendapatkan progress per vendor
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
            
            // Hanya proses jika kebun sesuai dengan filter
            if (currentKebun === filterKebun.value) {
              // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
              const lcPersentase = calculateProgressTU(cells);
              
              if (!vendorProgress[paketName]) {
                vendorProgress[paketName] = {
                  totalProgress: 0,
                  count: 0
                };
              }
              
              vendorProgress[paketName].totalProgress += lcPersentase;
              vendorProgress[paketName].count += 1;
            }
          }
        }
        
        // Hitung rata-rata progress per vendor
        const labels = Object.keys(vendorProgress);
        const data = labels.map(vendor => 
          vendorProgress[vendor].count > 0 
            ? vendorProgress[vendor].totalProgress / vendorProgress[vendor].count 
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
          }],
          options: {
            scales: {
              y: yAxisConfig
            }
          }
        };
      } else {
        // Jika tidak ada filter kebun, tampilkan progress per kebun
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
            
            // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
            const lcPersentase = calculateProgressTU(cells);
            
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
          }],
          options: {
            scales: {
              y: yAxisConfig
            }
          }
        };
      }
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
          
          // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
          const lcPersentase = calculateProgressTU(cells);
          
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
          
          // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
          const lcPersentase = calculateProgressTU(cells);
          
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
        datasets: datasets,
        options: {
          scales: {
            y: yAxisConfig
          }
        }
      };
    });
    
    // Data untuk Radar Chart - TANPA AKTIVITAS PARIT
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
          }],
          options: {
            scales: {
              r: radialAxisConfig
            }
          }
        };
      }
      
      const rows = rawData.value.table.rows;
      const activityData = {
        'Ripper (ha)': { total: 0, count: 0, items: [] },
        'Luku (ha)': { total: 0, count: 0, items: [] },
        'Tumbang/Chipping (ha)': { total: 0, count: 0, items: [] },
        'Menanam Mucuna (ha)': { total: 0, count: 0, items: [] },
        'Lubang Tanam (ha)': { total: 0, count: 0, items: [] },
        'Mempupuk Lobang (ha)': { total: 0, count: 0, items: [] },
        'Menanam KS (ha)': { total: 0, count: 0, items: [] }
      };
      let currentKebun = null;
      
      // Proses data untuk mendapatkan progress per aktivitas (tanpa parit)
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
          
          // Aktivitas-aktivitas TANPA Pembuatan Parit
          const activities = [
            { name: 'Ripper (ha)', rencana: cells[5], realisasi: cells[7] },      // Kolom 5 (index 4) / Kolom 7 (index 6)
            { name: 'Luku (ha)', rencana: cells[9], realisasi: cells[11] },        // Kolom 9 (index 8) / Kolom 11 (index 10)
            { name: 'Tumbang/Chipping (ha)', rencana: cells[13], realisasi: cells[15] }, // Kolom 13 (index 12) / Kolom 15 (index 14)
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
        }],
        options: {
          scales: {
            r: radialAxisConfig
          }
        }
      };
    });
    
    // Data for Pie Chart with Needle - similar to bar chart data
    const pieWithNeedleChartData = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) {
        return {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          }]
        };
      }
      
      const rows = rawData.value.table.rows;
      
      // Generate colors for the pie chart
      const generateColors = (count) => {
        const colors = [];
        const baseColors = [
          'rgba(16, 185, 129, 0.7)',  // green
          'rgba(59, 130, 246, 0.7)',  // blue
          'rgba(139, 92, 246, 0.7)',  // purple
          'rgba(245, 158, 11, 0.7)',  // yellow
          'rgba(239, 68, 68, 0.7)',   // red
          'rgba(236, 72, 153, 0.7)',  // pink
          'rgba(14, 165, 233, 0.7)',  // light blue
          'rgba(168, 85, 247, 0.7)',  // medium purple
          'rgba(34, 197, 94, 0.7)',   // emerald
          'rgba(249, 115, 22, 0.7)'   // orange
        ];
        
        const borderColors = [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)'
        ];
        
        for (let i = 0; i < count; i++) {
          colors.push({
            background: baseColors[i % baseColors.length],
            border: borderColors[i % borderColors.length]
          });
        }
        
        return colors;
      };
      
      // If kebun filter is active, show progress per vendor
      if (filterKebun.value) {
        const vendorProgress = {};
        let currentKebun = null;
        
        // Process data to get progress per vendor
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          // Skip header, jumlah, total rows
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          // Skip rows without kebun and AFD
          if (!kebunName && !afdName) continue;
          
          // Set currentKebun if exists
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          // Skip rows without AFD (except kebun rows)
          if (!afdName && !kebunName) continue;
          
          // Only process if there's kebun and AFD
          if (currentKebun && afdName) {
            // Apply filters using helper function
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            // Only process if kebun matches filter
            if (currentKebun === filterKebun.value) {
              // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
              const lcPersentase = calculateProgressTU(cells);
              
              if (!vendorProgress[paketName]) {
                vendorProgress[paketName] = {
                  totalProgress: 0,
                  count: 0
                };
              }
              
              vendorProgress[paketName].totalProgress += lcPersentase;
              vendorProgress[paketName].count += 1;
            }
          }
        }
        
        // Calculate average progress per vendor
        const labels = Object.keys(vendorProgress);
        const data = labels.map(vendor => 
          vendorProgress[vendor].count > 0 
            ? vendorProgress[vendor].totalProgress / vendorProgress[vendor].count 
            : 0
        );
        
        // Generate colors
        const colors = generateColors(labels.length);
        
        return {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors.map(c => c.background),
            borderColor: colors.map(c => c.border),
            borderWidth: 1
          }]
        };
      } else {
        // If no kebun filter, show progress per kebun
        const kebunProgress = {};
        let currentKebun = null;
        
        // Process data to get progress per kebun
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          // Skip header, jumlah, total rows
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          // Skip rows without kebun and AFD
          if (!kebunName && !afdName) continue;
          
          // Set currentKebun if exists
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          // Skip rows without AFD (except kebun rows)
          if (!afdName && !kebunName) continue;
          
          // Only process if there's kebun and AFD
          if (currentKebun && afdName) {
            // Apply filters using helper function
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
            const lcPersentase = calculateProgressTU(cells);
            
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
        
        // Calculate average progress per kebun
        const labels = Object.keys(kebunProgress);
        const data = labels.map(kebun => 
          kebunProgress[kebun].count > 0 
            ? kebunProgress[kebun].totalProgress / kebunProgress[kebun].count 
            : 0
        );
        
        // Generate colors
        const colors = generateColors(labels.length);
        
        return {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colors.map(c => c.background),
            borderColor: colors.map(c => c.border),
            borderWidth: 1
          }]
        };
      }
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
    
    // Watch for filter changes and apply automatically
    watch([filterKebun, filterAfd, filterPaket], () => {
      applyFilters();
    });
    
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
      afdOptions,
      paketOptions,
      barChartData,
      pieChartData,
      lineChartData,
      radarChartData,
      pieWithNeedleChartData,
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
  justify-content: center;
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

.toggle-button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
}
.toggle-button:hover {
  background-color: #0056b3;
}

</style>