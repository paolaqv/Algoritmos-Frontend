Aquí tienes una versión mejor organizada y estilizada de tu template utilizando la paleta de colores proporcionada:

```html
<template>
  <nav class="navbar">
    <img src="@/assets/logo.svg" alt="Logo" class="logo">
    <ul class="nav-links">
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/graphs">Grafos</router-link></li>
      <li><router-link to="#">Contacto</router-link></li>
    </ul>
  </nav>
  <section class="landing">
    <div class="hero">
      <h1 class="fade-in">Grafo Interactivo</h1>
      <p class="slide-up">Crea y personaliza grafos de forma intuitiva e interactiva.</p>
      <router-link to="/graphs" class="cta-button scale-up">Empezar</router-link>
    </div>
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
    <footer class="footer">
      <p>Proyecto Open Source en <b><a href="https://github.com/paolaqv/Algoritmos-Frontend" target="_blank">GitHub</a></b></p>
    </footer>
  </section>
</template>

<script setup lang="ts">
</script>

<style>
:root {
  --primary-color: #41658A;
  --secondary-color: #F0B67F;
  --background-color: #EEF5DB;
  --accent-color: #C7EFCF;
  --text-color: #D6D1B1;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--primary-color);
}

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
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: bold;
}

.hero {
  text-align: center;
  padding: 2rem;
  background-color: var(--accent-color);
  margin: 1rem;
  border-radius: 10px;
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
  color: var(--primary-color);
  text-decoration: none;
  border-radius: 5px;
  margin-top: 1rem;
}

.features {
  display: flex;
  justify-content: space-around;
  padding: 2rem;
}

.feature {
  text-align: center;
  background-color: var(--accent-color);
  padding: 1rem;
  border-radius: 10px;
  width: 30%;
}

.feature h2 {
  color: var(--primary-color);
}

.feature p {
  color: var(--primary-color);
}

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
</style>
```

Este código organiza el contenido de manera más estructurada y aplica la paleta de colores que proporcionaste. Además, se han añadido animaciones para mejorar la experiencia visual.