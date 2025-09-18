<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <header class="dashboard-header">
      <h1 class="text-2xl md:text-3xl font-bold">Dashboard Monitoring Tanaman</h1>
      <p class="mt-2">Monitoring progress tanaman ulang dan konversi</p>
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Luas Paket"
          :value="totalLuasPaket + ' ha'"
          icon-color="bg-green-500"
          icon-path="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
        <StatCard 
          title="Total LC Rencana"
          :value="formatNumber(totalLCRencana)"
          icon-color="bg-blue-500"
          icon-path="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
        <StatCard 
          title="Total LC Realisasi"
          :value="formatNumber(totalLCRealisasi)"
          icon-color="bg-purple-500"
          icon-path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
        <StatCard 
          title="Progress Rata-rata"
          :value="formatPercentage(avgProgress)"
          :change="progressChange"
          :change-type="progressChangeType"
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
              <option v-for="afd in uniqueAfd" :key="afd" :value="afd">{{ afd }}</option>
            </select>
          </div>
          <div>
            <label class="filter-label">Cari</label>
            <input 
              v-model="filterSearch" 
              type="text" 
              placeholder="Cari data..." 
              class="filter-input"
            />
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
import { calculateDaysDifference } from './utils/dateUtils'; // Tambahkan import ini
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
    // your other reactive refs
    const loading = ref(true);
    const error = ref(null);
    const rawData = ref(null);
    const filterKebun = ref('');
    const filterAfd = ref('');
    const filterSearch = ref('');
    const currentFilters = ref({
      kebun: '',
      afd: '',
      search: ''
    });
    
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
        const afdName = cells[2] ? cells[2].v : '';
        
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
          const jumlahHariKerja = calculateDaysDifference(tanggalSPPBJ); // Gunakan fungsi yang sudah diimport
          
          result.push({
            kebun: currentKebun,
            afd: afdName,
            luasPaket: cells[3] ? cells[3].v : 0,
            lcRencana: cells[32] ? cells[32].v : 0,
            lcRealisasi: cells[33] ? cells[33].v : 0,
            tanggalSPPBJ: tanggalSPPBJ,
            jumlahHariKerja: jumlahHariKerja
          });
        }
      }
      
      return result;
    });
    
    // Menghitung total luas paket
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
        const afdName = cells[2] ? cells[2].v : '';
        
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
          const luasPaket = cells[3] ? cells[3].v : 0;
          total += parseFloat(luasPaket) || 0;
        }
      }
      
      return total.toFixed(2);
    });
    
    // Menghitung total LC rencana
    const totalLCRencana = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return 0;
      
      let total = 0;
      const rows = rawData.value.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const lcRencana = cells[32] ? cells[32].v : 0;
        total += parseFloat(lcRencana) || 0;
      }
      
      return total.toFixed(2);
    });
    
    // Menghitung total LC realisasi
    const totalLCRealisasi = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return 0;
      
      let total = 0;
      const rows = rawData.value.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const lcRealisasi = cells[33] ? cells[33].v : 0;
        total += parseFloat(lcRealisasi) || 0;
      }
      
      return total.toFixed(2);
    });
    
    // Menghitung progress rata-rata
    const avgProgress = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return 0;
      
      let totalPercentage = 0;
      let count = 0;
      const rows = rawData.value.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        // Hitung persentase untuk setiap aktivitas
        const activities = [
          { rencana: cells[4], realisasi: cells[6] }, // Ripper
          { rencana: cells[8], realisasi: cells[10] }, // Luku
          { rencana: cells[12], realisasi: cells[14] }, // Tumbang/Chipping
          { rencana: cells[16], realisasi: cells[18] }, // Pembuatan Parit
          { rencana: cells[20], realisasi: cells[22] }, // Menanam Mucuna
          { rencana: cells[24], realisasi: cells[26] }, // Lubang Tanam
          { rencana: cells[28], realisasi: cells[30] }, // Menanam KS
        ];
        
        activities.forEach(activity => {
          const rencana = activity.rencana ? activity.rencana.v : 0;
          const realisasi = activity.realisasi ? activity.realisasi.v : 0;
          
          if (rencana > 0) {
            totalPercentage += (realisasi / rencana) * 100;
            count++;
          }
        });
      }
      
      return count > 0 ? totalPercentage / count : 0;
    });
    
    // Menghitung perubahan progress
    const progressChange = computed(() => {
      // Ini hanya contoh, bisa disesuaikan dengan logika bisnis
      const change = Math.random() * 10 - 5; // Random antara -5% sampai +5%
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    });
    
    const progressChangeType = computed(() => {
      // Ini hanya contoh, bisa disesuaikan dengan logika bisnis
      return Math.random() > 0.5 ? 'positive' : 'negative';
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
    
    // Mendapatkan daftar AFD unik
    const uniqueAfd = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) return [];
      
      const afdSet = new Set();
      const rows = rawData.value.table.rows;
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const afdName = cells[2] ? cells[2].v : '';
        if (afdName) {
          afdSet.add(afdName);
        }
      }
      
      return Array.from(afdSet);
    });
    
    // Data untuk Bar Chart
    const barChartData = computed(() => {
      if (!rawData.value || !rawData.value.table || !rawData.value.table.rows) {
        return {
          labels: [],
          datasets: []
        };
      }
      
      const rows = rawData.value.table.rows;
      const kebunData = {};
      
      // Proses data untuk mendapatkan progress per kebun
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        if (!kebunName) continue;
        
        // Total LC
        const lcRencana = cells[32] ? cells[32].v : 0;
        const lcRealisasi = cells[33] ? cells[33].v : 0;
        const lcPersentase = lcRencana > 0 ? (lcRealisasi / lcRencana) * 100 : 0;
        
        if (!kebunData[kebunName]) {
          kebunData[kebunName] = {
            totalProgress: 0,
            count: 0
          };
        }
        
        kebunData[kebunName].totalProgress += lcPersentase;
        kebunData[kebunName].count += 1;
      }
      
      // Hitung rata-rata progress per kebun
      const labels = Object.keys(kebunData);
      const data = labels.map(kebun => 
        kebunData[kebun].count > 0 
          ? kebunData[kebun].totalProgress / kebunData[kebun].count 
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
          datasets: []
        };
      }
      
      const rows = rawData.value.table.rows;
      const progressCategories = {
        '0-25%': 0,
        '26-50%': 0,
        '51-75%': 0,
        '76-100%': 0
      };
      
      // Proses data untuk mengkategorikan progress
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        // Total LC
        const lcRencana = cells[32] ? cells[32].v : 0;
        const lcRealisasi = cells[33] ? cells[33].v : 0;
        const lcPersentase = lcRencana > 0 ? (lcRealisasi / lcRencana) * 100 : 0;
        
        // Kategorikan progress
        if (lcPersentase <= 25) {
          progressCategories['0-25%']++;
        } else if (lcPersentase <= 50) {
          progressCategories['26-50%']++;
        } else if (lcPersentase <= 75) {
          progressCategories['51-75%']++;
        } else {
          progressCategories['76-100%']++;
        }
      }
      
      return {
        labels: Object.keys(progressCategories),
        datasets: [{
          data: Object.values(progressCategories),
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
      
      // Proses data untuk mendapatkan progress per kebun
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        if (!kebunName) continue;
        
        // Total LC
        const lcRencana = cells[32] ? cells[32].v : 0;
        const lcRealisasi = cells[33] ? cells[33].v : 0;
        const lcPersentase = lcRencana > 0 ? (lcRealisasi / lcRencana) * 100 : 0;
        
        if (!kebunData[kebunName]) {
          kebunData[kebunName] = [];
        }
        
        kebunData[kebunName].push(lcPersentase);
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
        // Generate trend data
        const data = [];
        let currentValue = Math.random() * 50 + 25; // Start with a random value between 25-75
        
        for (let i = 0; i < 7; i++) {
          data.push(currentValue);
          // Random change between -5% and +5%
          currentValue += (Math.random() * 10 - 5);
          // Keep value between 0 and 100
          currentValue = Math.max(0, Math.min(100, currentValue));
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
          datasets: []
        };
      }
      
      const rows = rawData.value.table.rows;
      const activityData = {
        'Ripper': { total: 0, count: 0 },
        'Luku': { total: 0, count: 0 },
        'Tumbang/Chipping': { total: 0, count: 0 },
        'Pembuatan Parit': { total: 0, count: 0 },
        'Menanam Mucuna': { total: 0, count: 0 },
        'Lubang Tanam': { total: 0, count: 0 },
        'Menanam KS': { total: 0, count: 0 }
      };
      
      // Proses data untuk mendapatkan progress per aktivitas
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        // Skip baris header, jumlah, total
        if (cells[1] && (cells[1].v === 'Kebun' || cells[0] && (cells[0].v === 'Jumlah' || cells[0].v === 'Total'))) continue;
        
        // Aktivitas-aktivitas
        const activities = [
          { name: 'Ripper', rencana: cells[4], realisasi: cells[6] },
          { name: 'Luku', rencana: cells[8], realisasi: cells[10] },
          { name: 'Tumbang/Chipping', rencana: cells[12], realisasi: cells[14] },
          { name: 'Pembuatan Parit', rencana: cells[16], realisasi: cells[18] },
          { name: 'Menanam Mucuna', rencana: cells[20], realisasi: cells[22] },
          { name: 'Lubang Tanam', rencana: cells[24], realisasi: cells[26] },
          { name: 'Menanam KS', rencana: cells[28], realisasi: cells[30] }
        ];
        
        activities.forEach(activity => {
          const rencana = activity.rencana ? activity.rencana.v : 0;
          const realisasi = activity.realisasi ? activity.realisasi.v : 0;
          const persentase = rencana > 0 ? (realisasi / rencana) * 100 : 0;
          
          activityData[activity.name].total += persentase;
          activityData[activity.name].count += 1;
        });
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
          pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
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
        filterSearch.value = '';
        currentFilters.value = {
          kebun: '',
          afd: '',
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
        rawData.value = await fetchSheetData();
        console.log("Raw data:", rawData.value);
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
      filterSearch,
      currentFilters,
      totalLuasPaket,
      totalLCRencana,
      totalLCRealisasi,
      avgProgress,
      progressChange,
      progressChangeType,
      uniqueKebun,
      uniqueAfd,
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