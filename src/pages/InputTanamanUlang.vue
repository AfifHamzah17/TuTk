<template>
  <div class="container">
    <h1 class="page-title">Input Data Tanaman Ulang</h1>
    
    <div class="card">
      <h2 class="card-title">Form Input Data</h2>
      
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label" for="kebun">Kebun</label>
            <input 
              type="text" 
              id="kebun" 
              v-model="formData.kebun" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="afdeling">Afdeling</label>
            <input 
              type="text" 
              id="afdeling" 
              v-model="formData.afdeling" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="namaVendor">Nama Vendor</label>
            <input 
              type="text" 
              id="namaVendor" 
              v-model="formData.namaVendor" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="luas">Luas (ha)</label>
            <input 
              type="number" 
              id="luas" 
              v-model="formData.luas" 
              class="form-input" 
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="tanggalSPPBJ">Tanggal SPPBJ</label>
            <input 
              type="date" 
              id="tanggalSPPBJ" 
              v-model="formData.tanggalSPPBJ" 
              class="form-input" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="pembuatanParit">Pembuatan Parit (m)</label>
            <input 
              type="number" 
              id="pembuatanParit" 
              v-model="formData.pembuatanParit" 
              class="form-input" 
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="pembuatanJalan">Pembuatan Jalan (m)</label>
            <input 
              type="number" 
              id="pembuatanJalan" 
              v-model="formData.pembuatanJalan" 
              class="form-input" 
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="pembuatanTeras">Pembuatan Teras (m)</label>
            <input 
              type="number" 
              id="pembuatanTeras" 
              v-model="formData.pembuatanTeras" 
              class="form-input" 
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="ripping">Ripping (ha)</label>
            <input 
              type="number" 
              id="ripping" 
              v-model="formData.ripping" 
              class="form-input" 
              step="0.01"
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="luku">Luku (ha)</label>
            <input 
              type="number" 
              id="luku" 
              v-model="formData.luku" 
              class="form-input" 
              step="0.01"
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="tumbangChipping">Tumbang/Chipping (ha)</label>
            <input 
              type="number" 
              id="tumbangChipping" 
              v-model="formData.tumbangChipping" 
              class="form-input" 
              step="0.01"
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="menanamMucuna">Menanam Mucuna (ha)</label>
            <input 
              type="number" 
              id="menanamMucuna" 
              v-model="formData.menanamMucuna" 
              class="form-input" 
              step="0.01"
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="lubangTanam">Lubang Tanam KS (buah)</label>
            <input 
              type="number" 
              id="lubangTanam" 
              v-model="formData.lubangTanam" 
              class="form-input" 
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="mempupukLobang">Mempupuk Lubang (buah)</label>
            <input 
              type="number" 
              id="mempupukLobang" 
              v-model="formData.mempupukLobang" 
              class="form-input" 
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="menanamKS">Menanam KS (buah)</label>
            <input 
              type="number" 
              id="menanamKS" 
              v-model="formData.menanamKS" 
              class="form-input" 
              min="0"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label" for="progressOverall">Progress Overall (%)</label>
            <input 
              type="number" 
              id="progressOverall" 
              v-model="formData.progressOverall" 
              class="form-input" 
              step="0.01"
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner"></span>
            <span v-else>Simpan Data</span>
          </button>
          <button type="button" @click="resetForm" class="btn btn-secondary">Reset</button>
        </div>
      </form>
    </div>
    
    <div class="card">
      <h2 class="card-title">Data Tersimpan</h2>
      
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div> Memuat data...
      </div>
      
      <div v-else-if="dataList.length === 0" class="empty-state">
        <p>Belum ada data tersimpan</p>
      </div>
      
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Kebun</th>
              <th>Afdeling</th>
              <th>Nama Vendor</th>
              <th>Luas (ha)</th>
              <th>Tanggal SPPBJ</th>
              <th>Progress Overall</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="item.id">
              <td>{{ startIndex + index + 1 }}</td>
              <td>{{ item.kebun }}</td>
              <td>{{ item.afdeling }}</td>
              <td>{{ item.namaVendor }}</td>
              <td>{{ item.luas }}</td>
              <td>{{ formatDate(item.tanggalSPPBJ) }}</td>
              <td>{{ item.progressOverall }}%</td>
              <td>
                <button @click="viewDetails(item)" class="btn btn-sm btn-secondary">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="pagination">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1" 
            class="btn btn-secondary"
          >
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages" 
            class="btn btn-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal Detail -->
    <div v-if="showDetailModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Detail Data</h3>
          <button @click="closeDetailModal" class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <strong>Kebun:</strong> {{ selectedItem.kebun }}
            </div>
            <div class="detail-item">
              <strong>Afdeling:</strong> {{ selectedItem.afdeling }}
            </div>
            <div class="detail-item">
              <strong>Nama Vendor:</strong> {{ selectedItem.namaVendor }}
            </div>
            <div class="detail-item">
              <strong>Luas:</strong> {{ selectedItem.luas }} ha
            </div>
            <div class="detail-item">
              <strong>Tanggal SPPBJ:</strong> {{ formatDate(selectedItem.tanggalSPPBJ) }}
            </div>
            <div class="detail-item">
              <strong>Pembuatan Parit:</strong> {{ selectedItem.pembuatanParit }} m
            </div>
            <div class="detail-item">
              <strong>Pembuatan Jalan:</strong> {{ selectedItem.pembuatanJalan }} m
            </div>
            <div class="detail-item">
              <strong>Pembuatan Teras:</strong> {{ selectedItem.pembuatanTeras }} m
            </div>
            <div class="detail-item">
              <strong>Ripping:</strong> {{ selectedItem.ripping }} ha
            </div>
            <div class="detail-item">
              <strong>Luku:</strong> {{ selectedItem.luku }} ha
            </div>
            <div class="detail-item">
              <strong>Tumbang/Chipping:</strong> {{ selectedItem.tumbangChipping }} ha
            </div>
            <div class="detail-item">
              <strong>Menanam Mucuna:</strong> {{ selectedItem.menanamMucuna }} ha
            </div>
            <div class="detail-item">
              <strong>Lubang Tanam KS:</strong> {{ selectedItem.lubangTanam }} buah
            </div>
            <div class="detail-item">
              <strong>Mempupuk Lubang:</strong> {{ selectedItem.mempupukLobang }} buah
            </div>
            <div class="detail-item">
              <strong>Menanam KS:</strong> {{ selectedItem.menanamKS }} buah
            </div>
            <div class="detail-item">
              <strong>Progress Overall:</strong> {{ selectedItem.progressOverall }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addTanamanUlangData, getTanamanUlangData } from '@/services/firestoreService';
import { formatDate } from '@/utils/dateUtils';

export default {
  name: 'InputTanamanUlang',
  data() {
    return {
      formData: {
        kebun: '',
        afdeling: '',
        namaVendor: '',
        luas: 0,
        tanggalSPPBJ: '',
        pembuatanParit: 0,
        pembuatanJalan: 0,
        pembuatanTeras: 0,
        ripping: 0,
        luku: 0,
        tumbangChipping: 0,
        menanamMucuna: 0,
        lubangTanam: 0,
        mempupukLobang: 0,
        menanamKS: 0,
        progressOverall: 0
      },
      dataList: [],
      loading: false,
      isSubmitting: false,
      successMessage: '',
      errorMessage: '',
      currentPage: 1,
      itemsPerPage: 10,
      showDetailModal: false,
      selectedItem: {}
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.dataList.length / this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return this.startIndex + this.itemsPerPage;
    },
    paginatedData() {
      return this.dataList.slice(this.startIndex, this.endIndex);
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatDate,
    async fetchData() {
      this.loading = true;
      try {
        const data = await getTanamanUlangData();
        this.dataList = data;
      } catch (error) {
        this.errorMessage = 'Gagal memuat data: ' + error.message;
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';
      
      try {
        await addTanamanUlangData(this.formData);
        this.successMessage = 'Data berhasil disimpan!';
        this.resetForm();
        this.fetchData();
      } catch (error) {
        this.errorMessage = 'Gagal menyimpan data: ' + error.message;
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = {
        kebun: '',
        afdeling: '',
        namaVendor: '',
        luas: 0,
        tanggalSPPBJ: '',
        pembuatanParit: 0,
        pembuatanJalan: 0,
        pembuatanTeras: 0,
        ripping: 0,
        luku: 0,
        tumbangChipping: 0,
        menanamMucuna: 0,
        lubangTanam: 0,
        mempupukLobang: 0,
        menanamKS: 0,
        progressOverall: 0
      };
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
    viewDetails(item) {
      this.selectedItem = item;
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedItem = {};
    }
  }
}
</script>

<style scoped>
.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 1rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.detail-item {
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}
</style>