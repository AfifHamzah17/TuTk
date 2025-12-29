<!-- src/components/DataGridTK.vue -->
<template>
  <div class="data-grid">
    <div class="data-grid-header">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">Data Progress Tanaman Konversi</h3>
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
    
    <div class="table-container overflow-x-auto">
      <table class="data-table min-w-full">
        <thead>
          <tr>
            <th class="w-12">No</th>
            <th class="w-32">Kebun</th>
            <th class="w-24">Afdeling</th>
            <th class="w-32">Nama Vendor</th>
            <th class="w-24">Luas</th>
            <th class="w-64">Pembuatan Parit</th>
            <!-- Header Baru (Pindah ke sini, setelah Parit) -->
            <th class="w-64">Membuat Teras</th>
            <th class="w-64">Membuat Jalan Baru</th>
            <!-- End Header Baru -->
            <th class="w-64">Membongkar Tunggul</th>
            <th class="w-64">Merumpuk Tunggul</th>
            <th class="w-64">Ripping</th>
            <th class="w-64">Luku</th>
            <th class="w-64">Menanam Mucuna</th>
            <th class="w-64">Lubang Tanam</th>
            <th class="w-64">Menutup Lubang Tanam</th>
            <th class="w-64">Menanam KS</th>
            <th class="w-64">Progress overall</th>
            <th class="w-40">Tanggal SPPBJ</th>
            <th class="w-32">Durasi kerja</th>
          </tr>
        </thead>
        <tbody class="data-grid-body">
          <template v-for="(group, groupName) in paginatedGroupedData" :key="groupName">
            <!-- Header Group Kebun -->
            <tr class="kebun-group">
              <!-- Colspan tetap 19 karena jumlah kolom tidak berubah, hanya urutan -->
              <td colspan="19" class="kebun-header px-6 py-3 cursor-pointer" @click="toggleGroup(groupName)">
                <div class="flex items-center">
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
                  <span class="ml-2 text-sm text-gray-500">({{ group.length }} AFD)</span>
                  <span class="ml-2 text-xs px-2 py-1 rounded-full" 
                        :class="minimizedGroups[groupName] ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-800'">
                    {{ minimizedGroups[groupName] ? 'Minimized' : 'Expanded' }}
                  </span>
                </div>
              </td>
            </tr>
            
            <!-- Data per AFD dalam group -->
            <template v-if="!minimizedGroups[groupName]">
              <tr v-for="(row, index) in group" :key="index" class="data-grid-row">
                <td class="data-grid-cell font-medium">{{ row.no }}</td>
                <td class="data-grid-cell kebun-name">{{ row.kebun }}</td>
                <td class="data-grid-cell">
                  <span class="badge badge-info">{{ row.afd }}</span>
                </td>
                <td class="data-grid-cell">{{ row.namaPaket }}</td>
                <td class="data-grid-cell">{{ formatNumber(row.luasPaket) }} ha</td>
                
                <!-- 1. Pembuatan Parit -->
                <td class="data-grid-cell">
                  <ProgressItem
                    title="Pembuatan Parit"
                    unit="mtr"
                    :rencana="row.pembuatanParit.rencana"
                    :hari-ini="row.pembuatanParit.hariIni"
                    :sd-hari-ini="row.pembuatanParit.sdHariIni"
                    :persentase="row.pembuatanParit.persentase"
                  />
                </td>
                
                <!-- 2. Membuat Teras (Unit Meter, Posisi setelah Parit) -->
                <td class="data-grid-cell">
                  <ProgressItem
                    title="Membuat Teras"
                    unit="mtr"
                    :rencana="row.membuatTeras.rencana"
                    :hari-ini="row.membuatTeras.hariIni"
                    :sd-hari-ini="row.membuatTeras.sdHariIni"
                    :persentase="row.membuatTeras.persentase"
                  />
                </td>
                
                <!-- 3. Membuat Jalan Baru (Unit Meter, Posisi setelah Teras) -->
                <td class="data-grid-cell">
                  <ProgressItem
                    title="Membuat Jalan Baru"
                    unit="mtr"
                    :rencana="row.membuatJalanBaru.rencana"
                    :hari-ini="row.membuatJalanBaru.hariIni"
                    :sd-hari-ini="row.membuatJalanBaru.sdHariIni"
                    :persentase="row.membuatJalanBaru.persentase"
                  />
                </td>

                <!-- Sisa Kolom (Urutan Sesuai Header) -->
                <td class="data-grid-cell">
                  <ProgressItem
                    title="Membongkar Tunggul"
                    :rencana="row.membongkarTunggul.rencana"
                    :hari-ini="row.membongkarTunggul.hariIni"
                    :sd-hari-ini="row.membongkarTunggul.sdHariIni"
                    :persentase="row.membongkarTunggul.persentase"
                  />
                </td>
                <td class="data-grid-cell">
                  <ProgressItem
                    title="Merumpuk Tunggul"
                    :rencana="row.merumpukTunggul.rencana"
                    :hari-ini="row.merumpukTunggul.hariIni"
                    :sd-hari-ini="row.merumpukTunggul.sdHariIni"
                    :persentase="row.merumpukTunggul.persentase"
                  />
                </td>
                <td class="data-grid-cell">
                  <ProgressItem
                    title="Ripping"
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
                    title="Menutup Lubang Tanam"
                    :rencana="row.menutupLubangTanam.rencana"
                    :hari-ini="row.menutupLubangTanam.hariIni"
                    :sd-hari-ini="row.menutupLubangTanam.sdHariIni"
                    :persentase="row.menutupLubangTanam.persentase"
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
                    title="Progress Overall"
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
import { calculateDaysDifference, formatDate, isValidDateFormat } from '../utils/dateUtils';
import { exportToExcel } from '../utils/exportUtils.js';
import ProgressItem from './ProgressItem.vue';

export default {
  name: 'DataGridTK',
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
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      customItemsPerPage: 10,
      minimizedGroups: {},
      allGroupsMinimized: false
    };
  },
  computed: {
    processedData() {
      if (!this.rawData || !this.rawData.table || !this.rawData.table.rows) return [];
      
      const rows = this.rawData.table.rows;
      const result = [];
      let currentKebun = null;
      let no = 0;
      
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
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.c;
        
        if (!cells || cells.length === 0) continue;
        
        const kebunName = cells[1] ? cells[1].v : '';
        
        if (kebunName === 'Kebun') continue;
        if (cells[0] && cells[0].v === 'Jumlah') continue;
        if (cells[0] && cells[0].v === 'Total') continue;
        
        const namaPaket = cells[2] ? cells[2].v : '';
        const afdName = cells[3] ? cells[3].v : '';
        const luasPaket = cells[4] ? cells[4].v : 0;
        
        if (!kebunName && !afdName) {
          continue;
        }
        
        if (kebunName) {
          currentKebun = kebunName;
        }
        
        if (!afdName && !kebunName) {
          continue;
        }
        
        // --- Data Mapping ---
        
        // Membongkar Tunggul (5,6,7)
        const MembongkarTunggulRencana = cells[5] ? cells[5].v : 0;
        const MembongkarTunggulHariIni = cells[6] ? cells[6].v : 0;
        const MembongkarTunggulSdHariIni = cells[7] ? cells[7].v : 0;
        const MembongkarTunggulPersentase = calculatePercentage(MembongkarTunggulSdHariIni, MembongkarTunggulRencana);
        
        // Merumpuk Tunggul (9,10,11)
        const MerumpukTunggulRencana = cells[9] ? cells[9].v : 0;
        const MerumpukTunggulHariIni = cells[10] ? cells[10].v : 0;
        const MerumpukTunggulSdHariIni = cells[11] ? cells[11].v : 0;
        const MerumpukTunggulPersentase = calculatePercentage(MerumpukTunggulSdHariIni, MerumpukTunggulRencana);
        
        // Ripper (13,14,15)
        const ripperRencana = cells[13] ? cells[13].v : 0;
        const ripperHariIni = cells[14] ? cells[14].v : 0;
        const ripperSdHariIni = cells[15] ? cells[15].v : 0;
        const ripperPersentase = calculatePercentage(ripperSdHariIni, ripperRencana);
        
        // Luku (17,18,19)
        const lukuRencana = cells[17] ? cells[17].v : 0;
        const lukuHariIni = cells[18] ? cells[18].v : 0;
        const lukuSdHariIni = cells[19] ? cells[19].v : 0;
        const lukuPersentase = calculatePercentage(lukuSdHariIni, lukuRencana);
        
        // Pembuatan Parit (21,22,23)
        const PembuatanParitRencana = cells[21] ? cells[21].v : 0;
        const PembuatanParitHariIni = cells[22] ? cells[22].v : 0;
        const PembuatanParitSdHariIni = cells[23] ? cells[23].v : 0;
        const PembuatanParitPersentase = calculatePercentage(PembuatanParitSdHariIni, PembuatanParitRencana);
        
        // Menanam Mucuna (25,26,27)
        const MenanamMucunaRencana = cells[25] ? cells[25].v : 0;
        const MenanamMucunaHariIni = cells[26] ? cells[26].v : 0;
        const MenanamMucunaSdHariIni = cells[27] ? cells[27].v : 0;
        const MenanamMucunaPersentase = calculatePercentage(MenanamMucunaSdHariIni, MenanamMucunaRencana);
        
        // Lubang Tanam (29,30,31)
        const MelubangTanamRencana = cells[29] ? cells[29].v : 0;
        const MelubangTanamHariIni = cells[30] ? cells[30].v : 0;
        const MelubangTanamSdHariIni = cells[31] ? cells[31].v : 0;
        const MelubangTanamPersentase = calculatePercentage(MelubangTanamSdHariIni, MelubangTanamRencana);
        
        // Menutup Lubang Tanam (33,34,35)
        const MenutupLubangTanamRencana = cells[33] ? cells[33].v : 0;
        const MenutupLubangTanamHariIni = cells[34] ? cells[34].v : 0;
        const MenutupLubangTanamSdHariIni = cells[35] ? cells[35].v : 0;
        const MenutupLubangTanamPersentase = calculatePercentage(MenutupLubangTanamSdHariIni, MenutupLubangTanamRencana);
        
        // Menanam KS (37,38,39)
        const MenanamKSRencana = cells[37] ? cells[37].v : 0;
        const MenanamKSHariIni = cells[38] ? cells[38].v : 0;
        const MenanamKSSdHariIni = cells[39] ? cells[39].v : 0;
        const MenanamKSPersentase = calculatePercentage(MenanamKSSdHariIni, MenanamKSRencana);
        
        // --- DATA BARU ---
        // Membuat Teras (46, 47, 48)
        const MembuatTerasRencana = cells[46] ? cells[46].v : 0;
        const MembuatTerasHariIni = cells[47] ? cells[47].v : 0;
        const MembuatTerasSdHariIni = cells[48] ? cells[48].v : 0;
        const MembuatTerasPersentase = calculatePercentage(MembuatTerasSdHariIni, MembuatTerasRencana);
        
        // Membuat Jalan Baru (50, 51, 52)
        const MembuatJalanBaruRencana = cells[50] ? cells[50].v : 0;
        const MembuatJalanBaruHariIni = cells[51] ? cells[51].v : 0;
        const MembuatJalanBaruSdHariIni = cells[52] ? cells[52].v : 0;
        const MembuatJalanBaruPersentase = calculatePercentage(MembuatJalanBaruSdHariIni, MembuatJalanBaruRencana);
        // --- AKHIR DATA BARU ---

        // Total LC (41, 42)
        const lcRencana = cells[41] ? cells[41].v : 0;
        const lcRealisasi = cells[42] ? cells[42].v : 0;
        const lcPersentase = calculatePercentage(lcRealisasi, lcRencana);
        
        // Tanggal SPPBJ (44)
        const tanggalSPPBJ = cells[44] ? (cells[44].f || cells[44].v) : '';
        
        let jumlahHariKerja = 0;
        if (isValidDateFormat(tanggalSPPBJ)) {
          jumlahHariKerja = calculateDaysDifference(tanggalSPPBJ);
        }
        
        if (currentKebun && afdName) {
          no++;
          result.push({
            no: no,
            kebun: currentKebun,
            namaPaket: namaPaket,
            afd: afdName,
            luasPaket: luasPaket,
            pembuatanParit: {
              rencana: PembuatanParitRencana,
              hariIni: PembuatanParitHariIni,
              sdHariIni: PembuatanParitSdHariIni,
              persentase: PembuatanParitPersentase
            },
            // Data Baru (Object property urutan tidak mempengaruhi tampilan HTML, tapi saya letakkan di sini)
            membuatTeras: {
              rencana: MembuatTerasRencana,
              hariIni: MembuatTerasHariIni,
              sdHariIni: MembuatTerasSdHariIni,
              persentase: MembuatTerasPersentase
            },
            membuatJalanBaru: {
              rencana: MembuatJalanBaruRencana,
              hariIni: MembuatJalanBaruHariIni,
              sdHariIni: MembuatJalanBaruSdHariIni,
              persentase: MembuatJalanBaruPersentase
            },
            membongkarTunggul: {
              rencana: MembongkarTunggulRencana,
              hariIni: MembongkarTunggulHariIni,
              sdHariIni: MembongkarTunggulSdHariIni,
              persentase: MembongkarTunggulPersentase
            },
            merumpukTunggul: {
              rencana: MerumpukTunggulRencana,
              hariIni: MerumpukTunggulHariIni,
              sdHariIni: MerumpukTunggulSdHariIni,
              persentase: MerumpukTunggulPersentase
            },
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
            menanamMucuna: {
              rencana: MenanamMucunaRencana,
              hariIni: MenanamMucunaHariIni,
              sdHariIni: MenanamMucunaSdHariIni,
              persentase: MenanamMucunaPersentase
            },
            lubangTanam: {
              rencana: MelubangTanamRencana,
              hariIni: MelubangTanamHariIni,
              sdHariIni: MelubangTanamSdHariIni,
              persentase: MelubangTanamPersentase
            },
            menutupLubangTanam: {
              rencana: MenutupLubangTanamRencana,
              hariIni: MenutupLubangTanamHariIni,
              sdHariIni: MenutupLubangTanamSdHariIni,
              persentase: MenutupLubangTanamPersentase
            },
            menanamKS: {
              rencana: MenanamKSRencana,
              hariIni: MenanamKSHariIni,
              sdHariIni: MenanamKSSdHariIni,
              persentase: MenanamKSPersentase
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
      
      return result;
    },
    
    filteredData() {
      if (!this.processedData.length) return [];
      
      return this.processedData.filter(row => {
        if (this.filters.kebun && row.kebun !== this.filters.kebun) {
          return false;
        }
        
        if (this.filters.afd && row.afd !== this.filters.afd) {
          return false;
        }
        
        if (this.filters.search) {
          const searchLower = this.filters.search.toLowerCase();
          const searchableText = [
            row.kebun,
            row.namaPaket,
            row.afd,
            row.luasPaket.toString(),
            row.membongkarTunggul.rencana.toString(),
            row.membongkarTunggul.sdHariIni.toString(),
            row.merumpukTunggul.rencana.toString(),
            row.merumpukTunggul.sdHariIni.toString(),
            row.ripper.rencana.toString(),
            row.ripper.sdHariIni.toString(),
            row.luku.rencana.toString(),
            row.luku.sdHariIni.toString(),
            row.pembuatanParit.rencana.toString(),
            row.pembuatanParit.sdHariIni.toString(),
            // Kolom Baru untuk Search
            row.membuatTeras.rencana.toString(),
            row.membuatTeras.sdHariIni.toString(),
            row.membuatJalanBaru.rencana.toString(),
            row.membuatJalanBaru.sdHariIni.toString(),
            // Sisa kolom
            row.menanamMucuna.rencana.toString(),
            row.menanamMucuna.sdHariIni.toString(),
            row.lubangTanam.rencana.toString(),
            row.lubangTanam.sdHariIni.toString(),
            row.menutupLubangTanam.rencana.toString(),
            row.menutupLubangTanam.sdHariIni.toString(),
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
    
    groupedData() {
      const groups = {};
      this.filteredData.forEach(row => {
        if (!groups[row.kebun]) {
          groups[row.kebun] = [];
        }
        groups[row.kebun].push(row);
      });
      return groups;
    },

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
    
    paginatedGroupedData() {
      if (this.itemsPerPage === 'all') {
        return this.groupedData;
      }
      
      const result = {};
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const pageData = this.filteredData.slice(startIndex, endIndex);
      
      pageData.forEach(row => {
        if (!result[row.kebun]) {
          result[row.kebun] = [];
        }
        result[row.kebun].push(row);
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
    toggleGroup(groupName) {
      this.minimizedGroups = {
        ...this.minimizedGroups,
        [groupName]: !this.minimizedGroups[groupName]
      };
    },
    minimizeAllGroups() {
      const groupNames = Object.keys(this.groupedData);
      const newMinimizedGroups = {};
      groupNames.forEach(groupName => {
        newMinimizedGroups[groupName] = true;
      });
      this.minimizedGroups = newMinimizedGroups;
      this.allGroupsMinimized = true;
    },
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
.kebun-header {
  cursor: pointer;
  transition: background-color 0.2s;
}

.kebun-header:hover {
  background-color: rgba(243, 244, 246, 0.5);
}

/* Animasi untuk ikon panah */
.transform {
  transition: transform 0.2s ease-in-out;
}

.rotate-90 {
  transform: rotate(90deg);
}

/* Style untuk status indikator */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
</style>