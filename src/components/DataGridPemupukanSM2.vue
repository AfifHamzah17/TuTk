<template>
  <div class="data-grid">
    <!-- <div class="data-grid-header">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Data Progress Pemupukan Semester 2</h3>
        <div class="flex space-x-2">
          <button @click="exportToExcelHandler" class="btn btn-secondary text-sm">
            Export Excel
          </button>
          <button @click="refreshData" class="btn btn-primary text-sm">
            Refresh Data
          </button>
        </div>
      </div>
    </div> -->
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="w-12">No</th>
            <th class="w-32">Distrik</th>
            <th class="w-32">Kebun</th>
            <th class="w-24">Luas (ha)</th>
            <th class="w-24">Total Afd</th>
            
            <!-- Stok Pupuk -->
            <th class="w-64">Stok Pupuk 2025</th>
            
            <!-- Progress NPK SM II -->
            <th class="w-32">Realisasi NPK SM II</th>
            
            <!-- Progress Urea SM II -->
            <th class="w-32">Realisasi Urea SM II</th>
            
            <!-- Progress Borate SM II -->
            <th class="w-32">Realisasi Borate SM II</th>
            
            <!-- Sisa Pemupukan SM II -->
            <th class="w-64">Sisa Pemupukan SM II</th>
            
            <!-- SPPBJ -->
            <th class="w-64">SPPBJ</th>
            
            <!-- Jangka Waktu -->
            <th class="w-64">Jangka Waktu</th>
            
            <!-- Durasi Jangka Waktu -->
            <th class="w-64">Durasi Jangka Waktu</th>
            
            <!-- Persentase Dropping -->
            <th class="w-64">Persentase Dropping</th>
            
            <!-- Durasi Kerja -->
            <th class="w-32">Durasi Kerja</th>
          </tr>
        </thead>
        <tbody class="data-grid-body">
          <template v-for="(group, groupName) in paginatedGroupedData" :key="groupName">
            <!-- Header Group Distrik -->
            <tr class="distrik-group">
              <td colspan="15" class="distrik-header px-6 py-3 cursor-pointer" @click="toggleGroup(groupName)">
                <div class="flex items-center">
                  <!-- Ikon untuk toggle minimize/maximize -->
                  <svg 
                    class="w-5 h-5 text-green-600 mr-2 transform transition-transform duration-200" 
                    :class="{ 'rotate-90': !minimizedGroups[groupName] }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span class="text-lg font-semibold">{{ groupName }}</span>
                  <span class="ml-2 text-sm text-gray-500">({{ group.length }} Kebun)</span>
                  <!-- Status indikator -->
                  <span class="ml-2 text-xs px-2 py-1 rounded-full" 
                        :class="minimizedGroups[groupName] ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'">
                    {{ minimizedGroups[groupName] ? 'Minimized' : 'Expanded' }}
                  </span>
                </div>
              </td>
            </tr>
            
            <!-- Data per Kebun dalam group - hanya ditampilkan jika grup tidak diminimalkan -->
            <template v-if="!minimizedGroups[groupName]">
              <tr v-for="(row, index) in group" :key="index" class="data-grid-row">
                <td class="data-grid-cell font-medium">{{ row.no }}</td>
                <td class="data-grid-cell">{{ row.distrik }}</td>
                <td class="data-grid-cell kebun-name">{{ row.namaKebun }}</td>
                <td class="data-grid-cell">{{ formatNumber(row.luas_ha) }}</td>
                <td class="data-grid-cell">{{ row.total_afd }}</td>
              
                <!-- Stok Pupuk -->
                <td class="data-grid-cell">
                  <ProgressItemMulti
                    title="Stok Pupuk 2025"
                    unit="Ton"
                    :npk="row.stokNPK"
                    :dolomit="row.stokDolomit"
                    :urea="row.stokUrea"
                    :borat="row.stokBorat"
                  />
                </td>
                
                <!-- Progress NPK SM II -->
                <td class="data-grid-cell">
                  <ProgressItem
                    title="NPK SM II"
                    unit="Ton"
                    :rencana="row.rencanaNPK"
                    :hariIni="row.realisasiHariIniNPK"
                    :sdHariIni="row.realisasiSdHariIniNPK"
                    :persentase="row.progressNPK"
                  />
                </td>
                
                <!-- Progress Urea SM II -->
                <td class="data-grid-cell">
                  <ProgressItem
                    title="Urea SM II"
                    unit="Ton"
                    :rencana="row.rencanaUrea"
                    :hariIni="row.realisasiHariIniUrea"
                    :sdHariIni="row.realisasiSdHariIniUrea"
                    :persentase="row.progressUrea"
                  />
                </td>
                
                <!-- Progress Borate SM II -->
                <td class="data-grid-cell">
                  <ProgressItem
                    title="Borate SM II"
                    unit="Ton"
                    :rencana="row.rencanaBorat"
                    :hariIni="row.realisasiHariIniBorat"
                    :sdHariIni="row.realisasiSdHariIniBorat"
                    :persentase="row.progressBorat"
                  />
                </td>
                
                <!-- Sisa Pemupukan SM II -->
                <td class="data-grid-cell">
                  <ProgressItemMulti
                    title="Sisa Pemupukan SM II"
                    unit="Ton"
                    :npk="row.sisaNPK"
                    :dolomit="row.sisaDolomit"
                    :urea="row.sisaUrea"
                    :borat="row.sisaBorat"
                  />
                </td>
                
                <!-- SPPBJ -->
                <td class="data-grid-cell">
                  <div class="text-sm">
                    <div class="flex items-center mb-1">
                      <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="font-medium">NPK: {{ formatDate(row.tanggalSPPBJNPK) }}</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="font-medium">Dolomit: {{ formatDate(row.tanggalSPPBJDolomit) }}</span>
                    </div>
                  </div>
                </td>
                
                <!-- Jangka Waktu -->
                <td class="data-grid-cell">
                  <div class="text-sm">
                    <div class="flex items-center mb-1">
                      <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="font-medium">NPK: {{ formatDate(row.tanggalJangkaWaktuNPK) }}</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="font-medium">Dolomit: {{ formatDate(row.tanggalJangkaWaktuDolomit) }}</span>
                    </div>
                  </div>
                </td>
                
                <!-- Durasi Jangka Waktu -->
                <td class="data-grid-cell">
                  <div class="text-sm">
                    <div class="flex items-center mb-1">
                      <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="font-medium" :class="getDurationClass(row.durasiJangkaWaktuNPK)">NPK: {{ row.durasiJangkaWaktuNPK }}</span>
                    </div>
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="font-medium" :class="getDurationClass(row.durasiJangkaWaktuDolomit)">Dolomit: {{ row.durasiJangkaWaktuDolomit }}</span>
                    </div>
                  </div>
                </td>
                
                <!-- Persentase Dropping -->
                <td class="data-grid-cell">
                  <div class="text-sm">
                    <div>NPK: <span class="font-medium">{{ formatPercentage(row.persentaseDroppingNPK) }}</span></div>
                    <div>Dolomit: <span class="font-medium">{{ formatPercentage(row.persentaseDroppingDolomit) }}</span></div>
                  </div>
                </td>
                
                <!-- Durasi Kerja -->
                <td class="data-grid-cell">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="font-medium">{{ row.durasiKerja !== null ? row.durasiKerja + ' hari' : '-' }}</span>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Menampilkan <span class="font-medium">{{ startItem }}-{{ endItem }}</span> dari <span class="font-medium">{{ filteredData.length }}</span> data
        </div>
        <div class="flex items-center space-x-8">
          <!-- Items per page control -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-700">Items per page:</span>
            <div class="flex items-center border rounded">
              <select 
                v-model="itemsPerPage" 
                @change="handleItemsPerPageChange" 
                class="border-none rounded-l px-2 py-1 text-sm focus:outline-none"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
          
          <!-- Pagination buttons -->
          <div class="flex space-x-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-secondary text-sm">
              Previous
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-primary text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateDaysDifference, calculateDaysDifferenceWithSign, formatDate, isValidDateFormat } from '../utils/dateUtils';
import { exportToExcel } from '../utils/exportUtils.js';
import ProgressItem from './ProgressItem.vue';
import ProgressItemMulti from './ProgressItemMulti.vue';

export default {
  name: 'DataGridPemupukanSM2',
  components: {
    ProgressItem,
    ProgressItemMulti
  },
  props: {
    rawData: Object,
    filters: {
      type: Object,
      default: () => ({
        distrik: '',
        kebun: '',
        search: ''
      })
    }
  },
  emits: ['refresh'],
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      customItemsPerPage: 10,
      // State untuk melacak grup yang diminimalkan
      minimizedGroups: {},
      // State untuk melihat apakah semua grup diminimalkan
      allGroupsMinimized: false
    };
  },
  computed: {
    processedData() {
      if (!this.rawData || !this.rawData.table || !this.rawData.table.rows) return [];
      
      const rows = this.rawData.table.rows;
      const result = [];
      let no = 0;
      
      // Fungsi untuk menghitung persentase
      const calculatePercentage = (realisasi, rencana) => {
        if (!rencana || rencana === 0) return 0;
        return (realisasi / rencana) * 100;
      };
      
      console.log("Total baris dalam data:", rows.length);
      console.log("Struktur data baris pertama:", rows[0]);
      
      // Proses setiap baris, mulai dari baris pertama (indeks 0)
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        // Debug: Tampilkan setiap baris yang diproses
        console.log(`Memproses baris ${i}:`, cells);
        
        // Skip baris kosong
        if (!cells || cells.length === 0) {
          console.log(`Baris ${i} kosong, dilewati`);
          continue;
        }
        
        // Ambil data dasar
        const distrik = cells[0] ? cells[0].v : '';
        const singkatandistrik = cells[2] ? cells[2].v : '';
        const singkatankebun = cells[3] ? cells[3].v : '';
        const namaKebun = cells[4] ? cells[4].v : '';
        const luas_ha = cells[5] ? parseFloat(cells[5].v) || 0 : 0;
        const total_afd = cells[6] ? parseInt(cells[6].v) || 0 : 0;
        
        // Rencana SM I 2025
        const rencanaSMINPK = cells[7] ? parseFloat(cells[7].v) || 0 : 0;
        const rencanaSMIDolomit = cells[8] ? parseFloat(cells[8].v) || 0 : 0;
        
        // Rencana SM II 2025
        const rencanaNPK = cells[9] ? parseFloat(cells[9].v) || 0 : 0;
        const rencanaUrea = cells[10] ? parseFloat(cells[10].v) || 0 : 0;
        const rencanaBorat = cells[11] ? parseFloat(cells[11].v) || 0 : 0;
        const totalRencanaSMII = cells[12] ? parseFloat(cells[12].v) || 0 : 0;
        
        // Rencana Tahun 2025
        const rencanaTahunNPK = cells[13] ? parseFloat(cells[13].v) || 0 : 0;
        const rencanaTahunDolomit = cells[14] ? parseFloat(cells[14].v) || 0 : 0;
        const rencanaTahunUrea = cells[15] ? parseFloat(cells[15].v) || 0 : 0;
        const rencanaTahunBorat = cells[16] ? parseFloat(cells[16].v) || 0 : 0;
        
        // Realisasi NPK SM II
        const realisasiRencanaNPK = cells[17] ? parseFloat(cells[17].v) || 0 : 0;
        const realisasiHariIniNPK = cells[18] ? parseFloat(cells[18].v) || 0 : 0;
        const realisasiSdHariIniNPK = cells[19] ? parseFloat(cells[19].v) || 0 : 0;
        
        // Realisasi Urea SM II
        const realisasiRencanaUrea = cells[21] ? parseFloat(cells[21].v) || 0 : 0;
        const realisasiHariIniUrea = cells[22] ? parseFloat(cells[22].v) || 0 : 0;
        const realisasiSdHariIniUrea = cells[23] ? parseFloat(cells[23].v) || 0 : 0;
        
        // Realisasi Borate SM II
        const realisasiRencanaBorat = cells[25] ? parseFloat(cells[25].v) || 0 : 0;
        const realisasiHariIniBorat = cells[26] ? parseFloat(cells[26].v) || 0 : 0;
        const realisasiSdHariIniBorat = cells[27] ? parseFloat(cells[27].v) || 0 : 0;
        
        // Stok Pupuk
        const stokNPK = cells[29] ? parseFloat(cells[29].v) || 0 : 0;
        const stokDolomit = cells[30] ? parseFloat(cells[30].v) || 0 : 0;
        const stokUrea = cells[31] ? parseFloat(cells[31].v) || 0 : 0;
        const stokBorat = cells[32] ? parseFloat(cells[32].v) || 0 : 0;
        
        // Tanggal Terbit SPPBJ
        const sppbjNPK = cells[34] ? (cells[34].f || cells[34].v) : '';
        const sppbjDolomit = cells[35] ? (cells[35].f || cells[35].v) : '';
        
        // Jangka Waktu
        const jangkaWaktuNPK = cells[36] ? (cells[36].f || cells[36].v) : '';
        const jangkaWaktuDolomit = cells[37] ? (cells[37].f || cells[37].v) : '';
        
        // Persentase Dropping
        const persentaseDroppingNPK = cells[38] ? parseFloat(cells[38].v) || 0 : 0;
        const persentaseDroppingDolomit = cells[39] ? parseFloat(cells[39].v) || 0 : 0;
        
        // Hitung sisa pemupukan SM II
        const sisaNPK = rencanaNPK - realisasiSdHariIniNPK;
        const sisaUrea = rencanaUrea - realisasiSdHariIniUrea;
        const sisaBorat = rencanaBorat - realisasiSdHariIniBorat;
        // Untuk Dolomit, kita gunakan rencana SM I karena tidak ada realisasi Dolomit SM II
        const sisaDolomit = rencanaSMIDolomit - 0; // Asumsi tidak ada realisasi Dolomit SM II
        
        // Hitung progress
        const progressNPK = calculatePercentage(realisasiSdHariIniNPK, rencanaNPK);
        const progressUrea = calculatePercentage(realisasiSdHariIniUrea, rencanaUrea);
        const progressBorat = calculatePercentage(realisasiSdHariIniBorat, rencanaBorat);
        
        // Hitung durasi kerja
        let durasiKerja = null;
        
        // Prioritaskan menggunakan SPPBJ NPK
        if (sppbjNPK && isValidDateFormat(sppbjNPK)) {
          durasiKerja = calculateDaysDifference(sppbjNPK);
        } 
        // Jika SPPBJ NPK tidak valid, coba SPPBJ Dolomit
        else if (sppbjDolomit && isValidDateFormat(sppbjDolomit)) {
          durasiKerja = calculateDaysDifference(sppbjDolomit);
        }
        
        // Hitung durasi jangka waktu dengan tanda (+) atau (-)
        const durasiJangkaWaktuNPK = calculateDaysDifferenceWithSign(jangkaWaktuNPK);
        const durasiJangkaWaktuDolomit = calculateDaysDifferenceWithSign(jangkaWaktuDolomit);
        
        // Tambahkan ke result
        no++;
        result.push({
          no: no,
          distrik: distrik,
          singkatandistrik: singkatandistrik,
          singkatankebun: singkatankebun,
          namaKebun: namaKebun,
          luas_ha: luas_ha,
          total_afd: total_afd,
          
          // Rencana SM I
          rencanaSMINPK: rencanaSMINPK,
          rencanaSMIDolomit: rencanaSMIDolomit,
          
          // Rencana SM II
          rencanaNPK: rencanaNPK,
          rencanaUrea: rencanaUrea,
          rencanaBorat: rencanaBorat,
          totalRencanaSMII: totalRencanaSMII,
          
          // Rencana Tahun
          rencanaTahunNPK: rencanaTahunNPK,
          rencanaTahunDolomit: rencanaTahunDolomit,
          rencanaTahunUrea: rencanaTahunUrea,
          rencanaTahunBorat: rencanaTahunBorat,
          
          // Stok
          stokNPK: stokNPK,
          stokDolomit: stokDolomit,
          stokUrea: stokUrea,
          stokBorat: stokBorat,
          
          // Realisasi
          realisasiRencanaNPK: realisasiRencanaNPK,
          realisasiHariIniNPK: realisasiHariIniNPK,
          realisasiSdHariIniNPK: realisasiSdHariIniNPK,
          
          realisasiRencanaUrea: realisasiRencanaUrea,
          realisasiHariIniUrea: realisasiHariIniUrea,
          realisasiSdHariIniUrea: realisasiSdHariIniUrea,
          
          realisasiRencanaBorat: realisasiRencanaBorat,
          realisasiHariIniBorat: realisasiHariIniBorat,
          realisasiSdHariIniBorat: realisasiSdHariIniBorat,
          
          // Sisa
          sisaNPK: sisaNPK,
          sisaDolomit: sisaDolomit,
          sisaUrea: sisaUrea,
          sisaBorat: sisaBorat,
          
          // Progress
          progressNPK: progressNPK,
          progressUrea: progressUrea,
          progressBorat: progressBorat,
          
          // Tanggal
          tanggalSPPBJNPK: sppbjNPK,
          tanggalSPPBJDolomit: sppbjDolomit,
          tanggalJangkaWaktuNPK: jangkaWaktuNPK,
          tanggalJangkaWaktuDolomit: jangkaWaktuDolomit,
          durasiJangkaWaktuNPK: durasiJangkaWaktuNPK,
          durasiJangkaWaktuDolomit: durasiJangkaWaktuDolomit,
          
          // Persentase
          persentaseDroppingNPK: persentaseDroppingNPK,
          persentaseDroppingDolomit: persentaseDroppingDolomit,
          
          // Durasi
          durasiKerja: durasiKerja
        });
        
        // Debug: Tampilkan data yang ditambahkan
        console.log(`Data ditambahkan dari baris ${i}:`, {
          distrik: distrik,
          namaKebun: namaKebun,
          luas_ha: luas_ha,
          rencanaNPK: rencanaNPK,
          realisasiSdHariIniNPK: realisasiSdHariIniNPK,
          sisaNPK: sisaNPK,
          sppbjNPK: sppbjNPK,
          jangkaWaktuNPK: jangkaWaktuNPK,
          durasiJangkaWaktuNPK: durasiJangkaWaktuNPK,
          persentaseDroppingNPK: persentaseDroppingNPK,
          durasiKerja: durasiKerja
        });
      }
      
      console.log(`Total baris diproses: ${rows.length}`);
      console.log(`Total data valid: ${result.length}`);
      
      return result;
    },
    
    // Filter data berdasarkan filter yang dipilih
    filteredData() {
      if (!this.processedData.length) return [];
      
      return this.processedData.filter(row => {
        // Filter distrik
        if (this.filters.distrik && row.distrik !== this.filters.distrik) {
          return false;
        }
        
        // Filter kebun
        if (this.filters.kebun && row.namaKebun !== this.filters.kebun) {
          return false;
        }
        
        // Filter search
        if (this.filters.search) {
          const searchLower = this.filters.search.toLowerCase();
          const searchableText = [
            row.distrik,
            row.singkatandistrik,
            row.singkatankebun,
            row.namaKebun,
            row.luas_ha.toString(),
            row.total_afd.toString(),
            row.rencanaNPK.toString(),
            row.rencanaUrea.toString(),
            row.rencanaBorat.toString(),
            row.stokNPK.toString(),
            row.stokDolomit.toString(),
            row.stokUrea.toString(),
            row.stokBorat.toString(),
            row.realisasiHariIniNPK.toString(),
            row.realisasiHariIniUrea.toString(),
            row.realisasiHariIniBorat.toString(),
            row.realisasiSdHariIniNPK.toString(),
            row.realisasiSdHariIniUrea.toString(),
            row.realisasiSdHariIniBorat.toString(),
            row.sisaNPK.toString(),
            row.sisaDolomit.toString(),
            row.sisaUrea.toString(),
            row.sisaBorat.toString(),
            row.progressNPK.toString(),
            row.progressUrea.toString(),
            row.progressBorat.toString(),
            row.tanggalSPPBJNPK,
            row.tanggalSPPBJDolomit,
            row.tanggalJangkaWaktuNPK,
            row.tanggalJangkaWaktuDolomit,
            row.durasiJangkaWaktuNPK,
            row.durasiJangkaWaktuDolomit,
            row.persentaseDroppingNPK.toString(),
            row.persentaseDroppingDolomit.toString(),
            row.durasiKerja ? row.durasiKerja.toString() : ''
          ].join(' ').toLowerCase();
          
          if (!searchableText.includes(searchLower)) {
            return false;
          }
        }
        
        return true;
      });
    },
    
    // Group data berdasarkan nama distrik
    groupedData() {
      const groups = {};
      
      this.filteredData.forEach(row => {
        if (!groups[row.distrik]) {
          groups[row.distrik] = [];
        }
        groups[row.distrik].push(row);
      });
      
      return groups;
    },

    // Calculate pagination values
    totalPages() {
      if (this.itemsPerPage === 'all') return 1;
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    
    startItem() {
      if (this.itemsPerPage === 'all') return 1;
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    
    endItem() {
      if (this.itemsPerPage === 'all') return this.filteredData.length;
      const end = this.currentPage * this.itemsPerPage;
      return end > this.filteredData.length ? this.filteredData.length : end;
    },
    
    // Create paginated version of grouped data
    paginatedGroupedData() {
      if (this.itemsPerPage === 'all') {
        return this.groupedData;
      }
      
      const result = {};
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      
      // Get the slice of data for the current page
      const pageData = this.filteredData.slice(startIndex, endIndex);
      
      // Group the page data
      pageData.forEach(row => {
        if (!result[row.distrik]) {
          result[row.distrik] = [];
        }
        result[row.distrik].push(row);
      });
      
      return result;
    }
  },
  methods: {
    formatNumber(num) {
      if (num === null || num === undefined || isNaN(num)) return '0';
      return parseFloat(num).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    formatPercentage(num) {
      if (num === null || num === undefined || isNaN(num)) return '0%';
      return `${parseFloat(num).toFixed(1)}%`;
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      return formatDate(dateString);
    },
    getProgressColorClass(percentage) {
      if (percentage >= 80) return 'progress-fill-success';
      if (percentage >= 50) return 'progress-fill-warning';
      return 'progress-fill-danger';
    },
    getDurationClass(duration) {
      if (!duration || duration === '-') return '';
      // Jika dimulai dengan '+', berarti tanggal di masa depan
      if (duration.startsWith('+')) {
        return 'text-green-600 font-semibold';
      }
      // Jika dimulai dengan '-', berarti tanggal sudah lewat
      if (duration.startsWith('-')) {
        return 'text-red-600 font-semibold';
      }
      return '';
    },
    exportToExcelHandler() {
      console.log('Exporting raw data:', this.rawData);
      exportToExcel(this.rawData);
    },
    refreshData() {
      this.$emit('refresh');
    },
    resetPagination() {
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    handleItemsPerPageChange() {
      if (this.itemsPerPage !== 'custom') {
        this.resetPagination();
      }
    },
    applyCustomItemsPerPage() {
      if (this.customItemsPerPage > 0) {
        this.itemsPerPage = this.customItemsPerPage;
        this.resetPagination();
      }
    },
    // Metode untuk toggle minimize/maximize grup
    toggleGroup(groupName) {
      // Menggunakan spread operator untuk mempertahankan reaktivitas di Vue 3
      this.minimizedGroups = {
        ...this.minimizedGroups,
        [groupName]: !this.minimizedGroups[groupName]
      };
    },
    
    // Metode untuk minimize semua grup
    minimizeAllGroups() {
      const groupNames = Object.keys(this.groupedData);
      const newMinimizedGroups = {};
      
      groupNames.forEach(groupName => {
        newMinimizedGroups[groupName] = true;
      });
      
      this.minimizedGroups = newMinimizedGroups;
      this.allGroupsMinimized = true;
    },
    
    // Metode untuk expand semua grup
    expandAllGroups() {
      const groupNames = Object.keys(this.groupedData);
      const newMinimizedGroups = {};
      
      groupNames.forEach(groupName => {
        newMinimizedGroups[groupName] = false;
      });
      
      this.minimizedGroups = newMinimizedGroups;
      this.allGroupsMinimized = false;
    }
  },
  watch: {
    filteredData() {
      this.resetPagination();
      
      // Reset state minimizedGroups ketika data berubah
      this.minimizedGroups = {};
      this.allGroupsMinimized = false;
    },
    itemsPerPage(newVal) {
      if (newVal !== 'custom' && newVal !== 'all') {
        this.customItemsPerPage = newVal;
      }
    }
  }
}
</script>

<style scoped>
/* Tambahkan style untuk transisi dan cursor pointer */
.distrik-header {
  cursor: pointer;
  transition: background-color 0.2s;
}

.distrik-header:hover {
  background-color: rgba(243, 244, 246, 0.5);
}

/* Animasi untuk ikon panah */
.transform {
  transition: transform 0.2s ease-in-out;
}

.rotate-90 {
  transform: rotate(90deg);
}

/* Style untuk progress bar */
.progress-fill-success {
  background-color: #10b981;
}

.progress-fill-warning {
  background-color: #f59e0b;
}

.progress-fill-danger {
  background-color: #ef4444;
}

/* Style untuk badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-info {
  background-color: #dbeafe;
  color: #1e40af;
}

/* Style untuk tombol */
.btn {
  padding: 0.5rem 1rem;
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

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-secondary:disabled {
  background-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Style untuk tabel */
.data-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.data-table th {
  background-color: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.data-grid-cell {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.data-grid-row:hover {
  background-color: #f9fafb;
}

.kebun-name {
  font-weight: 600;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.data-grid {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-grid-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
</style>