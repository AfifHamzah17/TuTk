<template>
  <div class="relative overflow-hidden rounded-2xl shadow-xl">
    <carousel :items-to-show="1" :wrap-around="true" :autoplay="4000" :transition="500">
      <slide v-for="slide in slides" :key="slide.id">
        <div class="carousel__item relative">
          <img :src="slide.image" :alt="slide.title" class="w-full h-64 md:h-96 object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div class="p-6 md:p-8 text-white">
              <h2 class="text-2xl md:text-3xl font-bold mb-2">{{ slide.title }}</h2>
              <p class="text-sm md:text-base max-w-2xl">{{ slide.description }}</p>
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
.carousel__item {
  position: relative;
}

.carousel__slide {
  padding: 0;
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
</style>