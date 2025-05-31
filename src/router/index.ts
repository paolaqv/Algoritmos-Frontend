import { createRouter, createWebHistory } from 'vue-router'
import GraphsPage from '../views/GraphsPage.vue'
import LandingPage from '../views/LandingPage.vue'
import SortPage from '../views/SortPage.vue'
import MatrizAdyacenteInfo from '../views/MatrizAdyacenteInfo.vue' 
import NorthWest from '../views/NorthWest.vue'
import JohnsonInfo from '../views/JohnsonInfo.vue'

import MuseumPage from "../views/MuseumPage.vue";
import MuseMap from "../views/MuseMap.vue";
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
    },
    {
      path: '/matriz-adyacente-info', 
      name: 'MatrizAdyacenteInfo',
      component: MatrizAdyacenteInfo,
    },
    {
      path: '/northwest-info', 
      name: 'NorthWest',
      component: NorthWest,
    },
     {
      path: '/johnson-info', 
      name: 'JohnsonInfo',
      component: JohnsonInfo,
     },
    {
      path: '/noche',
      name: 'MuseumPage',
      component: MuseumPage,
    },
    {
      path: '/map',
      name: 'MuseMap',
      component: MuseMap,
    },

  ],
})

export default router
