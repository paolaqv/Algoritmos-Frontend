<template>
  <div class="binary-tree-popup">
    <button class="popup-close" @click="emit('close')">×</button>
    <div class="popup-header mb-3 d-flex justify-content-between align-items-center">
      <h4>Árbol Binario</h4>
      <div>
        <button class="btn btn-sm btn-danger me-2" @click="clearTree">Limpiar</button>
        <button class="btn btn-sm btn-primary" @click="openReconstructModal">Reconstruir Árbol</button>
      </div>
    </div>

    <div class="controls mb-3 d-flex align-items-center">
      <input
        v-model="inputText"
        type="text"
        placeholder="Ej: 50,30,70,20,40,60,80"
        class="form-control me-2"
      />
      <button class="btn btn-success me-4" @click="insertValues">Insertar</button>

      <label for="traversal" class="me-2">Recorrido:</label>
      <select id="traversal" v-model="traversalOption" class="form-select w-auto" @change="handleTraversal">
        <option value="all">Seleccionar</option>
        <option value="all">Todo</option>
        <option value="pre">Preorden</option>
        <option value="in">Inorden</option>
        <option value="post">Postorden</option>
      </select>
    </div>

    <div class="tree-display">
      <v-network-graph
        ref="graph"
        :nodes="nodes"
        :edges="edges"
        :layouts="{ nodes: layouts }"
        :configs="configs"
        class="vng-canvas"
      >
        <template #override-node-label="{ text }">
          <text
            x="0"
            y="0"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="14"
            fill="#fff"
          >
            {{ text }}
          </text>
        </template>
      </v-network-graph>
    </div>

    <!-- Modal Recorrido -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0,0,0,0.5);"
      v-if="showTraversalModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <button type="button" class="custom-close-btn" @click="showTraversalModal = false">×</button>
          <div class="modal-header">
            <h5 class="modal-title">Recorridos</h5>
          </div>
          <div class="modal-body">
            <template v-if="traversalOption === 'all'">
              <p><strong>Preorden:</strong> {{ preOrder.join(', ') }}</p>
              <p><strong>Inorden:</strong> {{ inOrder.join(', ') }}</p>
              <p><strong>Postorden:</strong> {{ postOrder.join(', ') }}</p>
            </template>
            <template v-else>
              <p><strong>{{ traversalLabel }}:</strong> {{ traversalResult.join(', ') }}</p>
            </template>
          </div>
          <div class="modal-footer">
            <!-- <button
              type="button"
              class="btn btn-secondary"
              @click="showTraversalModal = false"
            >Cerrar</button> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Reconstruir -->
    <div
      class="modal fade show"
      tabindex="-1"
      style="display: block; background: rgba(0,0,0,0.5);"
      v-if="showReconstructModal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Reconstruir Árbol</h5>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Postorden (coma-separados):</label>
              <input
                v-model="postOrderText"
                class="form-control"
                placeholder="Ej: 20,40,30,60,80,70,50"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Inorden (coma-separados):</label>
              <input
                v-model="inOrderText"
                class="form-control"
                placeholder="Ej: 20,30,40,50,60,70,80"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              @click="reconstructTree"
            >Reconstruir</button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="showReconstructModal = false"
            >Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    <button class="fab" @click="onFabClick()">?</button>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { VNetworkGraphInstance } from 'v-network-graph';
import { defineConfigs } from 'v-network-graph';
import { useTreeStore } from '@/stores/treeStore';

const treeStore = useTreeStore();
const graph = ref<VNetworkGraphInstance | null>(null);
const inputText = ref('');
const emit = defineEmits<{ (event: 'close'): void }>();
// Estado de recorrido
const traversalOption = ref<'all' | 'pre' | 'in' | 'post'>('all');
const traversalResult = ref<number[]>([]);
const traversalLabel = ref('');
const preOrder = ref<number[]>([]);
const inOrder = ref<number[]>([]);
const postOrder = ref<number[]>([]);
const showTraversalModal = ref(false);

// Estado de reconstrucción
const showReconstructModal = ref(false);
const postOrderText = ref('');
const inOrderText = ref('');

// Reactividad del grafo
type NodeMap = Record<string, { id: string; name: string }>;
type EdgeMap = Record<string, { id: string; source: string; target: string }>;
type LayoutMap = Record<string, { x: number; y: number }>;
const nodes = reactive<NodeMap>({});
const edges = reactive<EdgeMap>({});
const layouts = reactive<LayoutMap>({});

const configs = defineConfigs({
  edge: {
    normal: { width: 2, color: '#2c3e50' },
    marker: { target: { type: 'arrow', width: 6, height: 6, color: '#2c3e50' } }
  }
});


async function clearTree() {
  await treeStore.clearTree();
  Object.keys(nodes).forEach((k) => delete nodes[k]);
  Object.keys(edges).forEach((k) => delete edges[k]);
  Object.keys(layouts).forEach((k) => delete layouts[k]);
}

async function insertValues() {
  const vals = inputText.value
    .split(',')
    .map((v) => parseInt(v.trim(), 10))
    .filter((v) => !isNaN(v));
  if (!vals.length) return;
  await clearTree();
  for (const v of vals) {
    await treeStore.insertNode(v);
  }
  await treeStore.generateDisplayTree();
  applyLevelLayout();
  inputText.value = '';
}

async function handleTraversal() {
  const opt = traversalOption.value;
  preOrder.value = [];
  inOrder.value = [];
  postOrder.value = [];
  if (opt === 'all') {
    traversalLabel.value = 'Todos los recorridos';
    [preOrder.value, inOrder.value, postOrder.value] = await Promise.all([
      treeStore.preOrderTraversal(),
      treeStore.inOrderTraversal(),
      treeStore.postOrderTraversal()
    ]);
  } else if (opt === 'pre') {
    traversalLabel.value = 'Preorden';
    preOrder.value = await treeStore.preOrderTraversal();
    traversalResult.value = preOrder.value;
  } else if (opt === 'in') {
    traversalLabel.value = 'Inorden';
    inOrder.value = await treeStore.inOrderTraversal();
    traversalResult.value = inOrder.value;
  } else if (opt === 'post') {
    traversalLabel.value = 'Postorden';
    postOrder.value = await treeStore.postOrderTraversal();
    traversalResult.value = postOrder.value;
  }
  showTraversalModal.value = true;
}

function openReconstructModal() {
  showReconstructModal.value = true;
}

async function reconstructTree() {
  const post = postOrderText.value
    .split(',')
    .map((v) => parseInt(v.trim(), 10))
    .filter((v) => !isNaN(v));
  const ino = inOrderText.value
    .split(',')
    .map((v) => parseInt(v.trim(), 10))
    .filter((v) => !isNaN(v));
  await treeStore.generateFromPostorderAndInorder(post, ino);
  await treeStore.generateDisplayTree();
  applyLevelLayout();
  showReconstructModal.value = false;
  postOrderText.value = '';
  inOrderText.value = '';
}

function applyLevelLayout() {
  // Limpiar estructuras
  Object.keys(nodes).forEach((k) => delete nodes[k]);
  Object.keys(edges).forEach((k) => delete edges[k]);
  Object.keys(layouts).forEach((k) => delete layouts[k]);

  // Recuperar grafo generado
  const display = treeStore.graphdisplay;
  display.nodes.forEach((n) => (nodes[n.id] = { id: n.id, name: n.name }));
  display.edges.forEach((e) =>
    (edges[e.id] = { id: e.id, source: e.source, target: e.target })
  );

  // Mapear hijos y nodos
  const children: Record<string, string[]> = {};
  const allIds: string[] = [];
  const childIds = new Set<string>();
  display.nodes.forEach((n) => allIds.push(n.id));
  display.edges.forEach((e) => {
    children[e.source] = children[e.source] || [];
    children[e.source].push(e.target);
    childIds.add(e.target);
  });

  // Detectar raíz
  const rootId = allIds.find((id) => !childIds.has(id)) || allIds[0];
  if (!rootId) return;

  // BFS para niveles
  const levelMap: Record<string, number> = {};
  const queue: [string, number][] = [[rootId, 0]];
  while (queue.length) {
    const [id, lvl] = queue.shift()!;
    levelMap[id] = lvl;
    (children[id] || []).forEach((ch) => queue.push([ch, lvl + 1]));
  }

  // Agrupar niveles
  const levels: Record<number, string[]> = {};
  Object.entries(levelMap).forEach(([id, lvl]) => {
    const L = +lvl;
    levels[L] = levels[L] || [];
    levels[L].push(id);
  });

  // Dimensiones dinámicas
  const container = (graph.value as any)?._container as HTMLElement | null;
  const canvasWidth = container ? container.clientWidth : 800;
  const verticalGap = 100;
  const offsetY = 50;

  // Reubicar nodos
  Object.entries(levels).forEach(([lvlStr, ids]) => {
    const lvl = +lvlStr;
    const count = ids.length;
    ids.forEach((id, idx) => {
      layouts[id] = {
        x: ((idx + 1) / (count + 1)) * canvasWidth,
        y: lvl * verticalGap + offsetY
      };
    });
  });

  // Actualizar y centrar vista
  graph.value?.$emit('update:layouts', { nodes: layouts });
  graph.value?.fitToContents();
}
</script>

<style scoped>
.binary-tree-popup {
  background: #FAF9F9;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #BEE3DB;
  max-width: 800px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, sans-serif;
  color: #555B6E;
  position: relative;

}

/* Header */
.popup-header {
  background: #555B6E;
  color: #FAF9F9;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Buttons */
.btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}
.btn-sm {
  padding: 6px 12px;
}
.btn-primary {
  background: #89B0AE;
  border: none;
  color: #FAF9F9;
}
.btn-primary:hover {
  background: #BEE3DB;
  transform: translateY(-2px);
}
.btn-success {
  background: #FFD6BA;
  border: none;
  color: #555B6E;
}
.btn-success:hover {
  background: #FFEAD2;
  transform: translateY(-2px);
}
.btn-danger {
  background: #FFD6BA;
  border: none;
  color: #555B6E;
}
.btn-danger:hover {
  background: #FFEAD2;
  transform: translateY(-2px);
}

/* Inputs and selects */
.form-control,
.form-select {
  border: 1px solid #89B0AE;
  border-radius: 8px;
  background: #BEE3DB;
  color: #555B6E;
  transition: border-color 0.3s ease;
}
.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: #555B6E;
  box-shadow: 0 0 5px rgba(133,176,174,0.5);
}

/* Tree display */
.tree-display {
  height: 300px;
  width: 100%;
  background: #FAF9F9;
  border: 1px solid #89B0AE;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

/* Modals */
.modal-content {
  background: #FAF9F9;
  border: 1px solid #BEE3DB;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}
.modal.fade.show .modal-content {
  transform: translateY(0);
}
.modal-header {
  background: #555B6E;
  border-bottom: none;
  color: #FAF9F9;
}
.modal-body {
  background: #FAF9F9;
  color: #555B6E;
  padding: 1rem;
}
/* Asegurar visibilidad de textos de recorrido */
.modal-body p,
.modal-body p strong {
  color: #555B6E;
}
.modal-footer {
  background: #BEE3DB;
  border-top: none;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

/* Close button */
.custom-close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #FAF9F9;
  line-height: 1;
  cursor: pointer;
  transition: color 0.3s ease;
}
.custom-close-btn:hover {
  color: #FFD6BA;
}

.modal-dialog {
  max-width: 500px;
  margin: 0;
}

/* Label styling */
label,
.form-label {
  color: #555B6E;
  font-weight: 600;
}

/* Ensure select width */
.form-select.w-auto {
  min-width: 120px;
}

/* Center modals */
.modal.fade.show {
  display: flex !important;
  align-items: center;
  justify-content: center;
}
/* X de cierre */
.popup-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #FFD6BA;
  cursor: pointer;
  transition: color 0.2s ease;
}
.popup-close:hover {
  color: #555B6E;
}

/* Botón flotante */
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
</style>
