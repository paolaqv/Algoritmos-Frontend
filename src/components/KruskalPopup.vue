<template>
  <div v-if="visible" class="kruskal-popup-overlay">
    <div class="kruskal-popup card p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5>Kruskal MST</h5>
        <button class="btn-close" @click="close" aria-label="Close"></button>
      </div>

      <div class="btn-group mb-4" role="group">
        <button
          type="button"
          class="btn"
          :class="!maximize ? 'btn-primary' : 'btn-outline-primary'"
          @click="runKruskal(false)"
        >
          Minimizar
        </button>
        <button
          type="button"
          class="btn"
          :class="maximize ? 'btn-primary' : 'btn-outline-primary'"
          @click="runKruskal(true)"
        >
          Maximizar
        </button>
      </div>

      <div class="graph-container">
        <v-network-graph
          v-if="renderNodes.length"
          :nodes="renderNodes"
          :edges="renderEdges"
          :layouts="nodeLayouts"
          :configs="graphConfigs"
          class="vng-canvas"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'

// Props: recibe grafo ingresado
const props = defineProps({
  modelValue: Boolean,
  nodes: Array,
  edges: Array,
})
const emit = defineEmits(['update:modelValue'])

// Control de visibilidad
const visible = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

// Flags y datos del MST
const maximize = ref(false)
const mstEdges = ref(new Set())

// Ejecuta Kruskal y resalta las aristas
async function runKruskal(isMax) {
  maximize.value = isMax
  try {
    const { data } = await axios.post(
      `/graph/spanning_tree?maximize=${isMax}`,
      { nodes: props.nodes, edges: props.edges }
    )
    mstEdges.value = new Set(Object.keys(data.data_mst.edges))
  } catch (err) {
    console.error('Kruskal error', err)
  }
}

// Cerrar popup
function close() {
  emit('update:modelValue', false)
}

// Prepara nodos con id y propiedades originales
const renderNodes = computed(() =>
  props.nodes.map(n => ({ id: n.name ?? n.id, x: n.x, y: n.y, label: n.name, ...n }))
)

// Layouts basados en coordenadas originales
const nodeLayouts = computed(() => {
  const layout = {}
  renderNodes.value.forEach(n => {
    layout[n.id] = { x: n.x, y: n.y }
  })
  return layout
})

// Configuración para grafo: no auto-layout
const graphConfigs = {
  directed: props.edges.some(e => e.direction === 'directed'),
  physics: false,
  staticGraph: true,
}

// Prepara aristas con estilo según MST
const renderEdges = computed(() =>
  props.edges.map((e, i) => {
    const id = `e${i + 1}`
    return {
      id,
      source: e.node1.name ?? e.node1.id,
      target: e.node2.name ?? e.node2.id,
      label: String(e.weight),
      color: mstEdges.value.has(id) ? '#ff5722' : '#999',
      width: mstEdges.value.has(id) ? 3 : 1,
      arrows: e.direction === 'directed' ? 'to' : false,
    }
  })
)
</script>

<style scoped>
.kruskal-popup-overlay {
  position: fixed;
  top: 0; left: 0; bottom: 0; right: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.kruskal-popup {
  background: #fff;
  border-radius: .5rem;
  width: 90%; max-width: 800px;
  max-height: 90vh;
  overflow: auto;
}
.graph-container {
  height: 400px;
}
.vng-canvas {
  width: 100%; height: 100%;
}
</style>