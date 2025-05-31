import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // Importa el enrutador
import VNetworkGraph from 'v-network-graph'
import 'v-network-graph/lib/style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/assets/css/MuseumRoute.css'


const app = createApp(App)
    .use(VNetworkGraph)

const pinia = createPinia()


app.use(pinia)
app.use(router) // Asegura que Vue use el enrutador
app.mount('#app')
