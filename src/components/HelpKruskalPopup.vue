<template>
  <div>
    <!-- Botón flotante -->
    <button class="fab" @click="visible = true">?</button>

    <!-- Popup de ayuda -->
    <transition name="popup-fade">
      <div v-if="visible" class="popup-overlay">
        <transition name="slide-fade" mode="out-in">
          <div class="popup-content help-popup" :key="step">
            <div v-if="step === 0" class="text-center">
              <h2 class="text-primary mb-3">📌 Ayuda de Algoritmo de Kruskal</h2>
              <p>
                ¿Quieres aprender cómo funcionan el algoritmo de
                <strong>Kruskal</strong> que puedes usar?
              </p>
              <div class="d-flex justify-content-center gap-2 mt-4">
                <button class="tutorial-button" @click="step = 1">Sí, mostrar guía</button>
                <button class="tutorial-button" @click="visible = false">Saltar guía</button>
              </div>
            </div>

            <div v-else>
              <h2 class="text-primary mb-3">📘 Paso {{ step }}</h2>
              <img
                class="img-fluid rounded mb-3 border"
                :src="`/images/kruskal${step}.png`"
                :alt="`Paso ${step}`"
              />
              <p class="text-start" v-html="steps[step - 1]"></p>

              <div class="d-flex justify-content-between mt-4">
                <button class="tutorial-button" @click="step--" :disabled="step === 1">
                  ⬅️ Anterior
                </button>
                <button class="tutorial-button" v-if="step < steps.length" @click="step++">
                  Siguiente ➡️
                </button>
                <button class="tutorial-button" v-else @click="visible = false">
                  Finalizar ✅
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const step = ref(0)

const steps = [
  `✅ <strong>Paso 1:</strong> Ingresa todos los nodos y aristas del grafo junto con sus pesos. 
  El grafo debe ser no dirigido y sin bucles (una arista que conecte un nodo consigo mismo).`,

  `✅ <strong>Paso 2:</strong> Selecciona el criterio de optimización, maximizar o minimizar.`,

  `✅ <strong>Paso 3:</strong> Se seleccionarán las aristas más livianas una por una, siempre y cuando no formen un ciclo con las ya seleccionadas.`,

  `✅ <strong>Paso 4:</strong> El proceso termina cuando todos los nodos están conectados en un solo árbol. 
  El resultado es el Árbol de Expansión Mínima (MST), que conecta todos los nodos con el menor costo total.`,
]
</script>

<style scoped>
/* Botón flotante */
.floating-help-button {
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 60px;
  height: 60px;
  background-color: #ffd6ba;
  border: none;
  border-radius: 50%;
  font-size: 30px;
  color: #333333;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  z-index: 1000;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.floating-help-button:hover {
  background-color: #ffc099;
  transform: scale(1.1);
}

/* Popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.help-popup {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);
  text-align: center;
  animation: zoomIn 0.3s ease;
}

.tutorial-button {
  background-color: #89b0ae;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin: 0 5px;
  transition:
    background-color 0.3s,
    transform 0.2s,
    box-shadow 0.3s;
}

.tutorial-button:hover {
  background-color: #6d9794;
  transform: scale(1.05);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Transiciones */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.3s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}
.fab {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: #89b0ae;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: #faf9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.fab:hover {
  transform: translateY(-3px);
}
</style>
