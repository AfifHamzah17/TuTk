<!-- src/components/DataGrid.vue -->
<template>
  <div class="data-grid">
    <div class="data-grid-header">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Data Progress Tanaman</h3>
        <div class="flex space-x-2">
          <button @click="exportToExcelHandler" class="btn btn-secondary text-sm">
            Export Excel
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
            <th class="w-32">Nama Paket</th>
            <th class="w-24">AFD</th>
            <th class="w-32">Luas Paket (ha)</th>
            <th class="w-64">Ripper</th>
            <th class="w-64">Luku</th>
            <th class="w-64">Tumbang/Chipping</th>
            <th class="w-64">Pembuatan Parit</th>
            <th class="w-64">Menanam Mucuna</th>
            <th class="w-64">Lubang Tanam</th>
            <th class="w-64">Mempupuk Lobang</th>
            <th class="w-64">Menanam KS</th>
            <th class="w-64">Progress TU</th>
            <th class="w-40">Tanggal SPPBJ</th>
            <th class="w-32">Hari Kerja</th>
          </tr>
        </thead>
        <tbody class="data-grid-body">
          <template v-for="(group, groupName) in groupedData" :key="groupName">
            <!-- Header Group Kebun -->
            <tr class="kebun-group">
              <td colspan="16" class="kebun-header px-6 py-3">
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
              <td class="data-grid-cell">{{ row.namaPaket }}</td>
              <td class="data-grid-cell">
                <span class="badge badge-info">{{ row.afd }}</span>
              </td>
              <td class="data-grid-cell">{{ formatNumber(row.luasPaket) }}</td>
              <td class="data-grid-cell">
                <ProgressItem
                  title="Ripper"
                  :rencana="row.ripper.rencana"
                  :hari-ini="row.ripper.hariIni"
                  :sd-hari-ini="row.ripper.sdHariIni"
                  :persentase="row.ripper.persentase"
                />
              </td>
              <td class="data-grid-cell">
                <ProgressItem
                  title="Luku"
                  :rencana="row.luku.rencana"
                  :hari-ini="row.luku.hariIni"
                  :sd-hari-ini="row.luku.sdHariIni"
                  :persentase="row.luku.persentase"
                />
              </td>
              <td class="data-grid-cell">
                <ProgressItem
                  title="Tumbang/Chipping"
                  :rencana="row.tumbangChipping.rencana"
                  :hari-ini="row.tumbangChipping.hariIni"
                  :sd-hari-ini="row.tumbangChipping.sdHariIni"
                  :persentase="row.tumbangChipping.persentase"
                />
              </td>
              <td class="data-grid-cell">
                <ProgressItem
                  title="Pembuatan Parit"
                  unit="Mtr"
                  :rencana="row.pembuatanParit.rencana"
                  :hari-ini="row.pembuatanParit.hariIni"
                  :sd-hari-ini="row.pembuatanParit.sdHariIni"
                  :persentase="row.pembuatanParit.persentase"
                />
              </td>
              <td class="data-grid-cell">
                <ProgressItem
                  title="Menanam Mucuna"
                  :rencana="row.menanamMucuna.rencana"
                  :hari-ini="row.menanamMucuna.hariIni"
                  :sd-hari-ini="row.menanamMucuna.sdHariIni"
                  :persentase="row.menanamMucuna.persentase"
                />
              </td>
              <td class="data-grid-cell">
                <ProgressItem
                  title="Lubang Tanam"
                  :rencana="row.lubangTanam.rencana"
                  :hari-ini="row.lubangTanam.hariIni"
                  :sd-hari-ini="row.lubangTanam.sdHariIni"
                  :persentase="row.lubangTanam.persentase"
                />
              </td>
              <td class="data-grid-cell">
                <ProgressItem
                  title="Mempupuk Lobang"
                  :rencana="row.mempupukLobang.rencana"
                  :hari-ini="row.mempupukLobang.hariIni"
                  :sd-hari-ini="row.mempupukLobang.sdHariIni"
                  :persentase="row.mempupukLobang.persentase"
                />
              </td>
              <td class="data-grid-cell">
                <ProgressItem
                  title="Menanam KS"
                  :rencana="row.menanamKS.rencana"
                  :hari-ini="row.menanamKS.hariIni"
                  :sd-hari-ini="row.menanamKS.sdHariIni"
                  :persentase="row.menanamKS.persentase"
                />
              </td>
              <td class="data-grid-cell">
                <ProgressItem
                  title="Progress Tanam Ulang"
                  :rencana="row.totalLC.rencana"
                  :hari-ini="row.totalLC.realisasi"
                  :sd-hari-ini="row.totalLC.realisasi"
                  :persentase="row.totalLC.persentase"
                />
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
import ProgressItem from './ProgressItem.vue';

export default {
  name: 'DataGrid',
  components: {
    ProgressItem
  },
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
        const namaPaket = cells[2] ? cells[2].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const luasPaket = cells[4] ? cells[4].v : 0;
        
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
        const ripperRencana = cells[5] ? cells[5].v : 0;
        const ripperHariIni = cells[6] ? cells[6].v : 0;
        const ripperSdHariIni = cells[7] ? cells[7].v : 0;
        const ripperPersentase = calculatePercentage(ripperSdHariIni, ripperRencana);
        
        // Luku
        const lukuRencana = cells[9] ? cells[9].v : 0;
        const lukuHariIni = cells[10] ? cells[10].v : 0;
        const lukuSdHariIni = cells[11] ? cells[11].v : 0;
        const lukuPersentase = calculatePercentage(lukuSdHariIni, lukuRencana);
        
        // Tumbang/Chipping
        const tumbangRencana = cells[13] ? cells[13].v : 0;
        const tumbangHariIni = cells[14] ? cells[14].v : 0;
        const tumbangSdHariIni = cells[15] ? cells[15].v : 0;
        const tumbangPersentase = calculatePercentage(tumbangSdHariIni, tumbangRencana);
        
        // Pembuatan Parit
        const paritRencana = cells[17] ? cells[17].v : 0;
        const paritHariIni = cells[18] ? cells[18].v : 0;
        const paritSdHariIni = cells[19] ? cells[19].v : 0;
        const paritPersentase = calculatePercentage(paritSdHariIni, paritRencana);
        
        // Menanam Mucuna
        const mucunaRencana = cells[21] ? cells[21].v : 0;
        const mucunaHariIni = cells[22] ? cells[22].v : 0;
        const mucunaSdHariIni = cells[23] ? cells[23].v : 0;
        const mucunaPersentase = calculatePercentage(mucunaSdHariIni, mucunaRencana);
        
        // Lubang Tanam
        const lubangRencana = cells[25] ? cells[25].v : 0;
        const lubangHariIni = cells[26] ? cells[26].v : 0;
        const lubangSdHariIni = cells[27] ? cells[27].v : 0;
        const lubangPersentase = calculatePercentage(lubangSdHariIni, lubangRencana);
        
        // Mempupuk Lobang
        const mempupukLobangRencana = cells[29] ? cells[29].v : 0;
        const mempupukLobangHariIni = cells[30] ? cells[30].v : 0;
        const mempupukLobangSdHariIni = cells[31] ? cells[31].v : 0;
        const mempupukLobangPersentase = calculatePercentage(mempupukLobangSdHariIni, mempupukLobangRencana);
        
        // Menanam KS
        const ksRencana = cells[33] ? cells[33].v : 0; // Sama dengan Mempupuk Lobang
        const ksHariIni = cells[34] ? cells[34].v : 0; // Sama dengan Mempupuk Lobang
        const ksSdHariIni = cells[35] ? cells[35].v : 0; // Sama dengan Mempupuk Lobang
        const ksPersentase = calculatePercentage(ksSdHariIni, ksRencana);
        
        // Total LC
        const lcRencana = cells[37] ? cells[37].v : 0;
        const lcRealisasi = cells[38] ? cells[38].v : 0;
        const lcPersentase = calculatePercentage(lcRealisasi, lcRencana);
        
        // Tanggal SPPBJ
        const tanggalSPPBJ = cells[40] ? (cells[40].f || cells[40].v) : '';
        
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
            namaPaket: namaPaket,
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
            mempupukLobang: {
              rencana: mempupukLobangRencana,
              hariIni: mempupukLobangHariIni,
              sdHariIni: mempupukLobangSdHariIni,
              persentase: mempupukLobangPersentase
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
      
      // console.log("DataGrid: Hasil processedData:", result);
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
            row.namaPaket,
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
            row.mempupukLobang.rencana.toString(),
            row.mempupukLobang.sdHariIni.toString(),
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
    refreshData() {
      this.$emit('refresh');
    }
  }
}
</script>