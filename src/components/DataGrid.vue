<!-- src/components/DataGrid.vue -->
<template>
  <div class="data-grid">
    <div class="data-grid-header">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Data Progress Tanaman</h3>
        <div class="flex space-x-2">
          <button @click="exportToExcelHandler" class="btn btn-secondary text-sm">
            Export CSV
          </button>
          <button @click="refreshData" class="btn btn-primary text-sm">
            Refresh Data
          </button>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th class="w-12">No</th>
            <th class="w-32">Kebun</th>
            <th class="w-24">AFD</th>
            <th class="w-32">Luas Paket (ha)</th>
            <th class="w-64">Ripper</th>
            <th class="w-64">Luku</th>
            <th class="w-64">Tumbang/Chipping</th>
            <th class="w-64">Pembuatan Parit</th>
            <th class="w-64">Menanam Mucuna</th>
            <th class="w-64">Lubang Tanam</th>
            <th class="w-64">Menanam KS</th>
            <th class="w-64">Total LC</th>
            <th class="w-40">Tanggal SPPBJ</th>
            <th class="w-32">Hari Kerja</th>
          </tr>
        </thead>
        <tbody class="data-grid-body">
          <template v-for="(group, groupName) in groupedData" :key="groupName">
            <!-- Header Group Kebun -->
            <tr class="kebun-group">
              <td colspan="15" class="kebun-header px-6 py-3">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <span class="text-lg font-semibold">{{ groupName }}</span>
                  <span class="ml-2 text-sm text-gray-500">({{ group.length }} AFD)</span>
                </div>
              </td>
            </tr>
            
            <!-- Data per AFD dalam group -->
            <tr v-for="(row, index) in group" :key="index" class="data-grid-row">
              <td class="data-grid-cell font-medium">{{ row.no }}</td>
              <td class="data-grid-cell kebun-name">{{ row.kebun }}</td>
              <td class="data-grid-cell">
                <span class="badge badge-info">{{ row.afd }}</span>
              </td>
              <td class="data-grid-cell">{{ formatNumber(row.luasPaket) }}</td>
              <td class="data-grid-cell">
                <div class="sub-grid">
                  <div class="sub-grid-title">Ripper (ha)</div>
                  <div class="sub-grid-cols">
                    <div>
                      <div class="sub-grid-label">Rencana</div>
                      <div class="sub-grid-value">{{ formatNumber(row.ripper.rencana) }}</div>
                    </div>
                    <div>
                      <div class="sub-grid-label">Realisasi</div>
                      <div class="sub-grid-value">{{ formatNumber(row.ripper.sdHariIni) }}</div>
                    </div>
                  </div>
                  <div class="progress-container">
                    <div class="progress-info">
                      <span class="progress-label">Progress</span>
                      <span class="progress-value">{{ formatPercentage(row.ripper.persentase) }}</span>
                    </div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill progress-fill-success" 
                        :style="{ width: `${row.ripper.persentase}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="data-grid-cell">
                <div class="sub-grid">
                  <div class="sub-grid-title">Luku (ha)</div>
                  <div class="sub-grid-cols">
                    <div>
                      <div class="sub-grid-label">Rencana</div>
                      <div class="sub-grid-value">{{ formatNumber(row.luku.rencana) }}</div>
                    </div>
                    <div>
                      <div class="sub-grid-label">Realisasi</div>
                      <div class="sub-grid-value">{{ formatNumber(row.luku.sdHariIni) }}</div>
                    </div>
                  </div>
                  <div class="progress-container">
                    <div class="progress-info">
                      <span class="progress-label">Progress</span>
                      <span class="progress-value">{{ formatPercentage(row.luku.persentase) }}</span>
                    </div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="getProgressColorClass(row.luku.persentase)"
                        :style="{ width: `${row.luku.persentase}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="data-grid-cell">
                <div class="sub-grid">
                  <div class="sub-grid-title">Tumbang/Chipping (ha)</div>
                  <div class="sub-grid-cols">
                    <div>
                      <div class="sub-grid-label">Rencana</div>
                      <div class="sub-grid-value">{{ formatNumber(row.tumbangChipping.rencana) }}</div>
                    </div>
                    <div>
                      <div class="sub-grid-label">Realisasi</div>
                      <div class="sub-grid-value">{{ formatNumber(row.tumbangChipping.sdHariIni) }}</div>
                    </div>
                  </div>
                  <div class="progress-container">
                    <div class="progress-info">
                      <span class="progress-label">Progress</span>
                      <span class="progress-value">{{ formatPercentage(row.tumbangChipping.persentase) }}</span>
                    </div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="getProgressColorClass(row.tumbangChipping.persentase)"
                        :style="{ width: `${row.tumbangChipping.persentase}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="data-grid-cell">
                <div class="sub-grid">
                  <div class="sub-grid-title">Pembuatan Parit (Mtr)</div>
                  <div class="sub-grid-cols">
                    <div>
                      <div class="sub-grid-label">Rencana</div>
                      <div class="sub-grid-value">{{ formatNumber(row.pembuatanParit.rencana) }}</div>
                    </div>
                    <div>
                      <div class="sub-grid-label">Realisasi</div>
                      <div class="sub-grid-value">{{ formatNumber(row.pembuatanParit.sdHariIni) }}</div>
                    </div>
                  </div>
                  <div class="progress-container">
                    <div class="progress-info">
                      <span class="progress-label">Progress</span>
                      <span class="progress-value">{{ formatPercentage(row.pembuatanParit.persentase) }}</span>
                    </div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="getProgressColorClass(row.pembuatanParit.persentase)"
                        :style="{ width: `${row.pembuatanParit.persentase}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="data-grid-cell">
                <div class="sub-grid">
                  <div class="sub-grid-title">Menanam Mucuna (ha)</div>
                  <div class="sub-grid-cols">
                    <div>
                      <div class="sub-grid-label">Rencana</div>
                      <div class="sub-grid-value">{{ formatNumber(row.menanamMucuna.rencana) }}</div>
                    </div>
                    <div>
                      <div class="sub-grid-label">Realisasi</div>
                      <div class="sub-grid-value">{{ formatNumber(row.menanamMucuna.sdHariIni) }}</div>
                    </div>
                  </div>
                  <div class="progress-container">
                    <div class="progress-info">
                      <span class="progress-label">Progress</span>
                      <span class="progress-value">{{ formatPercentage(row.menanamMucuna.persentase) }}</span>
                    </div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="getProgressColorClass(row.menanamMucuna.persentase)"
                        :style="{ width: `${row.menanamMucuna.persentase}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="data-grid-cell">
                <div class="sub-grid">
                  <div class="sub-grid-title">Lubang Tanam (ha)</div>
                  <div class="sub-grid-cols">
                    <div>
                      <div class="sub-grid-label">Rencana</div>
                      <div class="sub-grid-value">{{ formatNumber(row.lubangTanam.rencana) }}</div>
                    </div>
                    <div>
                      <div class="sub-grid-label">Realisasi</div>
                      <div class="sub-grid-value">{{ formatNumber(row.lubangTanam.sdHariIni) }}</div>
                    </div>
                  </div>
                  <div class="progress-container">
                    <div class="progress-info">
                      <span class="progress-label">Progress</span>
                      <span class="progress-value">{{ formatPercentage(row.lubangTanam.persentase) }}</span>
                    </div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="getProgressColorClass(row.lubangTanam.persentase)"
                        :style="{ width: `${row.lubangTanam.persentase}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="data-grid-cell">
                <div class="sub-grid">
                  <div class="sub-grid-title">Menanam KS (ha)</div>
                  <div class="sub-grid-cols">
                    <div>
                      <div class="sub-grid-label">Rencana</div>
                      <div class="sub-grid-value">{{ formatNumber(row.menanamKS.rencana) }}</div>
                    </div>
                    <div>
                      <div class="sub-grid-label">Realisasi</div>
                      <div class="sub-grid-value">{{ formatNumber(row.menanamKS.sdHariIni) }}</div>
                    </div>
                  </div>
                  <div class="progress-container">
                    <div class="progress-info">
                      <span class="progress-label">Progress</span>
                      <span class="progress-value">{{ formatPercentage(row.menanamKS.persentase) }}</span>
                    </div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="getProgressColorClass(row.menanamKS.persentase)"
                        :style="{ width: `${row.menanamKS.persentase}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="data-grid-cell">
                <div class="sub-grid">
                  <div class="sub-grid-title">Total LC</div>
                  <div class="sub-grid-cols">
                    <div>
                      <div class="sub-grid-label">Rencana</div>
                      <div class="sub-grid-value">{{ formatNumber(row.totalLC.rencana) }}</div>
                    </div>
                    <div>
                      <div class="sub-grid-label">Realisasi</div>
                      <div class="sub-grid-value">{{ formatNumber(row.totalLC.realisasi) }}</div>
                    </div>
                  </div>
                  <div class="progress-container">
                    <div class="progress-info">
                      <span class="progress-label">Progress</span>
                      <span class="progress-value">{{ formatPercentage(row.totalLC.persentase) }}</span>
                    </div>
                    <div class="progress-bar">
                      <div 
                        class="progress-fill" 
                        :class="getProgressColorClass(row.totalLC.persentase)"
                        :style="{ width: `${row.totalLC.persentase}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td class="data-grid-cell">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{{ formatDate(row.tanggalSPPBJ) }}</span>
                </div>
              </td>
              <td class="data-grid-cell">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{{ row.jumlahHariKerja }} hari</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Menampilkan <span class="font-medium">{{ filteredData.length }}</span> dari <span class="font-medium">{{ processedData.length }}</span> data
        </div>
        <div class="flex space-x-2">
          <button class="btn btn-secondary text-sm">
            Previous
          </button>
          <button class="btn btn-primary text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateDaysDifference, formatDate, isValidDateFormat } from '../utils/dateUtils';
import { exportToExcel } from '../utils/exportUtils.js';

export default {
  name: 'DataGrid',
  props: {
    rawData: Object,
    filters: {
      type: Object,
      default: () => ({
        kebun: '',
        afd: '',
        search: ''
      })
    }
  },
  emits: ['refresh'],
  computed: {
    processedData() {
      if (!this.rawData || !this.rawData.table || !this.rawData.table.rows) return [];
      
      const rows = this.rawData.table.rows;
      const result = [];
      let currentKebun = null;
      let no = 0;
      
      // Fungsi untuk menghitung persentase
      const calculatePercentage = (realisasi, rencana) => {
        if (!rencana || rencana === 0) return 0;
        return (realisasi / rencana) * 100;
      };
      
      // Proses setiap baris
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        // Skip baris kosong
        if (!cells || cells.length === 0) continue;
        
        // Cek apakah ini baris nama kebun
        const kebunName = cells[1] ? cells[1].v : '';
        
        // Skip baris header
        if (kebunName === 'Kebun') continue;
        
        // Skip baris "Jumlah"
        if (cells[0] && cells[0].v === 'Jumlah') continue;
        
        // Skip baris "Total"
        if (cells[0] && cells[0].v === 'Total') continue;
        
        // Ambil data dari sel
        const afdName = cells[2] ? cells[2].v : '';
        const luasPaket = cells[3] ? cells[3].v : 0;
        
        // LOGIKA BARU: Skip baris yang tidak memiliki kebun dan AFD
        if (!kebunName && !afdName) {
          continue; // Lewati baris ini
        }
        
        // Jika ini baris nama kebun, set currentKebun
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        // Skip baris yang tidak memiliki AFD (kecuali baris nama kebun)
        if (!afdName && !kebunName) {
          continue; // Lewati baris ini
        }
        
        // Ripper
        const ripperRencana = cells[4] ? cells[4].v : 0;
        const ripperHariIni = cells[5] ? cells[5].v : 0;
        const ripperSdHariIni = cells[6] ? cells[6].v : 0;
        const ripperPersentase = calculatePercentage(ripperSdHariIni, ripperRencana);
        
        // Luku
        const lukuRencana = cells[8] ? cells[8].v : 0;
        const lukuHariIni = cells[9] ? cells[9].v : 0;
        const lukuSdHariIni = cells[10] ? cells[10].v : 0;
        const lukuPersentase = calculatePercentage(lukuSdHariIni, lukuRencana);
        
        // Tumbang/Chipping
        const tumbangRencana = cells[12] ? cells[12].v : 0;
        const tumbangHariIni = cells[13] ? cells[13].v : 0;
        const tumbangSdHariIni = cells[14] ? cells[14].v : 0;
        const tumbangPersentase = calculatePercentage(tumbangSdHariIni, tumbangRencana);
        
        // Pembuatan Parit
        const paritRencana = cells[16] ? cells[16].v : 0;
        const paritHariIni = cells[17] ? cells[17].v : 0;
        const paritSdHariIni = cells[18] ? cells[18].v : 0;
        const paritPersentase = calculatePercentage(paritSdHariIni, paritRencana);
        
        // Menanam Mucuna
        const mucunaRencana = cells[20] ? cells[20].v : 0;
        const mucunaHariIni = cells[21] ? cells[21].v : 0;
        const mucunaSdHariIni = cells[22] ? cells[22].v : 0;
        const mucunaPersentase = calculatePercentage(mucunaSdHariIni, mucunaRencana);
        
        // Lubang Tanam
        const lubangRencana = cells[24] ? cells[24].v : 0;
        const lubangHariIni = cells[25] ? cells[25].v : 0;
        const lubangSdHariIni = cells[26] ? cells[26].v : 0;
        const lubangPersentase = calculatePercentage(lubangSdHariIni, lubangRencana);
        
        // Menanam KS
        const ksRencana = cells[28] ? cells[28].v : 0;
        const ksHariIni = cells[29] ? cells[29].v : 0;
        const ksSdHariIni = cells[30] ? cells[30].v : 0;
        const ksPersentase = calculatePercentage(ksSdHariIni, ksRencana);
        
        // Total LC
        const lcRencana = cells[32] ? cells[32].v : 0;
        const lcRealisasi = cells[33] ? cells[33].v : 0;
        const lcPersentase = calculatePercentage(lcRealisasi, lcRencana);
        
        // Tanggal SPPBJ
        const tanggalSPPBJ = cells[35] ? (cells[35].f || cells[35].v) : '';
        
        // Hitung jumlah hari kerja secara otomatis
        let jumlahHariKerja = 0;
        if (isValidDateFormat(tanggalSPPBJ)) {
          jumlahHariKerja = calculateDaysDifference(tanggalSPPBJ);
        }
        
        // Tambahkan ke result hanya jika ada data yang valid
        if (currentKebun && afdName) {
          no++;
          result.push({
            no: no,
            kebun: currentKebun,
            afd: afdName,
            luasPaket: luasPaket,
            ripper: {
              rencana: ripperRencana,
              hariIni: ripperHariIni,
              sdHariIni: ripperSdHariIni,
              persentase: ripperPersentase
            },
            luku: {
              rencana: lukuRencana,
              hariIni: lukuHariIni,
              sdHariIni: lukuSdHariIni,
              persentase: lukuPersentase
            },
            tumbangChipping: {
              rencana: tumbangRencana,
              hariIni: tumbangHariIni,
              sdHariIni: tumbangSdHariIni,
              persentase: tumbangPersentase
            },
            pembuatanParit: {
              rencana: paritRencana,
              hariIni: paritHariIni,
              sdHariIni: paritSdHariIni,
              persentase: paritPersentase
            },
            menanamMucuna: {
              rencana: mucunaRencana,
              hariIni: mucunaHariIni,
              sdHariIni: mucunaSdHariIni,
              persentase: mucunaPersentase
            },
            lubangTanam: {
              rencana: lubangRencana,
              hariIni: lubangHariIni,
              sdHariIni: lubangSdHariIni,
              persentase: lubangPersentase
            },
            menanamKS: {
              rencana: ksRencana,
              hariIni: ksHariIni,
              sdHariIni: ksSdHariIni,
              persentase: ksPersentase
            },
            totalLC: {
              rencana: lcRencana,
              realisasi: lcRealisasi,
              persentase: lcPersentase
            },
            tanggalSPPBJ: tanggalSPPBJ,
            jumlahHariKerja: jumlahHariKerja
          });
        }
      }
        console.log("DataGrid: Hasil processedData:", result);

      return result;
    },
    
    // Filter data berdasarkan filter yang dipilih
    filteredData() {
      if (!this.processedData.length) return [];
      
      return this.processedData.filter(row => {
        // Filter kebun
        if (this.filters.kebun && row.kebun !== this.filters.kebun) {
          return false;
        }
        
        // Filter AFD
        if (this.filters.afd && row.afd !== this.filters.afd) {
          return false;
        }
        
        // Filter search
        if (this.filters.search) {
          const searchLower = this.filters.search.toLowerCase();
          const searchableText = [
            row.kebun,
            row.afd,
            row.luasPaket.toString(),
            row.ripper.rencana.toString(),
            row.ripper.sdHariIni.toString(),
            row.luku.rencana.toString(),
            row.luku.sdHariIni.toString(),
            row.tumbangChipping.rencana.toString(),
            row.tumbangChipping.sdHariIni.toString(),
            row.pembuatanParit.rencana.toString(),
            row.pembuatanParit.sdHariIni.toString(),
            row.menanamMucuna.rencana.toString(),
            row.menanamMucuna.sdHariIni.toString(),
            row.lubangTanam.rencana.toString(),
            row.lubangTanam.sdHariIni.toString(),
            row.menanamKS.rencana.toString(),
            row.menanamKS.sdHariIni.toString(),
            row.totalLC.rencana.toString(),
            row.totalLC.realisasi.toString(),
            row.tanggalSPPBJ,
            row.jumlahHariKerja.toString()
          ].join(' ').toLowerCase();
          
          if (!searchableText.includes(searchLower)) {
            return false;
          }
        }
        
        return true;
      });
    },
    
    // Group data berdasarkan nama kebun
    groupedData() {
      const groups = {};
      
      this.filteredData.forEach(row => {
        if (!groups[row.kebun]) {
          groups[row.kebun] = [];
        }
        groups[row.kebun].push(row);
      });
      
      return groups;
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
      return formatDate(dateString);
    },
    getProgressColorClass(percentage) {
      if (percentage >= 80) return 'progress-fill-success';
      if (percentage >= 50) return 'progress-fill-warning';
      return 'progress-fill-danger';
    },
exportToExcelHandler() {
  console.log('Exporting raw data:', this.rawData);
  exportToExcel(this.rawData);
},
 exportToCSV() {
      if (!this.processedData || this.processedData.length === 0) {
        console.warn('Tidak ada data untuk diexport.');
        return;
      }

      // Format data untuk CSV
      const dataToExport = this.processedData.map(item => ({
        'Kebun': item.kebun || '',
        'AFD': item.afd || '',
        'Luas Paket (Ha)': Number(item.luasPaket || 0).toFixed(2),
        'LC Rencana': Number(item.lcRencana || 0).toFixed(2),
        'LC Realisasi': Number(item.lcRealisasi || 0).toFixed(2),
        'Tanggal SPPBJ': this.formatTanggal(item.tanggalSPPBJ),
        'Jumlah Hari Kerja': item.jumlahHariKerja || 0
      }));

      // Generate CSV string
      const csv = Papa.unparse(dataToExport);

      // Buat dan unduh file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data-monitoring.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    formatTanggal(tgl) {
      const date = new Date(tgl);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }
}
</script>