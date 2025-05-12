<template>
  <div v-if="visible" class="dijkstra-popup-overlay">
    <div class="dijkstra-popup">
      <div class="popup-header gradient-bg">
        <h3>
          <i class="fas fa-road me-2"></i>
          Algoritmo Dijkstra
        </h3>
        <button class="close-btn" @click="close">&times;</button>
      </div>

      <div class="popup-body">
        <div class="controls-section">
          <div class="node-selector">
            <div class="select-wrapper">
              <label><i class="fas fa-map-marker-alt"></i> Nodo Inicial</label>
              <select v-model="startNode" class="styled-select">
                <option v-for="node in nodes" :key="node.id" :value="node">
                  {{ node.name }}
                </option>
              </select>
            </div>
            <div class="select-wrapper">
              <label><i class="fas fa-flag-checkered"></i> Nodo Final</label>
              <select v-model="endNode" class="styled-select">
                <option v-for="node in nodes" :key="node.id" :value="node">
                  {{ node.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="controls-section">
            <div class="mode-selector">
              <button class="find-path-btn" @click="runDijkstra('max')">
                <i class="fas fa-arrow-up me-2"></i>
                Maximizar
              </button>
              <button class="find-path-btn" @click="runDijkstra('min')">
                <i class="fas fa-arrow-down me-2"></i>
                Minimizar
              </button>
            </div>
          </div>
        </div>

        <div class="graph-section">
          <v-network-graph
            :nodes="renderNodes"
            :edges="renderEdges"
            :layouts="nodeLayouts"
            :configs="graphConfigs"
            class="graph-display"
          />
          <div v-if="pathFound" class="result-summary">
            <span class="badge">
              <i class="fas fa-ruler-combined me-2"></i>
              Longitud de recorrido: {{ pathLength }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <HelpDijkstraPopup/>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HelpDijkstraPopup from './HelpDijkstraPopup.vue'
const props = defineProps({
  modelValue: Boolean,
  nodes: Array,
  edges: Array,
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const pathFound = ref(false)
const pathLength = ref(0)

const startNode = ref(null)
const endNode = ref(null)
const pathEdges = ref(new Set())

const renderNodes = computed(() =>
  props.nodes?.map((n) => ({
    id: n.name ?? n.id,
    x: n.x,
    y: n.y,
    label: n.name,
    ...n,
  })),
)

const nodeLayouts = computed(() => {
  const layout = {}
  renderNodes.value.forEach((n) => {
    layout[n.id] = { x: n.x, y: n.y }
  })
  return layout
})

const graphConfigs = {
  directed: props.edges.some((e) => e.direction === 'directed'),
  physics: false,
  staticGraph: true,
  edge: {
    normal: {
      color: '#cbd5e0',
      width: 2,
    },
    hover: {
      color: '#93c5fd',
      width: 3,
    },
    marker: {
      target: {
        type: 'arrow',
        width: 4,
        height: 4,
      },
    },
  },
  node: {
    normal: {
      color: '#667eea',
      radius: 20,
    },
    hover: {
      color: '#5a67d8',
    },
    label: {
      color: '#2d3748',
      fontSize: 14,
    },
  },
}

const renderEdges = computed(() =>
  props.edges.map((e, i) => {
    const id = `e${i + 1}`
    return {
      id,
      source: e.node1.name ?? e.node1.id,
      target: e.node2.name ?? e.node2.id,
      label: String(e.weight),
      color: pathEdges.value.has(id) ? '#4a78a2' : '#999',
      width: pathEdges.value.has(id) ? 4 : 1,
      arrows: e.direction === 'directed' ? 'to' : false,
    }
  }),
)

function showHelp() {
  alert(
    'Selecciona un nodo inicial y uno final para calcular el camino más corto con Dijkstra. Usa "maximizar" o "minimizar" según el criterio de optimización deseado.',
  )
}

function runDijkstra(mode: 'max' | 'min') {
  // Aquí conectas con tu backend o mockeas diferente
  if (!startNode.value || !endNode.value) {
    alert('Selecciona nodo inicial y final')
    return
  }

  // Simulación por ahora
  if (mode === 'max') {
    pathEdges.value = new Set(['e2', 'e4']) // Ejemplo
  } else {
    pathEdges.value = new Set(['e1', 'e3']) // Ejemplo
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.dijkstra-popup-overlay {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dijkstra-popup {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 800px;
  max-width: 90vw;
  overflow: hidden;
  position: relative;
}

.popup-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: relative;
}

.popup-body {
  padding: 2rem;
}

.controls-section {
  margin-bottom: 2rem;
}

.mode-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.node-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.select-wrapper {
  position: relative;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 600;
}

.styled-select {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  appearance: none;
  background: white
    url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")
    no-repeat right 1rem center;
  background-size: 1em;
  transition: border-color 0.3s;
}

.styled-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.find-path-btn {
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.find-path-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.graph-section {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.path-edge {
  stroke: #48bb78 !important;
  stroke-width: 3 !important;
  animation: pulse 1.5s infinite;
}

.help-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.fab {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: #89B0AE;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: #FAF9F9;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.fab:hover {
  transform: translateY(-3px);
}

@keyframes pulse {
  0% {
    stroke-width: 3;
  }
  50% {
    stroke-width: 4;
  }
  100% {
    stroke-width: 3;
  }
}
</style>
