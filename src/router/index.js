import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('../views/HomeView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const LoginView = () => import('../views/LoginView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        protected: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') // Check if token exists (user is logged in)

  // If the route requires authentication and the user is not logged in, redirect to login page
  if (to.matched.some((record) => record.meta.protected) && !token) {
    next({ path: '/login' })
  } else {
    next() // Proceed as normal if authenticated or route doesn't require authentication
  }
})

export default router
