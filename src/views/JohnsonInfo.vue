<template>
  <nav class="navbar">
    <img src="@/assets/logo.svg" alt="Logo" class="logo" />
    <ul class="nav-links">
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/graphs">Grafos</router-link></li>
      <li><router-link to="/sort">Ordenamiento</router-link></li>
      <li><router-link to="#">Contacto</router-link></li>
    </ul>
  </nav>

  <div class="page-container">
    <div class="info-page">
      <h1>Método de Johnson</h1>
      <p>
        El método de Johnson es un algoritmo para encontrar el orden óptimo de procesamiento de trabajos en dos máquinas
        con el objetivo de minimizar el tiempo total de finalización. Consiste en seleccionar los trabajos con los tiempos 
        más cortos y ordenarlos al inicio o al final de la secuencia, aplicando una regla específica para la asignación.
      </p>

      <div class="video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/P-7wEVzFXi8"
          title="Video explicativo del Método de Johnson"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #555b6e;
  --secondary-color: #89b0ae;
  --background-color: #f5f5f5;
  --accent-color: #ffd6ba;
  --text-color: #333333;
  --card-color: #bee3db;
}

.navbar {
  background-color: var(--primary-color);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  height: 40px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav-links li a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 600;
}

.nav-links li a.router-link-active {
  border-bottom: 2px solid var(--background-color);
}

.page-container {
  background-color: var(--background-color);
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.info-page {
  background-color: var(--card-color);
  border: 2px solid var(--accent-color);
  padding: 2rem 3rem;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  color: var(--text-color);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
}

.info-page h1 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.info-page p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.video-container iframe {
  width: 100%;
  height: 400px;
  border-radius: 10px;
}
</style>
