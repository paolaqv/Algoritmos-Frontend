<template>
  <section class="landing">
    <!-- NAVBAR -->
    <nav class="navbar">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
      <ul class="nav-links">
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/graphs">Grafos</router-link></li>
        <li><router-link to="/sort">Sorting</router-link></li>
        <li><router-link to="#">Contacto</router-link></li>
      </ul>
    </nav>

  <div class="hero split-hero">
  <!-- Caja de Grafos -->
  <div class="hero-half">
    <h1 class="fade-in">Grafo Interactivo</h1>
    <p class="slide-up">Crea y personaliza grafos de forma intuitiva e interactiva.</p>
    <router-link to="/graphs" class="cta-button scale-up">Empezar</router-link>
  </div>

  <!-- Caja de Sorting -->
  <div class="hero-half">
    <h1 class="fade-in">Algoritmos de Ordenamiento</h1>
    <p class="slide-up">Visualiza paso a paso algoritmos como Selection Sort e Insertion Sort.</p>
    <router-link to="/sort" class="cta-button scale-up">Ver Sorting</router-link>
  </div>
</div>


    <!-- FEATURES -->
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
  <h2>Explora los Algoritmos</h2>
  <div class="algorithm-cards">
    <div class="algorithm-card">
      <h3>Matriz de Adyacencia</h3>
      <p>Representación compacta de grafos mediante matrices.</p>
      <div class="card-buttons">
<<<<<<< HEAD
        <button class="btn">Conocer más</button>
        <button class="btn btn-outline">Ir al algoritmo</button>
=======
        <router-link to="/graphs" class="cta-button scale-up">Conocer mas</router-link>
        <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
>>>>>>> 149a2a4 (Actualización de LandingPage)
      </div>
    </div>
    <div class="algorithm-card">
      <h3>North West</h3>
      <p>Método inicial para problemas de transporte.</p>
      <div class="card-buttons">
<<<<<<< HEAD
        <button class="btn">Conocer más</button>
        <button class="btn btn-outline">Ir al algoritmo</button>
=======
        <router-link to="/graphs" class="cta-button scale-up">Conocer mas</router-link>
        <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
>>>>>>> 149a2a4 (Actualización de LandingPage)
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Johnson</h3>
      <p>Encuentra caminos más cortos entre todos los pares de nodos.</p>
      <div class="card-buttons">
<<<<<<< HEAD
        <button class="btn">Conocer más</button>
        <button class="btn btn-outline">Ir al algoritmo</button>
=======
        <router-link to="/graphs" class="cta-button scale-up">Conocer mas</router-link>
        <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
>>>>>>> 149a2a4 (Actualización de LandingPage)
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Asignación</h3>
      <p>Algoritmo para asignar tareas u optimizar recursos.</p>
      <div class="card-buttons">
<<<<<<< HEAD
        <button class="btn">Conocer más</button>
        <button class="btn btn-outline">Ir al algoritmo</button>
=======
        <router-link to="/graphs" class="cta-button scale-up">Conocer mas</router-link>
        <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
>>>>>>> 149a2a4 (Actualización de LandingPage)
      </div>
    </div>
  </div>
</div>

<!-- SECCIÓN ALGORITMOS DE ORDENAMIENTO -->
<div class="algorithms-section">
  <h2>Algoritmos de Ordenamiento</h2>
  <div class="algorithm-cards">
    <div class="algorithm-card">
      <h3>Selection Sort</h3>
      <p>Ordenamiento simple basado en selecciones sucesivas.</p>
      <div class="card-buttons">
<<<<<<< HEAD
        <button class="btn">Conocer más</button>
        <button class="btn btn-outline">Ir al algoritmo</button>
=======
        <router-link to="/graphs" class="cta-button scale-up">Conocer mas</router-link>
        <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
>>>>>>> 149a2a4 (Actualización de LandingPage)
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Insertion Sort</h3>
      <p>Construye la lista ordenada uno por uno.</p>
      <div class="card-buttons">
<<<<<<< HEAD
        <button class="btn">Conocer más</button>
        <button class="btn btn-outline">Ir al algoritmo</button>
=======
        <router-link to="/graphs" class="cta-button scale-up">Conocer mas</router-link>
        <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
>>>>>>> 149a2a4 (Actualización de LandingPage)
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Merge Sort</h3>
      <p>Divide y conquista para ordenar eficientemente.</p>
      <div class="card-buttons">
<<<<<<< HEAD
        <button class="btn">Conocer más</button>
        <button class="btn btn-outline">Ir al algoritmo</button>
=======
      <router-link to="/graphs" class="cta-button scale-up">Conocer mas</router-link>
        <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
>>>>>>> 149a2a4 (Actualización de LandingPage)
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Shell Sort</h3>
      <p>Versión mejorada del insertion sort con saltos.</p>
      <div class="card-buttons">
<<<<<<< HEAD
        <button class="btn">Conocer más</button>
        <button class="btn btn-outline">Ir al algoritmo</button>
=======
      <router-link to="/graphs" class="cta-button scale-up">Conocer mas</router-link>
        <router-link to="/graphs" class="cta-button scale-up">Ir al algoritmo</router-link>
>>>>>>> 149a2a4 (Actualización de LandingPage)
      </div>
    </div>
  </div>
</div>


    <!-- FOOTER -->
    <footer class="footer">
      <p>
        Proyecto Open Source en
        <b><a href="https://github.com/paolaqv/Algoritmos-Frontend" target="_blank">GitHub</a></b>
      </p>
    </footer>
  </section>
</template>

<script setup lang="ts">
</script>

<style>
/* COLORES */
:root {
  --primary-color: #555B6E;     /* para navbar, texto fuerte */
  --secondary-color: #89B0AE;   /* botones y detalles suaves */
  --background-color:rgb(255, 255, 255);  /* fondo general */
  --accent-color: #FFD6BA;      /* fondo de cajas destacadas */
  --text-color: #333333;        /* texto en general */
  --card-color: #BEE3DB;        /* tarjetas y fondos suaves */
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--primary-color);
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

/* HERO */
.hero {
  text-align: center;
  padding: 2rem;
  background-color: var(--accent-color);
  margin: 1rem;
  border-radius: 10px;
  color: var(--primary-color);
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
  padding: 0.5rem 1rem;
  background-color: var(--secondary-color);
  color: var(--background-color);
  text-decoration: none;
  border-radius: 5px;
  margin-top: 1rem;
  font-weight: bold;
}

/* FEATURES */
.features {
  display: flex;
  justify-content: space-around;
  padding: 2rem;
  flex-wrap: wrap;
  background-color: var(--background-color);
}

.feature {
  text-align: center;
  background-color: var(--accent-color);
  padding: 1rem;
  border-radius: 10px;
  width: 30%;
  margin-bottom: 1rem;
}

.feature h2, .feature p {
  color: var(--primary-color);
}

/* NUEVA SECCIÓN */
.algorithms-section {
  padding: 2rem;
  background-color: var(--accent-color);
  text-align: center;
}

.algorithms-section h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.algorithm-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.algorithm-card {
  background-color: var(--background-color);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(85, 91, 110, 0.1); /* primary-color con opacidad */
  transition: transform 0.3s ease;
  color: var(--primary-color);
}

.algorithm-card:hover {
  transform: translateY(-5px);
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 1rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  margin-top: 2rem;
}

.footer a {
  color: var(--text-color);
  text-decoration: none;
}

/* ANIMACIONES */
.fade-in {
  animation: fadeIn 2s;
}

.slide-up {
  animation: slideUp 1.5s;
}

.scale-up {
  animation: scaleUp 1s;
}

.zoom-in {
  animation: zoomIn 1s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleUp {
  from { transform: scale(0.9); }
  to { transform: scale(1); }
}

@keyframes zoomIn {
  from { transform: scale(0.9); }
  to { transform: scale(1); }
}

.split-hero {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 2rem;
  margin: 2rem;
  flex-wrap: nowrap;
}

.hero-half {
  background-color: var(--accent-color);
  border-radius: 10px;
  padding: 2rem;
  flex: 1;
  text-align: center;
  min-width: 0;
  box-shadow: 0 4px 10px rgba(85, 91, 110, 0.15); /* primary-color */
  transition: transform 0.3s ease;
  color: var(--primary-color);
}

.hero-half:hover {
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .split-hero {
    flex-direction: column;
  }
}
.card-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

</style>
