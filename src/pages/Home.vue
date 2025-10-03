<template>
  <!-- Wrapper untuk seluruh halaman dengan background warna -->
  <div class="main-wrapper">
    <!-- Container Utama (Kartu Besar) yang menampung semua konten -->
    <div class="main-container">
      <!-- Header di dalam Container Utama -->
      <header class="main-header">
        <h1>Dashboard Peremajaan PT Perkebunan Nusantara IV Regional 1</h1>
        <p>Sistem Informasi Peremajaan Tanaman</p>
      </header>

      <!-- Konten dalam bentuk kartu-kartu kecil -->
      <main class="main-content">
        <!-- Kartu untuk Carousel -->
        <div class="content-card">
          <CarouselComponent />
        </div>

        <!-- Kartu untuk Pilihan Dashboard -->
        <div class="content-card">
          <div class="section-header">
            <h2>Pilih Dashboard</h2>
          </div>
          
          <div class="cards-grid">
            <!-- Card for Tanaman Ulang -->
            <router-link to="/tanaman-ulang" class="card-link">
              <div class="dashboard-card card-ulang">
                <div class="card-header">
                  <div class="card-shimmer"></div>
                  <div class="card-initials">TU</div>
                </div>
                <div class="card-body">
                  <div class="card-meta">
                    <span class="badge">TU</span>
                    <span class="realtime">Real-time</span>
                  </div>
                  <h3>Monitoring Tanaman Ulang</h3>
                  <p>Dashboard monitoring untuk kegiatan peremajaan tanaman kelapa sawit.</p>
                  <div class="card-footer">
                    <span>Lihat Dashboard</span>
                    <span class="arrow">→</span>
                  </div>
                </div>
              </div>
            </router-link>

            <!-- Card for Tanaman Konversi -->
            <router-link to="/tanaman-konversi" class="card-link">
              <div class="dashboard-card card-konversi">
                <div class="card-header">
                  <div class="card-shimmer"></div>
                  <div class="card-initials">TK</div>
                </div>
                <div class="card-body">
                  <div class="card-meta">
                    <span class="badge">TK</span>
                    <span class="realtime">Real-time</span>
                  </div>
                  <h3>Monitoring Tanaman Konversi</h3>
                  <p>Dashboard monitoring untuk kegiatan konversi tanaman kelapa sawit.</p>
                  <div class="card-footer">
                    <span>Lihat Dashboard</span>
                    <span class="arrow">→</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import CarouselComponent from '../components/CarouselComponent.vue';

export default {
  name: 'Home',
  components: {
    CarouselComponent
  }
}
</script>

<style scoped>
/* --- GLOBAL & BACKGROUND --- */
:global(body) {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f0fdf4; /* Hijau sangat pucat (green-50) */
}

/* --- WRAPPER & CONTAINER UTAMA --- */
.main-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%); /* Gradien hijau segar */
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Konten dimulai dari atas */
}

.main-container {
  width: 100%;
  max-width: 1200px; /* Maksimal lebar agar tidak terlalu lebar di layar besar */
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden; /* Membuat sudut tetap rapi */
  margin-bottom: 40px;
}

/* --- HEADER DI DALAM CONTAINER --- */
.main-header {
  background: linear-gradient(135deg, #15803d, #166534);
  color: white;
  text-align: center;
  padding: 40px 20px;
}

.main-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}
@media (min-width: 768px) {
  .main-header h1 {
    font-size: 36px;
  }
}

.main-header p {
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  opacity: 0.9;
}

/* --- KONTEN UTAMA --- */
.main-content {
  padding: 40px 20px;
}

/* --- KARTU-KARTU KECIL (CONTENT CARD) --- */
.content-card {
  background-color: #f9fafb; /* Abu-abu sangat pucat (gray-50) */
  border: 1px solid #e5e7eb; /* Border abu-abu */
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.content-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.content-card:last-child {
  margin-bottom: 0;
}

/* --- SECTION HEADER --- */
.section-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937; /* Abu-abu gelap (gray-800) */
  text-align: center;
  margin: 0;
}
@media (min-width: 768px) {
  .section-header h2 {
    font-size: 28px;
  }
}

/* --- GRID UNTUK DASHBOARD CARD --- */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

/* --- STYLE UNTUK DASHBOARD CARD (HIJAU) --- */
.card-link {
  text-decoration: none;
  color: inherit;
}

.dashboard-card {
  background: linear-gradient(to bottom right, #16a34a, #166534);
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.dashboard-card.card-konversi {
  background: linear-gradient(to bottom right, #166534, #14532d);
  border-color: rgba(22, 101, 52, 0.3);
}

.card-link:hover .dashboard-card {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-header {
  height: 140px;
  background: linear-gradient(to bottom right, #22c55e, #166534);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
@media (min-width: 768px) {
  .card-header {
    height: 160px;
  }
}

.card-konversi .card-header {
  background: linear-gradient(to bottom right, #16a34a, #14532d);
}

.card-initials {
  font-size: 42px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 2;
}
@media (min-width: 768px) {
  .card-initials {
    font-size: 48px;
  }
}

.card-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.2), transparent);
  transform: skewX(-12deg) translateX(-100%);
  transition: transform 1s ease-out;
}

.card-link:hover .card-shimmer {
  transform: skewX(-12deg) translateX(100%);
}

.card-body {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-meta {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background-color: rgba(250, 204, 21, 0.3);
  color: #fef3c7;
  backdrop-filter: blur(4px);
}

.realtime {
  margin-left: auto;
  font-size: 12px;
  color: rgba(220, 252, 231, 0.8);
}

.card-body h3 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}
@media (min-width: 768px) {
  .card-body h3 {
    font-size: 20px;
  }
}

.card-body p {
  color: rgba(220, 252, 231, 0.9);
  font-size: 14px;
  margin: 0 0 16px 0;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  color: #facc15;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.3s ease;
}

.card-link:hover .card-footer {
  color: #fde047;
}

.arrow {
  margin-left: 8px;
  font-size: 18px;
}
</style>