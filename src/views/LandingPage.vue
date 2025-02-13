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

<style scoped>
body, #app {
  margin: 0;
  padding: 0;
}

.landing {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(180deg, #41658a, #7dbaff);
  color: white;
  /* animation: fadeIn 2s ease; */
}

.navbar {
  font-family: 'Poppins', sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 100;
}
.logo {
  height: 40px;
}
.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
}
.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}
.nav-links a:hover {
  color: #89c4ff;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: fadeInDown 1.5s ease;
}
.cta-button {
  margin-top: 100px; 
  background-color: #41658a;
  color: white;
  padding: 1rem 2rem;
  border: solid 1px rgb(44, 67, 90);
  border-radius: 50px;
  text-decoration: none;
  transition: transform 0.3s;
}
.cta-button:hover {
  transform: scale(1.1);
}
.features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
}
.feature {
  max-width: 300px;
  padding: 1rem;
  background: white;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}
.feature:hover {
  transform: translateY(-10px);
}
.footer {
  margin-top: 4rem;
  font-size: 0.875rem;
}
.footer a {
  color: #41658a;
  text-decoration: none;
}
.footer a:hover {
  text-decoration: underline;
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>