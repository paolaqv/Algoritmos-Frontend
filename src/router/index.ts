import { createRouter, createWebHistory } from 'vue-router'
import GraphsPage from '@/views/GraphsPage.vue' // Asegúrate de que la ruta sea correcta

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/graphs',
      name: 'GraphsPage',
      component: GraphsPage,
    }
  ],
})

export default router
