import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Importa el enrutador


import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)

app.use(router) // Asegura que Vue use el enrutador
app.mount('#app')
