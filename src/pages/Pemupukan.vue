<!-- src/pages/Pemupukan.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <header class="dashboard-header">
      <h1 class="text-2xl md:text-3xl font-bold">Dashboard PT Perkebunan Nusantara IV Regional 1</h1>
      <p class="mt-2">Monitoring Pemupukan Kelapa Sawit Tahun 2025</p>
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          :title="filterTitle"
          :value="filteredTotalLuas + ' ha'"
          icon-color="bg-green-500"
          icon-path="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
        <StatCard 
          title="Progress Pemupukan NPK"
          :value="formatPercentage(filteredAvgProgressNPK)"
          :change="filteredProgressChangeNPK"
          :change-type="filteredProgressChangeTypeNPK"
          icon-color="bg-blue-500"
          icon-path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
        <StatCard 
          title="Progress Pemupukan Dolomit"
          :value="formatPercentage(filteredAvgProgressDolomit)"
          :change="filteredProgressChangeDolomit"
          :change-type="filteredProgressChangeTypeDolomit"
          icon-color="bg-yellow-500"
          icon-path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
        <StatCard 
          title="Total Afdeling"
          :value="filteredTotalAfdeling"
          icon-color="bg-purple-500"
          icon-path="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </div>

      <div>
        <!-- Toggle Button -->
        <button @click="toggleFilters" class="toggle-button">Tampilkan Filter</button>

        <!-- Filter Container -->
        <div v-show="filtersVisible" class="filter-container">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="filter-label">Filter Distrik</label>
              <select v-model="filterDistrik" class="filter-input">
                <option value="">Semua Distrik</option>
                <option v-for="distrik in uniqueDistrik" :key="distrik" :value="distrik">{{ distrik }}</option>
              </select>
            </div>
            <div>
              <label class="filter-label">Filter Kebun</label>
              <select v-model="filterKebun" class="filter-input">
                <option value="">Semua Kebun</option>
                <option v-for="kebun in kebunOptions" :key="kebun" :value="kebun">{{ kebun }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <!-- First Row: Two Full-Width Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="chart-container">
          <BarChart 
            :title="chartTitleNPK" 
            :data="barChartDataNPK" 
          />
        </div>
        <div class="chart-container">
          <BarChart 
            :title="chartTitleDolomit" 
            :data="barChartDataDolomit" 
          />
        </div>
      </div>
      
      <!-- Second Row: Pie Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="chart-container">
          <PieChart 
            :title="'Distribusi Progress NPK'" 
            :data="pieChartDataNPK" 
          />
        </div>
        <div class="chart-container">
          <PieChart 
            :title="'Distribusi Progress Dolomit'" 
            :data="pieChartDataDolomit" 
          />
        </div>
      </div>

      <!-- Third Row: Stock and Realization Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="chart-container">
          <BarChart 
            :title="'Stok vs Realisasi NPK'" 
            :data="stockRealizationChartNPK" 
          />
        </div>
        <div class="chart-container">
          <BarChart 
            :title="'Stok vs Realisasi Dolomit'" 
            :data="stockRealizationChartDolomit" 
          />
        </div>
      </div>

      <!-- Data Grid -->
      <div class="data-grid-container">
        <div class="data-grid-header">
          <h3 class="text-lg font-medium text-gray-900">Data Progress Pemupukan</h3>
          <div class="flex space-x-2">
            <!-- Dropdown untuk memilih Data Grid -->
            <div class="flex items-center border rounded">
              <select 
                v-model="selectedDataGrid" 
                @change="changeDataGrid" 
                class="border-none rounded-l px-2 py-1 text-sm focus:outline-none"
              >
                <option value="sm1">Semester 1</option>
                <option value="sm2">Semester 2</option>
              </select>
            </div>
            <button @click="exportToExcelHandler" class="btn btn-secondary text-sm">
              Export Excel
            </button>
            <button @click="refreshData" class="btn btn-primary text-sm">
              Refresh Data
            </button>
          </div>
        </div>
        
        <!-- Data Grid yang dipilih -->
        <DataGridPemupukan 
          v-if="selectedDataGrid === 'sm1'"
          :rawData="rawData" 
          :filters="currentFilters"
          @refresh="refreshData"
        />
        
        <DataGridPemupukanSM2 
          v-if="selectedDataGrid === 'sm2'"
          :rawData="rawDataSM2" 
          :filters="currentFilters"
          @refresh="refreshDataSM2"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { fetchSheetDataByGid } from '../services/sheetsService';
import StatCard from '../components/StatCard.vue';
import DataGridPemupukan from '../components/DataGridPemupukan.vue';
import DataGridPemupukanSM2 from '../components/DataGridPemupukanSM2.vue';
import BarChart from '../components/BarChart.vue';
import PieChart from '../components/PieChart.vue';
import LineChart from '../components/LineChart.vue';
import RadarChart from '../components/RadarChart.vue';
import PieChartWithNeedle from '../components/PieChartWithNeedle.vue';

export default {
  name: 'Pemupukan',
  components: {
    StatCard,
    DataGridPemupukan,
    DataGridPemupukanSM2,
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
      filterDistrik: '',
      filterKebun: '',
      uniqueDistrik: [''],  
      kebunOptions: [''],
      selectedDataGrid: 'sm1' // Default ke Semester 1
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
    },
    exportToExcelHandler() {
      if (this.selectedDataGrid === 'sm1') {
        console.log('Exporting SM1 data:', this.rawData);
        // Export logic for SM1
      } else {
        console.log('Exporting SM2 data:', this.rawDataSM2);
        // Export logic for SM2
      }
    },
    changeDataGrid() {
      // Method ini dipanggil ketika dropdown diubah
      console.log('Data grid changed to:', this.selectedDataGrid);
    }
  },
  computed: {
    filterTitle() {
      if (this.filterKebun) return `Luas Kebun ${this.filterKebun}`;
      if (this.filterDistrik) return `Luas Distrik ${this.filterDistrik}`;
      return 'Luas Area Pemupukan';
    },
    chartTitleNPK() {
      if (this.filterKebun) return `Progress Pemupukan NPK - ${this.filterKebun}`;
      if (this.filterDistrik) return `Progress Pemupukan NPK - ${this.filterDistrik}`;
      return 'Progress Pemupukan NPK Per Kebun';
    },
    chartTitleDolomit() {
      if (this.filterKebun) return `Progress Pemupukan Dolomit - ${this.filterKebun}`;
      if (this.filterDistrik) return `Progress Pemupukan Dolomit - ${this.filterDistrik}`;
      return 'Progress Pemupukan Dolomit Per Kebun';
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
    const rawDataSM2 = ref(null);
    const filterDistrik = ref('');
    const filterKebun = ref('');
    const filterSearch = ref('');
    const currentFilters = ref({
      distrik: '',
      kebun: '',
      search: ''
    });
    const selectedDataGrid = ref('sm1');
    
    // Progress data
    const progressDataToday = ref([]);
    const progressDataYesterday = ref([]);
    
    // Helper function to check if a row should be included based on filters
    const shouldIncludeRow = (distrik, kebun) => {
      // Jika filter distrik aktif, hanya tampilkan data dari distrik tersebut
      if (currentFilters.value.distrik && distrik !== currentFilters.value.distrik) return false;
      
      // Jika filter kebun aktif, hanya tampilkan data dari kebun tersebut
      if (currentFilters.value.kebun && kebun !== currentFilters.value.kebun) return false;
      
      return true;
    };
    
    // Fungsi untuk mengambil data progress hari ini
    const fetchProgressDataToday = async () => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const rows = rawData.value.table.rows;
      const result = [];
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        const kebunName = cells[4] ? cells[4].v : '';
        
        // Skip baris yang tidak memiliki distrik dan kebun
        if (!distrikName && !kebunName) continue;
        
        // Hitung progress NPK
        const rencanaNPK = cells[7] ? parseFloat(cells[7].v) || 0 : 0;
        const realisasiNPK = cells[13] ? parseFloat(cells[13].v) || 0 : 0;
        const progressNPK = rencanaNPK > 0 ? (realisasiNPK / rencanaNPK) * 100 : 0;
        
        // Hitung progress Dolomit
        const rencanaDolomit = cells[8] ? parseFloat(cells[8].v) || 0 : 0;
        const realisasiDolomit = cells[14] ? parseFloat(cells[14].v) || 0 : 0;
        const progressDolomit = rencanaDolomit > 0 ? (realisasiDolomit / rencanaDolomit) * 100 : 0;
        
        result.push({
          distrik: distrikName,
          kebun: kebunName,
          progressNPK: progressNPK,
          progressDolomit: progressDolomit
        });
      }
      
      return result;
    };
    
    // Fungsi untuk memuat data kemarin dari localStorage
    const loadProgressDataYesterday = () => {
      const savedData = localStorage.getItem('progressDataYesterdayPemupukan');
      if (savedData) {
        progressDataYesterday.value = JSON.parse(savedData);
      }
    };
    
    // Fungsi untuk menyimpan data hari ini untuk besok
    const saveProgressDataForTomorrow = () => {
      localStorage.setItem('progressDataYesterdayPemupukan', JSON.stringify(progressDataToday.value));
    };
    
    // Menghitung total luas (unfiltered)
    const totalLuas = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) return 0;
      
      let total = 0;
      const rows = currentData.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const luas = cells[5] ? parseFloat(cells[5].v) || 0 : 0;
        total += luas;
      }
      
      return total.toFixed(2);
    });
    
    // Filtered total luas
    const filteredTotalLuas = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) return 0;
      
      let total = 0;
      const rows = currentData.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        const kebunName = cells[4] ? cells[4].v : '';
        
        // Apply filters using helper function
        if (!shouldIncludeRow(distrikName, kebunName)) continue;
        
        const luas = cells[5] ? parseFloat(cells[5].v) || 0 : 0;
        total += luas;
      }
      
      return total.toFixed(2);
    });
    
    // Filtered total afdeling
    const filteredTotalAfdeling = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) return 0;
      
      let total = 0;
      const rows = currentData.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        const kebunName = cells[4] ? cells[4].v : '';
        
        // Apply filters using helper function
        if (!shouldIncludeRow(distrikName, kebunName)) continue;
        
        const totalAfd = cells[6] ? parseInt(cells[6].v) || 0 : 0;
        total += totalAfd;
      }
      
      return total;
    });
    
    // Filtered progress data today
    const filteredProgressDataToday = computed(() => {
      return progressDataToday.value.filter(item => {
        if (currentFilters.value.distrik && item.distrik !== currentFilters.value.distrik) return false;
        if (currentFilters.value.kebun && item.kebun !== currentFilters.value.kebun) return false;
        return true;
      });
    });
    
    // Filtered progress data yesterday
    const filteredProgressDataYesterday = computed(() => {
      return progressDataYesterday.value.filter(item => {
        if (currentFilters.value.distrik && item.distrik !== currentFilters.value.distrik) return false;
        if (currentFilters.value.kebun && item.kebun !== currentFilters.value.kebun) return false;
        return true;
      });
    });
    
    // Menghitung rata-rata progress NPK hari ini (unfiltered)
    const avgProgressNPK = computed(() => {
      if (progressDataToday.value.length === 0) return 0;
      const total = progressDataToday.value.reduce((sum, item) => sum + item.progressNPK, 0);
      return total / progressDataToday.value.length;
    });
    
    // Filtered average progress NPK
    const filteredAvgProgressNPK = computed(() => {
      if (filteredProgressDataToday.value.length === 0) return 0;
      const total = filteredProgressDataToday.value.reduce((sum, item) => sum + item.progressNPK, 0);
      return total / filteredProgressDataToday.value.length;
    });
    
    // Filtered average progress NPK yesterday
    const filteredAvgProgressNPKYesterday = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 0;
      const total = filteredProgressDataYesterday.value.reduce((sum, item) => sum + item.progressNPK, 0);
      return total / filteredProgressDataYesterday.value.length;
    });
    
    // Filtered progress change NPK
    const filteredProgressChangeNPK = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 'Data baru';
      
      const today = filteredAvgProgressNPK.value;
      const yesterday = filteredAvgProgressNPKYesterday.value;
      
      if (yesterday === 0) return '0%';
      
      const change = ((today - yesterday) / yesterday) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    });
    
    // Filtered progress change type NPK
    const filteredProgressChangeTypeNPK = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 'neutral';
      
      const change = parseFloat(filteredProgressChangeNPK.value);
      return change >= 0 ? 'positive' : 'negative';
    });
    
    // Menghitung rata-rata progress Dolomit hari ini (unfiltered)
    const avgProgressDolomit = computed(() => {
      if (progressDataToday.value.length === 0) return 0;
      const total = progressDataToday.value.reduce((sum, item) => sum + item.progressDolomit, 0);
      return total / progressDataToday.value.length;
    });
    
    // Filtered average progress Dolomit
    const filteredAvgProgressDolomit = computed(() => {
      if (filteredProgressDataToday.value.length === 0) return 0;
      const total = filteredProgressDataToday.value.reduce((sum, item) => sum + item.progressDolomit, 0);
      return total / filteredProgressDataToday.value.length;
    });
    
    // Filtered average progress Dolomit yesterday
    const filteredAvgProgressDolomitYesterday = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 0;
      const total = filteredProgressDataYesterday.value.reduce((sum, item) => sum + item.progressDolomit, 0);
      return total / filteredProgressDataYesterday.value.length;
    });
    
    // Filtered progress change Dolomit
    const filteredProgressChangeDolomit = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 'Data baru';
      
      const today = filteredAvgProgressDolomit.value;
      const yesterday = filteredAvgProgressDolomitYesterday.value;
      
      if (yesterday === 0) return '0%';
      
      const change = ((today - yesterday) / yesterday) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    });
    
    // Filtered progress change type Dolomit
    const filteredProgressChangeTypeDolomit = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 'neutral';
      
      const change = parseFloat(filteredProgressChangeDolomit.value);
      return change >= 0 ? 'positive' : 'negative';
    });
    
    // Mendapatkan daftar distrik unik
    const uniqueDistrik = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) return [];
      
      const distrikSet = new Set();
      const rows = currentData.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        if (distrikName) {
          distrikSet.add(distrikName);
        }
      }
      
      return Array.from(distrikSet);
    });
    
    // Mendapatkan opsi kebun berdasarkan distrik yang dipilih
    const kebunOptions = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) return [];
      
      const kebunSet = new Set();
      const rows = currentData.table.rows;
      
      // Jika distrik dipilih, tampilkan kebun hanya dari distrik tersebut
      if (filterDistrik.value) {
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          // Skip baris header
          if (cells[0] && cells[0].v === 'Distrik') continue;
          
          const distrikName = cells[0] ? cells[0].v : '';
          const kebunName = cells[4] ? cells[4].v : '';
          
          // Hanya tambahkan jika distrik sesuai dengan yang dipilih
          if (distrikName === filterDistrik.value && kebunName) {
            kebunSet.add(kebunName);
          }
        }
        
        return Array.from(kebunSet).sort();
      } else {
        // Jika tidak ada distrik yang dipilih, tampilkan semua kebun
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          // Skip baris header
          if (cells[0] && cells[0].v === 'Distrik') continue;
          
          const kebunName = cells[4] ? cells[4].v : '';
          
          if (kebunName) {
            kebunSet.add(kebunName);
          }
        }
        
        return Array.from(kebunSet).sort();
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
    
    // Data untuk Bar Chart NPK
    const barChartDataNPK = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) {
        return {
          labels: [],
          datasets: [{
            label: 'Progress NPK (%)',
            data: [],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }],
          options: {
            scales: {
              y: yAxisConfig
            }
          }
        };
      }
      
      const rows = currentData.table.rows;
      const dataPoints = [];
      
      // Proses data untuk mendapatkan progress per kebun
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        const kebunName = cells[4] ? cells[4].v : '';
        
        // Apply filters using helper function
        if (!shouldIncludeRow(distrikName, kebunName)) continue;
        
        // Hitung progress NPK
        let rencanaNPK, realisasiNPK;
        
        if (selectedDataGrid.value === 'sm1') {
          // Untuk SM1
          rencanaNPK = cells[7] ? parseFloat(cells[7].v) || 0 : 0;
          realisasiNPK = cells[13] ? parseFloat(cells[13].v) || 0 : 0;
        } else {
          // Untuk SM2
          rencanaNPK = cells[9] ? parseFloat(cells[9].v) || 0 : 0;
          realisasiNPK = cells[19] ? parseFloat(cells[19].v) || 0 : 0;
        }
        
        const progressNPK = rencanaNPK > 0 ? (realisasiNPK / rencanaNPK) * 100 : 0;
        
        // Ambil luas untuk tooltip
        const luas = cells[5] ? parseFloat(cells[5].v) || 0 : 0;
        
        // Format label
        let label = kebunName;
        if (filterDistrik.value && !filterKebun.value) {
          label = kebunName;
        } else if (!filterDistrik.value && !filterKebun.value) {
          label = `${distrikName} - ${kebunName}`;
        }
        
        dataPoints.push({
          label: label,
          progress: progressNPK,
          luas: luas
        });
      }
      
      // Urutkan berdasarkan progress (descending)
      dataPoints.sort((a, b) => b.progress - a.progress);
      
      // Buat array khusus untuk luas
      const luasArray = dataPoints.map(dp => dp.luas);
      
      return {
        labels: dataPoints.map(dp => dp.label),
        datasets: [{
          label: 'Progress NPK (%)',
          data: dataPoints.map(dp => dp.progress),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          // Tambahkan data luas sebagai properti tambahan
          luas: luasArray
        }],
        options: {
          scales: {
            y: yAxisConfig
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.parsed.y || 0;
                  return `Progress NPK: ${value.toFixed(2)}%`;
                },
                afterLabel: function(context) {
                  // Akses luas dari dataset
                  const luas = context.dataset.luas[context.dataIndex] || 0;
                  return `Luas: ${luas} ha`;
                }
              }
            }
          }
        }
      };
    });
    
    // Data untuk Bar Chart Dolomit
    const barChartDataDolomit = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) {
        return {
          labels: [],
          datasets: [{
            label: 'Progress Dolomit (%)',
            data: [],
            backgroundColor: 'rgba(245, 158, 11, 0.5)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1
          }],
          options: {
            scales: {
              y: yAxisConfig
            }
          }
        };
      }
      
      const rows = currentData.table.rows;
      const dataPoints = [];
      
      // Proses data untuk mendapatkan progress per kebun
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        const kebunName = cells[4] ? cells[4].v : '';
        
        // Apply filters using helper function
        if (!shouldIncludeRow(distrikName, kebunName)) continue;
        
        // Hitung progress Dolomit
        let rencanaDolomit, realisasiDolomit;
        
        if (selectedDataGrid.value === 'sm1') {
          // Untuk SM1
          rencanaDolomit = cells[8] ? parseFloat(cells[8].v) || 0 : 0;
          realisasiDolomit = cells[14] ? parseFloat(cells[14].v) || 0 : 0;
        } else {
          // Untuk SM2
          rencanaDolomit = cells[8] ? parseFloat(cells[8].v) || 0 : 0;
          // Asumsi tidak ada realisasi Dolomit SM II
          realisasiDolomit = 0;
        }
        
        const progressDolomit = rencanaDolomit > 0 ? (realisasiDolomit / rencanaDolomit) * 100 : 0;
        
        // Ambil luas untuk tooltip
        const luas = cells[5] ? parseFloat(cells[5].v) || 0 : 0;
        
        // Format label
        let label = kebunName;
        if (filterDistrik.value && !filterKebun.value) {
          label = kebunName;
        } else if (!filterDistrik.value && !filterKebun.value) {
          label = `${distrikName} - ${kebunName}`;
        }
        
        dataPoints.push({
          label: label,
          progress: progressDolomit,
          luas: luas
        });
      }
      
      // Urutkan berdasarkan progress (descending)
      dataPoints.sort((a, b) => b.progress - a.progress);
      
      // Buat array khusus untuk luas
      const luasArray = dataPoints.map(dp => dp.luas);
      
      return {
        labels: dataPoints.map(dp => dp.label),
        datasets: [{
          label: 'Progress Dolomit (%)',
          data: dataPoints.map(dp => dp.progress),
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 1,
          // Tambahkan data luas sebagai properti tambahan
          luas: luasArray
        }],
        options: {
          scales: {
            y: yAxisConfig
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.parsed.y || 0;
                  return `Progress Dolomit: ${value.toFixed(2)}%`;
                },
                afterLabel: function(context) {
                  // Akses luas dari dataset
                  const luas = context.dataset.luas[context.dataIndex] || 0;
                  return `Luas: ${luas} ha`;
                }
              }
            }
          }
        }
      };
    });
    
    // Data untuk Stock vs Realization Chart NPK
    const stockRealizationChartNPK = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) {
        return {
          labels: [],
          datasets: [
            {
              label: 'Stok NPK',
              data: [],
              backgroundColor: 'rgba(34, 197, 94, 0.5)',
              borderColor: 'rgba(34, 197, 94, 1)',
              borderWidth: 1
            },
            {
              label: 'Realisasi NPK',
              data: [],
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }
          ]
        };
      }
      
      const rows = currentData.table.rows;
      const labels = [];
      const stokData = [];
      const realisasiData = [];
      
      // Proses data untuk mendapatkan stok dan realisasi per kebun
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        const kebunName = cells[4] ? cells[4].v : '';
        
        // Apply filters using helper function
        if (!shouldIncludeRow(distrikName, kebunName)) continue;
        
        // Ambil data stok dan realisasi
        let stokNPK, realisasiNPK;
        
        if (selectedDataGrid.value === 'sm1') {
          // Untuk SM1
          stokNPK = cells[15] ? parseFloat(cells[15].v) || 0 : 0;
          realisasiNPK = cells[9] ? parseFloat(cells[9].v) || 0 : 0;
        } else {
          // Untuk SM2
          stokNPK = cells[29] ? parseFloat(cells[29].v) || 0 : 0;
          realisasiNPK = cells[19] ? parseFloat(cells[19].v) || 0 : 0;
        }
        
        // Format label
        let label = kebunName;
        if (filterDistrik.value && !filterKebun.value) {
          label = kebunName;
        } else if (!filterDistrik.value && !filterKebun.value) {
          label = `${distrikName} - ${kebunName}`;
        }
        
        labels.push(label);
        stokData.push(stokNPK);
        realisasiData.push(realisasiNPK);
      }
      
      return {
        labels: labels,
        datasets: [
          {
            label: 'Stok NPK (Ton)',
            data: stokData,
            backgroundColor: 'rgba(34, 197, 94, 0.5)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1
          },
          {
            label: 'Realisasi NPK (Ton)',
            data: realisasiData,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }
        ],
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value.toLocaleString('id-ID') + ' Ton';
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += context.parsed.y.toLocaleString('id-ID') + ' Ton';
                  return label;
                }
              }
            }
          }
        }
      };
    });
    
    // Data untuk Stock vs Realization Chart Dolomit
    const stockRealizationChartDolomit = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) {
        return {
          labels: [],
          datasets: [
            {
              label: 'Stok Dolomit',
              data: [],
              backgroundColor: 'rgba(251, 191, 36, 0.5)',
              borderColor: 'rgba(251, 191, 36, 1)',
              borderWidth: 1
            },
            {
              label: 'Realisasi Dolomit',
              data: [],
              backgroundColor: 'rgba(245, 158, 11, 0.5)',
              borderColor: 'rgba(245, 158, 11, 1)',
              borderWidth: 1
            }
          ]
        };
      }
      
      const rows = currentData.table.rows;
      const labels = [];
      const stokData = [];
      const realisasiData = [];
      
      // Proses data untuk mendapatkan stok dan realisasi per kebun
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        const kebunName = cells[4] ? cells[4].v : '';
        
        // Apply filters using helper function
        if (!shouldIncludeRow(distrikName, kebunName)) continue;
        
        // Ambil data stok dan realisasi
        let stokDolomit, realisasiDolomit;
        
        if (selectedDataGrid.value === 'sm1') {
          // Untuk SM1
          stokDolomit = cells[16] ? parseFloat(cells[16].v) || 0 : 0;
          realisasiDolomit = cells[13] ? parseFloat(cells[13].v) || 0 : 0;
        } else {
          // Untuk SM2
          stokDolomit = cells[30] ? parseFloat(cells[30].v) || 0 : 0;
          // Asumsi tidak ada realisasi Dolomit SM II
          realisasiDolomit = 0;
        }
        
        // Format label
        let label = kebunName;
        if (filterDistrik.value && !filterKebun.value) {
          label = kebunName;
        } else if (!filterDistrik.value && !filterKebun.value) {
          label = `${distrikName} - ${kebunName}`;
        }
        
        labels.push(label);
        stokData.push(stokDolomit);
        realisasiData.push(realisasiDolomit);
      }
      
      return {
        labels: labels,
        datasets: [
          {
            label: 'Stok Dolomit (Ton)',
            data: stokData,
            backgroundColor: 'rgba(251, 191, 36, 0.5)',
            borderColor: 'rgba(251, 191, 36, 1)',
            borderWidth: 1
          },
          {
            label: 'Realisasi Dolomit (Ton)',
            data: realisasiData,
            backgroundColor: 'rgba(245, 158, 11, 0.5)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1
          }
        ],
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return value.toLocaleString('id-ID') + ' Ton';
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  label += context.parsed.y.toLocaleString('id-ID') + ' Ton';
                  return label;
                }
              }
            }
          }
        }
      };
    });
    
    // Data untuk Pie Chart NPK
    const pieChartDataNPK = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) {
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
      
      const rows = currentData.table.rows;
      const progressCategories = {
        '0-25%': { count: 0, items: [] },
        '26-50%': { count: 0, items: [] },
        '51-75%': { count: 0, items: [] },
        '76-100%': { count: 0, items: [] }
      };
      
      // Proses data untuk mengkategorikan progress
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        const kebunName = cells[4] ? cells[4].v : '';
        
        // Apply filters using helper function
        if (!shouldIncludeRow(distrikName, kebunName)) continue;
        
        // Hitung progress NPK
        let rencanaNPK, realisasiNPK;
        
        if (selectedDataGrid.value === 'sm1') {
          // Untuk SM1
          rencanaNPK = cells[7] ? parseFloat(cells[7].v) || 0 : 0;
          realisasiNPK = cells[9] ? parseFloat(cells[9].v) || 0 : 0;
        } else {
          // Untuk SM2
          rencanaNPK = cells[17] ? parseFloat(cells[17].v) || 0 : 0;
          realisasiNPK = cells[19] ? parseFloat(cells[19].v) || 0 : 0;
        }
        
        const progressNPK = rencanaNPK > 0 ? (realisasiNPK / rencanaNPK) * 100 : 0;
        
        // Kategorikan progress
        let category;
        if (progressNPK <= 25) {
          category = '0-25%';
        } else if (progressNPK <= 50) {
          category = '26-50%';
        } else if (progressNPK <= 75) {
          category = '51-75%';
        } else {
          category = '76-100%';
        }
        
        progressCategories[category].count++;
        progressCategories[category].items.push({
          distrik: distrikName,
          kebun: kebunName,
          progress: progressNPK
        });
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
            cat.items.map(item => `${item.distrik} - ${item.kebun}: ${item.progress.toFixed(1)}%`).join('<br>')
          )
        }]
      };
    });
    
    // Data untuk Pie Chart Dolomit
    const pieChartDataDolomit = computed(() => {
      const currentData = selectedDataGrid.value === 'sm1' ? rawData.value : rawDataSM2.value;
      if (!currentData || !currentData.table || !currentData.table.rows) {
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
      
      const rows = currentData.table.rows;
      const progressCategories = {
        '0-25%': { count: 0, items: [] },
        '26-50%': { count: 0, items: [] },
        '51-75%': { count: 0, items: [] },
        '76-100%': { count: 0, items: [] }
      };
      
      // Proses data untuk mengkategorikan progress
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header
        if (cells[0] && cells[0].v === 'Distrik') continue;
        
        const distrikName = cells[0] ? cells[0].v : '';
        const kebunName = cells[4] ? cells[4].v : '';
        
        // Apply filters using helper function
        if (!shouldIncludeRow(distrikName, kebunName)) continue;
        
        // Hitung progress Dolomit
        let rencanaDolomit, realisasiDolomit;
        
        if (selectedDataGrid.value === 'sm1') {
          // Untuk SM1
          rencanaDolomit = cells[11] ? parseFloat(cells[11].v) || 0 : 0;
          realisasiDolomit = cells[13] ? parseFloat(cells[13].v) || 0 : 0;
        } else {
          // Untuk SM2
          rencanaDolomit = 0;
          // Asumsi tidak ada realisasi Dolomit SM II
          realisasiDolomit = 0;
        }
        
        const progressDolomit = rencanaDolomit > 0 ? (realisasiDolomit / rencanaDolomit) * 100 : 0;
        
        // Kategorikan progress
        let category;
        if (progressDolomit <= 25) {
          category = '0-25%';
        } else if (progressDolomit <= 50) {
          category = '26-50%';
        } else if (progressDolomit <= 75) {
          category = '51-75%';
        } else {
          category = '76-100%';
        }
        
        progressCategories[category].count++;
        progressCategories[category].items.push({
          distrik: distrikName,
          kebun: kebunName,
          progress: progressDolomit
        });
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
            cat.items.map(item => `${item.distrik} - ${item.kebun}: ${item.progress.toFixed(1)}%`).join('<br>')
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
        distrik: filterDistrik.value,
        kebun: filterKebun.value,
        search: filterSearch.value
      };
    };
    
    // Watch for filter changes and apply automatically
    watch([filterDistrik, filterKebun], () => {
      applyFilters();
    });
    
    // Refresh data
    const refreshData = async () => {
      try {
        loading.value = true;
        rawData.value = await fetchSheetDataByGid('1827722340'); // GID sheet Pemupukan SM1
        
        // Reset filters
        filterDistrik.value = '';
        filterKebun.value = '';
        filterSearch.value = '';
        currentFilters.value = {
          distrik: '',
          kebun: '',
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
    
    // Refresh data SM2
    const refreshDataSM2 = async () => {
      try {
        loading.value = true;
        rawDataSM2.value = await fetchSheetDataByGid('681770242'); // GID sheet Pemupukan SM2
        
        // Reset filters
        filterDistrik.value = '';
        filterKebun.value = '';
        filterSearch.value = '';
        currentFilters.value = {
          distrik: '',
          kebun: '',
          search: ''
        };
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
        
        // Load sheet data untuk SM1
        rawData.value = await fetchSheetDataByGid('1827722340'); // GID sheet Pemupukan SM1
        
        // Load sheet data untuk SM2
        rawDataSM2.value = await fetchSheetDataByGid('681770242'); // GID sheet Pemupukan SM2
        
        // Muat data kemarin dari localStorage
        loadProgressDataYesterday();
        
        // Ambil data progress hari ini
        progressDataToday.value = await fetchProgressDataToday();
        
        // Simpan data hari ini untuk perbandingan besok
        saveProgressDataForTomorrow();
        
        console.log("Raw data SM1:", rawData.value);
        console.log("Raw data SM2:", rawDataSM2.value);
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
      rawDataSM2,
      filterDistrik,
      filterKebun,
      filterSearch,
      currentFilters,
      selectedDataGrid,
      progressDataToday,
      progressDataYesterday,
      totalLuas,
      avgProgressNPK,
      avgProgressDolomit,
      // Filtered properties
      filteredTotalLuas,
      filteredTotalAfdeling,
      filteredAvgProgressNPK,
      filteredAvgProgressDolomit,
      filteredProgressChangeNPK,
      filteredProgressChangeTypeNPK,
      filteredProgressChangeDolomit,
      filteredProgressChangeTypeDolomit,
      uniqueDistrik,
      kebunOptions,
      barChartDataNPK,
      barChartDataDolomit,
      stockRealizationChartNPK,
      stockRealizationChartDolomit,
      pieChartDataNPK,
      pieChartDataDolomit,
      formatNumber,
      formatPercentage,
      applyFilters,
      refreshData,
      refreshDataSM2
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

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
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
  margin-bottom: 1rem;
}
.toggle-button:hover {
  background-color: #0056b3;
}

.chart-container {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-grid-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-grid-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>