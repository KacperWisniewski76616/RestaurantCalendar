import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from "@/layouts/MainLayout.vue"
import ReservationView from "@/views/ReservationView.vue"
import AdminPanelView from "@/views/AdminPanelView.vue"
import LoginPanelView from "@/views/LoginPanelView.vue"
import {useAuthStore} from "@/stores";

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPanelView
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/reservations' },
      { path: 'reservations', name: 'reservations', component: ReservationView },
      { path: 'admin-panel', name: 'admin-panel', component: AdminPanelView }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()


  if (to.meta.requiresAuth && !authStore.isLogged) {
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isLogged) {
    next({ name: 'reservations' })
  } else {
    next()
  }
})

export default router
