<template>
  <div class="carousel-card">
    <carousel :items-to-show="1" :wrap-around="true" :autoplay="4000" :transition="500">
      <slide v-for="slide in slides" :key="slide.id">
        <div class="carousel__item relative">
          <div class="image-container p-4">
            <img 
              :src="slide.image" 
              :alt="slide.title" 
              class="carousel-image"
            >
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end rounded-2xl">
            <div class="p-6 md:p-8">
              <h2 class="text-2xl md:text-3xl font-bold mb-2 text-white drop-shadow-lg">{{ slide.title }}</h2>
              <p class="text-sm md:text-base max-w-2xl text-white drop-shadow-md">{{ slide.description }}</p>
            </div>
          </div>
        </div>
      </slide>

      <template #addons>
        <navigation />
        <pagination />
      </template>
    </carousel>
  </div>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

export default {
  name: 'CarouselComponent',
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  data() {
    return {
      slides: [
        {
          id: 1,
          title: 'Pembuatan Parit di Kebun Aek Nabara Utara',
          description: 'Proses pembuatan parit yang optimal di Kebun Aek Nabara Utara (1KAN) untuk sistem drainase yang baik dan mendukung pertumbuhan tanaman kelapa sawit yang sehat.',
          image: '/1KAN-PARIT.png'
        },
        {
          id: 2,
          title: 'Merumpuk Tunggul di Kebun Bandar Betsy',
          description: 'Kegiatan merumpuk tunggul di Kebun Bandar Betsy (1KBB) sebagai bagian dari proses peremajaan tanaman untuk memastikan area siap untuk tanam baru.',
          image: '/1KBB-MERUMPUK.png'
        },
        {
          id: 3,
          title: 'Pembuatan Parit di Kebun Gunung Pamela',
          description: 'Pembangunan infrastruktur parit di Kebun Gunung Pamela (1KGP) untuk meningkatkan sistem pengairan dan drainase di area perkebunan.',
          image: '/1KGP-PARIT.png'
        },
        {
          id: 4,
          title: 'Proses Luku di Kebun Membang Muda',
          description: 'Pelaksanaan pengolahan tanah dengan metode luku di Kebun Membang Muda (1KMM) untuk mempersiapkan lahan yang optimal bagi pertumbuhan tanaman.',
          image: '/1KMM-LUKU.png'
        },
        {
          id: 5,
          title: 'Proses Ripping di Kebun Sei Kebara',
          description: 'Teknik ripping tanah yang dilakukan di Kebun Sei Kebara (1KSK) untuk memperbaiki struktur tanah dan meningkatkan aerasi akar tanaman kelapa sawit.',
          image: '/1KSK-RIPPING.png'
        }
      ]
    }
  }
}
</script>

<style scoped>
.carousel-card {
  background: linear-gradient(to bottom right, #16a34a, #166534);
  border-radius: 16px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.carousel__item {
  position: relative;
  min-height: 400px; /* Minimum height for the carousel item */
}

.carousel__slide {
  padding: 0;
}

.image-container {
  padding: 1rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 350px; /* Minimum height for image container */
}

/* Gaya khusus untuk gambar carousel */
.carousel-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: 500px; /* Maximum height to prevent images from being too large */
  border-radius: 1rem; /* rounded-2xl */
  object-fit: contain; /* Changed from cover to contain to show full image */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); /* shadow-2xl */
  transition: transform 0.5s ease, box-shadow 0.3s ease;
}

/* Efek hover pada gambar */
.carousel-image:hover {
  transform: scale(1.02); /* Reduced scale to prevent overflow */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

/* Efek hover pada container gambar */
.image-container:hover {
  transform: translateY(-2px); /* Reduced transform to prevent layout issues */
}

/* Responsive untuk ukuran gambar */
@media (min-width: 768px) {
  .carousel__item {
    min-height: 500px;
  }
  
  .image-container {
    min-height: 450px;
  }
  
  .carousel-image {
    max-height: 600px;
  }
}

@media (max-width: 640px) {
  .carousel__item {
    min-height: 300px;
  }
  
  .image-container {
    min-height: 250px;
  }
  
  .carousel-image {
    max-height: 350px;
  }
}

/* Style untuk navigasi dan pagination */
:deep(.carousel__pagination-button::after) {
  @apply bg-white rounded-full opacity-70;
}

:deep(.carousel__pagination-button--active::after) {
  @apply bg-green-500 opacity-100;
}

:deep(.carousel__prev),
:deep(.carousel__next) {
  @apply bg-white/20 text-white rounded-full w-10 h-10 md:w-12 md:h-12 backdrop-blur-sm;
}

:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  @apply bg-white/30;
}

/* Style untuk title dan description */
.carousel__item h2 {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.carousel__item p {
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
}
</style>