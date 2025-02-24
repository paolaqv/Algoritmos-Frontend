<template>
  <div class="graphs-page">
    <aside class="sidebar"></aside>
    <main class="content" @click="openNodePopup">
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
          <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
          </marker>
        </defs>
        <g v-for="(edge, index) in edges" :key="index">
          @click="handleEdgeClick(edge, index, $event)"
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
    </main>

    <footer class="bottom-bar">
      <button class="menu-button add-button" 
      :class="{ active: isAddingNode }"
        @click="toggleAddNode" 
        title="Agregar nodo">
        <i class="fas fa-plus"></i>
      </button>
      <button class="menu-button link-button" 
      :class="{ active: isLinking }" 
        @click="toggleLinking" 
        title="Enlazar">
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
    </footer>
      <div class="import-export-buttons">
      <button class="menu-button import-button" @click="importData">Importar</button>
      <button class="menu-button export-button" @click="exportData">Exportar</button>
    </div>
    <input type="file" ref="fileInput" @change="handleFileImport" accept=".json" style="display: none;" />
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
export default {
  name: 'GraphsPage',
  data() {
    return {
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
    };
  },
  methods: {
    handleEdgeClick(edge, index, event) {
    event.stopPropagation();
    if (this.isEditing) {
      this.editingTarget = edge;
      this.editingType = 'edge';
      this.editEdgeWeight = edge.weight;
      this.editEdgeDirection = edge.direction;
      this.editEdgeColor = edge.color;
      this.editEdgeIndex = index;
      this.showEditEdgePopup = true;
    }
  },
    //calculo del radio para arista
    calculateEdgePosition(node1, node2) {
      const radius = 22.5; 
      const dx = node2.x - node1.x;
      const dy = node2.y - node1.y;
      const angle = Math.atan2(dy, dx);

      return {
        x1: node1.x + Math.cos(angle) * radius,
        y1: node1.y + Math.sin(angle) * radius,
        x2: node2.x - Math.cos(angle) * radius,
        y2: node2.y - Math.sin(angle) * radius
      };
    },
    generateEdgePath(edge) {
  const { x1, y1, x2, y2 } = edge.calculated;
  const offset = 20; //curva
  const { cpX, cpY } = this.getControlPoint(x1, y1, x2, y2, offset);
  return `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`;
},
    toggleAddNode() {
      this.isAddingNode = !this.isAddingNode;
      this.isDeletingNode = false; 
      this.isLinking = false;
      this.isMovingNode = false;

    },
    toggleDeleteMode() {
      this.isDeletingNode = !this.isDeletingNode;
      this.isAddingNode = false; 
      this.isLinking = false;
      this.isMovingNode = false;


    },
    toggleLinking() {
      this.isLinking = !this.isLinking;
      this.selectedNodes = [];
      this.isAddingNode = false;
      this.isMovingNode = false;
      this.isDeletingNode = false;
    },

    toggleMoveMode() {
      this.isMovingNode = !this.isMovingNode;
      this.isAddingNode = false;
      this.isDeletingNode = false;
      this.isLinking = false;
    },
    toggleEditingMode() {
  this.isEditing = !this.isEditing;
  if (this.isEditing) {
    this.isAddingNode = false;
    this.isLinking = false;
    this.isDeletingNode = false;
    this.isMovingNode = false;
  } else {
    this.editingTarget = null;
    this.editingType = '';
  }
},
handleNodeClick(node, index) {
  if (this.isEditing) {
    this.editingTarget = node;
    this.editingType = 'node';
    this.editNodeName = node.name;
    this.editNodeColor = node.color;
    this.editNodeIndex = index;
    this.showEditNodePopup = true;
    return; 
  }
  if (this.isDeletingNode) {
    this.confirmDeleteNode(index);
  } else if (this.isLinking) {
    this.selectNode(node);
  } else {
    console.log("Click en nodo, pero no estamos en modo eliminar ni enlazar.");
  }
},
    
    //seleccionar 2 nodos para la arista y popup
    selectNode(node) {
      if (this.isLinking) {
        if (!this.selectedNodes.includes(node)) {
          this.selectedNodes.push(node);
        }
        if (this.selectedNodes.length === 2) {
          this.showEdgePopup = true;
        }
      }
    },
    cancelEdgePopup() {
      this.showEdgePopup = false;
      this.selectedNodes = [];
    },
    confirmEdge() {
      if (this.selectedNodes.length === 2) {
        const node1 = this.selectedNodes[0];
        const node2 = this.selectedNodes[1];

        if (!node1 || !node2) {
          console.error("Error: No se han seleccionado nodos válidos.");
          return;
        }

        const calculatedPositions = this.calculateEdgePosition(node1, node2);

    this.edges.push({
      node1,          
      node2,         
      weight: this.edgeWeight,
      direction: this.edgeDirection,
      color: this.edgeColor,
      calculated: calculatedPositions
    });
      }
      this.showEdgePopup = false;
      this.selectedNodes = [];
    },
    openNodePopup(event) {
      if (this.isAddingNode) {
        const rect = event.currentTarget.getBoundingClientRect();
        this.tempNodePosition = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
        this.showPopup = true;
      }
    },
    closeColorPicker() {
      document.activeElement.blur();
    },
    cancelPopup() {
      this.showPopup = false;
    },
    confirmNode() {
      this.nodes.push({
        x: this.tempNodePosition.x,
        y: this.tempNodePosition.y,
        name: this.nodeName,
        color: this.nodeColor
      });
      this.showPopup = false;
      this.nodeName = '';
      this.nodeColor = '#ff0000';
    },
    confirmDeleteNode(index) {
      if (this.isDeletingNode) {
        this.nodeToDelete = index;
        this.showDeletePopup = true;
      }
    },
    deleteNode() {
      if (this.nodeToDelete !== null) {
        const deletedNode = this.nodes[this.nodeToDelete];

        this.nodes.splice(this.nodeToDelete, 1);
        this.edges = this.edges.filter(edge => {
          return !(
            (edge.node1.x === deletedNode.x && edge.node1.y === deletedNode.y) ||
            (edge.node2.x === deletedNode.x && edge.node2.y === deletedNode.y)
          );
        });
        this.nodeToDelete = null;
        this.showDeletePopup = false;
      }
    },
    cancelDelete() {
      this.showDeletePopup = false;
      this.nodeToDelete = null;
    },

    startDrag(event, node) {
      if (this.isMovingNode) {
        this.draggingNode = node;
        this.offsetX = event.clientX - node.x;
        this.offsetY = event.clientY - node.y;
      }
    },

    onDrag(event) {
      if (this.draggingNode) {
        this.draggingNode.x = event.clientX - this.offsetX;
        this.draggingNode.y = event.clientY - this.offsetY;

    this.edges.forEach(edge => {
      if (edge.node1 === this.draggingNode || edge.node2 === this.draggingNode) {
        edge.calculated = this.calculateEdgePosition(edge.node1, edge.node2);
      }
    });
      }
    },

    confirmEditNode() {
      if (this.editNodeIndex !== null) {
        this.nodes[this.editNodeIndex].name = this.editNodeName;
        this.nodes[this.editNodeIndex].color = this.editNodeColor;
      }
      this.showEditNodePopup = false;
      this.editingTarget = null;
      this.editingType = '';
      this.editNodeIndex = null;
      this.editNodeName = '';
      this.editNodeColor = '#ff0000';
    },
    cancelEditNode() {
      this.showEditNodePopup = false;
      this.editingTarget = null;
      this.editingType = '';
      this.editNodeIndex = null;
    },
    confirmEditEdge() {
      if (this.editEdgeIndex !== null) {
        this.edges[this.editEdgeIndex].weight = this.editEdgeWeight;
        this.edges[this.editEdgeIndex].direction = this.editEdgeDirection;
        this.edges[this.editEdgeIndex].color = this.editEdgeColor;
      }
      this.showEditEdgePopup = false;
      this.editingTarget = null;
      this.editingType = '';
      this.editEdgeIndex = null;
      this.editEdgeWeight = '1';
      this.editEdgeDirection = 'directed';
      this.editEdgeColor = '#000000';
    },
    cancelEditEdge() {
      this.showEditEdgePopup = false;
      this.editingTarget = null;
      this.editingType = '';
      this.editEdgeIndex = null;
    },
    endDrag() {
      this.dragenerateggingNode = null;
    },
    importData() {
    this.$refs.fileInput.click();
    },

    getControlPoint(x1, y1, x2, y2, offset) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    return { cpX: midX + nx * offset, cpY: midY + ny * offset };
    },
    generateEdgeLabelPosition(edge) {
      const { x1, y1, x2, y2 } = edge.calculated;
      const offset = 20;
      const { cpX, cpY } = this.getControlPoint(x1, y1, x2, y2, offset);
      const labelX = 0.25 * x1 + 0.5 * cpX + 0.25 * x2;
      const labelY = 0.25 * y1 + 0.5 * cpY + 0.25 * y2 - 10;
      return { labelX, labelY };
    },
    handleFileImport(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.nodes && data.edges) {
            // Actualiza el grafo con los datos importados
            this.nodes = data.nodes;
            this.edges = data.edges;
            console.log("Grafo importado exitosamente");
          } else {
            console.error("El archivo JSON no tiene el formato correcto.");
          }
        } catch (error) {
          console.error("Error al importar el archivo JSON:", error);
        }
      };
      reader.readAsText(file);
    },

    exportData() {
        const data = {
        nodes: this.nodes,
        edges: this.edges
      };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "graph-data.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },

      clearCanvas() {
      this.nodes = [];
      this.edges = [];
      this.selectedNodes = [];
    },
    }
  };
</script>

<style scoped>
.graphs-page {
  display: flex;
  width: 95vw;
  height: 95vh;
  background: #41658A;
  position: absolute;      
  top: 50%;               
  left: 50%;               
  transform: translate(-50%, -50%);  
  border-radius: 5px;
}


.sidebar {
  width: 150px;
  height: 60%;
  background: #F0B67F;
  margin: 20px;
  margin-top: 70px;
  border-radius: 10px;
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
  color: #D6D1B1;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  font-family: Arial, sans-serif;
  cursor: pointer;
}


.bottom-bar {
  height: 50px;
  background: #F0B67F;
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
  background: #C7EFCF;
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
  background: #41658A;
}

.accept-button {
  background: #F0B67F;
  color: white;
}

.accept-button:hover {
  background: #E26A2C;
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

/* Tooltips para los botones */
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
  width: 90px;          /* Ajusta el ancho para que se acomode al texto */
  height: 40px;         /* Altura adecuada para un botón interactivo */
  background: #558ebc;  /* Color base coherente con el resto de los botones */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
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
  transition: stroke 0.3s, stroke-width 0.3s;
}
.edge-path:hover {
  stroke-width: 3;
  /* Puedes cambiar el color o agregar otros efectos */
  stroke: #ff0000;
}


</style>
