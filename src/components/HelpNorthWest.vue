<template>
  <div class="popup-overlay">
    <div class="popup-content help-popup">
      <h2 class="text-primary mb-3">📘 Guía rápida - Algoritmo North West</h2>

      <ul class="list-group text-start mb-4">
        <li class="list-group-item">
          ✅ <strong>Paso 1:</strong> Dibuja un grafo donde cada nodo origen esté conectado a uno o más destinos.
        </li>
        <li class="list-group-item">
          ✅ <strong>Paso 2:</strong> Asegúrate que cada arista tenga un <strong>peso numérico</strong> (costo).
        </li>
        <li class="list-group-item">
          ✅ <strong>Paso 3:</strong> Al hacer clic en <em>NorthWest</em>, se generará una tabla basada en los nodos y conexiones.
        </li>
        <li class="list-group-item">
          ✅ <strong>Paso 4:</strong> Completa los campos de <strong>oferta</strong> (última columna) y <strong>demanda</strong> (última fila).
        </li>
        <li class="list-group-item">
          ✅ <strong>Paso 5:</strong> Haz clic en <strong>Resolver</strong> para aplicar el algoritmo y ver la asignación inicial.
        </li>
      </ul>

      <div class="d-flex justify-content-end">
        <button class="btn btn-success" @click="$emit('skip')">Saltar guía</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpNorthWest',
  emits: ['skip'],
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
}

.list-group-item {
  border: none;
  font-size: 16px;
  margin-bottom: 8px;
}
</style>
