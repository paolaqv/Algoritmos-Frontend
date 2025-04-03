<template>
    <nav class="navbar">
      <img src="@/assets/logo.svg" alt="Logo" class="logo">
      <ul class="nav-links">
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/graphs">Grafos</router-link></li>
        <li><router-link to="/sort">Sorting</router-link></li>
        <li><router-link to="#">Contacto</router-link></li>
      </ul>
    </nav>
    <div class="container">
    <div class="sidebar">
      <div class="button-group">
        <h2>Cargar Listas</h2>
        <button class="action-button">Cargar Manualmente</button>
        <button class="action-button">Cargar Aleatorios</button>
        <button class="action-button">Boton 3</button>
        <button class="action-button">Boton 4</button>
      </div>
      
      <div class="button-group">
        <h2>Ordenar</h2>
        <button class="action-button">Boton 4</button>
        <button class="action-button">Boton 4</button>
        <button class="action-button">Boton 4</button>
        <button class="action-button">Boton 4</button>
      </div>
    </div>
    
    <div class="chart-container">
      <div class="chart">
        <div class="y-axis">
          <div class="y-label">40</div>
          <div class="y-label">30</div>
          <div class="y-label">20</div>
          <div class="y-label">10</div>
          <div class="y-label">0</div>
        </div>
        
        <div class="bars-container">
          <div v-for="(value, index) in barValues" :key="index" class="bar-wrapper">
            <div class="bar" :style="{ height: value + '%' }"></div>
            <div class="x-label">{{ index + 1 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  const barValues = ref([
    62, 75, 85, 68, 100, 75, 85, 70, 60, 78, 68, 75
  ]);
</script>

<script lang="ts">
    export default {
    name: 'SortPage'
    }
</script>
  
<style>
    :root {
    --primary-color: #41658A;
    --secondary-color: #F0B67F;
    --background-color: #EEF5DB;
    --accent-color: #C7EFCF;
    --text-color: #D6D1B1;
    }

    .container {
    display: flex;
    gap: 20px;
    padding: 20px;
    background-color: var(--background-color);
    height: 60vh;
    min-height: calc(100vh - 40px);
    }

    .sidebar {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 60vh;
    }

    .button-group {
    background-color: white;
    border: 2px solid var(--primary-color);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 11px;
    }

    .button-group h2 {
    color: var(--primary-color);
    text-align: center;
    margin: 0 0 10px 0;
    font-size: 1.5rem;
    }

    .action-button {
    padding: 10px;
    background-color: white;
    border: 2px solid var(--secondary-color);
    border-radius: 5px;
    color: var(--primary-color);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    }

    .action-button:hover {
    background-color: var(--accent-color);
    }

    .chart-container {
    flex: 1;
    background-color: white;
    border: 2px solid var(--primary-color);
    border-radius: 5px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50vh;
    }

    .chart {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    }

    .y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 10px;
    height: 100%;
    }

    .y-label {
    color: var(--primary-color);
    font-weight: bold;
    }

    .bars-container {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    }

    .bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
    }

    .bar {
    width: 40px;
    background-color: transparent;
    border: 2px solid #4CAF50;
    margin: 0 5px;
    }

    .x-label {
    margin-top: 10px;
    color: var(--primary-color);
    font-weight: bold;
    }
    .chart-container {
    background-image: linear-gradient(#ddd 1px, transparent 1px),
                        linear-gradient(90deg, #ddd 1px, transparent 1px);
    background-size: 20px 20px;
    }
</style>