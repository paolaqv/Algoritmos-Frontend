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
          <line
            :x1="edge.calculated.x1"
            :y1="edge.calculated.y1"
            :x2="edge.calculated.x2"
            :y2="edge.calculated.y2"
            :stroke="edge.color"
            stroke-width="2"
            :marker-end="edge.direction === 'directed' ? 'url(#arrow)' : ''"
          />
          <text
            :x="(edge.calculated.x1 + edge.calculated.x2) / 2"
            :y="(edge.calculated.y1 + edge.calculated.y2) / 2 - 5"
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
      <button class="menu-button add-button" :class="{ active: isAddingNode }" @click="toggleAddNode" title="Agregar nodo">
        <i class="fas fa-plus"></i>
      </button>
      <button class="menu-button link-button" :class="{ active: isLinking }" @click="toggleLinking" title="Enlazar">
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
    </footer>
    
    <!-- Popup para agregar nodo -->
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

    <!-- Popup para agregar arista -->
    <div v-if="showEdgePopup" class="popup">
      <div class="popup-content">
        <label>Peso de la arista:</label>
        <input type="number" v-model="edgeWeight" placeholder="Ingrese peso..." />
        
        <label>Dirección:</label>
        <select v-model="edgeDirection">
          <option value="bidirectional">Bidireccional</option>
          <option value="directed">Direccional</option>
        </select>
        
        <label>Color de la arista:</label>
        <input type="color" v-model="edgeColor" />
        
        <div class="popup-buttons">
          <button class="cancel-button" @click="cancelEdgePopup">Cancelar</button>
          <button class="accept-button" @click="confirmEdge">Aceptar</button>
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
      isMovingNode: false
    };
  },
  methods: {
    handleNodeClick(node, index) {
      // Si estás en modo eliminar, se llama a la función de borrado
      if (this.isDeletingNode) {
        this.confirmDeleteNode(index);
      } 
      // Si estás en modo enlazar/seleccionar, llama a selectNode
      else if (this.isLinking) {
        this.selectNode(node);
      } 
      // Si quieres contemplar otros modos, agrégalos aquí
      else {
        console.log("Click en nodo, pero no estamos en modo eliminar ni enlazar.");
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
    toggleAddNode() {
      this.isAddingNode = !this.isAddingNode;
      this.isDeletingNode = false; // Desactiva la opción de eliminar si se activa añadir
    },
    toggleDeleteMode() {
      this.isDeletingNode = !this.isDeletingNode;
      this.isAddingNode = false; // Desactiva la opción de añadir si se activa eliminar
      this.isLinking = false;

    },
    toggleLinking() {
      this.isLinking = !this.isLinking;
      this.selectedNodes = [];
      this.isAddingNode = false;
      this.isAddingNode = false;
    },

    toggleMoveMode() {
      this.isMovingNode = !this.isMovingNode;
      this.isAddingNode = false;
      this.isDeletingNode = false;
      this.isLinking = false;
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
          node1: { x: node1.x, y: node1.y },
          node2: { x: node2.x, y: node2.y },
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
            edge.calculated = this.calculateEdgePosition(
              this.nodes.find(n => n.x === edge.node1.x && n.y === edge.node1.y),
              this.nodes.find(n => n.x === edge.node2.x && n.y === edge.node2.y)
            );
          }
        });
      }
    },

    // Stop dragging
    endDrag() {
      this.draggingNode = null;
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
  background: #C7EFCF;
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
</style>
