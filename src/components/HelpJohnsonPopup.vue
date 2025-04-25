<template>
    <transition name="popup-fade">
      <div class="popup-overlay" v-if="visible">
        <transition name="slide-fade" mode="out-in">
          <div class="popup-content help-popup" :key="step">
            <div v-if="step === 0" class="text-center">
              <h2 class="text-primary mb-3">📊 Algoritmo de Johnson</h2>
              <p>
                ¿Deseas ver una guía rápida para aplicar el algoritmo <strong>Johnson</strong> en tu grafo?
              </p>
              <div class="d-flex justify-content-center gap-2 mt-4">
                <button class="tutorial-button" @click="step = 1">Sí, mostrar guía</button>
                <button class="tutorial-button" @click="$emit('skip')">Saltar guía</button>
              </div>
            </div>
  
            <div v-else>
              <h2 class="text-primary mb-3">📘 Paso {{ step }} - Johnson</h2>
              <img
                class="img-fluid rounded mb-3 border"
                :src="`/images/JohnsonStep${step}.png`"
                :alt="`Paso ${step}`"
              />
              <p class="text-start" v-html="steps[step - 1]"></p>
  
              <div class="d-flex justify-content-between mt-4">
                <button class="tutorial-button" @click="step--" :disabled="step === 1">⬅️ Anterior</button>
                <button class="tutorial-button" v-if="step < steps.length" @click="step++">Siguiente ➡️</button>
                <button class="tutorial-button" v-else @click="$emit('skip')">Finalizar ✅</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'HelpJohnsonPopup',
    emits: ['skip'],
    data() {
      return {
        step: 0,
        visible: true,
        steps: [
          `✅ <strong>Paso 1:</strong> Crea un grafo dirigido, recuerda que puedes crear, eliminar, editar un nodo o una arista.`,
          `✅ <strong>Paso 2:</strong> Al presionar el botón "Johnson", si el grafo tiene pesos negativos o ciclos, no se podrá calcular la ruta crítica.`,
          `✅ <strong>Paso 3:</strong> Asegúrate de tener un nodo de inicio y un nodo de fin.`,
          `✅ <strong>Paso 4:</strong> Al presionar el botón "Johnson", se mostrará la ruta crítica y se marcará visualmente sobre el grafo.`,
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .popup-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }
  
  .help-popup {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 700px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);
    text-align: center;
    animation: zoomIn 0.3s ease;
  }
  
  img {
    max-height: 300px;
    object-fit: contain;
  }
  
  p {
    font-size: 16px;
    text-align: justify;
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
    transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
  }
  
  .tutorial-button:hover {
    background-color: #6d9794;
    transform: scale(1.05);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }
  
  .tutorial-button:active {
    transform: scale(0.95);
  }
  
  /* Animaciones */
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
  </style>
  