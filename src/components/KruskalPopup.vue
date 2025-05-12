<template>
  <div v-if="visible" class="kruskal-popup-overlay">
    <div class="kruskal-popup">
      <div class="popup-header gradient-bg">
        <h3>
          <i class="fas fa-project-diagram me-2"></i>
          Algoritmo Kruskal
        </h3>
        <button class="close-btn" @click="close">&times;</button>
      </div>

      <div class="popup-body">
        <div class="controls-section">
          <div class="mode-selector">
            <button
              @click="runKruskal(false)"
              :class="{ 'active-mode': !maximize }"
              class="mode-btn"
            >
              <i class="fas fa-arrow-down me-2"></i>
              Minimizar
            </button>
            <button @click="runKruskal(true)" :class="{ 'active-mode': maximize }" class="mode-btn">
              <i class="fas fa-arrow-up me-2"></i>
              Maximizar
            </button>
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
          <div v-if="mstEdges.size > 0" class="result-summary">
            <span class="badge">
              <i class="fas fa-weight-hanging me-2"></i>
              Peso Total: {{ totalWeight }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

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

const maximize = ref(false)
const mstEdges = ref(new Set())

async function runKruskal(isMax) {
  maximize.value = isMax
  try {
    // TODO: Connect to backend Kruskal implementation
    // For now, mock MST edges
    mstEdges.value = new Set(['e1', 'e2', 'e3']) // Example edges
  } catch (err) {
    console.error('Kruskal error', err)
  }
}

const renderNodes = computed(() =>
  props.nodes.map((n) => ({
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
      color: mstEdges.value.has(id) ? '#ff5722' : '#999',
      width: mstEdges.value.has(id) ? 4 : 1,
      arrows: e.direction === 'directed' ? 'to' : false,
    }
  }),
)

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.kruskal-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.kruskal-popup {
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 800px;
  max-width: 90vw;
  overflow: hidden;
}

.popup-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: relative;
}

.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: rotate(90deg);
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

.mode-btn {
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: #f8f9fa;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mode-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.active-mode {
  background: #667eea !important;
  color: white !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.graph-section {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.graph-display {
  height: 400px;
  background: #f8fafc;
}

.result-summary {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 10;
}

.badge {
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  color: #2d3748;
}
</style>
