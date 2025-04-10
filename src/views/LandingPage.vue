<template>
  <section class="landing">
    <!-- NAVBAR -->
    <nav class="navbar">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
      <ul class="nav-links">
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/graphs">Grafos</router-link></li>
        <li><router-link to="/sort">Ordenamiento</router-link></li>
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
    <router-link to="/sort" class="cta-button scale-up">Ver Ordenamiento</router-link>
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
  <h2>Explora los Algoritmos</h2>
  <div class="algorithm-cards">
    <div class="algorithm-card">
      <h3>Matriz de Adyacencia</h3>
      <p>Representación compacta de grafos mediante matrices.</p>
      <div class="card-buttons">
        <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
        <router-link to="#" class="cta-button scale-up">Ir al algoritmo</router-link>
      </div>
    </div>
    <div class="algorithm-card">
      <h3>North West</h3>
      <p>Método inicial para problemas de transporte.</p>
      <div class="card-buttons">
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
        <router-link to="#" class="cta-button scale-up">Ir al algoritmo</router-link>
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Johnson</h3>
      <p>Encuentra caminos más cortos entre todos los pares de nodos.</p>
      <div class="card-buttons">
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
        <router-link to="#" class="cta-button scale-up">Ir al algoritmo</router-link>
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Asignación</h3>
      <p>Algoritmo para asignar tareas u optimizar recursos.</p>
      <div class="card-buttons">
           <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
        <router-link to="#" class="cta-button scale-up">Ir al algoritmo</router-link>
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
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
        <router-link to="#" class="cta-button scale-up">Ir al algoritmo</router-link>
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Insertion Sort</h3>
      <p>Construye la lista ordenada uno por uno.</p>
      <div class="card-buttons">
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
        <router-link to="#" class="cta-button scale-up">Ir al algoritmo</router-link>
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Merge Sort</h3>
      <p>Divide y conquista para ordenar eficientemente.</p>
      <div class="card-buttons">
    <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
        <router-link to="#" class="cta-button scale-up">Ir al algoritmo</router-link>
      </div>
    </div>
    <div class="algorithm-card">
      <h3>Shell Sort</h3>
      <p>Versión mejorada del insertion sort con saltos.</p>
      <div class="card-buttons">
            <router-link to="#" class="cta-button scale-up">Conocer más</router-link>
        <router-link to="#" class="cta-button scale-up">Ir al algoritmo</router-link>
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

/* CARACTERÍSTICAS */
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.algorithm-card h3 {
  color: var(--primary-color);
}

.card-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.card-buttons .cta-button {
  background-color: var(--secondary-color);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 5px;
}

/* FOOTER */
.footer {
  text-align: center;
  padding: 1rem;
  background-color: var(--primary-color);
  color: var(--background-color);
}
</style>
