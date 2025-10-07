<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <header class="dashboard-header">
      <h1 class="text-2xl md:text-3xl font-bold">Dashboard PT Perkebunan Nusantara IV Regional 1</h1>
      <p class="mt-2">Monitoring Tanaman Ulang (TU) Kelapa Sawit Tahun 2025</p>
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
          :title="filterTitle"
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
          <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div>
              <label class="filter-label">Filter Kebun</label>
              <select v-model="filterKebun" class="filter-input">
                <option value="">Semua Kebun</option>
                <option v-for="kebun in uniqueKebun" :key="kebun" :value="kebun">{{ kebun }}</option>
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
      <!-- First Row: Two Full-Width Charts -->
      <div class="grid grid-cols-1 gap-6 mb-8">
        <div class="chart-container">
          <BarChart 
            :title="chartTitle" 
            :data="barChartData" 
          />
        </div>
        <div class="pie-chart-outer">
          <!-- Tambahkan legenda di atas grafik -->
          <PieChartWithNeedle 
            :title="needleChartTitle"
            :legend="needleChartLegend"
            :data="pieWithNeedleChartData"
            :average-progress="filteredAvgProgress"
          />
        </div>
      </div>
      <!-- Second Row: Multiple Radar Charts -->
<!-- Second Row: Multiple Radar Charts -->
<div class="mb-8">
  <RadarChart 
    title="Progress TU Per Objek Kerja" 
    :charts="radarChartData" 
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { fetchSheetData } from '../services/sheetsService';
import { calculateDaysDifference } from '../utils/dateUtils';
import StatCard from '../components/StatCard.vue';
import DataGrid from '../components/DataGrid.vue';
import BarChart from '../components/BarChart.vue';
import PieChart from '../components/PieChart.vue';
import LineChart from '../components/LineChart.vue';
import RadarChart from '../components/RadarChart.vue';
import PieChartWithNeedle from '../components/PieChartWithNeedle.vue';
import '../data/rantai.json';

export default {
  name: 'TanamanUlang',
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
      filterPaket: '',
      uniqueKebun: [''],  
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
  computed: {
    filterTitle() {
      if (this.filterPaket) return `Luas Paket ${this.filterPaket}`;
      if (this.filterKebun) return `Luas Kebun ${this.filterKebun}`;
      return 'Luas Tanaman ulang';
    },
    chartTitle() {
      if (this.filterKebun && this.filterPaket) return `Progress TU per Afdeling`;
      if (this.filterPaket) return `Progress TU per Afdeling`;
      if (this.filterKebun) return `Progress TU per Afdeling dan Vendor`;
      return 'Progress TU Per Vendor';
    },
    needleChartTitle() {
      if (this.filterKebun && this.filterPaket) return `Progress TU berdasarkan kuadran per Afdeling`;
      if (this.filterPaket) return `Progress TU berdasarkan kuadran per Afdeling`;
      if (this.filterKebun) return `Progress TU berdasarkan kuadran per Afdeling dan Vendor`;
      return 'Progress TU Berdasarkan Kuadran Per Vendor';
    },
  
  needleChartLegend() {
    // Sesuaikan dengan kebutuhan legend Anda
    return [
      { label: 'Sangat Rendah', color: '#EF4444' },
      { label: 'Rendah', color: '#F59E0B' },
      { label: 'Tinggi', color: '#4F46E5' },
      { label: 'Sangat Tinggi', color: '#10B981' }
      ];
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
    const filterPaket = ref('');
    const filterSearch = ref('');
    const currentFilters = ref({
      kebun: '',
      paket: '',
      search: ''
    });
    
    // Kodering mapping
    const koderingMap = ref({});
    
    // Progress data
    const progressDataToday = ref([]);
    const progressDataYesterday = ref([]);
    
    // Helper function to get kodering for a kebun
    const getKodering = (kebunName) => {
      if (!kebunName || !koderingMap.value) return 'Tidak diketahui';
      
      // Try exact match first
      const lowerKebun = kebunName.toLowerCase();
      if (koderingMap.value[lowerKebun]) {
        return koderingMap.value[lowerKebun];
      }
      
      // Try without "KEBUN " prefix
      const withoutPrefix = lowerKebun.replace(/^kebun\s+/i, '');
      if (koderingMap.value[withoutPrefix]) {
        return koderingMap.value[withoutPrefix];
      }
      
      return 'Tidak diketahui';
    };
    
    // Load kodering data
    const loadKoderingData = async () => {
      try {
        const response = await fetch('/data/rantai.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Create mapping from kebun name to kodering
        const mapping = {};
        data.forEach(item => {
          // Add both full name and name without "KEBUN " prefix
          const fullName = item.Kebun;
          const shortName = fullName.replace(/^KEBUN\s+/i, '');
          
          mapping[fullName.toLowerCase()] = item.Kodering;
          mapping[shortName.toLowerCase()] = item.Kodering;
        });
        koderingMap.value = mapping;
      } catch (error) {
        console.error('Error loading kodering data from file, using fallback data:', error);
        
        // Fallback data - use the provided JSON directly
        const fallbackData = [
          { "Kebun": "KEBUN SEI DAUN", "Kodering": "1KSD" },
          { "Kebun": "KEBUN TORGAMBA", "Kodering": "1KTO" },
          { "Kebun": "KEBUN SEI BARUHUR", "Kodering": "1KSB" },
          { "Kebun": "KEBUN SEI KEBARA", "Kodering": "1KSK" },
          { "Kebun": "KEBUN AEK TOROP", "Kodering": "1KAT" },
          { "Kebun": "KEBUN AEK RASO", "Kodering": "1KAR" },
          { "Kebun": "KEBUN SISUMUT", "Kodering": "1KSU" },
          { "Kebun": "KEBUN AEK NABARA UTARA", "Kodering": "1KAN" },
          { "Kebun": "KEBUN AEK NABARA SELATAN", "Kodering": "1KAS" },
          { "Kebun": "KEBUN RANTAU PRAPAT", "Kodering": "1KRP" },
          { "Kebun": "KEBUN MEMBANG MUDA", "Kodering": "1KMM" },
          { "Kebun": "KEBUN LABUHAN HAJI", "Kodering": "1KLJ" },
          { "Kebun": "KEBUN MERBAU SELATAN", "Kodering": "1KMS" },
          { "Kebun": "KEBUN SEI DADAP", "Kodering": "1KDP" },
          { "Kebun": "KEBUN PULAU MANDI", "Kodering": "1KPM" },
          { "Kebun": "1KAM", "Kodering": "1KAM" },
          { "Kebun": "KEBUN SEI SILAU", "Kodering": "1KSL" },
          { "Kebun": "KEBUN HUTA PADANG", "Kodering": "1KHP" },
          { "Kebun": "KEBUN BANDAR SELAMAT", "Kodering": "1KBS" },
          { "Kebun": "KEBUN DUSUN HULU", "Kodering": "1KDH" },
          { "Kebun": "KEBUN BANDAR BETSY", "Kodering": "1KBB" },
          { "Kebun": "KEBUN BANGUN", "Kodering": "1KBN" },
          { "Kebun": "KEBUN GUNUNG PAMELA", "Kodering": "1KGP" },
          { "Kebun": "KEBUN GUNUNG MONAKO", "Kodering": "1KGM" },
          { "Kebun": "KEBUN SILAU DUNIA", "Kodering": "1KSA" },
          { "Kebun": "KEBUN GUNUNG PARA", "Kodering": "1KGR" },
          { "Kebun": "KEBUN SEI PUTIH", "Kodering": "1KSP" },
          { "Kebun": "KEBUN SARANG GITING", "Kodering": "1KSG" },
          { "Kebun": "KEBUN TANAH RAJA", "Kodering": "1KTR" },
          { "Kebun": "KEBUN RAMBUTAN", "Kodering": "1KRB" },
          { "Kebun": "KEBUN HAPESONG", "Kodering": "1KHG" },
          { "Kebun": "KEBUN BATANG TORU", "Kodering": "1KBU" },
          { "Kebun": "KEBUN SEI MERANTI", "Kodering": "1KMS" },
          { "Kebun": "KEBUN BUKIT TUJUH", "Kodering": "1KBT" },
          { "Kebun": "KEBUN KARANG INONG", "Kodering": "1KKI" },
          { "Kebun": "KEBUN JOLOK RAYEUK SELATAN", "Kodering": "1KLJ" },
          { "Kebun": "KEBUN CISALAK BARU", "Kodering": "1KCB" },
          { "Kebun": "KEBUN BOJONG DATAR", "Kodering": "1KBO" },
          { "Kebun": "KEBUN PANGLEJAR", "Kodering": "1KPA" },
          { "Kebun": "KEBUN KERTAJAYA", "Kodering": "1KKE" },
          { "Kebun": "KEBUN CIBUNGUNG", "Kodering": "1KTB" },
          { "Kebun": "KEBUN CIKASUNGKA", "Kodering": "1KCI" },
          { "Kebun": "KEBUN SUKA MAJU", "Kodering": "1KKA" }
        ];
        
        // Create mapping from kebun name to kodering using fallback data
        const mapping = {};
        fallbackData.forEach(item => {
          // Add both full name and name without "KEBUN " prefix
          const fullName = item.Kebun;
          const shortName = fullName.replace(/^KEBUN\s+/i, '');
          
          mapping[fullName.toLowerCase()] = item.Kodering;
          mapping[shortName.toLowerCase()] = item.Kodering;
        });
        koderingMap.value = mapping;
      }
    };
    
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
    
    // Helper function to get realized area
    const getRealizedArea = (cells) => {
      const activities = [
        { realisasi: cells[7] },   // Ripper
        { realisasi: cells[11] },  // Luku
        { realisasi: cells[15] },  // Tumbang/Chipping
        { realisasi: cells[23] },  // Menanam Mucuna
        { realisasi: cells[27] },  // Lubang Tanam
        { realisasi: cells[31] },  // Mempupuk Lobang
        { realisasi: cells[35] }   // Menanam KS
      ];

      let totalRealisasi = 0;
      activities.forEach(activity => {
        const realisasi = activity.realisasi ? activity.realisasi.v : 0;
        totalRealisasi += parseFloat(realisasi) || 0;
      });

      return totalRealisasi;
    };
    
    // Helper function to check if a row should be included based on filters
    const shouldIncludeRow = (kebun, afd, paket) => {
      // Jika filter kebun aktif, hanya tampilkan data dari kebun tersebut
      if (currentFilters.value.kebun && kebun !== currentFilters.value.kebun) return false;
      
      // Jika filter paket aktif, hanya tampilkan data dari paket tersebut
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
        if (currentFilters.value.paket && item.paket !== currentFilters.value.paket) return false;
        return true;
      });
    });
    
    // Filtered progress data yesterday
    const filteredProgressDataYesterday = computed(() => {
      return progressDataYesterday.value.filter(item => {
        if (currentFilters.value.kebun && item.kebun !== currentFilters.value.kebun) return false;
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
    
    // Mendapatkan opsi paket berdasarkan kebun yang dipilih (tanpa AFD)
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
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed.y || 0;
                return `Progress TU (%): ${value.toFixed(2)}`;
              },
              afterLabel: function(context) {
                return `Luas Paket: ${context.raw.luasPaket || 0} ha`;
              }
            }
          }
        }
      }
    };
  }
  
  const rows = rawData.value.table.rows;
  
  // Debug: Log structure of first data row
  if (rows.length > 1) {
    console.log("Struktur data baris pertama:", rows[1].c);
  }
  
  // Jika filter kebun dan vendor aktif, tampilkan per afdeling
  if (filterKebun.value && filterPaket.value) {
    const dataPoints = [];
    let currentKebun = null;
    
    // Proses data untuk mendapatkan progress per afdeling
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
        
        // Hanya proses jika kebun dan paket sesuai dengan filter
        if (currentKebun === filterKebun.value && paketName === filterPaket.value) {
          // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
          const lcPersentase = calculateProgressTU(cells);
          const realizedArea = getRealizedArea(cells);
          
          // Debug: Log cell values
          console.log(`Baris ${i}: Kebun=${currentKebun}, Afd=${afdName}, Paket=${paketName}`);
          console.log("Cells[4]:", cells[4]);
          
          // Ambil luas paket dari kolom ke-4 (indeks 4)
          let luasPaket = 0;
          if (cells[4]) {
            // Coba ambil nilai dari properti v atau f
            if (cells[4].v !== undefined && cells[4].v !== null) {
              luasPaket = parseFloat(cells[4].v) || 0;
            } else if (cells[4].f !== undefined && cells[4].f !== null) {
              // Jika v tidak ada, coba f (formatted value)
              // Hapus tanda koma dan titik untuk memastikan parsing yang benar
              const formattedValue = cells[4].f.replace(/[,.]/g, '');
              luasPaket = parseFloat(formattedValue) || 0;
            }
          }
          
          console.log(`Luas Paket yang diambil: ${luasPaket}`);
          
          // Format label: afdeling saja
          const label = afdName;
          
          dataPoints.push({
            label: label,
            progress: lcPersentase,
            realizedArea: realizedArea,
            luasPaket: luasPaket
          });
        }
      }
    }
    
    console.log("Data points yang akan dikirim ke chart:", dataPoints);
    
    // Buat array khusus untuk luas paket
    const luasPaketArray = dataPoints.map(dp => dp.luasPaket);
    
    return {
      labels: dataPoints.map(dp => dp.label),
      datasets: [{
        label: 'Progress TU (%)',
        data: dataPoints.map(dp => dp.progress),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        // Tambahkan data luas paket sebagai properti tambahan
        luasPaket: luasPaketArray
      }],
      options: {
        scales: {
          y: yAxisConfig
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                // Format nilai progress dengan 2 angka desimal
                const value = context.parsed.y || 0;
                return `Progress TU (%): ${value.toFixed(2)}`;
              },
              afterLabel: function(context) {
                // Akses luas paket dari dataset
                const luasPaket = context.dataset.luasPaket[context.dataIndex] || 0;
                return `Luas Paket: ${luasPaket} ha`;
              }
            }
          }
        }
      }
    };
  }
  
  // Jika filter vendor aktif, tampilkan per afdeling dengan kodering
  if (filterPaket.value && !filterKebun.value) {
    const dataPoints = [];
    let currentKebun = null;
    
    // Proses data untuk mendapatkan progress per afdeling
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
        
        // Hanya proses jika paket sesuai dengan filter
        if (paketName === filterPaket.value) {
          // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
          const lcPersentase = calculateProgressTU(cells);
          const realizedArea = getRealizedArea(cells);
          
          // Debug: Log cell values
          console.log(`Baris ${i}: Kebun=${currentKebun}, Afd=${afdName}, Paket=${paketName}`);
          console.log("Cells[4]:", cells[4]);
          
          // Ambil luas paket dari kolom ke-4 (indeks 4)
          let luasPaket = 0;
          if (cells[4]) {
            // Coba ambil nilai dari properti v atau f
            if (cells[4].v !== undefined && cells[4].v !== null) {
              luasPaket = parseFloat(cells[4].v) || 0;
            } else if (cells[4].f !== undefined && cells[4].f !== null) {
              // Jika v tidak ada, coba f (formatted value)
              // Hapus tanda koma dan titik untuk memastikan parsing yang benar
              const formattedValue = cells[4].f.replace(/[,.]/g, '');
              luasPaket = parseFloat(formattedValue) || 0;
            }
          }
          
          console.log(`Luas Paket yang diambil: ${luasPaket}`);
          
          // Get kodering for the kebun
          const kodering = getKodering(currentKebun);
          
          // Format label: kodering - afdeling
          const label = `${kodering} - AFD ${afdName}`;
          
          dataPoints.push({
            label: label,
            progress: lcPersentase,
            realizedArea: realizedArea,
            luasPaket: luasPaket
          });
        }
      }
    }
    
    console.log("Data points yang akan dikirim ke chart:", dataPoints);
    
    // Buat array khusus untuk luas paket
    const luasPaketArray = dataPoints.map(dp => dp.luasPaket);
    
    return {
      labels: dataPoints.map(dp => dp.label),
      datasets: [{
        label: 'Progress TU (%)',
        data: dataPoints.map(dp => dp.progress),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        // Tambahkan data luas paket sebagai properti tambahan
        luasPaket: luasPaketArray
      }],
      options: {
        scales: {
          y: yAxisConfig
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                // Format nilai progress dengan 2 angka desimal
                const value = context.parsed.y || 0;
                return `Progress TU (%): ${value.toFixed(2)}`;
              },
              afterLabel: function(context) {
                // Akses luas paket dari dataset
                const luasPaket = context.dataset.luasPaket[context.dataIndex] || 0;
                return `Luas Paket: ${luasPaket} ha`;
              }
            }
          }
        }
      }
    };
  }
  
  // Jika filter kebun aktif, tampilkan per afdeling dan vendor
  if (filterKebun.value && !filterPaket.value) {
    const dataPoints = [];
    let currentKebun = null;
    
    // Proses data untuk mendapatkan progress per afdeling dan vendor
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
          const realizedArea = getRealizedArea(cells);
          
          // Debug: Log cell values
          console.log(`Baris ${i}: Kebun=${currentKebun}, Afd=${afdName}, Paket=${paketName}`);
          console.log("Cells[4]:", cells[4]);
          
          // Ambil luas paket dari kolom ke-4 (indeks 4)
          let luasPaket = 0;
          if (cells[4]) {
            // Coba ambil nilai dari properti v atau f
            if (cells[4].v !== undefined && cells[4].v !== null) {
              luasPaket = parseFloat(cells[4].v) || 0;
            } else if (cells[4].f !== undefined && cells[4].f !== null) {
              // Jika v tidak ada, coba f (formatted value)
              // Hapus tanda koma dan titik untuk memastikan parsing yang benar
              const formattedValue = cells[4].f.replace(/[,.]/g, '');
              luasPaket = parseFloat(formattedValue) || 0;
            }
          }
          
          console.log(`Luas Paket yang diambil: ${luasPaket}`);
          
          // Format label: afdeling - vendor
          const label = `AFD ${afdName} - ${paketName}`;
          
          dataPoints.push({
            label: label,
            progress: lcPersentase,
            realizedArea: realizedArea,
            luasPaket: luasPaket
          });
        }
      }
    }
    
    console.log("Data points yang akan dikirim ke chart:", dataPoints);
    
    // Buat array khusus untuk luas paket
    const luasPaketArray = dataPoints.map(dp => dp.luasPaket);
    
    return {
      labels: dataPoints.map(dp => dp.label),
      datasets: [{
        label: 'Progress TU (%)',
        data: dataPoints.map(dp => dp.progress),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        // Tambahkan data luas paket sebagai properti tambahan
        luasPaket: luasPaketArray
      }],
      options: {
        scales: {
          y: yAxisConfig
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                // Format nilai progress dengan 2 angka desimal
                const value = context.parsed.y || 0;
                return `Progress TU (%): ${value.toFixed(2)}`;
              },
              afterLabel: function(context) {
                // Akses luas paket dari dataset
                const luasPaket = context.dataset.luasPaket[context.dataIndex] || 0;
                return `Luas Paket: ${luasPaket} ha`;
              }
            }
          }
        }
      }
    };
  }
  
  // Jika tidak ada filter, tampilkan Per Vendor dengan format kodering - AFD afdeling - vendor
  if (!filterKebun.value && !filterPaket.value) {
    const dataPoints = [];
    let currentKebun = null;
    
    // Proses data untuk mendapatkan progress Per Vendor
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
        const realizedArea = getRealizedArea(cells);
        
        // Debug: Log cell values
        console.log(`Baris ${i}: Kebun=${currentKebun}, Afd=${afdName}, Paket=${paketName}`);
        console.log("Cells[4]:", cells[4]);
        
        // Ambil luas paket dari kolom ke-4 (indeks 4)
        let luasPaket = 0;
        if (cells[4]) {
          // Coba ambil nilai dari properti v atau f
          if (cells[4].v !== undefined && cells[4].v !== null) {
            luasPaket = parseFloat(cells[4].v) || 0;
          } else if (cells[4].f !== undefined && cells[4].f !== null) {
            // Jika v tidak ada, coba f (formatted value)
            // Hapus tanda koma dan titik untuk memastikan parsing yang benar
            const formattedValue = cells[4].f.replace(/[,.]/g, '');
            luasPaket = parseFloat(formattedValue) || 0;
          }
        }
        
        console.log(`Luas Paket yang diambil: ${luasPaket}`);
        
        // Get kodering for the kebun
        const kodering = getKodering(currentKebun);
        
        // Format label: kodering - AFD afdeling - vendor
        const label = `${kodering} - AFD ${afdName} - ${paketName}`;
        
        dataPoints.push({
          label: label,
          progress: lcPersentase,
          realizedArea: realizedArea,
          luasPaket: luasPaket
        });
      }
    }
    
    console.log("Data points yang akan dikirim ke chart:", dataPoints);
    
    // Buat array khusus untuk luas paket
    const luasPaketArray = dataPoints.map(dp => dp.luasPaket);
    
    return {
      labels: dataPoints.map(dp => dp.label),
      datasets: [{
        label: 'Progress TU (%)',
        data: dataPoints.map(dp => dp.progress),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        // Tambahkan data luas paket sebagai properti tambahan
        luasPaket: luasPaketArray
      }],
      options: {
        scales: {
          y: yAxisConfig
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                // Format nilai progress dengan 2 angka desimal
                const value = context.parsed.y || 0;
                return `Progress TU (%): ${value.toFixed(2)}`;
              },
              afterLabel: function(context) {
                // Akses luas paket dari dataset
                const luasPaket = context.dataset.luasPaket[context.dataIndex] || 0;
                return `Luas Paket: ${luasPaket} ha`;
              }
            }
          }
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
    return [];
  }
  
  const rows = rawData.value.table.rows;
  
  // Definisikan semua aktivitas yang akan ditampilkan di radar chart
  const activityLabels = [
    'Pembuatan Parit (Mtr)',
    'Pembuatan Jalan (Mtr)',
    'Pembuatan Teras (Mtr)',
    'Ripping (ha)',
    'Luku (ha)',
    'Tumbang/Chipping (ha)',
    'Menanam Mucuna (ha)',
    'Lubang Tanam KS (ha)',
    'Menanam KS (ha)'
  ];
  
  // Array untuk menyimpan semua chart data
  const chartsData = [];
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
      
      // Buat label berdasarkan filter yang aktif
      let label = '';
      
      if (filterKebun.value && filterPaket.value) {
        label = afdName;
      } else if (filterPaket.value && !filterKebun.value) {
        const kodering = getKodering(currentKebun);
        label = `${kodering} - AFD ${afdName}`;
      } else if (filterKebun.value && !filterPaket.value) {
        label = `AFD ${afdName} - ${paketName}`;
      } else {
        const kodering = getKodering(currentKebun);
        label = `${kodering} - AFD ${afdName} - ${paketName}`;
      }
      
      // Fungsi untuk menghitung persentase
      const calculatePercentage = (realisasi, rencana) => {
        if (!rencana || rencana === 0) return 0;
        return (realisasi / rencana) * 100;
      };
      
      // Aktivitas-aktivitas dengan indeks kolom yang sesuai
      const activities = [
        { 
          name: 'Pembuatan Parit (Mtr)', 
          rencana: cells[17] ? cells[17].v : 0, 
          realisasi: cells[19] ? cells[19].v : 0 
        },
        { 
          name: 'Pembuatan Jalan (Mtr)', 
          rencana: cells[37] ? cells[37].v : 0, 
          realisasi: cells[39] ? cells[39].v : 0 
        },
        { 
          name: 'Pembuatan Teras (Mtr)', 
          rencana: cells[41] ? cells[41].v : 0, 
          realisasi: cells[43] ? cells[43].v : 0 
        },
        { 
          name: 'Ripping (ha)', 
          rencana: cells[5] ? cells[5].v : 0, 
          realisasi: cells[7] ? cells[7].v : 0 
        },
        { 
          name: 'Luku (ha)', 
          rencana: cells[9] ? cells[9].v : 0, 
          realisasi: cells[11] ? cells[11].v : 0 
        },
        { 
          name: 'Tumbang/Chipping (ha)', 
          rencana: cells[13] ? cells[13].v : 0, 
          realisasi: cells[15] ? cells[15].v : 0 
        },
        { 
          name: 'Menanam Mucuna (ha)', 
          rencana: cells[21] ? cells[21].v : 0, 
          realisasi: cells[23] ? cells[23].v : 0 
        },
        { 
          name: 'Lubang Tanam KS (ha)', 
          rencana: cells[25] ? cells[25].v : 0, 
          realisasi: cells[27] ? cells[27].v : 0 
        },
        { 
          name: 'Menanam KS (ha)', 
          rencana: cells[33] ? cells[33].v : 0, 
          realisasi: cells[35] ? cells[35].v : 0 
        }
      ];
      
      // Array untuk menyimpan data aktivitas (persentase)
      const activityData = [];
      // Array baru untuk menyimpan detail (rencana & realisasi)
      const detailInfo = [];
      
      // Proses setiap aktivitas
      activities.forEach(activity => {
        const rencana = parseFloat(activity.rencana) || 0;
        const realisasi = parseFloat(activity.realisasi) || 0;
        
        // Hitung progress = (realisasi / rencana) * 100
        let persentase = calculatePercentage(realisasi, rencana);
        persentase = Math.min(persentase, 100);
        
        activityData.push(persentase);
        
        // Simpan detail untuk tooltip
        detailInfo.push({
          rencana: rencana,
          realisasi: realisasi
        });
      });
      
      // Buat chart data untuk vendor/kebun/afdeling ini
      chartsData.push({
        title: label,
        data: {
          labels: activityLabels,
          datasets: [{
            label: 'Progress (%)',
            data: activityData,
            // TAMBAHKAN detailInfo KE DALAM DATASET
            detailInfo: detailInfo, 
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 1)',
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
          }]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20,
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.parsed.r.toFixed(2)}%`;
                }
              }
            }
          }
        }
      });
    }
  }
  
  console.log("Radar Chart Data:", chartsData);
  return chartsData;
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
          }],
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.parsed}%`;
                  }
                }
              }
            }
          }
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
      
      // Jika filter kebun dan vendor aktif, tampilkan per afdeling
      if (filterKebun.value && filterPaket.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        // Proses data untuk mendapatkan progress per afdeling
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
            
            // Only process if kebun and paket matches filter
            if (currentKebun === filterKebun.value && paketName === filterPaket.value) {
              // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
              const lcPersentase = calculateProgressTU(cells);
              
              // Format label: afdeling saja
              const label = afdName;
              
              dataPoints.push({
                label: label,
                progress: lcPersentase
              });
            }
          }
        }
        
        // Generate colors
        const colors = generateColors(dataPoints.length);
        
        return {
          labels: dataPoints.map(dp => dp.label),
          datasets: [{
            data: dataPoints.map(dp => dp.progress),
            backgroundColor: colors.map(c => c.background),
            borderColor: colors.map(c => c.border),
            borderWidth: 1
          }],
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.parsed}%`;
                  }
                }
              }
            }
          }
        };
      }
      
      // Jika filter vendor aktif, tampilkan per afdeling dengan kodering
      if (filterPaket.value && !filterKebun.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        // Proses data untuk mendapatkan progress per afdeling
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
            
            // Only process if paket matches filter
            if (paketName === filterPaket.value) {
              // Hitung Progress TU dengan fungsi baru (tanpa aktivitas parit)
              const lcPersentase = calculateProgressTU(cells);
              
              // Get kodering for the kebun
              const kodering = getKodering(currentKebun);
              
              // Format label: kodering - afdeling
              const label = `${kodering} - AFD ${afdName}`;
              
              dataPoints.push({
                label: label,
                progress: lcPersentase
              });
            }
          }
        }
        
        // Generate colors
        const colors = generateColors(dataPoints.length);
        
        return {
          labels: dataPoints.map(dp => dp.label),
          datasets: [{
            data: dataPoints.map(dp => dp.progress),
            backgroundColor: colors.map(c => c.background),
            borderColor: colors.map(c => c.border),
            borderWidth: 1
          }],
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.parsed}%`;
                  }
                }
              }
            }
          }
        };
      }
      
      // Jika filter kebun aktif, tampilkan per afdeling dan vendor
      if (filterKebun.value && !filterPaket.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        // Proses data untuk mendapatkan progress per afdeling dan vendor
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
              
              // Format label: afdeling - vendor
              const label = `${afdName} - ${paketName}`;
              
              dataPoints.push({
                label: label,
                progress: lcPersentase
              });
            }
          }
        }
        
        // Generate colors
        const colors = generateColors(dataPoints.length);
        
        return {
          labels: dataPoints.map(dp => dp.label),
          datasets: [{
            data: dataPoints.map(dp => dp.progress),
            backgroundColor: colors.map(c => c.background),
            borderColor: colors.map(c => c.border),
            borderWidth: 1
          }],
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.parsed}%`;
                  }
                }
              }
            }
          }
        };
      }
      
      // Jika tidak ada filter, tampilkan Per Vendor dengan format kodering - afdeling - vendor
      if (!filterKebun.value && !filterPaket.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        // Process data to get progress Per Vendor
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
            
            // Get kodering for the kebun
            const kodering = getKodering(currentKebun);
            
            // Format label: kodering - afdeling - vendor
            const label = `${kodering} - AFD ${afdName} - ${paketName}`;
            
            dataPoints.push({
              label: label,
              progress: lcPersentase
            });
          }
        }
        
        // Generate colors
        const colors = generateColors(dataPoints.length);
        
        return {
          labels: dataPoints.map(dp => dp.label),
          datasets: [{
            data: dataPoints.map(dp => dp.progress),
            backgroundColor: colors.map(c => c.background),
            borderColor: colors.map(c => c.border),
            borderWidth: 1
          }],
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.parsed}%`;
                  }
                }
              }
            }
          }
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
        paket: filterPaket.value,
        search: filterSearch.value
      };
    };
    
    // Watch for filter changes and apply automatically
    watch([filterKebun, filterPaket], () => {
      applyFilters();
    });
    
    // Refresh data
    const refreshData = async () => {
      try {
        loading.value = true;
        rawData.value = await fetchSheetData();
        
        // Reset filters
        filterKebun.value = '';
        filterPaket.value = '';
        filterSearch.value = '';
        currentFilters.value = {
          kebun: '',
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
        // Load kodering data first
        await loadKoderingData();
        
        // Then load sheet data
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
  margin-bottom: 1rem;
}
.toggle-button:hover {
  background-color: #0056b3;
}

/* Style untuk Pie Chart dengan overflow horizontal */
.pie-chart-outer {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

/* Scrollbar styling */
.pie-chart-outer::-webkit-scrollbar {
  height: 8px;
}

.pie-chart-outer::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.pie-chart-outer::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.pie-chart-outer::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Style untuk legenda */
.chart-legend {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.legend-color {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border-radius: 3px;
}
</style>