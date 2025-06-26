import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from "@/layouts/MainLayout.vue";
import ReservationView from "@/views/ReservationView.vue";
import AdminPanelView from "@/views/AdminPanelView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainLayout,
      children: [
        {path: '/', redirect:'/reservations'},
        {path: '/reservations', name: 'reservations', component: ReservationView},
        {path: '/admin-panel', name: 'admin-panel', component: AdminPanelView}
      ]
    },
  ],
})

export default router
