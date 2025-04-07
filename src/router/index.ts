import { createRouter, createWebHistory } from 'vue-router'
import GraphsPage from '../views/GraphsPage.vue'
import LandingPage from '../views/LandingPage.vue'
import SortPage from '../views/SortPage.vue'

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
    },
    {
      path: '/sort',
      name: 'SortPage',
      component: SortPage,
    }
  ],
})

export default router
