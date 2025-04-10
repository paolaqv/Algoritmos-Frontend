<template>
  <div class="popup-overlay" v-if="visible">
    <div class="popup-content help-popup">
      <div v-if="step === 0" class="text-center">
        <h2 class="text-primary mb-3">👋 Bienvenido</h2>
        <p>¿Deseas ver una guía rápida del algoritmo <strong>North West</strong>?</p>
        <div class="d-flex justify-content-center gap-2 mt-4">
          <button class="tutorial-button" @click="step = 1">Sí, mostrar tutorial</button>
          <button class="tutorial-button" @click="$emit('skip')">No, continuar</button>
        </div>
      </div>

      <div v-else>
        <h2 class="text-primary mb-3">📘 Paso {{ step }} - Algoritmo North West</h2>
        <img
          class="img-fluid rounded mb-3 border"
          :src="`/images/NorthWestStep${step}.png`"
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
          <button class="tutorial-button" v-else @click="$emit('skip')">Finalizar ✅</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpNorthWest',
  emits: ['skip'],
  data() {
    return {
      step: 0,
      visible: true,
      steps: [
        `✅ <strong>Paso 1:</strong> Dibuja un grafo donde cada nodo origen esté conectado a uno o más destinos.`,
        `✅ <strong>Paso 2:</strong> Asegúrate que cada arista tenga un <strong>peso numérico</strong> (costo).`,
        `✅ <strong>Paso 3:</strong> Al hacer clic en <em>NorthWest</em>, se generará una tabla basada en los nodos y conexiones.`,
        `✅ <strong>Paso 4:</strong> Completa los campos de <strong>oferta</strong> (última columna) y <strong>demanda</strong> (última fila).`,
        `✅ <strong>Paso 5:</strong> Haz clic en <strong>Resolver</strong> para aplicar el algoritmo y ver la asignación inicial.`,
      ],
    }
  },
}
</script>

<style scoped>
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
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 700px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.25);
  text-align: center;
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

.tutorial-button:active {
  transform: scale(0.95);
}
</style>
