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

      <!-- FITUR RANKING BARU - Leaderboard UI -->
      <div>
        <!-- Toggle Button -->
        <button @click="toggleRanking" class="toggle-button">
          {{ rankingVisible ? 'Sembunyikan' : 'Tampilkan' }} Ranking Progress Harian
        </button>

        <div v-show="rankingVisible" class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Ranking Progress Harian - Semua Paket</h2>
          </div>
          
    <!-- PERUBAHAN: Podium Card untuk Top 3 -->
    <div class="podium-card mb-6">
      <div class="podium-header">
        <h3 class="podium-title">Top 3 Kebun</h3>
      </div>
      <div class="podium-content">
        <div class="podium-positions">
          <!-- Peringkat 2 (Kiri) -->
          <div v-if="topRankingData[1]" class="podium-position position-2">
            <div class="medal-container medal-silver">
              <img src="/medal (2).png" alt="Medal Rank 2" class="medal-image">
            </div>
            <div class="podium-info">
              <div class="podium-name">{{ topRankingData[1].name }}</div>
              <div class="podium-details">
                <div class="podium-detail">
                  <span class="detail-label">Kebun:</span>
                  <span class="detail-value">{{ topRankingData[1].kebun }}</span>
                </div>
                <div class="podium-detail">
                  <span class="detail-label">Afd:</span>
                  <span class="detail-value">{{ topRankingData[1].afd }}</span>
                </div>
                <div class="podium-detail">
                  <span class="detail-label">Vendor:</span>
                  <span class="detail-value">{{ topRankingData[1].paket }}</span>
                </div>
                <div class="podium-detail">
                  <span class="detail-label">Luas:</span>
                  <span class="detail-value">{{ topRankingData[1].luasPaket.toFixed(2) }} ha</span>
                </div>
              </div>
              <div class="podium-progress">
                <div class="progress-value">{{ topRankingData[1].progress.toFixed(1) }}%</div>
                <div class="progress-change" :class="getChangeClass(topRankingData[1].change)">
                  {{ topRankingData[1].change > 0 ? '+' : '' }}{{ topRankingData[1].change.toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
          
          <!-- Peringkat 1 (Tengah) dengan gambar medal -->
          <div v-if="topRankingData[0]" class="podium-position position-1">
            <div class="medal-container medal-gold">
              <img src="/medal (1).png" alt="Medal Rank 1" class="medal-image">
            </div>
            <div class="podium-info">
              <div class="podium-name">{{ topRankingData[0].name }}</div>
              <div class="podium-details">
                <div class="podium-detail">
                  <span class="detail-label">Kebun:</span>
                  <span class="detail-value">{{ topRankingData[0].kebun }}</span>
                </div>
                <div class="podium-detail">
                  <span class="detail-label">Afd:</span>
                  <span class="detail-value">{{ topRankingData[0].afd }}</span>
                </div>
                <div class="podium-detail">
                  <span class="detail-label">Vendor:</span>
                  <span class="detail-value">{{ topRankingData[0].paket }}</span>
                </div>
                <div class="podium-detail">
                  <span class="detail-label">Luas:</span>
                  <span class="detail-value">{{ topRankingData[0].luasPaket.toFixed(2) }} ha</span>
                </div>
              </div>
              <div class="podium-progress">
                <div class="progress-value">{{ topRankingData[0].progress.toFixed(1) }}%</div>
                <div class="progress-change" :class="getChangeClass(topRankingData[0].change)">
                  {{ topRankingData[0].change > 0 ? '+' : '' }}{{ topRankingData[0].change.toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
          
          <!-- Peringkat 3 (Kanan) -->
          <div v-if="topRankingData[2]" class="podium-position position-3">
            <div class="medal-container medal-bronze">
              <img src="/medal (3).png" alt="Medal Rank 3" class="medal-image">
            </div>
            <div class="podium-info">
              <div class="podium-name">{{ topRankingData[2].name }}</div>
              <div class="podium-details">
                <div class="podium-detail">
                  <span class="detail-label">Kebun:</span>
                  <span class="detail-value">{{ topRankingData[2].kebun }}</span>
                </div>
                <div class="podium-detail">
                  <span class="detail-label">Afd:</span>
                  <span class="detail-value">{{ topRankingData[2].afd }}</span>
                </div>
                <div class="podium-detail">
                  <span class="detail-label">Vendor:</span>
                  <span class="detail-value">{{ topRankingData[2].paket }}</span>
                </div>
                <div class="podium-detail">
                  <span class="detail-label">Luas:</span>
                  <span class="detail-value">{{ topRankingData[2].luasPaket.toFixed(2) }} ha</span>
                </div>
              </div>
              <div class="podium-progress">
                <div class="progress-value">{{ topRankingData[2].progress.toFixed(1) }}%</div>
                <div class="progress-change" :class="getChangeClass(topRankingData[2].change)">
                  {{ topRankingData[2].change > 0 ? '+' : '' }}{{ topRankingData[2].change.toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br></br>
          
          <!-- Rest of Ranking List -->
          <div class="ranking-list">
            <div v-for="(item, index) in restRankingData" :key="item.id" 
                 class="ranking-item">
              <div class="rank-position">{{ index + 4 }}</div>
              <div class="item-content">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-details">
                  <span class="item-detail">{{ item.kebun }} - {{ item.afd }} - {{ item.paket }}</span>
                  <span class="item-detail">{{ item.luasPaket.toFixed(2) }} ha</span>
                </div>
              </div>
              <div class="item-progress">
                <div class="progress-value">{{ item.progress.toFixed(1) }}%</div>
                <div class="progress-change" :class="getChangeClass(item.change)">
                  {{ item.change > 0 ? '+' : '' }}{{ item.change.toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <!-- Toggle Button -->
        <button @click="toggleFilters" class="toggle-button">
          {{ filtersVisible ? 'Sembunyikan' : 'Tampilkan' }} Filter
        </button>

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
    <!-- Floating Action Button for Scroll to Top -->
    <div v-show="showScrollTop" class="fab-container">
      <button @click="scrollToTop" class="fab" title="Scroll to Top">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
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
      rankingVisible: false,
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
    toggleRanking() {
      this.rankingVisible = !this.rankingVisible;
    },
    updateDateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.currentDate = now.toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    },
    // Fungsi untuk menentukan kelas perubahan progress
    getChangeClass(change) {
      if (change > 0) return 'positive-change';
      if (change < 0) return 'negative-change';
      return 'neutral-change';
    },
      handleScroll() {
    this.showScrollTop = window.pageYOffset > 300;
  },
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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
    
    // Add scroll event listener
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    clearInterval(this.timeInterval);
      // Remove scroll event listener
  window.removeEventListener('scroll', this.handleScroll);
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
      
      const lowerKebun = kebunName.toLowerCase();
      if (koderingMap.value[lowerKebun]) {
        return koderingMap.value[lowerKebun];
      }
      
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
        
        const mapping = {};
        data.forEach(item => {
          const fullName = item.Kebun;
          const shortName = fullName.replace(/^KEBUN\s+/i, '');
          
          mapping[fullName.toLowerCase()] = item.Kodering;
          mapping[shortName.toLowerCase()] = item.Kodering;
        });
        koderingMap.value = mapping;
      } catch (error) {
        console.error('Error loading kodering data from file, using fallback data:', error);
        
        const fallbackData = [
          { "Kebun": "KEBUN SEI DAUN", "Kodering": "1KSD" }, { "Kebun": "KEBUN TORGAMBA", "Kodering": "1KTO" }, { "Kebun": "KEBUN SEI BARUHUR", "Kodering": "1KSB" }, { "Kebun": "KEBUN SEI KEBARA", "Kodering": "1KSK" }, { "Kebun": "KEBUN AEK TOROP", "Kodering": "1KAT" }, { "Kebun": "KEBUN AEK RASO", "Kodering": "1KAR" }, { "Kebun": "KEBUN SISUMUT", "Kodering": "1KSU" }, { "Kebun": "KEBUN AEK NABARA UTARA", "Kodering": "1KAN" }, { "Kebun": "KEBUN AEK NABARA SELATAN", "Kodering": "1KAS" }, { "Kebun": "KEBUN RANTAU PRAPAT", "Kodering": "1KRP" }, { "Kebun": "KEBUN MEMBANG MUDA", "Kodering": "1KMM" }, { "Kebun": "KEBUN LABUHAN HAJI", "Kodering": "1KLJ" }, { "Kebun": "KEBUN MERBAU SELATAN", "Kodering": "1KMS" }, { "Kebun": "KEBUN SEI DADAP", "Kodering": "1KDP" }, { "Kebun": "KEBUN PULAU MANDI", "Kodering": "1KPM" }, { "Kebun": "1KAM", "Kodering": "1KAM" }, { "Kebun": "KEBUN SEI SILAU", "Kodering": "1KSL" }, { "Kebun": "KEBUN HUTA PADANG", "Kodering": "1KHP" }, { "Kebun": "KEBUN BANDAR SELAMAT", "Kodering": "1KBS" }, { "Kebun": "KEBUN DUSUN HULU", "Kodering": "1KDH" }, { "Kebun": "KEBUN BANDAR BETSY", "Kodering": "1KBB" }, { "Kebun": "KEBUN BANGUN", "Kodering": "1KBN" }, { "Kebun": "KEBUN GUNUNG PAMELA", "Kodering": "1KGP" }, { "Kebun": "KEBUN GUNUNG MONAKO", "Kodering": "1KGM" }, { "Kebun": "KEBUN SILAU DUNIA", "Kodering": "1KSA" }, { "Kebun": "KEBUN GUNUNG PARA", "Kodering": "1KGR" }, { "Kebun": "KEBUN SEI PUTIH", "Kodering": "1KSP" }, { "Kebun": "KEBUN SARANG GITING", "Kodering": "1KSG" }, { "Kebun": "KEBUN TANAH RAJA", "Kodering": "1KTR" }, { "Kebun": "KEBUN RAMBUTAN", "Kodering": "1KRB" }, { "Kebun": "KEBUN HAPESONG", "Kodering": "1KHG" }, { "Kebun": "KEBUN BATANG TORU", "Kodering": "1KBU" }, { "Kebun": "KEBUN SEI MERANTI", "Kodering": "1KMS" }, { "Kebun": "KEBUN BUKIT TUJUH", "Kodering": "1KBT" }, { "Kebun": "KEBUN KARANG INONG", "Kodering": "1KKI" }, { "Kebun": "KEBUN JOLOK RAYEUK SELATAN", "Kodering": "1KLJ" }, { "Kebun": "KEBUN CISALAK BARU", "Kodering": "1KCB" }, { "Kebun": "KEBUN BOJONG DATAR", "Kodering": "1KBO" }, { "Kebun": "KEBUN PANGLEJAR", "Kodering": "1KPA" }, { "Kebun": "KEBUN KERTAJAYA", "Kodering": "1KKE" }, { "Kebun": "KEBUN CIBUNGUNG", "Kodering": "1KTB" }, { "Kebun": "KEBUN CIKASUNGKA", "Kodering": "1KCI" }, { "Kebun": "KEBUN SUKA MAJU", "Kodering": "1KKA" }
        ];
        
        const mapping = {};
        fallbackData.forEach(item => {
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
      const activities = [
        { rencana: cells[5], realisasi: cells[7] },      
        { rencana: cells[9], realisasi: cells[11] },     
        { rencana: cells[13], realisasi: cells[15] },    
        { rencana: cells[21], realisasi: cells[23] },    
        { rencana: cells[25], realisasi: cells[27] },    
        { rencana: cells[29], realisasi: cells[31] },    
        { rencana: cells[33], realisasi: cells[35] }     
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
    
    const getRealizedArea = (cells) => {
      const activities = [
        { realisasi: cells[7] },   
        { realisasi: cells[11] },  
        { realisasi: cells[15] },  
        { realisasi: cells[23] },  
        { realisasi: cells[27] },  
        { realisasi: cells[31] },  
        { realisasi: cells[35] }   
      ];

      let totalRealisasi = 0;
      activities.forEach(activity => {
        const realisasi = activity.realisasi ? activity.realisasi.v : 0;
        totalRealisasi += parseFloat(realisasi) || 0;
      });

      return totalRealisasi;
    };
    
    const shouldIncludeRow = (kebun, afd, paket) => {
      if (currentFilters.value.kebun && kebun !== currentFilters.value.kebun) return false;
      if (currentFilters.value.paket && paket !== currentFilters.value.paket) return false;
      return true;
    };
    
    // Fungsi untuk mengambil semua data progress hari ini
    const fetchAllProgressDataToday = async () => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const rows = rawData.value.table.rows;
      const result = [];
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        if (!kebunName && !afdName) continue;
        
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        if (!afdName && !kebunName) continue;
        
        if (currentKebun && afdName) {
          const progressTU = calculateProgressTU(cells);
          
          // Ambil luas paket
          let luasPaket = 0;
          if (cells[4]) {
            if (cells[4].v !== undefined && cells[4].v !== null) {
              luasPaket = parseFloat(cells[4].v) || 0;
            } else if (cells[4].f !== undefined && cells[4].f !== null) {
              const formattedValue = cells[4].f.replace(/[,.]/g, '');
              luasPaket = parseFloat(formattedValue) || 0;
            }
          }
          
          result.push({
            kebun: currentKebun,
            afd: afdName,
            paket: paketName,
            progress: progressTU,
            luasPaket: luasPaket
          });
        }
      }
      
      return result;
    };
    
    // Fungsi untuk menyimpan data progress ke localStorage
    const saveProgressDataToStorage = () => {
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
      const progressData = {
        date: today,
        data: progressDataToday.value
      };
      
      // Simpan data ke localStorage
      localStorage.setItem('progressData', JSON.stringify(progressData));
    };
    
    // Fungsi untuk memuat data progress dari localStorage
    const loadProgressDataFromStorage = () => {
      const savedData = localStorage.getItem('progressData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        // Jika data yang tersimpan adalah dari hari kemarin, gunakan sebagai data kemarin
        if (parsedData.date !== today) {
          progressDataYesterday.value = parsedData.data;
          return true;
        }
      }
      
      return false;
    };
    
    const processedDataForStats = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const rows = rawData.value.table.rows;
      const result = [];
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        
        if (!kebunName && !afdName) continue;
        
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        if (!afdName && !kebunName) continue;
        
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
    
    const totalLuasPaket = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return 0;
      
      let total = 0;
      const rows = rawData.value.table.rows;
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        
        if (!kebunName && !afdName) continue;
        
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        if (!afdName && !kebunName) continue;
        
        if (currentKebun && afdName) {
          const luasPaket = cells[4] ? cells[4].v : 0;
          total += parseFloat(luasPaket) || 0;
        }
      }
      
      return total.toFixed(2);
    });
    
    const filteredTotalLuasPaket = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return 0;
      
      let total = 0;
      const rows = rawData.value.table.rows;
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        if (!kebunName && !afdName) continue;
        
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        if (!afdName && !kebunName) continue;
        
        if (currentKebun && afdName) {
          if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
          
          const luasPaket = cells[4] ? cells[4].v : 0;
          total += parseFloat(luasPaket) || 0;
        }
      }
      
      return total.toFixed(2);
    });
    
    const filteredProgressDataToday = computed(() => {
      return progressDataToday.value.filter(item => {
        if (currentFilters.value.kebun && item.kebun !== currentFilters.value.kebun) return false;
        if (currentFilters.value.paket && item.paket !== currentFilters.value.paket) return false;
        return true;
      });
    });
    
    const filteredProgressDataYesterday = computed(() => {
      return progressDataYesterday.value.filter(item => {
        if (currentFilters.value.kebun && item.kebun !== currentFilters.value.kebun) return false;
        if (currentFilters.value.paket && item.paket !== currentFilters.value.paket) return false;
        return true;
      });
    });
    
    const avgProgress = computed(() => {
      if (progressDataToday.value.length === 0) return 0;
      const total = progressDataToday.value.reduce((sum, item) => sum + item.progress, 0);
      return total / progressDataToday.value.length;
    });
    
    const filteredAvgProgress = computed(() => {
      if (filteredProgressDataToday.value.length === 0) return 0;
      const total = filteredProgressDataToday.value.reduce((sum, item) => sum + item.progress, 0);
      return total / filteredProgressDataToday.value.length;
    });
    
    const filteredAvgProgressYesterday = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 0;
      const total = filteredProgressDataYesterday.value.reduce((sum, item) => sum + item.progress, 0);
      return total / filteredProgressDataYesterday.value.length;
    });
    
    const avgProgressYesterday = computed(() => {
      if (progressDataYesterday.value.length === 0) return 0;
      const total = progressDataYesterday.value.reduce((sum, item) => sum + item.progress, 0);
      return total / progressDataYesterday.value.length;
    });
    
    const filteredProgressChange = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 'Data baru';
      
      const today = filteredAvgProgress.value;
      const yesterday = filteredAvgProgressYesterday.value;
      
      if (yesterday === 0) return '0%';
      
      const change = ((today - yesterday) / yesterday) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    });
    
    const filteredProgressChangeType = computed(() => {
      if (filteredProgressDataYesterday.value.length === 0) return 'neutral';
      
      const change = parseFloat(filteredProgressChange.value);
      return change >= 0 ? 'positive' : 'negative';
    });
    
    const progressChange = computed(() => {
      if (progressDataYesterday.value.length === 0) return 'Data baru';
      
      const today = avgProgress.value;
      const yesterday = avgProgressYesterday.value;
      
      if (yesterday === 0) return '0%';
      
      const change = ((today - yesterday) / yesterday) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    });
    
    const progressChangeType = computed(() => {
      if (progressDataYesterday.value.length === 0) return 'neutral';
      
      const change = parseFloat(progressChange.value);
      return change >= 0 ? 'positive' : 'negative';
    });
    
    const uniqueKebun = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const kebunSet = new Set();
      const rows = rawData.value.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        if (kebunName) {
          kebunSet.add(kebunName);
        }
      }
      
      return Array.from(kebunSet);
    });
    
    const paketOptions = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const paketSet = new Set();
      const rows = rawData.value.table.rows;
      
      if (filterKebun.value) {
        let currentKebun = null;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          if (!kebunName && !afdName) continue;
          
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          if (!afdName && !kebunName) continue;
          
          if (currentKebun && afdName) {
            if (currentKebun === filterKebun.value && paketName) {
              paketSet.add(paketName);
            }
          }
        }
        
        return Array.from(paketSet).sort();
      } else {
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const paketName = cells[2] ? cells[2].v : '';
          
          if (paketName) {
            paketSet.add(paketName);
          }
        }
        
        return Array.from(paketSet).sort();
      }
    });
    
    const fixedYAxisTicks = [
      { value: 0 },
      { value: 20 },
      { value: 40 },
      { value: 60 },
      { value: 80 },
      { value: 100 }
    ];
    
    // Menghilangkan nilai negatif pada yAxisConfig
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
      
      if (rows.length > 1) {
        console.log("Struktur data baris pertama:", rows[1].c);
      }
      
      if (filterKebun.value && filterPaket.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          if (!kebunName && !afdName) continue;
          
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          if (!afdName && !kebunName) continue;
          
          if (currentKebun && afdName) {
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            if (currentKebun === filterKebun.value && paketName === filterPaket.value) {
              const lcPersentase = calculateProgressTU(cells);
              const realizedArea = getRealizedArea(cells);
              
              console.log(`Baris ${i}: Kebun=${currentKebun}, Afd=${afdName}, Paket=${paketName}`);
              console.log("Cells[4]:", cells[4]);
              
              let luasPaket = 0;
              if (cells[4]) {
                if (cells[4].v !== undefined && cells[4].v !== null) {
                  luasPaket = parseFloat(cells[4].v) || 0;
                } else if (cells[4].f !== undefined && cells[4].f !== null) {
                  const formattedValue = cells[4].f.replace(/[,.]/g, '');
                  luasPaket = parseFloat(formattedValue) || 0;
                }
              }
              
              console.log(`Luas Paket yang diambil: ${luasPaket}`);
              
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
        
        const luasPaketArray = dataPoints.map(dp => dp.luasPaket);
        
        return {
          labels: dataPoints.map(dp => dp.label),
          datasets: [{
            label: 'Progress TU (%)',
            data: dataPoints.map(dp => dp.progress),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
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
                    const value = context.parsed.y || 0;
                    return `Progress TU (%): ${value.toFixed(2)}`;
                  },
                  afterLabel: function(context) {
                    const luasPaket = context.dataset.luasPaket[context.dataIndex] || 0;
                    return `Luas Paket: ${luasPaket} ha`;
                  }
                }
              }
            }
          }
        };
      }
      
      if (filterPaket.value && !filterKebun.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          if (!kebunName && !afdName) continue;
          
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          if (!afdName && !kebunName) continue;
          
          if (currentKebun && afdName) {
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            if (paketName === filterPaket.value) {
              const lcPersentase = calculateProgressTU(cells);
              const realizedArea = getRealizedArea(cells);
              
              console.log(`Baris ${i}: Kebun=${currentKebun}, Afd=${afdName}, Paket=${paketName}`);
              console.log("Cells[4]:", cells[4]);
              
              let luasPaket = 0;
              if (cells[4]) {
                if (cells[4].v !== undefined && cells[4].v !== null) {
                  luasPaket = parseFloat(cells[4].v) || 0;
                } else if (cells[4].f !== undefined && cells[4].f !== null) {
                  const formattedValue = cells[4].f.replace(/[,.]/g, '');
                  luasPaket = parseFloat(formattedValue) || 0;
                }
              }
              
              console.log(`Luas Paket yang diambil: ${luasPaket}`);
              
              const kodering = getKodering(currentKebun);
              
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
        
        const luasPaketArray = dataPoints.map(dp => dp.luasPaket);
        
        return {
          labels: dataPoints.map(dp => dp.label),
          datasets: [{
            label: 'Progress TU (%)',
            data: dataPoints.map(dp => dp.progress),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
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
                    const value = context.parsed.y || 0;
                    return `Progress TU (%): ${value.toFixed(2)}`;
                  },
                  afterLabel: function(context) {
                    const luasPaket = context.dataset.luasPaket[context.dataIndex] || 0;
                    return `Luas Paket: ${luasPaket} ha`;
                  }
                }
              }
            }
          }
        };
      }
      
      if (filterKebun.value && !filterPaket.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          if (!kebunName && !afdName) continue;
          
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          if (!afdName && !kebunName) continue;
          
          if (currentKebun && afdName) {
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            if (currentKebun === filterKebun.value) {
              const lcPersentase = calculateProgressTU(cells);
              const realizedArea = getRealizedArea(cells);
              
              console.log(`Baris ${i}: Kebun=${currentKebun}, Afd=${afdName}, Paket=${paketName}`);
              console.log("Cells[4]:", cells[4]);
              
              let luasPaket = 0;
              if (cells[4]) {
                if (cells[4].v !== undefined && cells[4].v !== null) {
                  luasPaket = parseFloat(cells[4].v) || 0;
                } else if (cells[4].f !== undefined && cells[4].f !== null) {
                  const formattedValue = cells[4].f.replace(/[,.]/g, '');
                  luasPaket = parseFloat(formattedValue) || 0;
                }
              }
              
              console.log(`Luas Paket yang diambil: ${luasPaket}`);
              
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
        
        const luasPaketArray = dataPoints.map(dp => dp.luasPaket);
        
        return {
          labels: dataPoints.map(dp => dp.label),
          datasets: [{
            label: 'Progress TU (%)',
            data: dataPoints.map(dp => dp.progress),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
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
                    const value = context.parsed.y || 0;
                    return `Progress TU (%): ${value.toFixed(2)}`;
                  },
                  afterLabel: function(context) {
                    const luasPaket = context.dataset.luasPaket[context.dataIndex] || 0;
                    return `Luas Paket: ${luasPaket} ha`;
                  }
                }
              }
            }
          }
        };
      }
      
      // Menampilkan semua item pada bagian "semua paket" tanpa averaging
      if (!filterKebun.value && !filterPaket.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          if (!kebunName && !afdName) continue;
          
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          if (!afdName && !kebunName) continue;
          
          if (currentKebun && afdName) {
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            const lcPersentase = calculateProgressTU(cells);
            const realizedArea = getRealizedArea(cells);
            
            console.log(`Baris ${i}: Kebun=${currentKebun}, Afd=${afdName}, Paket=${paketName}`);
            console.log("Cells[4]:", cells[4]);
            
            let luasPaket = 0;
            if (cells[4]) {
              if (cells[4].v !== undefined && cells[4].v !== null) {
                luasPaket = parseFloat(cells[4].v) || 0;
              } else if (cells[4].f !== undefined && cells[4].f !== null) {
                const formattedValue = cells[4].f.replace(/[,.]/g, '');
                luasPaket = parseFloat(formattedValue) || 0;
              }
            }
            
            console.log(`Luas Paket yang diambil: ${luasPaket}`);
            
            const kodering = getKodering(currentKebun);
            
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
        
        const luasPaketArray = dataPoints.map(dp => dp.luasPaket);
        
        return {
          labels: dataPoints.map(dp => dp.label),
          datasets: [{
            label: 'Progress TU (%)',
            data: dataPoints.map(dp => dp.progress),
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
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
                    const value = context.parsed.y || 0;
                    return `Progress TU (%): ${value.toFixed(2)}`;
                  },
                  afterLabel: function(context) {
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
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        if (!kebunName && !afdName) continue;
        
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        if (!afdName && !kebunName) continue;
        
        if (currentKebun && afdName) {
          if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
          
          const lcPersentase = calculateProgressTU(cells);
          
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
          detailInfo: Object.values(progressCategories).map(cat => 
            cat.items.map(item => `${item.kebun} ${item.afd} (${item.paket}): ${item.progress.toFixed(1)}%`).join('<br>')
          )
        }]
      };
    });
    
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
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        if (!kebunName && !afdName) continue;
        
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        if (!afdName && !kebunName) continue;
        
        if (currentKebun && afdName) {
          if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
          
          const lcPersentase = calculateProgressTU(cells);
          
          if (!kebunData[currentKebun]) {
            kebunData[currentKebun] = [];
          }
          
          kebunData[currentKebun].push(lcPersentase);
        }
      }
      
      const labels = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
      }
      
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
        const data = [];
        
        const currentValue = kebunData[kebun].length > 0 
          ? kebunData[kebun].reduce((sum, val) => sum + val, 0) / kebunData[kebun].length 
          : 0;
        
        for (let i = 0; i < 7; i++) {
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

const radarChartData = computed(() => {
  if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) {
    return [];
  }
  
  const rows = rawData.value.table.rows;
  
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
  
  const chartsData = [];
  let currentKebun = null;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.c;
    
    if (!cells || cells.length === 0) continue;
    
    if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
    
    const kebunName = cells[1] ? cells[1].v : '';
    const afdName = cells[3] ? cells[3].v : '';
    const paketName = cells[2] ? cells[2].v : '';
    
    if (!kebunName && !afdName) continue;
    
    if (kebunName) {
      currentKebun = kebunName;
    }
    
    if (!afdName && !kebunName) continue;
    
    if (currentKebun && afdName) {
      if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
      
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
      
      // --- LOGIKA PERHITUNGAN PERSEN (UPDATE SESUAI REQUEST) ---
      const calculatePercentage = (realisasi, rencana) => {
        // 1. Jika rencana 0, anggap 100%
        if (!rencana || rencana === 0) return 100;
        
        const pct = (realisasi / rencana) * 100;
        
        // 2. Jika persentase > 100%, batasi menjadi 100%
        if (pct > 100) return 100;
        
        return pct;
      };
      // ----------------------------------------------------------
      
      const activities = [
        { name: 'Pembuatan Parit (Mtr)', rencana: cells[17] ? cells[17].v : 0, realisasi: cells[19] ? cells[19].v : 0 },
        { name: 'Pembuatan Jalan (Mtr)', rencana: cells[37] ? cells[37].v : 0, realisasi: cells[39] ? cells[39].v : 0 },
        { name: 'Pembuatan Teras (Mtr)', rencana: cells[41] ? cells[41].v : 0, realisasi: cells[43] ? cells[43].v : 0 },
        { name: 'Ripping (ha)', rencana: cells[5] ? cells[5].v : 0, realisasi: cells[7] ? cells[7].v : 0 },
        { name: 'Luku (ha)', rencana: cells[9] ? cells[9].v : 0, realisasi: cells[11] ? cells[11].v : 0 },
        { name: 'Tumbang/Chipping (ha)', rencana: cells[13] ? cells[13].v : 0, realisasi: cells[15] ? cells[15].v : 0 },
        { name: 'Menanam Mucuna (ha)', rencana: cells[21] ? cells[21].v : 0, realisasi: cells[23] ? cells[23].v : 0 },
        { name: 'Lubang Tanam KS (ha)', rencana: cells[25] ? cells[25].v : 0, realisasi: cells[27] ? cells[27].v : 0 },
        { name: 'Menanam KS (ha)', rencana: cells[33] ? cells[33].v : 0, realisasi: cells[35] ? cells[35].v : 0 }
      ];
      
      const activityData = [];
      const detailInfo = [];
      
      activities.forEach(activity => {
        const rencana = parseFloat(activity.rencana) || 0;
        const realisasi = parseFloat(activity.realisasi) || 0;
        
        // Langsung gunakan hasil dari fungsi calculatePercentage yang sudah diupdate
        const persentase = calculatePercentage(realisasi, rencana);
        
        activityData.push(persentase);
        
        detailInfo.push({
          rencana: rencana,
          realisasi: realisasi
        });
      });
      
      chartsData.push({
        title: label,
        data: {
          labels: activityLabels,
          datasets: [{
            label: 'Progress (%)',
            data: activityData,
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
      
      const generateColors = (count) => {
        const colors = [];
        const baseColors = [
          'rgba(16, 185, 129, 0.7)',  'rgba(59, 130, 246, 0.7)',  'rgba(139, 92, 246, 0.7)',  'rgba(245, 158, 11, 0.7)',  'rgba(239, 68, 68, 0.7)',  'rgba(236, 72, 153, 0.7)',  'rgba(14, 165, 233, 0.7)',  'rgba(168, 85, 247, 0.7)',  'rgba(34, 197, 94, 0.7)',  'rgba(249, 115, 22, 0.7)'
        ];
        
        const borderColors = [
          'rgba(16, 185, 129, 1)', 'rgba(59, 130, 246, 1)', 'rgba(139, 92, 246, 1)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)', 'rgba(236, 72, 153, 1)', 'rgba(14, 165, 233, 1)', 'rgba(168, 85, 247, 1)', 'rgba(34, 197, 94, 1)', 'rgba(249, 115, 22, 1)'
        ];
        
        for (let i = 0; i < count; i++) {
          colors.push({
            background: baseColors[i % baseColors.length],
            border: borderColors[i % borderColors.length]
          });
        }
        
        return colors;
      };
      
      if (filterKebun.value && filterPaket.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          if (!kebunName && !afdName) continue;
          
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          if (!afdName && !kebunName) continue;
          
          if (currentKebun && afdName) {
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            if (currentKebun === filterKebun.value && paketName === filterPaket.value) {
              const lcPersentase = calculateProgressTU(cells);
              
              const label = afdName;
              
              dataPoints.push({
                label: label,
                progress: lcPersentase
              });
            }
          }
        }
        
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
      
      if (filterPaket.value && !filterKebun.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          if (!kebunName && !afdName) continue;
          
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          if (!afdName && !kebunName) continue;
          
          if (currentKebun && afdName) {
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            if (paketName === filterPaket.value) {
              const lcPersentase = calculateProgressTU(cells);
              
              const kodering = getKodering(currentKebun);
              
              const label = `${kodering} - AFD ${afdName}`;
              
              dataPoints.push({
                label: label,
                progress: lcPersentase
              });
            }
          }
        }
        
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
      
      if (filterKebun.value && !filterPaket.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          if (!kebunName && !afdName) continue;
          
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          if (!afdName && !kebunName) continue;
          
          if (currentKebun && afdName) {
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            if (currentKebun === filterKebun.value) {
              const lcPersentase = calculateProgressTU(cells);
              
              const label = `${afdName} - ${paketName}`;
              
              dataPoints.push({
                label: label,
                progress: lcPersentase
              });
            }
          }
        }
        
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
      
      // Menampilkan semua item pada bagian "semua paket" tanpa averaging
      if (!filterKebun.value && !filterPaket.value) {
        const dataPoints = [];
        let currentKebun = null;
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const cells = row.c;
          
          if (!cells || cells.length === 0) continue;
          
          if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
          
          const kebunName = cells[1] ? cells[1].v : '';
          const afdName = cells[3] ? cells[3].v : '';
          const paketName = cells[2] ? cells[2].v : '';
          
          if (!kebunName && !afdName) continue;
          
          if (kebunName) {
            currentKebun = kebunName;
          }
          
          if (!afdName && !kebunName) continue;
          
          if (currentKebun && afdName) {
            if (!shouldIncludeRow(currentKebun, afdName, paketName)) continue;
            
            const lcPersentase = calculateProgressTU(cells);
            
            const kodering = getKodering(currentKebun);
            
            const label = `${kodering} - AFD ${afdName} - ${paketName}`;
            
            dataPoints.push({
              label: label,
              progress: lcPersentase
            });
          }
        }
        
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

    // Menghitung perubahan progress harian untuk ranking
    const calculateDailyProgressChange = (todayProgress, yesterdayProgress) => {
      if (yesterdayProgress === undefined || yesterdayProgress === null) return 0;
      return todayProgress - yesterdayProgress;
    };

    // Data untuk leaderboard - Top 3
    const topRankingData = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const rows = rawData.value.table.rows;
      const entityProgressMap = new Map();
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        if (!kebunName && !afdName) continue;
        
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        if (!afdName && !kebunName) continue;
        
        if (currentKebun && afdName) {
          const progressTU = calculateProgressTU(cells);
          
          const entityKey = `${currentKebun}-${afdName}-${paketName}`;
          const kodering = getKodering(currentKebun);
          const entityName = `${kodering} - AFD ${afdName} - ${paketName}`;
          
          if (!entityProgressMap.has(entityKey)) {
            entityProgressMap.set(entityKey, {
              id: entityKey,
              name: entityName,
              kebun: currentKebun,
              afd: afdName,
              paket: paketName,
              todayProgress: 0,
              yesterdayProgress: 0,
              change: 0,
              count: 0,
              luasPaket: 0
            });
          }
          
          const entity = entityProgressMap.get(entityKey);
          entity.todayProgress += progressTU;
          entity.count++;
          
          // Tambahkan luas paket
          let luasPaket = 0;
          if (cells[4]) {
            if (cells[4].v !== undefined && cells[4].v !== null) {
              luasPaket = parseFloat(cells[4].v) || 0;
            } else if (cells[4].f !== undefined && cells[4].f !== null) {
              const formattedValue = cells[4].f.replace(/[,.]/g, '');
              luasPaket = parseFloat(formattedValue) || 0;
            }
          }
          entity.luasPaket += luasPaket;
        }
      }
      
      // Proses data kemarin
      progressDataYesterday.value.forEach(item => {
        const entityKey = `${item.kebun}-${item.afd}-${item.paket}`;
        
        if (entityProgressMap.has(entityKey)) {
          entityProgressMap.get(entityKey).yesterdayProgress = item.progress;
        }
      });
      
      // Hitung rata-rata dan perubahan
      const rankingData = Array.from(entityProgressMap.values()).map(entity => {
        entity.progress = entity.count > 0 ? entity.todayProgress / entity.count : 0;
        entity.change = calculateDailyProgressChange(entity.progress, entity.yesterdayProgress);
        return entity;
      });
      
      // Urutkan berdasarkan perubahan progress (terbesar ke terkecil)
      rankingData.sort((a, b) => b.change - a.change);
      
      // Ambil 3 data teratas
      return rankingData.slice(0, 3);
    });
    
    // Data untuk leaderboard - Sisanya
    const restRankingData = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const rows = rawData.value.table.rows;
      const entityProgressMap = new Map();
      let currentKebun = null;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const paketName = cells[2] ? cells[2].v : '';
        
        if (!kebunName && !afdName) continue;
        
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        if (!afdName && !kebunName) continue;
        
        if (currentKebun && afdName) {
          const progressTU = calculateProgressTU(cells);
          
          const entityKey = `${currentKebun}-${afdName}-${paketName}`;
          const kodering = getKodering(currentKebun);
          const entityName = `${kodering} - AFD ${afdName} - ${paketName}`;
          
          if (!entityProgressMap.has(entityKey)) {
            entityProgressMap.set(entityKey, {
              id: entityKey,
              name: entityName,
              kebun: currentKebun,
              afd: afdName,
              paket: paketName,
              todayProgress: 0,
              yesterdayProgress: 0,
              change: 0,
              count: 0,
              luasPaket: 0
            });
          }
          
          const entity = entityProgressMap.get(entityKey);
          entity.todayProgress += progressTU;
          entity.count++;
          
          // Tambahkan luas paket
          let luasPaket = 0;
          if (cells[4]) {
            if (cells[4].v !== undefined && cells[4].v !== null) {
              luasPaket = parseFloat(cells[4].v) || 0;
            } else if (cells[4].f !== undefined && cells[4].f !== null) {
              const formattedValue = cells[4].f.replace(/[,.]/g, '');
              luasPaket = parseFloat(formattedValue) || 0;
            }
          }
          entity.luasPaket += luasPaket;
        }
      }
      
      // Proses data kemarin
      progressDataYesterday.value.forEach(item => {
        const entityKey = `${item.kebun}-${item.afd}-${item.paket}`;
        
        if (entityProgressMap.has(entityKey)) {
          entityProgressMap.get(entityKey).yesterdayProgress = item.progress;
        }
      });
      
      // Hitung rata-rata dan perubahan
      const rankingData = Array.from(entityProgressMap.values()).map(entity => {
        entity.progress = entity.count > 0 ? entity.todayProgress / entity.count : 0;
        entity.change = calculateDailyProgressChange(entity.progress, entity.yesterdayProgress);
        return entity;
      });
      
      // Urutkan berdasarkan perubahan progress (terbesar ke terkecil)
      rankingData.sort((a, b) => b.change - a.change);
      
      // Ambil data dari posisi 4 ke bawah
      return rankingData.slice(3);
    });
    
    const formatNumber = (num) => {
      if (num === null || num === undefined || isNaN(num)) return '0';
      return parseFloat(num).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
    
    const formatPercentage = (num) => {
      if (num === null || num === undefined || isNaN(num)) return '0%';
      return `${parseFloat(num).toFixed(1)}%`;
    };
    
    const applyFilters = () => {
      currentFilters.value = {
        kebun: filterKebun.value,
        paket: filterPaket.value,
        search: filterSearch.value
      };
    };
    
    watch([filterKebun, filterPaket], () => {
      applyFilters();
    });
    
    const refreshData = async () => {
      try {
        loading.value = true;
        rawData.value = await fetchSheetData();
        
        filterKebun.value = '';
        filterPaket.value = '';
        filterSearch.value = '';
        currentFilters.value = {
          kebun: '',
          paket: '',
          search: ''
        };
        
        // Simpan data kemarin sebelum memuat data baru
        saveProgressDataToStorage();
        
        // Muat data progress hari ini
        progressDataToday.value = await fetchAllProgressDataToday();
        
        console.log("Raw data:", rawData.value);
        console.log("Progress today:", progressDataToday.value);
        console.log("Progress yesterday:", progressDataYesterday.value);
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
        await loadKoderingData();
        
        rawData.value = await fetchSheetData();
        
        // Coba muat data progress dari localStorage
        const hasYesterdayData = loadProgressDataFromStorage();
        
        // Muat data progress hari ini
        progressDataToday.value = await fetchAllProgressDataToday();
        
        // Simpan data progress hari ini untuk besok
        saveProgressDataToStorage();
        
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
      refreshData,
      // Kembalikan variabel dan fungsi baru untuk leaderboard
      topRankingData,
      restRankingData
    };
  }
}
</script>

<style>
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

.pie-chart-outer {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

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

/* PERUBAHAN: Style untuk podium card */
.podium-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}

.podium-header {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  text-align: center;
}

.podium-title {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.podium-content {
  padding: 2rem 1rem;
}

.podium-positions {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 1rem;
}

.podium-position {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.position-1 {
  order: 2;
  transform: translateY(-20px);
}

.position-2 {
  order: 1;
  transform: translateY(-10px);
}

.position-3 {
  order: 3;
}

.podium-rank {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: white;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.position-1 .podium-rank {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.position-2 .podium-rank {
  background: linear-gradient(135deg, #C0C0C0, #808080);
}

.position-3 .podium-rank {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
}

.podium-info {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.podium-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #1f2937;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.podium-details {
  margin-bottom: 0.75rem;
}

.podium-detail {
  display: flex;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
}

.detail-label {
  font-weight: 500;
  margin-right: 0.25rem;
  min-width: 40px;
  color: #6b7280;
}

.detail-value {
  color: #4b5563;
  font-weight: 500;
}

.podium-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.progress-value {
  font-weight: bold;
  font-size: 1.1rem;
  color: #1f2937;
}

.progress-change {
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.ranking-list {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.ranking-item:last-child {
  border-bottom: none;
}

.rank-position {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  color: #4b5563;
}

.item-content {
  flex-grow: 1;
}

.item-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.item-details {
  display: flex;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: #6b7280;
}

.item-detail {
  margin-right: 1rem;
}

.item-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.positive-change {
  background-color: #d4edda;
  color: #155724;
}

.negative-change {
  background-color: #f8d7da;
  color: #721c24;
}

.neutral-change {
  background-color: #e2e3e5;
  color: #383d41;
}

/* Responsive untuk podium */
@media (max-width: 768px) {
  .podium-positions {
    flex-direction: column;
    align-items: center;
  }
  
  .position-1,
  .position-2,
  .position-3 {
    transform: none;
    order: initial;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .podium-info {
    max-width: 300px;
  }
}
.fab-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #3b82f6;
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.fab:hover {
  background-color: #2563eb;
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.fab:active {
  transform: scale(0.95);
}

/* Style untuk medal image - ukuran lebih kecil */
.medal-container {
  width: 50px;  /* Dari 60px menjadi 40px */
  height: 50px; /* Dari 60px menjadi 40px */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem; /* Dari 1rem menjadi 0.75rem */
}

.medal-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>