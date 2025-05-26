<template>
  <nav class="navbar">
    <img src="@/assets/logo.svg" alt="Logo" class="logo" />
    <ul class="nav-links">
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/graphs">Grafos</router-link></li>
      <li><router-link to="/sort">Ordenamiento</router-link></li>
      <button class="matlab-btn" @click="openMatlab">
        <i class="fas fa-calculator"></i> MATLAB Tools
      </button>
      <li><router-link to="#">Contacto</router-link></li>
    </ul>
  </nav>
  <section class="landing">
    <div class="hero">
      <!-- Caja de contenido con Grafo Interactivo y Ordenamiento -->
      <div class="hero-content">
        <!-- Grafo Interactivo -->
        <div class="hero-half">
          <!-- Imagen pequeña centrada encima del Grafo Interactivo -->
          <div class="image-container">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyeqmUU6i2pH8mpCl5q_FhzMqsGXtEfBzMGA&s"
              alt="Imagen de grafo interactivo"
              class="hero-image"
            />
          </div>
          <h1 class="fade-in">Grafo Interactivo</h1>
          <p class="slide-up">Crea y personaliza grafos de forma intuitiva e interactiva.</p>
          <router-link to="/graphs" class="cta-button scale-up">Empezar</router-link>
        </div>

        <!-- Algoritmos de Ordenamiento -->
        <div class="hero-half">
          <img
            src="https://miro.medium.com/v2/resize:fit:1029/1*_qUuB7vQ716KuLp6bx3-oQ.png"
            alt="Algoritmos de Ordenamiento"
            class="hero-image"
          />
          <h1 class="fade-in">Algoritmos de Ordenamiento</h1>
          <p class="slide-up">
            Visualiza paso a paso algoritmos como Selection Sort e Insertion Sort.
          </p>
          <router-link to="/sort" class="cta-button scale-up">Ver Ordenamiento</router-link>
        </div>
      </div>
    </div>

    <!-- CARACTERÍSTICAS -->
    <div class="features">
      <div class="feature zoom-in">
        <h2>Interactividad</h2>
        <p>Añade nodos y aristas con un solo clic.</p>
      </div>
      <div class="feature zoom-in">
        <h2>Personalización</h2>
        <p>Nombrado y color personalizado para cada nodo.</p>
      </div>
      <div class="feature zoom-in">
        <h2>Exportación</h2>
        <p>Exporta tus grafos en formato CSV fácilmente.</p>
      </div>
    </div>

    <!-- SECCIÓN ALGORITMOS GENERALES -->
    <div class="algorithms-section">
      <h1 class="hero h1">Explora los Algoritmos</h1>
      <div class="algorithm-cards">
        <div class="algorithm-card">
          <h3>Matriz de Adyacencia</h3>
          <img
            src="https://matematicasies.com/local/cache-vignettes/L550xH234/maties_3461_b-0cdd9.png?1688043774"
            alt="Matriz de Adyacencia"
            class="hero-image"
          />
          <p>Representación compacta de grafos mediante matrices.</p>
          <div class="card-buttons">
            <router-link to="/matriz-adyacente-info" class="cta-button scale-up"
              >Conocer más</router-link
            >
            <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
          </div>
        </div>
        <div class="algorithm-card">
          <h3>North West</h3>
          <img
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgc88YRZXiMPug0I0REt9BBaWUZfnsg1mKj3XP74rIsy_a7a2yZdpBMsDwPpa7Pk-Fi1tua9T28SpdSCkuM4LbeHrTUK3pxvj7z3YoGi4U8Ok-nsJfqfR2JifKtRgfIcqJw-6tMnVWF_BSe/s1600/nwcmsolve.jpg"
            alt="North West"
            class="hero-image"
          />
          <p>Método inicial para problemas de transporte.</p>
          <div class="card-buttons">
            <router-link to="/northwest-info" class="cta-button scale-up">Conocer más</router-link>
            <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
          </div>
        </div>
        <div class="algorithm-card">
          <h3>Johnson</h3>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Johnson%27s_algorithm.svg/540px-Johnson%27s_algorithm.svg.png"
            alt="Johnson"
            class="hero-image"
          />
          <p>Encuentra caminos más cortos entre todos los pares de nodos.</p>
          <div class="card-buttons">
            <router-link to="/johnson-info" class="cta-button scale-up">Conocer más</router-link>
            <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
          </div>
        </div>
        <div class="algorithm-card">
          <h3>Asignación</h3>
          <img
            src="https://proyectoinvestigacionoperaciones.wordpress.com/wp-content/uploads/2016/11/modelo.png?w=736"
            alt="Asignación"
            class="hero-image"
          />
          <p>Algoritmo para asignar tareas u optimizar recursos.</p>
          <div class="card-buttons">
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
            <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIÓN ALGORITMOS DE ORDENAMIENTO -->
    <div class="algorithms-section">
      <h2 class="hero h1">Algoritmos de Ordenamiento</h2>
      <div class="algorithm-cards">
        <div class="algorithm-card">
          <h3>Selection Sort</h3>
          <img
            src="https://www.programiz.com/sites/tutorial2program/files/Selection-sort-0.png"
            alt="Selection Sort"
            class="hero-image"
          />
          <p>Ordenamiento simple basado en selecciones sucesivas.</p>
          <div class="card-buttons">
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
            <router-link to="/sort" class="cta-button scale-up">Ir al algoritmo</router-link>
          </div>
        </div>
        <div class="algorithm-card">
          <h3>Insertion Sort</h3>
          <img
            src="https://www.w3resource.com/w3r_images/insertion-sort.png"
            alt="Insertion Sort"
            class="hero-image"
          />
          <p>Construye la lista ordenada uno por uno.</p>
          <div class="card-buttons">
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
            <router-link to="/sort" class="cta-button scale-up">Ir al algoritmo</router-link>
          </div>
        </div>
        <div class="algorithm-card">
          <h3>Merge Sort</h3>
          <img
            src="https://www.programiz.com/sites/tutorial2program/files/merge-sort-example_0.png"
            alt="Merge Sort"
            class="hero-image"
          />
          <p>Divide y conquista para ordenar eficientemente.</p>
          <div class="card-buttons">
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
            <router-link to="/sort" class="cta-button scale-up">Ir al algoritmo</router-link>
          </div>
        </div>
        <div class="algorithm-card">
          <h3>Shell Sort</h3>
          <img
            src="https://images.tpointtech.com/ds/images/shell-sort-algorithm4.png"
            alt="Shell Sort"
            class="hero-image"
          />
          <p>Versión mejorada del insertion sort con saltos.</p>
          <div class="card-buttons">
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
            <router-link to="/sort" class="cta-button scale-up">Ir al algoritmo</router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
  <footer class="footer">
    <p>
      Proyecto Open Source en
      <b><a href="https://github.com/paolaqv/Algoritmos-Frontend" target="_blank">GitHub</a></b>
    </p>
  </footer>
</template>

<script setup>
const openMatlab = () => {
  window.open('http://localhost:5000/matlab', '_blank') // URL directa del backend
}
</script>

<style>
/* COLORES */
:root {
  --primary-color: #555b6e; /* para navbar, texto fuerte */
  --secondary-color: #89b0ae; /* botones y detalles suaves */
  --background-color: rgb(255, 255, 255); /* fondo general */
  --accent-color: #ffd6ba; /* fondo de cajas destacadas */
  --text-color: #333333; /* texto en general */
  --card-color: #bee3db; /* tarjetas y fondos suaves */
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--primary-color);
}

.landing {
  padding-left: 8rem;
  padding-right: 8rem;
}

/* NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary-color);
}

.navbar .logo {
  height: 40px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: bold;
}
/* Caja de la imagen */
.image-container {
  text-align: center;
  margin-bottom: 1rem;
  width: 100%; /* Para que ocupe todo el ancho disponible */
}

.hero-image {
  width: 100%; /* Se adapta al tamaño del contenedor */
  height: auto; /* Mantiene la proporción de la imagen */
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* HERO */
.hero {
  text-align: center;
  padding: 2rem;
  background-color: var(--accent-color);
  margin: 1rem;
  border-radius: 10px;
  color: var(--primary-color);
}

.hero-content {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.hero-half {
  flex: 1;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
}

.hero p {
  font-size: 1.2rem;
  color: var(--primary-color);
}

.cta-button {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: var(--secondary-color);
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: var(--primary-color);
}

.hero-image {
  height: auto;
  max-width: 100%;
  margin: 0 auto;
}

.hero-half {
  flex: 1;
  margin: 1rem;
}

.features {
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;
}

.feature {
  background-color: var(--card-color);
  padding: 1.5rem;
  border-radius: 10px;
  width: 30%;
  text-align: center;
}

.feature:hover {
  background-color: var(--secondary-color);
}

.feature h2 {
  font-size: 1.8rem;
  color: var(--primary-color);
}

.feature p {
  font-size: 1rem;
  color: var(--primary-color);
}

/* SECCIÓN DE ALGORITMOS */
.algorithms-section {
  margin-top: 3rem;
}

.algorithm-cards {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.algorithm-card {
  background-color: var(--card-color);
  padding: 2rem;
  border-radius: 10px;
  width: 22%;
  text-align: center;
}

.algorithm-card h3 {
  font-size: 1.5rem;
}

.algorithm-card p {
  font-size: 1.1rem;
}

.card-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.footer {
  background-color: var(--primary-color);
  color: #fff;
  padding: 1rem;
  text-align: center;
  margin-top: 3rem;
}

.footer a {
  color: #fff;
  text-decoration: none;
}
</style>
