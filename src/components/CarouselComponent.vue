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
          title: 'Dashboard PT Perkebunan Nusantara IV Regional 1',
          description: 'Sistem informasi peremajaan tanaman untuk monitoring dan pengelolaan perkebunan yang lebih efisien.',
          image: '/3.jpg'
        },
        {
          id: 2,
          title: 'Monitoring Peremajaan Tanaman',
          description: 'Pantau proses peremajaan tanaman secara real-time untuk meningkatkan produktivitas perkebunan.',
          image: '/4.jpg'
        },
        {
          id: 3,
          title: 'Analisis Data Perkebunan',
          description: 'Dapatkan insight mendalam dari data perkebunan untuk pengambilan keputusan yang lebih baik.',
          image: '/5.jpg'
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
}

.carousel__slide {
  padding: 0;
}

.image-container {
  padding: 1rem;
  transition: all 0.3s ease;
}

/* Gaya khusus untuk gambar carousel */
.carousel-image {
  width: 100%;
  height: 16rem; /* h-64 */
  border-radius: 1rem; /* rounded-2xl */
  object-fit: cover;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); /* shadow-2xl */
  transition: transform 0.5s ease, box-shadow 0.3s ease;
}

/* Efek hover pada gambar */
.carousel-image:hover {
  transform: scale(1.05);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

/* Efek hover pada container gambar */
.image-container:hover {
  transform: translateY(-5px);
}

/* Responsive untuk ukuran gambar */
@media (min-width: 768px) {
  .carousel-image {
    height: 24rem; /* h-96 */
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
