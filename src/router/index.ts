import { createRouter, createWebHistory } from 'vue-router'
import GraphsPage from '@/views/GraphsPage.vue'
import LandingPage from '@/views/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage,
    },
    {
      path: '/graphs',
      name: 'GraphsPage',
      component: GraphsPage,
    }
  ],
})

export default router
