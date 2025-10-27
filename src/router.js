// import { createRouter, createWebHistory } from 'vue-router';
// import Home from './pages/Home.vue'; // Buat file Home.vue baru
// import TanamanUlang from './pages/TanamanUlang.vue';
// import TanamanKonversi from './pages/TanamanKonversi.vue';

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/tanaman-ulang',
//     name: 'TanamanUlang',
//     component: TanamanUlang
//   },
//   {
//     path: '/tanaman-konversi',
//     name: 'TanamanKonversi',
//     component: TanamanKonversi
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// });

// export default router;


// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import TanamanUlang from './pages/TanamanUlang.vue';
import TanamanKonversi from './pages/TanamanKonversi.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
// import AdminDashboard from './pages/AdminDashboard.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/tanaman-ulang',
    name: 'TanamanUlang',
    component: TanamanUlang,
    meta: { requiresAuth: true }
  },
  {
    path: '/tanaman-konversi',
    name: 'TanamanKonversi',
    component: TanamanKonversi,
    meta: { requiresAuth: true }
  }
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login
  // },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: Register
  // }
  // {
  //   path: '/admin',
  //   name: 'Admin',
  //   component: AdminDashboard,
  //   meta: { requiresAuth: true, requiresAdmin: true }
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// // Navigation guard untuk autentikasi
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('token');
//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   const isAdmin = user.role === 'admin';
  
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login');
//   } else if (to.meta.requiresAdmin && !isAdmin) {
//     next('/'); // Redirect ke home jika bukan admin
//   } else {
//     next();
//   }
// });

export default router;