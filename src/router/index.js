import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const RegisterView = () => import('../views/RegisterView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RegisterView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    }
  ]
})

export default router
