<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header dengan animasi dan efek glassmorphism -->
    <header class="bg-green-700/90 backdrop-blur-sm text-white shadow-xl sticky top-0 z-20 border-b border-green-600/30">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0 flex items-center space-x-3">
            <div class="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Monitoring Perkebunan</h1>
              <p class="text-green-100 text-sm">Sistem Informasi Perkebunan Kelapa Sawit</p>
            </div>
          </div>
          <div class="text-center md:text-right bg-black/20 px-4 py-2 rounded-lg">
            <p class="text-lg font-medium">{{ currentDate }}</p>
            <p class="text-green-100 flex items-center justify-center">
              {{ currentTime }} WIB
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation dengan efek underline animasi -->
    <nav class="bg-green-600/90 backdrop-blur-sm text-white sticky top-16 z-10 shadow-lg border-b border-green-500/30">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center py-3">
          <div class="flex space-x-1 md:space-x-4">
            <router-link 
              to="/" 
              class="px-3 py-2 rounded-md text-sm md:text-base font-medium transition-all duration-300 hover:bg-green-500/50 relative group"
              active-class="bg-green-800/70"
            >
              Beranda
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </router-link>
            <router-link 
              to="/tanaman-ulang" 
              class="px-3 py-2 rounded-md text-sm md:text-base font-medium transition-all duration-300 hover:bg-green-500/50 relative group"
              active-class="bg-green-800/70"
            >
              Tanaman Ulang
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </router-link>
            <router-link 
              to="/tanaman-konversi" 
              class="px-3 py-2 rounded-md text-sm md:text-base font-medium transition-all duration-300 hover:bg-green-500/50 relative group"
              active-class="bg-green-800/70"
            >
              Tanaman Konversi
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </router-link>
          </div>
          
          <!-- Mobile menu button dengan animasi -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 rounded-md hover:bg-green-500/50 focus:outline-none transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform duration-300" :class="{'rotate-90': mobileMenuOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Mobile menu dengan animasi slide down -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div v-if="mobileMenuOpen" class="md:hidden pb-3">
            <router-link 
              to="/" 
              class="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-500/50 transition-colors duration-200"
              active-class="bg-green-800/70"
              @click="mobileMenuOpen = false"
            >
              Beranda
            </router-link>
            <router-link 
              to="/tanaman-ulang" 
              class="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-500/50 transition-colors duration-200"
              active-class="bg-green-800/70"
              @click="mobileMenuOpen = false"
            >
              Tanaman Ulang
            </router-link>
            <router-link 
              to="/tanaman-konversi" 
              class="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-500/50 transition-colors duration-200"
              active-class="bg-green-800/70"
              @click="mobileMenuOpen = false"
            >
              Tanaman Konversi
            </router-link>
          </div>
        </transition>
      </div>
    </nav>

    <main class="container mx-auto px-4 py-6 md:py-8">
      <!-- Hero Section dengan efek parallax dan animasi -->
      <section class="mb-8 md:mb-12">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div class="md:flex relative">
            <div class="md:flex-shrink-0 md:w-1/3">
              <div class="relative h-48 md:h-full overflow-hidden">
                <img 
                  class="h-full w-full object-cover transform transition-transform duration-700 hover:scale-110" 
                  src="https://picsum.photos/seed/plantation/800/600.jpg" 
                  alt="Perkebunan Kelapa Sawit"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
            </div>
            <div class="p-6 md:p-8 md:w-2/3 relative">
              <div class="absolute top-4 right-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Monitoring Perkebunan
                </span>
              </div>
              <h2 class="mt-1 text-xl md:text-2xl font-bold text-gray-900 mb-3">Sistem Informasi Perkebunan Kelapa Sawit</h2>
              <p class="text-gray-600 mb-4">Dashboard monitoring untuk peremajaan dan konversi tanaman kelapa sawit. Pilih jenis monitoring yang ingin Anda lihat.</p>
              <div class="flex items-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm">Real-time data monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dashboard Cards dengan animasi dan efek hover -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-gray-800">Pilih Dashboard</h2>
          <div class="flex space-x-2">
            <button class="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button class="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <!-- Card for Tanaman Ulang dengan animasi hover -->
          <router-link to="/tanaman-ulang" class="group">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-2xl h-full flex flex-col border border-gray-100">
              <div class="h-40 md:h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 md:h-24 md:w-24 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div class="p-5 md:p-6 flex-grow flex flex-col">
                <div class="flex items-center mb-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Peremajaan
                  </span>
                  <span class="ml-auto inline-flex items-center text-sm text-gray-500">
                    Real-time
                  </span>
                </div>
                <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-2">Monitoring Tanaman Ulang</h3>
                <p class="text-gray-600 text-sm md:text-base mb-4 flex-grow">Dashboard monitoring untuk kegiatan peremajaan tanaman kelapa sawit.</p>
                <div class="flex items-center text-green-600 font-medium group-hover:text-green-700">
                  <span>Lihat Dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </router-link>

          <!-- Card for Tanaman Konversi dengan animasi hover -->
          <router-link to="/tanaman-konversi" class="group">
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-2xl h-full flex flex-col border border-gray-100">
              <div class="h-40 md:h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 md:h-24 md:w-24 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div class="p-5 md:p-6 flex-grow flex flex-col">
                <div class="flex items-center mb-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Konversi
                  </span>
                  <span class="ml-auto inline-flex items-center text-sm text-gray-500">
                    Real-time
                  </span>
                </div>
                <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-2">Monitoring Tanaman Konversi</h3>
                <p class="text-gray-600 text-sm md:text-base mb-4 flex-grow">Dashboard monitoring untuk kegiatan konversi tanaman kelapa sawit.</p>
                <div class="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                  <span>Lihat Dashboard</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </section>
    </main>

    <!-- Footer dengan efek glassmorphism dan animasi -->
    <footer class="bg-gray-800/90 backdrop-blur-sm text-white py-6 md:py-8 mt-8 md:mt-12 border-t border-gray-700/30">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0 text-center md:text-left">
            <div class="flex items-center justify-center md:justify-start mb-2">
              <div class="bg-green-600 p-1.5 rounded-lg mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 class="text-lg md:text-xl font-bold">Sistem Informasi Perkebunan</h3>
            </div>
            <p class="text-gray-400 text-sm md:text-base">© 2025 PT. Perkebunan Kelapa Sawit</p>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="bg-gray-700/50 hover:bg-gray-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110">
              <svg class="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/>
              </svg>
            </a>
            <a href="#" class="bg-gray-700/50 hover:bg-gray-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110">
              <svg class="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
            <a href="#" class="bg-gray-700/50 hover:bg-gray-600 p-2 rounded-full transition-all duration-300 transform hover:scale-110">
              <svg class="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.218.682-.485 0-.236-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'Home',
  setup() {
    const currentTime = ref('');
    const currentDate = ref('');
    const mobileMenuOpen = ref(false);
    
    const updateDateTime = () => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      currentDate.value = now.toLocaleDateString('id-ID', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    };
    
    onMounted(() => {
      updateDateTime();
      const timeInterval = setInterval(updateDateTime, 1000);
      
      onBeforeUnmount(() => {
        clearInterval(timeInterval);
      });
    });
    
    return {
      currentTime,
      currentDate,
      mobileMenuOpen
    };
  }
}
</script>

<style>
/* Animasi kustom untuk efek hover */
.router-link-active {
  position: relative;
}

.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Efek parallax untuk gambar hero */
.parallax-bg {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>