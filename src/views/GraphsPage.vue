<template>
  <div class="graphs-page">
    <aside class="sidebar">
      <div class="sidebar-buttons">
        <button class="sidebar-button" @click="openMatrixPopup">matriz adyacente</button>
        <button class="sidebar-button" @click="runJohnson">jonhson</button>
        <button class="sidebar-button" @click="solveAssignment('min')">Minimizar</button>
        <button class="sidebar-button" @click="solveAssignment('max')">Maximizar</button>
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

      <!-- Modal para mostrar resultados de asignación -->
      <div v-if="showAssignmentModal" class="modal-overlay" @click.self="closeAssignmentModal">
        <div class="modal-content">
          <h2>
            Resultado de la Asignación ({{ assignmentMode === 'min' ? 'Minimizar' : 'Maximizar' }})
          </h2>
          <div class="matrix-container">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th v-for="(nodeB, index) in groupB" :key="index">{{ nodeB.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(nodeA, i) in groupA" :key="i">
                  <th>{{ nodeA.name }}</th>
                  <td v-for="(nodeB, j) in groupB" :key="j">
                    {{ assignmentMatrix[i][j] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="assignment-result">
            <p><strong>Costo Total:</strong> {{ totalCost }}</p>
            <p><strong>Asignaciones Óptimas:</strong></p>
            <ul>
              <li v-for="(pair, index) in optimalAssignment" :key="index">
                {{ pair.nodeA.name }} → {{ pair.nodeB.name }} (Costo: {{ pair.cost }})
              </li>
            </ul>
          </div>
          <button class="close-button" @click="closeAssignmentModal">Cerrar</button>
        </div>
      </div>

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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in adjacencyMatrix" :key="i">
                <th>{{ i + 1 }}</th>
                <td v-for="(cell, j) in row" :key="j">
                  {{ cell }}
                </td>
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
        :results="johnsonResults"
        :popupStyle="matrixPopupStyle"
        @close="closeJohnsonPopup"
        @start-drag="onPopupHeaderMouseDown"
        @start-resize="startResizing"
      />
    </main>

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
import JohnsonPopup from '../components/JohnsonPopup.vue' // Ajusta la ruta segun tu estructura

function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  const result = Array.isArray(obj) ? [] : {}
  Object.keys(obj).forEach((key) => {
    result[key] = cloneDeep(obj[key])
  })
  return result
}

export default {
  components: {
    JohnsonPopup,
    HelpView,
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
      showAssignmentModal: false,
      assignmentMatrix: [],
      totalCost: 0,
      optimalAssignment: [],
      assignmentMode: 'min', // 'min' o 'max'
      //Grupos de nodos para asignación (se detectan automaticamente)
      groupA: [],
      groupB: [],
    }
  },
  methods: {
    toggleHelp() {
      this.isHelpActive = !this.isHelpActive // Cambia el estado de isHelpActive
    },
    openMatrixPopup() {
      this.showMatrixPopup = true
    },
    //Matriz-----------------------------------------------
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
    //Johnson-----------------------------------------------
    async runJohnson() {
      if (!this.nodes || this.nodes.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No hay grafo',
          text: 'Grafica uno primero 😊',
        })
        return
      }
      // Verificar que el grafo sea dirigido
      const undirectedEdge = this.edges.find((edge) => edge.direction !== 'directed')
      if (undirectedEdge) {
        Swal.fire({
          icon: 'warning',
          title: 'Grafo no dirigido',
          text: 'El algoritmo de Johnson solo funciona en grafos dirigidos.',
        })
        return
      }
      // Verificar que todas las aristas tengan un peso numérico
      const invalidWeightEdge = this.edges.find((edge) => isNaN(Number(edge.weight)))
      if (invalidWeightEdge) {
        Swal.fire({
          icon: 'warning',
          title: 'Grafo no ponderado',
          text: 'Todas las aristas deben tener un peso numérico asociado.',
        })
        return
      }

      try {
        const response = await axios.post('http://127.0.0.1:5000/graph/johnson', {
          nodes: this.nodes,
          edges: this.edges,
        })
        console.log('Respuesta Johnson:', response.data)

        if (typeof response.data === 'string') {
          const parsedData = response.data.replace(/Infinity/g, '"∞"') // O reemplazar con un número grande
          this.johnsonResults = JSON.parse(parsedData)
        } else {
          this.johnsonResults = response.data
        }

        console.log('Resultados Johnson asignados:', this.johnsonResults)

        this.$nextTick(() => {
          this.showJohnsonPopup = true
        })
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error en Johnson',
          text: error.response?.data?.error || 'Error al procesar el grafo con Johnson.',
        })
        console.error('Error en Johnson:', error)
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
    handleFileImport(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          if (data.nodes && data.edges) {
            this.nodes = data.nodes
            // creacion de mapa para buscar nodos por su id
            const nodeMap = {}
            this.nodes.forEach((node) => {
              nodeMap[node.id] = node
            })

            // reasocia los nodos en cada arista y recalcula sus posiciones
            this.edges = data.edges.map((edge) => {
              return {
                ...edge,
                node1: nodeMap[edge.node1.id],
                node2: nodeMap[edge.node2.id],
                calculated: this.calculateEdgePosition(
                  nodeMap[edge.node1.id],
                  nodeMap[edge.node2.id],
                ),
              }
            })
            console.log('Grafo importado exitosamente')
          } else {
            console.error('El archivo JSON no tiene el formato correcto.')
          }
        } catch (error) {
          console.error('Error al importar el archivo JSON:', error)
        }
      }
      reader.readAsText(file)
    },

    // Botón para resolver la asignación; mode = 'min' o 'max'
    solveAssignment(mode) {
      this.assignmentMode = mode
      // Paso 1: Detectar grupos automáticamente
      if (!this.detectBipartiteGroups()) {
        alert('El grafo no es bipartito. No se puede calcular la asignación automáticamente.')
        return
      }
      // Paso 2: Construir la matriz de asignación
      this.buildAssignmentMatrix()
      // Paso 3: Resolver el problema usando el algoritmo húngaro
      const result = this.hungarianAlgorithm(this.assignmentMatrix)
      // Result es un objeto { cost, assignment } donde assignment es un arreglo de índices
      this.totalCost = result.cost
      this.optimalAssignment = []
      this.highlightedEdges = []
      result.assignment.forEach((j, i) => {
        const nodeA = this.groupA[i]
        const nodeB = this.groupB[j]
        // El costo original se obtiene de la matriz de asignación original
        const cost = this.assignmentMatrix[i][j]
        this.optimalAssignment.push({ nodeA, nodeB, cost })
        // Resaltar la arista entre estos nodos, si existe
        const edge = this.edges.find(
          (e) =>
            (e.node1.name === nodeA.name && e.node2.name === nodeB.name) ||
            (e.node1.name === nodeB.name && e.node2.name === nodeA.name),
        )
        if (edge) {
          this.highlightedEdges.push(edge)
        }
      })
      // Mostrar el modal con los resultados
      this.showAssignmentModal = true
    },

    // Método para detectar los grupos (bipartición) usando BFS
    detectBipartiteGroups() {
      // Inicializar grupos
      const color = {} // key: node.name, value: 0 o 1
      const queue = []
      // Tomamos el primer nodo y lo asignamos a 0 (Grupo A)
      if (this.nodes.length === 0) return false
      color[this.nodes[0].name] = 0
      queue.push(this.nodes[0])
      while (queue.length) {
        const node = queue.shift()
        // Buscar vecinos: consideramos los nodos conectados por aristas
        const neighbors = this.edges.reduce((acc, edge) => {
          if (edge.node1.name === node.name) acc.push(edge.node2)
          else if (edge.node2.name === node.name) acc.push(edge.node1)
          return acc
        }, [])
        neighbors.forEach((neighbor) => {
          if (color[neighbor.name] === undefined) {
            color[neighbor.name] = 1 - color[node.name]
            queue.push(neighbor)
          } else if (color[neighbor.name] === color[node.name]) {
            // El grafo no es bipartito
            return false
          }
        })
      }
      // Separar nodos en dos grupos
      this.groupA = this.nodes.filter((node) => color[node.name] === 0)
      this.groupB = this.nodes.filter((node) => color[node.name] === 1)
      // Verificar que ambos grupos tengan al menos un nodo
      return this.groupA.length > 0 && this.groupB.length > 0
    },

    // Construir la matriz de asignación a partir de groupA y groupB
    buildAssignmentMatrix() {
      // Inicializar matriz con valores altos (infinito) para representar ausencia de conexión
      const INF = 1e9
      const matrix = []
      // Se asume que, para cada par (nodeA, nodeB), si existe una arista, se usa su peso; si no, INF
      for (let i = 0; i < this.groupA.length; i++) {
        const row = []
        for (let j = 0; j < this.groupB.length; j++) {
          // Buscar una arista entre groupA[i] y groupB[j]
          const edge = this.edges.find(
            (e) =>
              (e.node1.name === this.groupA[i].name && e.node2.name === this.groupB[j].name) ||
              (e.node1.name === this.groupB[j].name && e.node2.name === this.groupA[i].name),
          )
          row.push(edge ? Number(edge.weight) : INF)
        }
        matrix.push(row)
      }
      // Si se selecciona maximización, transformamos la matriz
      if (this.assignmentMode === 'max') {
        let maxVal = 0
        matrix.forEach((row) =>
          row.forEach((val) => {
            if (val < INF && val > maxVal) maxVal = val
          }),
        )
        for (let i = 0; i < matrix.length; i++) {
          for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < INF) {
              matrix[i][j] = maxVal - matrix[i][j]
            }
          }
        }
      }
      this.assignmentMatrix = matrix
    },

    // Implementación simple del Algoritmo Húngaro
    hungarianAlgorithm(matrix) {
      // Esta implementación es para fines demostrativos.
      // Se espera que matrix sea un arreglo 2D.
      // Retorna un objeto { cost, assignment }.
      const n = matrix.length
      const m = matrix[0].length
      // Para simplicidad, asumimos n === m, de lo contrario se debe ajustar.
      const u = Array(n + 1).fill(0)
      const v = Array(m + 1).fill(0)
      const p = Array(m + 1).fill(0)
      const way = Array(m + 1).fill(0)

      for (let i = 1; i <= n; i++) {
        p[0] = i
        let minv = Array(m + 1).fill(1e9)
        const used = Array(m + 1).fill(false)
        let j0 = 0
        do {
          used[j0] = true
          const i0 = p[j0]
          let delta = 1e9
          let j1 = 0
          for (let j = 1; j <= m; j++) {
            if (!used[j]) {
              const cur = matrix[i0 - 1][j - 1] - u[i0] - v[j]
              if (cur < minv[j]) {
                minv[j] = cur
                way[j] = j0
              }
              if (minv[j] < delta) {
                delta = minv[j]
                j1 = j
              }
            }
          }
          for (let j = 0; j <= m; j++) {
            if (used[j]) {
              u[p[j]] += delta
              v[j] -= delta
            } else {
              minv[j] -= delta
            }
          }
          j0 = j1
        } while (p[j0] !== 0)
        do {
          const j1 = way[j0]
          p[j0] = p[j1]
          j0 = j1
        } while (j0)
      }
      const assignment = Array(n).fill(0)
      for (let j = 1; j <= m; j++) {
        assignment[p[j] - 1] = j - 1
      }
      const cost = -v[0]
      return { cost, assignment }
    },

    closeAssignmentModal() {
      this.showAssignmentModal = false
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
  background: #41658a;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
}

.content {
  flex-grow: 1;
  background: #e0f5e4;
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
  background: #f0b67f;
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
  background: #336699;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: white;
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
  transition: background 0.3s;
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
  background: #558ebc;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background 0.3s,
    transform 0.2s;
  font-size: 14px;
  font-weight: bold;
}

.menu-button.import-button:hover,
.menu-button.export-button:hover {
  background: #4a78a2;
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
  stroke: #ff0000;
}
/*sidebar*/
.sidebar {
  width: 150px;
  height: 60%;
  background: #f0b67f;
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
  background-color: #336699;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition:
    background 0.3s,
    transform 0.2s;
}
.sidebar-button:hover {
  background-color: #4a78a2;
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
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
}
.matrix-container {
  overflow-x: auto;
  margin-bottom: 10px;
}
.matrix-container table {
  border-collapse: collapse;
  width: 100%;
}
.matrix-container th,
.matrix-container td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.assignment-result ul {
  list-style: none;
  padding: 0;
}
.close-button {
  background: #d776e4;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
.close-button:hover {
  background: #c06ab8;
}
</style>
