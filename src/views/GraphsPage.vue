<template>
  <div>
    <nav class="navbar">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
      <ul class="nav-links">
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/graphs">Grafos</router-link></li>
        <li><router-link to="/sort">Ordenamiento</router-link></li>
        <li><router-link to="#">Contacto</router-link></li>
      </ul>
    </nav>
  </div>
  <div class="graphs-page">
    <aside class="sidebar">
      <div class="sidebar-buttons">
        <button id="btn-matriz" class="sidebar-button" @click="openMatrixPopup">
          matriz adyacente
        </button>
        <button id="btn-johnson" class="sidebar-button" @click="runJohnson">jonhson</button>
        <button id="btn-northwest" class="sidebar-button" @click="showNorthWestHelp = true">
          NorthWest
        </button>
        <button id="btn-asignacion" class="sidebar-button" @click="openAssignmentModal">
          Asignacion
        </button>
        <button id="btn-arbol-binario" class="sidebar-button" @click="openBinaryTreePopup">
          Árbol Binario
        </button>
        <button class="sidebar-button" @click="openKruskalModal">Kruskal</button>
        <button class="sidebar-button" @click="openDijkstraModal">Dijkstra</button>
      </div>
    </aside>
    <main ref="contentArea" class="content" @click="openNodePopup">
      <!-- Nodos y aristas -->
      <div
        v-for="(node, index) in nodes"
        :key="index"
        class="node"
        :style="{ top: node.y + 'px', left: node.x + 'px', backgroundColor: node.color }"
        @mousedown="startDrag($event, node)"
        @mouseup="endDrag"
        @mousemove="onDrag"
        @click.stop="handleNodeClick(node, index)"
      >
        {{ node.name }}
      </div>
      <svg class="edges">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
          </marker>
        </defs>
        <g v-for="(edge, index) in edges" :key="index">
          <path
            :d="generateEdgePath(edge)"
            :stroke="edge.color"
            fill="none"
            stroke-width="2"
            :marker-end="edge.direction === 'directed' ? 'url(#arrow)' : ''"
            class="edge-path"
            @click="handleEdgeClick(edge, index, $event)"
          />
          <text
            :x="generateEdgeLabelPosition(edge).labelX"
            :y="generateEdgeLabelPosition(edge).labelY"
            fill="black"
            font-size="12"
            text-anchor="middle"
          >
            {{ edge.weight }}
          </text>
        </g>
      </svg>
      <!--AssignmentPopup-->
      <AssignmentPopup
        v-if="showAssignmentModal"
        :nodes="nodes"
        :edges="edges"
        @close="showAssignmentModal = false"
      />
      <!-- Popup para matriz de adyacencia -->
      <div v-if="showMatrixPopup" class="matrix-popup" :style="matrixPopupStyle">
        <div class="matrix-popup-header" @mousedown="onPopupHeaderMouseDown">
          <span>Matriz de Adyacencia</span>
          <button class="close-button" @click="closeMatrixPopup">X</button>
        </div>
        <div class="matrix-popup-content">
          <table border="1" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th></th>
                <th v-for="(node, index) in nodes" :key="index">
                  {{ node.name }}
                </th>
                <th>RowSum</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in adjacencyMatrix" :key="i">
                <th>{{ i + 1 }}</th>
                <td v-for="(cell, j) in row" :key="j">
                  {{ cell }}
                </td>
                <td>{{ rowSums[i] }}</td>
              </tr>
              <tr>
                <th>ColSum</th>
                <td v-for="(sum, j) in colSums" :key="j">
                  {{ sum }}
                </td>
                <td>{{ totalSum }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="resizer" @mousedown="startResizing"></div>
      </div>
      <!-- Popup para resultados de Johnson -->
      <JohnsonPopup
        v-if="showJohnsonPopup"
        :nodes="nodes"
        :edges="edges"
        :results="johnsonResults"
        :popupStyle="matrixPopupStyle"
        @close="closeJohnsonPopup"
        @start-drag="onPopupHeaderMouseDown"
        @start-resize="startResizing"
      />
      <NorthWestPopup
        v-if="showNorthWestPopup"
        :nodes="nodes"
        :edges="edges"
        @close="showNorthWestPopup = false"
      />
      <HelpNorthWest
        v-if="showNorthWestHelp"
        @skip="
          () => {
            showNorthWestHelp = false
            showNorthWestPopup = true
          }
        "
      />
      <BinaryTreePopup v-if="showBinaryTreePopup" @close="showBinaryTreePopup = false" />
    </main>
<!-- -------------------------------------------------------------------------- -->
    <!-- Popup Kruskal -->
    <dialog ref="kruskalDialog" class="popup-window">
      <h3>Kruskal</h3>
      <div class="modal-controls">
        <button @click="runKruskal(false)" class="mode-btn">Minimizar</button>
        <button @click="runKruskal(true)" class="mode-btn">Maximizar</button>
      </div>
      <div class="graph-preview">
        <!-- Duplicado del canvas: nodos -->
        <div
          v-for="(node, i) in nodes"
          :key="'k-node-' + i"
          class="node"
          :style="{
            top: node.y + 'px',
            left: node.x + 'px',
            backgroundColor: node.color,
          }"
        >
          {{ node.name }}
        </div>
        <!-- Duplicado del canvas: aristas -->
        <svg class="edges">
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
          </marker>
          <g v-for="(edge, i) in previewEdges" :key="'k-edge-' + i">
            <line
              :id="'mst-edge-'+edge.id ? 'mst-edge-'+edge.id : null"
              :class="mstEdgeIds.includes(edge.id) ? 'mst-edge' : ''" 
              :x1="edge.calculated.startX"
              :y1="edge.calculated.startY"
              :x2="edge.calculated.endX"
              :y2="edge.calculated.endY"
              :stroke="edge.color"
              stroke-width="2"
              class="mst-edge"
              :marker-end="edge.direction === 'directed' ? 'url(#arrow)' : ''"
            />
            <!-- peso en el punto medio -->
            <text
              :x="(edge.calculated.startX + edge.calculated.endX) / 2"
              :y="(edge.calculated.startY + edge.calculated.endY) / 2 - 5"
              fill="#000"
              font-size="10"
              text-anchor="middle"
            >
              {{ edge.weight }}
            </text>
          </g>
        </svg>
      </div>
      <button class="close-btn" @click="$refs.kruskalDialog.close()">Cerrar</button>
    </dialog>
<!-- -------------------------------------------------------------------------- -->
    <!-- Popup Dijkstra -->
    <dialog ref="dijkstraDialog" class="popup-window">
      <h3>Dijkstra</h3>
      <div class="modal-controls">
        <label
          >Inicio:
          <select v-model="dijkstraStart">
            <option v-for="n in nodes" :key="n.id" :value="n.name">{{ n.name }}</option>
          </select>
        </label>
        <label
          >Fin:
          <select v-model="dijkstraEnd">
            <option v-for="n in nodes" :key="n.id" :value="n.name">{{ n.name }}</option>
          </select>
        </label>
        <button @click="runDijkstra('min')" class="mode-btn">Minimizar</button>
        <button @click="runDijkstra('max')" class="mode-btn">Maximizar</button>
      </div>
      <div class="graph-preview">
        <!-- Duplicado del canvas: nodos -->
        <div
          v-for="(node, i) in nodes"
          :key="'d-node-' + i"
          class="node"
          :style="{ top: node.y + 'px', left: node.x + 'px', backgroundColor: node.color }"
        >
          {{ node.name }}
        </div>
        <!-- Duplicado del canvas: aristas -->
        <svg class="edges">
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
          </marker>
          <g v-for="(edge, i) in previewEdges" :key="'d-edge-' + i">
            <line
              :x1="edge.calculated.startX"
              :y1="edge.calculated.startY"
              :x2="edge.calculated.endX"
              :y2="edge.calculated.endY"
              :stroke="edge.color"
              stroke-width="2"
              :marker-end="edge.direction === 'directed' ? 'url(#arrow)' : ''"
            />
            <!-- peso -->
            <text
              :x="(edge.calculated.startX + edge.calculated.endX) / 2"
              :y="(edge.calculated.startY + edge.calculated.endY) / 2 - 5"
              fill="#000"
              font-size="10"
              text-anchor="middle"
            >
              {{ edge.weight }}
            </text>
          </g>
        </svg>
      </div>
      <button class="close-btn" @click="$refs.dijkstraDialog.close()">Cerrar</button>
    </dialog>
<!-- -------------------------------------------------------------------------- -->


    <footer class="bottom-bar">
      <button
        class="menu-button add-button"
        :class="{ active: isAddingNode }"
        @click="toggleAddNode"
        title="Agregar nodo"
      >
        <i class="fas fa-plus"></i>
      </button>
      <button
        class="menu-button link-button"
        :class="{ active: isLinking }"
        @click="toggleLinking"
        title="Enlazar"
      >
        <i class="fas fa-link"></i>
      </button>
      <button
        class="menu-button delete-button"
        :class="{ active: isDeletingNode }"
        @click="toggleDeleteMode"
        title="Eliminar"
      >
        <i class="fas fa-trash"></i>
      </button>
      <button
        class="menu-button move-button"
        :class="{ active: isMovingNode }"
        @click="toggleMoveMode"
        title="Mover nodo"
      >
        <i class="fas fa-arrows-alt"></i>
      </button>
      <button
        class="menu-button edit-button"
        :class="{ active: isEditing }"
        @click="toggleEditingMode"
        title="Editar"
      >
        <i class="fas fa-edit"></i>
      </button>
      <button class="menu-button clear-button" @click="clearCanvas" title="Limpiar canvas">
        <i class="fas fa-eraser"></i>
      </button>
      <!-- Mostrar HelpView cuando isHelpActive sea true -->
      <HelpView v-if="isHelpActive" @close="toggleHelp" />

      <!-- Botón Help -->
      <button
        class="menu-button help-button"
        :class="{ active: isHelpActive }"
        @click="toggleHelp"
        title="Ayuda"
      >
        <i class="fas fa-question-circle"></i>
      </button>
    </footer>
    <div class="import-export-buttons">
      <button class="menu-button import-button" @click="importData">Importar</button>
      <button class="menu-button export-button" @click="exportData">Exportar</button>
    </div>
    <input
      type="file"
      ref="fileInput"
      @change="handleFileImport"
      accept=".json"
      style="display: none"
    />
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <label>Nombre del nodo:</label>
        <input type="text" v-model="nodeName" placeholder="Ingrese nombre..." />
        <label>Color del nodo:</label>
        <div class="color-picker-container">
          <input type="color" v-model="nodeColor" @change="closeColorPicker" class="color-picker" />
        </div>
        <div class="popup-buttons">
          <button class="cancel-button" @click="cancelPopup">Cancelar</button>
          <button class="accept-button" @click="confirmNode">Aceptar</button>
        </div>
      </div>
    </div>
    <div v-if="showEdgePopup" class="popup">
      <div class="popup-content">
        <label>Peso de la arista:</label>
        <input type="number" v-model="edgeWeight" placeholder="Ingrese peso..." />
        <label>Dirección:</label>
        <select v-model="edgeDirection">
          <option value="directed">Dirigido</option>
          <option value="undirected">No dirigido</option>
        </select>
        <label>Color de la arista:</label>
        <input type="color" v-model="edgeColor" />
        <div class="popup-buttons">
          <button class="cancel-button" @click="cancelEdgePopup">Cancelar</button>
          <button class="accept-button" @click="confirmEdge">Aceptar</button>
        </div>
      </div>
    </div>
    <!-- Popup para editar nodo -->
    <div v-if="showEditNodePopup" class="popup">
      <div class="popup-content">
        <label>Nombre del nodo:</label>
        <input type="text" v-model="editNodeName" placeholder="Ingrese nombre..." />
        <label>Color del nodo:</label>
        <div class="color-picker-container">
          <input type="color" v-model="editNodeColor" class="color-picker" />
        </div>
        <div class="popup-buttons">
          <button class="cancel-button" @click="cancelEditNode">Cancelar</button>
          <button class="accept-button" @click="confirmEditNode">Aceptar</button>
        </div>
      </div>
    </div>
    <!-- Popup para editar arista -->
    <div v-if="showEditEdgePopup" class="popup">
      <div class="popup-content">
        <label>Peso de la arista:</label>
        <input type="number" v-model="editEdgeWeight" placeholder="Ingrese peso..." />
        <label>Dirección:</label>
        <select v-model="editEdgeDirection">
          <option value="directed">Dirigido</option>
          <option value="undirected">No dirigido</option>
        </select>
        <label>Color de la arista:</label>
        <input type="color" v-model="editEdgeColor" />
        <div class="popup-buttons">
          <button class="cancel-button" @click="cancelEditEdge">Cancelar</button>
          <button class="accept-button" @click="confirmEditEdge">Aceptar</button>
        </div>
      </div>
    </div>
    <!-- Modal para confirmar eliminación -->
    <div v-if="showDeletePopup" class="popup">
      <div class="popup-content">
        <p>¿Seguro que deseas eliminar este nodo?</p>
        <div class="popup-buttons">
          <button class="cancel-button" @click="cancelDelete">Cancelar</button>
          <button class="accept-button" @click="deleteNode">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HelpView from './HelpView.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import gsap from 'gsap'

import JohnsonPopup from '../components/JohnsonPopup.vue'
import NorthWestPopup from '../components/NorthWestPopup.vue'
import HelpNorthWest from '../components/HelpNorthWest.vue'
import AssignmentPopup from '../components/AssignmentPopup.vue'
import BinaryTreePopup from '../components/BinaryTreePopup.vue'
import { fetchMstEdgeIds, colorEdges } from '@/utils/kruskalAlg'
export default {
  components: {
    JohnsonPopup,
    HelpView,
    NorthWestPopup,
    HelpNorthWest,
    AssignmentPopup,
    BinaryTreePopup,
  },

  name: 'GraphsPage',
  data() {
    return {
      isHelpActive: false,
      isAddingNode: false,
      isLinking: false,
      isDeletingNode: false,
      nodes: [],
      edges: [],
      selectedNodes: [],
      showEdgePopup: false,
      edgeWeight: '1',
      edgeDirection: 'directed',
      edgeColor: '#000000',
      showPopup: false,
      showDeletePopup: false,
      nodeName: '',
      nodeColor: '#ff0000',
      tempNodePosition: { x: 0, y: 0 },
      nodeToDelete: null,
      draggingNode: null,
      offsetX: 0,
      offsetY: 0,
      isMovingNode: false,
      isEditing: false,
      editingTarget: null,
      editingType: '',
      showEditNodePopup: false,
      showEditEdgePopup: false,
      editNodeName: '',
      editNodeColor: '',
      editNodeIndex: null,
      editEdgeWeight: '',
      editEdgeDirection: '',
      editEdgeColor: '',
      editEdgeIndex: null,
      // Popup de matriz
      showMatrixPopup: false,
      matrixPopupStyle: {
        top: '50px',
        left: '50px',
        width: '400px',
        height: '300px',
      },
      isDraggingPopup: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      isResizing: false,
      resizeStartWidth: 0,
      resizeStartHeight: 0,
      resizeStartX: 0,
      resizeStartY: 0,
      //matriz recibida
      adjacencyMatrix: [],
      // Propiedades para Johnson
      showJohnsonPopup: false,
      johnsonResults: {},
      // Propiedades para modal asignación
      assignmentResults: {
        min: null,
        max: null,
      },
      activeAssignmentTab: 'min', // min o max
      showAssignmentModal: false,
      assignmentMatrix: [],
      totalCost: 0,
      optimalAssignment: [],
      assignmentMode: 'min', // 'min' o 'max'
      //Grupos de nodos para asignación (se detectan automaticamente)
      groupA: [],
      groupB: [],
      //NorthWest
      showNorthWestPopup: false,
      showNorthWestHelp: false,
      //
      showBinaryTreePopup: false,
//-------------------------------------------
      kruskalMode: 'min',
      mstEdgeIds: [],  
      mstColors: {},

      dijkstraMode: 'min',      
      dijkstraStart: null,
      dijkstraEnd: null,
//-------------------------------------------
    }
  },

  computed: {
    rowSums() {
      return this.adjacencyMatrix.map((row) => row.reduce((acc, cell) => acc + Number(cell), 0))
    },
    colSums() {
      if (!this.adjacencyMatrix.length) return []
      const cols = this.adjacencyMatrix[0].length
      let sums = Array(cols).fill(0)
      this.adjacencyMatrix.forEach((row) => {
        row.forEach((cell, j) => {
          sums[j] += Number(cell)
        })
      })
      return sums
    },
    totalSum() {
      return this.rowSums.reduce((a, b) => a + b, 0)
    },

//-----------------------------------------------------------------
    // Genera edges con cálculo de posiciones para los previews
    previewEdges() {
      return colorEdges(this.edges, this.mstEdgeIds,this.mstColors)
    },
  },
//------------------------------------------------------------
  methods: {
//------------------------------------------------------------
    openKruskalModal() {
      this.$refs.kruskalDialog.showModal()
    },
    closeKruskalModal() {
      this.$refs.kruskalDialog.close()
    },
    async runKruskal(mode) {
     this.kruskalMode = mode ? 'max' : 'min'
      if (!this.nodes.length || !this.edges.length) {
        return Swal.fire({
          icon: 'info',
          title: 'Grafica uno primero',
          text: 'No hay grafo para calcular Kruskal'
           })
        }
        this.edges = this.edges.map((edge, idx) => ({
          id: edge.id || `e${idx + 1}`,
          ...edge
          }))
        try {
          this.mstEdgeIds = await fetchMstEdgeIds(
            this.nodes,
            this.edges,
            mode
        )
        this.mstColors = {}
        this.mstEdgeIds.forEach(id => {
          const hue = Math.floor(Math.random() * 360)
          this.mstColors[id] = `hsl(${hue}, 100%, 50%)`
          })
        console.log('MST IDs:', this.mstEdgeIds)
        console.log('Front IDs:', this.edges.map(e => e.id))
        } catch (err) {
          console.error(err)
          Swal.fire({
            icon: 'error',
            title: 'Error en Kruskal',
            text: err.message
          })
        }
        await this.$nextTick()
        this.animateMstEdges()  
    },
    animateMstEdges() {
    gsap.killTweensOf('.mst-edge')
    const dialog = this.$refs.kruskalDialog
    const allLines = dialog.querySelectorAll('svg.edges line')
    allLines.forEach(line => {
      gsap.killTweensOf(line)
      line.style.strokeDasharray  = ''
      line.style.strokeDashoffset = ''
    })
    this.mstEdgeIds.forEach(id => {
      const line = document.querySelector(`#mst-edge-${id}`)
      this.mstEdgeIds.forEach(id => {
      const line = dialog.querySelector(`#mst-edge-${id}`)
      if (!line) return
      // Longitud de la línea
      const length = line.getTotalLength()
      // Prepara dasharray/dashoffset
      gsap.set(line, {
        strokeDasharray: length,
        strokeDashoffset: length
      })
      // Anima dashoffset → 0 en bucle
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'none',
        repeat: -1
      })
    })
  })
  },

    openDijkstraModal() {
      this.$refs.dijkstraDialog.showModal()
      // Iniciar selects con primer nodo si no hay valor
      if (!this.dijkstraStart && this.nodes.length) this.dijkstraStart = this.nodes[0].name
      if (!this.dijkstraEnd && this.nodes.length) this.dijkstraEnd = this.nodes[0].name
    },
    closeDijkstraModal() {
      this.$refs.dijkstraDialog.close()
    },
    runDijkstra(mode) {
      // Lógica de Dijkstra con dijkstraStart, dijkstraEnd y dijkstraMode
      this.dijkstraMode = mode
      console.log('Dijkstra:', this.dijkstraStart, this.dijkstraEnd, this.dijkstraMode)
    },
//------------------------------------------------------------
    openBinaryTreePopup() {
      console.log('Botón Árbol Binario presionado')
      this.showBinaryTreePopup = true
    },

    toggleHelp() {
      this.isHelpActive = !this.isHelpActive // Cambia el estado de isHelpActive
    },
    openMatrixPopup() {
      this.showMatrixPopup = true
    },
    //Matriz---------------
    async openMatrixPopup() {
      if (!this.nodes || this.nodes.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No hay un grafo para calcular su matriz adyancente',
          text: 'Grafica uno primero 😊',
        })
        return
      }
      try {
        const response = await axios.post('http://127.0.0.1:5000/graph/adjacency_matrix', {
          nodes: this.nodes,
          edges: this.edges,
        })
        this.adjacencyMatrix = response.data.matrix
        this.showMatrixPopup = true
      } catch (error) {
        console.error('Error al obtener la matriz de adyacencia:', error)
      }
    },
    closeMatrixPopup() {
      this.showMatrixPopup = false
    },
    checkGraphValidity() {
      let errors = []
      // Construir mapas de entradas y salidas
      const incoming = new Map()
      const outgoing = new Map()
      this.nodes.forEach((n) => {
        incoming.set(n.name, 0)
        outgoing.set(n.name, 0)
      })
      this.edges.forEach((e) => {
        // Se asume que cada arista tiene propiedad weight y nodos identificados por name
        outgoing.set(e.node1.name, outgoing.get(e.node1.name) + 1)
        incoming.set(e.node2.name, incoming.get(e.node2.name) + 1)
      })
      // Nodo de inicio: sin entradas
      const startNodes = this.nodes.filter((n) => incoming.get(n.name) === 0)
      if (startNodes.length === 0) {
        errors.push('No se encontró un nodo de inicio (sin entradas).')
      }
      // Nodo final: sin salidas
      const endNodes = this.nodes.filter((n) => outgoing.get(n.name) === 0)
      if (endNodes.length === 0) {
        errors.push('No se encontró un nodo final (sin salidas).')
      }
      // Verifica que no haya ciclos (utilizando DFS)
      if (this.hasCycle()) {
        errors.push('El grafo tiene ciclos.')
      }
      // Verifica que no existan pesos negativos
      const negativeEdge = this.edges.find((e) => Number(e.weight) < 0)
      if (negativeEdge) {
        errors.push('El grafo tiene pesos negativos.')
      }
      return errors
    },

    // Algoritmo DFS para detectar ciclos
    hasCycle() {
      const visited = new Set()
      const recStack = new Set()
      const adjList = new Map()
      // Construir lista de adyacencia
      this.nodes.forEach((n) => {
        adjList.set(n.name, [])
      })
      this.edges.forEach((e) => {
        adjList.get(e.node1.name).push(e.node2.name)
      })
      // Función auxiliar DFS
      const dfs = (node) => {
        if (recStack.has(node)) return true
        if (visited.has(node)) return false
        visited.add(node)
        recStack.add(node)
        const neighbors = adjList.get(node)
        for (const nbr of neighbors) {
          if (dfs(nbr)) return true
        }
        recStack.delete(node)
        return false
      }
      // Recorre cada nodo
      for (const node of this.nodes.map((n) => n.name)) {
        if (dfs(node)) return true
      }
      return false
    },
    //NorthWest help---------------------------------------------------
    runNorthWest() {
      this.showNorthWestHelp = false
      this.showNorthWestPopup = true
    },

    //Johnson-----------------------------------------------
    async runJohnson() {
      const errors = this.checkGraphValidity()
      if (errors.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Grafo inválido',
          html: errors.join('<br>'),
        })
        return
      }
      try {
        console.log('Iniciando el proceso de ejecución de Johnson...')

        const edgesFormatted = this.edges
          .map((edge) => {
            const sourceNode = this.nodes.find((n) => n.id === edge.node1.id)
            const targetNode = this.nodes.find((n) => n.id === edge.node2.id)

            if (!sourceNode || !targetNode) {
              console.error(`❌ Nodo no encontrado: ${!sourceNode ? edge.node1.id : edge.node2.id}`)
              return null
            }

            console.log(
              `✅ Nodo encontrado: ${sourceNode.name} -> ${targetNode.name}, Peso: ${edge.weight}`,
            )

            return {
              node1: { name: sourceNode.name },
              node2: { name: targetNode.name },
              weight: Number(edge.weight),
            }
          })
          .filter((edge) => edge !== null)

        if (edgesFormatted.length === 0) {
          console.error('❌ No se encontraron aristas válidas después del formateo.')
          Swal.fire({
            icon: 'error',
            title: 'Error en Johnson',
            text: 'No se encontraron aristas válidas para procesar.',
          })
          return
        }

        console.log(
          'Aristas formateadas para enviar al backend:',
          JSON.stringify(edgesFormatted, null, 2),
        )

        const nodesFormatted = this.nodes.map((node) => ({
          id: node.id,
          x: node.x,
          y: node.y,
          name: node.name,
          color: node.color,
        }))

        console.log(
          'Nodos formateados para enviar al backend:',
          JSON.stringify(nodesFormatted, null, 2),
        )

        const response = await axios.post('http://127.0.0.1:5000/graph/johnson', {
          nodes: nodesFormatted,
          edges: edgesFormatted,
        })

        console.log('📥 Respuesta recibida del backend:', response.data)

        const { distances, h_values, critical_path, early_times, late_times, edges } = response.data

        if (!distances || !h_values || !critical_path || !early_times || !late_times || !edges) {
          console.error(
            '❌ Error: El formato de la respuesta del backend es incorrecto o faltan datos.',
          )
          throw new Error('El formato de la respuesta es incorrecto o faltan datos.')
        }

        this.johnsonResults = {
          distances,
          h_values,
          critical_path,
          early_times,
          late_times,
          edges,
        }

        console.log('✅ Johnson ejecutado correctamente. Resultados:', this.johnsonResults)
        this.showJohnsonPopup = true
      } catch (error) {
        console.error('❌ Error en Johnson:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error en Johnson',
          text: error.message || 'Error al procesar el grafo con Johnson.',
        })
      }
    },
    closeJohnsonPopup() {
      console.log('Cerrando popup de Johnson desde el componente padre')
      this.showJohnsonPopup = false
    },
    //------------------------------------------------------
    onPopupHeaderMouseDown(event) {
      this.isDraggingPopup = true
      const popupRect = event.currentTarget.parentElement.getBoundingClientRect()
      this.dragOffsetX = event.clientX - popupRect.left
      this.dragOffsetY = event.clientY - popupRect.top
      document.addEventListener('mousemove', this.onPopupDrag)
      document.addEventListener('mouseup', this.onPopupDragEnd)
    },
    onPopupDrag(event) {
      if (this.isDraggingPopup) {
        const contentRect = this.$refs.contentArea.getBoundingClientRect()
        const popupWidth = parseInt(this.matrixPopupStyle.width)
        const popupHeight = parseInt(this.matrixPopupStyle.height)
        // Calculamos la posición relativa dentro del content
        let newLeft = event.clientX - contentRect.left - this.dragOffsetX
        let newTop = event.clientY - contentRect.top - this.dragOffsetY
        // Limitar a la parte izquierda y superior
        if (newLeft < 0) newLeft = 0
        if (newTop < 0) newTop = 0
        // Limitar al ancho y alto del content
        if (newLeft + popupWidth > contentRect.width) newLeft = contentRect.width - popupWidth
        if (newTop + popupHeight > contentRect.height) newTop = contentRect.height - popupHeight
        this.matrixPopupStyle.left = newLeft + 'px'
        this.matrixPopupStyle.top = newTop + 'px'
      }
    },
    onPopupDragEnd() {
      this.isDraggingPopup = false
      document.removeEventListener('mousemove', this.onPopupDrag)
      document.removeEventListener('mouseup', this.onPopupDragEnd)
    },
    startResizing(event) {
      this.isResizing = true
      this.resizeStartWidth = parseInt(this.matrixPopupStyle.width)
      this.resizeStartHeight = parseInt(this.matrixPopupStyle.height)
      this.resizeStartX = event.clientX
      this.resizeStartY = event.clientY
      document.addEventListener('mousemove', this.onResizing)
      document.addEventListener('mouseup', this.stopResizing)
      event.stopPropagation()
    },
    onResizing(event) {
      if (this.isResizing) {
        let newWidth = this.resizeStartWidth + (event.clientX - this.resizeStartX)
        let newHeight = this.resizeStartHeight + (event.clientY - this.resizeStartY)
        if (newWidth < 200) newWidth = 200
        if (newHeight < 150) newHeight = 150
        this.matrixPopupStyle.width = newWidth + 'px'
        this.matrixPopupStyle.height = newHeight + 'px'
      }
    },
    stopResizing() {
      this.isResizing = false
      document.removeEventListener('mousemove', this.onResizing)
      document.removeEventListener('mouseup', this.stopResizing)
    },

    handleEdgeClick(edge, index, event) {
      event.stopPropagation()
      if (this.isDeletingNode) {
        this.deleteEdge(index)
      } else if (this.isEditing) {
        this.editingTarget = edge
        this.editingType = 'edge'
        this.editEdgeWeight = edge.weight
        this.editEdgeDirection = edge.direction
        this.editEdgeColor = edge.color
        this.editEdgeIndex = index
        this.showEditEdgePopup = true
      }
    },

    // Método para eliminar aristas
    deleteEdge(index) {
      if (index !== null) {
        this.edges.splice(index, 1)
      }
    },

    //calculo del radio para arista
    calculateEdgePosition(node1, node2) {
      const radius = 22.5
      if (node1 === node2) {
        let selfLoopCount = this.edges.filter((e) => e.node1 === node1 && e.node2 === node1).length
        let offsetFactor = 20 + selfLoopCount * 10
        return {
          selfLoop: true,
          x1: node1.x + radius,
          y1: node1.y,
          x2: node1.x,
          y2: node1.y - radius,
          offset: offsetFactor,
        }
      }
      const dx = node2.x - node1.x
      const dy = node2.y - node1.y
      const angle = Math.atan2(dy, dx)
      return {
        x1: node1.x + Math.cos(angle) * radius,
        y1: node1.y + Math.sin(angle) * radius,
        x2: node2.x - Math.cos(angle) * radius,
        y2: node2.y - Math.sin(angle) * radius,
      }
    },
    generateEdgePath(edge) {
      if (edge.node1 === edge.node2) {
        // Coordenadas del nodo
        const { x1, y1 } = edge.calculated
        const nodeRadius = 22.5
        const loopOffset = 50

        // loop
        const controlX1 = x1 + loopOffset
        const controlY1 = y1 - loopOffset * 1.5
        const controlX2 = x1 - loopOffset
        const controlY2 = y1 - loopOffset * 1.5

        const angle = (Math.PI * 5) / 3.8
        const endX = x1 + Math.cos(angle) * nodeRadius
        const endY = y1 + Math.sin(angle) * nodeRadius

        return `M ${x1} ${y1} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
      } else {
        // Arista normal
        const { x1, y1, x2, y2 } = edge.calculated
        const offset = 20
        const dx = x2 - x1
        const dy = y2 - y1
        const length = Math.sqrt(dx * dx + dy * dy) || 1
        const nx = -dy / length
        const ny = dx / length

        const cp1x = x1 + (x2 - x1) / 3 + nx * offset
        const cp1y = y1 + (y2 - y1) / 3 + ny * offset
        const cp2x = x1 + (2 * (x2 - x1)) / 3 + nx * offset
        const cp2y = y1 + (2 * (y2 - y1)) / 3 + ny * offset

        edge.controlPoints = { cp1x, cp1y, cp2x, cp2y }
        return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`
      }
    },

    toggleAddNode() {
      this.isAddingNode = !this.isAddingNode
      this.isDeletingNode = false
      this.isLinking = false
      this.isMovingNode = false
    },
    toggleDeleteMode() {
      this.isDeletingNode = !this.isDeletingNode
      this.isAddingNode = false
      this.isLinking = false
      this.isMovingNode = false
    },
    toggleLinking() {
      this.isLinking = !this.isLinking
      this.selectedNodes = []
      this.isAddingNode = false
      this.isMovingNode = false
      this.isDeletingNode = false
    },

    toggleMoveMode() {
      this.isMovingNode = !this.isMovingNode
      this.isAddingNode = false
      this.isDeletingNode = false
      this.isLinking = false
    },
    toggleEditingMode() {
      this.isEditing = !this.isEditing
      if (this.isEditing) {
        this.isAddingNode = false
        this.isLinking = false
        this.isDeletingNode = false
        this.isMovingNode = false
      } else {
        this.editingTarget = null
        this.editingType = ''
      }
    },
    handleNodeClick(node, index) {
      if (this.isEditing) {
        this.editingTarget = node
        this.editingType = 'node'
        this.editNodeName = node.name
        this.editNodeColor = node.color
        this.editNodeIndex = index
        this.showEditNodePopup = true
        return
      }
      if (this.isDeletingNode) {
        this.confirmDeleteNode(index)
      } else if (this.isLinking) {
        this.selectNode(node)
      } else {
        console.log('Click en nodo, pero no estamos en modo eliminar ni enlazar.')
      }
    },

    //seleccionar 2 nodos para la arista y popup
    selectNode(node) {
      if (this.isLinking) {
        if (this.selectedNodes.length === 0) {
          this.selectedNodes.push(node)
        } else if (this.selectedNodes.length === 1) {
          // Permitir self‑loop si se toca el mismo nodo
          if (this.selectedNodes[0] === node) {
            this.selectedNodes.push(node)
          } else if (!this.selectedNodes.includes(node)) {
            this.selectedNodes.push(node)
          }
        }
        if (this.selectedNodes.length === 2) {
          this.showEdgePopup = true
        }
      }
    },
    cancelEdgePopup() {
      this.showEdgePopup = false
      this.selectedNodes = []
    },
    confirmEdge() {
      if (this.selectedNodes.length === 2) {
        const node1 = this.selectedNodes[0]
        const node2 = this.selectedNodes[1]
        if (!node1 || !node2) {
          console.error('Error: No se han seleccionado nodos válidos.')
          return
        }
        //existencia de la arista
        const edgeExists = this.edges.some((edge) => {
          if (edge.direction === 'directed') {
            return edge.node1.name === node1.name && edge.node2.name === node2.name
          } else {
            //arista no dirigida
            return (
              (edge.node1.name === node1.name && edge.node2.name === node2.name) ||
              (edge.node1.name === node2.name && edge.node2.name === node1.name)
            )
          }
        })
        if (edgeExists) {
          Swal.fire({
            icon: 'warning',
            title: '¡Advertencia!',
            text: `Los nodos ${node1.name} y ${node2.name} ya estan enlazados.`,
          })
          this.selectedNodes = []
          return
        }
        const calculatedPositions = this.calculateEdgePosition(node1, node2)
        this.edges.push({
          node1,
          node2,
          weight: this.edgeWeight,
          direction: this.edgeDirection,
          color: this.edgeColor,
          calculated: calculatedPositions,
        })
      }
      this.showEdgePopup = false
      this.selectedNodes = []
    },
    openNodePopup(event) {
      if (this.isAddingNode) {
        const rect = event.currentTarget.getBoundingClientRect()
        this.tempNodePosition = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        }
        this.showPopup = true
      }
    },
    closeColorPicker() {
      document.activeElement.blur()
    },
    cancelPopup() {
      this.showPopup = false
    },
    confirmNode() {
      const newNode = {
        id: Date.now(), // O utiliza alguna otra estrategia para generar un id único
        x: this.tempNodePosition.x,
        y: this.tempNodePosition.y,
        name: this.nodeName,
        color: this.nodeColor,
      }
      this.nodes.push(newNode)
      this.showPopup = false
      this.nodeName = ''
      this.nodeColor = '#ff0000'
    },
    confirmDeleteNode(index) {
      if (this.isDeletingNode) {
        this.nodeToDelete = index
        this.showDeletePopup = true
      }
    },
    deleteNode() {
      if (this.nodeToDelete !== null) {
        const deletedNode = this.nodes[this.nodeToDelete]

        this.nodes.splice(this.nodeToDelete, 1)
        this.edges = this.edges.filter((edge) => {
          return !(
            (edge.node1.x === deletedNode.x && edge.node1.y === deletedNode.y) ||
            (edge.node2.x === deletedNode.x && edge.node2.y === deletedNode.y)
          )
        })
        this.nodeToDelete = null
        this.showDeletePopup = false
      }
    },
    cancelDelete() {
      this.showDeletePopup = false
      this.nodeToDelete = null
    },

    startDrag(event, node) {
      if (this.isMovingNode) {
        const contentRect = this.$refs.contentArea.getBoundingClientRect()
        this.offsetX = event.clientX - contentRect.left - node.x
        this.offsetY = event.clientY - contentRect.top - node.y
        this.draggingNode = node
        document.addEventListener('mousemove', this.onDrag)
        document.addEventListener('mouseup', this.endDrag)
      }
    },
    onDrag(event) {
      if (this.draggingNode && this.isMovingNode) {
        const contentRect = this.$refs.contentArea.getBoundingClientRect()
        const nodeRadius = 22.5
        let newX = event.clientX - contentRect.left - this.offsetX
        let newY = event.clientY - contentRect.top - this.offsetY
        //distancia content/radio node
        if (newX < nodeRadius) newX = nodeRadius
        if (newX > contentRect.width - nodeRadius) newX = contentRect.width - nodeRadius
        if (newY < nodeRadius) newY = nodeRadius
        if (newY > contentRect.height - nodeRadius) newY = contentRect.height - nodeRadius
        this.draggingNode.x = newX
        this.draggingNode.y = newY
        this.edges.forEach((edge) => {
          if (edge.node1 === this.draggingNode || edge.node2 === this.draggingNode) {
            edge.calculated = this.calculateEdgePosition(edge.node1, edge.node2)
          }
        })
      }
    },
    endDrag() {
      this.draggingNode = null
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.endDrag)
    },
    confirmEditNode() {
      if (this.editNodeIndex !== null) {
        this.nodes[this.editNodeIndex].name = this.editNodeName
        this.nodes[this.editNodeIndex].color = this.editNodeColor
      }
      this.showEditNodePopup = false
      this.editingTarget = null
      this.editingType = ''
      this.editNodeIndex = null
      this.editNodeName = ''
      this.editNodeColor = '#ff0000'
    },
    cancelEditNode() {
      this.showEditNodePopup = false
      this.editingTarget = null
      this.editingType = ''
      this.editNodeIndex = null
    },
    confirmEditEdge() {
      if (this.editEdgeIndex !== null) {
        this.edges[this.editEdgeIndex].weight = this.editEdgeWeight
        this.edges[this.editEdgeIndex].direction = this.editEdgeDirection
        this.edges[this.editEdgeIndex].color = this.editEdgeColor
      }
      this.showEditEdgePopup = false
      this.editingTarget = null
      this.editingType = ''
      this.editEdgeIndex = null
      this.editEdgeWeight = '1'
      this.editEdgeDirection = 'directed'
      this.editEdgeColor = '#000000'
    },
    cancelEditEdge() {
      this.showEditEdgePopup = false
      this.editingTarget = null
      this.editingType = ''
      this.editEdgeIndex = null
    },
    importData() {
      this.$refs.fileInput.click()
    },
    getControlPoint(x1, y1, x2, y2, offset) {
      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2
      const dx = x2 - x1
      const dy = y2 - y1
      const length = Math.sqrt(dx * dx + dy * dy) || 1
      const nx = -dy / length
      const ny = dx / length
      return { cpX: midX + nx * offset, cpY: midY + ny * offset }
    },
    generateEdgeLabelPosition(edge) {
      if (edge.node1 === edge.node2) {
        const { x1, y1, x2, y2, offset } = edge.calculated
        const cp1x = x1 + offset
        const cp1y = y1 - offset
        const cp2x = x2 - offset
        const cp2y = y2 - offset
        const labelX = 0.125 * x1 + 0.375 * cp1x + 0.375 * cp2x + 0.125 * x2
        const labelY = 0.125 * y1 + 0.375 * cp1y + 0.375 * cp2y + 0.125 * y2 - 10 // Se resta 10 para subir ligeramente el label
        return { labelX, labelY }
      } else {
        const { x1, y1, x2, y2 } = edge.calculated
        const { cp1x, cp1y, cp2x, cp2y } = edge.controlPoints
        const labelX = 0.125 * x1 + 0.375 * cp1x + 0.375 * cp2x + 0.125 * x2
        const labelY = 0.125 * y1 + 0.375 * cp1y + 0.375 * cp2y + 0.125 * y2 - 10
        return { labelX, labelY }
      }
    },
    // Botón para resolver la asignación; mode = 'min' o 'max'
    handleFileImport(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)

          if (data.nodes && data.edges) {
            // Cargar nodos
            this.nodes = data.nodes.map((node) => ({
              id: node.id,
              x: node.x,
              y: node.y,
              name: node.name,
              color: node.color,
            }))

            // Crear un mapa para acceder a los nodos por su nombre
            const nodeMap = {}
            this.nodes.forEach((node) => {
              nodeMap[node.name] = node // Mapear usando 'name' en lugar de 'id'
            })

            // Cargar aristas y calcular sus posiciones
            this.edges = data.edges
              .map((edge) => {
                const sourceNode = nodeMap[edge.node1.name] // Buscar por 'name'
                const targetNode = nodeMap[edge.node2.name] // Buscar por 'name'

                if (!sourceNode || !targetNode) {
                  console.error('Error al encontrar nodos para arista: ', edge)
                  return null
                }

                // Generar la propiedad 'calculated' usando tu método existente
                const calculatedPositions = this.calculateEdgePosition(sourceNode, targetNode)

                return {
                  node1: sourceNode,
                  node2: targetNode,
                  weight: edge.weight,
                  direction: edge.direction || 'directed',
                  color: edge.color || '#000000',
                  calculated: calculatedPositions, // Generar las posiciones calculadas
                }
              })
              .filter((edge) => edge !== null) // Filtrar aristas inválidas

            console.log('✅ Grafo importado exitosamente')
          } else {
            console.error('❌ El archivo JSON no tiene el formato correcto.')
          }
        } catch (error) {
          console.error('❌ Error al importar el archivo JSON:', error)
        }
      }
      reader.readAsText(file)
    },
    openAssignmentModal() {
      this.showAssignmentModal = true
    },
    exportData() {
      const jsonData = JSON.stringify({ nodes: this.nodes, edges: this.edges }, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const fileName = prompt('Ingrese un nombre para el archivo:', 'graph_data.json')
      if (!fileName) return

      const a = document.createElement('a')
      a.href = url
      a.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },

    clearCanvas() {
      this.nodes = []
      this.edges = []
      this.selectedNodes = []
    },
  },
}
</script>

<style scoped>
.graphs-page {
  display: flex;
  width: 95vw;
  height: 95vh;
  background: #555b6e;
  position: absolute;
  top: 59%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}

.content {
  flex-grow: 1;
  background: #faf9f9;
  margin: 20px;
  padding: 20px;
  margin-bottom: 100px;
  border-radius: 10px;
  position: relative;
}

.node {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #d6d1b1;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  font-family: Arial, sans-serif;
  cursor: pointer;
}

.bottom-bar {
  height: 50px;
  background: #89b0ae;
  position: absolute;
  bottom: 20px;
  left: 57%;
  transform: translateX(-50%);
  width: 70%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.menu-button {
  width: 40px;
  height: 40px;
  background: #bee3db;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #555b6e;
  position: relative;
}

.menu-button:hover {
  background: #4a78a2;
}

.menu-button.active {
  background: #c7efcf;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ebe5c1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
  font-family: Arial, sans-serif;
}

.popup-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
}

.popup-buttons button {
  padding: 8px 15px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: 0.3s;
}

.cancel-button {
  background: #4fb0d9;
  color: white;
}

.cancel-button:hover {
  background: #41658a;
}

.accept-button {
  background: #f0b67f;
  color: white;
}

.accept-button:hover {
  background: #e26a2c;
}

.styled-input {
  padding: 8px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
  text-align: center;
}

.color-picker-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.color-picker {
  width: 40px;
  height: 40px;
  cursor: pointer;
  border: none;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid #000;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

.add-button:hover::after {
  content: 'Agregar nodo';
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
}
.delete-button:hover::after {
  content: 'Eliminar nodo';
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
}
.move-button:hover::after {
  content: 'Mover nodo';
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
}
.link-button:hover::after {
  content: 'Enlazar nodos';
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
}

.edit-button:hover::after {
  content: 'Editar nodos';
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
}

.clear-button:hover::after {
  content: 'Limpiar canvas';
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
}

.edges {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid rgb(246, 243, 243);
  border-radius: 20px;
  pointer-events: none;
}
.import-export-buttons {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
}

.menu-button.import-button,
.menu-button.export-button {
  width: 90px;
  height: 40px;
  background: #ffd6ba;
  color: #555b6e;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transform: 0.2s;
  font-size: 14px;
  font-weight: bold;
}

.menu-button.import-button:hover,
.menu-button.export-button:hover {
  background: #dc9a6e;
  transform: scale(1.05);
}

.menu-button.import-button:active,
.menu-button.export-button:active {
  transform: scale(0.95);
}

.edge-path {
  pointer-events: stroke;
  transition:
    stroke 0.3s,
    stroke-width 0.3s;
}
.edge-path:hover {
  stroke-width: 3;
  stroke: #110b26;
}
/*sidebar*/
.sidebar {
  width: 150px;
  height: 60%;
  background: #89b0ae;
  margin: 20px;
  margin-top: 70px;
  border-radius: 10px;
  padding: 10px;
}
.sidebar-buttons {
  display: grid;
  grid-template-columns: repeat(2, 2cm);
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}
.sidebar-button {
  width: 2cm;
  height: 2cm;
  border: none;
  border-radius: 10px;
  background-color: #bee3db;
  color: #555b6e;
  font-size: 12px;
  cursor: pointer;
  transition:
  background 0.3s,
  transform 0.2s;
}
.sidebar-button:hover {
  background-color: #92cdc0;
  transform: scale(1.05);
}
.sidebar-button:active {
  transform: scale(0.95);
}
/* Estilos para el popup de matriz */
.matrix-popup {
  position: absolute;
  background: white;
  border: 2px solid #ccc;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.matrix-popup-header {
  background: #336699;
  color: white;
  padding: 8px;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
.matrix-popup-content {
  padding: 10px;
  flex-grow: 1;
  overflow: auto;
}
.resizer {
  width: 15px;
  height: 15px;
  background: #ccc;
  cursor: nwse-resize;
  align-self: flex-end;
}
/* NAVBAR */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--primary-color);
}

.navbar .logo {
  height: 40px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: bold;
}

.highlight-cell {
  background-color: #c7efcf;
  font-weight: bold;
  color: #000;
  border: 2px solid #4a78a2;
}
/*------------------------------------------------------------*/
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.graph-preview {
  position: relative;
  width: 100%;
  height: 70vh;
  background: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}
.graph-preview .node {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}
.graph-preview .edges {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.close-btn {
  margin-top: 1rem;
  background: #d776e4;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

/* Ventana emergente estilo dialog */
.popup-window {
  border: none;
  border-radius: 8px;
  padding: 1rem;
  width: 80vw;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.mode-btn {
  background: #558ebc;
  color: #fff;
  border: none;
  padding: 6px 12px;
  margin-right: 4px;
  border-radius: 4px;
  cursor: pointer;
}
.mode-btn:hover {
  background: #4a78a2;
}
</style>
