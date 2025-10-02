import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue'; // Buat file Home.vue baru
import TanamanUlang from './pages/TanamanUlang.vue';
import TanamanKonversi from './pages/TanamanKonversi.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tanaman-ulang',
    name: 'TanamanUlang',
    component: TanamanUlang
  },
  {
    path: '/tanaman-konversi',
    name: 'TanamanKonversi',
    component: TanamanKonversi
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;