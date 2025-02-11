<template>
  <div class="graphs-page">
    <aside class="sidebar"></aside>
    <main class="content" @click="openNodePopup">
      <div
        v-for="(node, index) in nodes"
        :key="index"
        class="node"
        :style="{ top: node.y + 'px', left: node.x + 'px', backgroundColor: node.color }"
        @click.stop="confirmDeleteNode(index)"
      >
        {{ node.name }}
      </div>
    </main>

    <footer class="bottom-bar">
      <button class="menu-button add-button" :class="{ active: isAddingNode }" @click="toggleAddNode" title="Agregar nodo">
        <i class="fas fa-plus"></i>
      </button>
      <button class="menu-button delete-button" :class="{ active: isDeletingNode }" @click="toggleDeleteMode" title="Eliminar nodo">
        <i class="fas fa-trash"></i>
      </button>
      <button class="menu-button move-button" title="Mover nodo">
        <i class="fas fa-arrows-alt"></i>
      </button>
    </footer>

    <!-- Modal para agregar nodo -->
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
      isDeletingNode: false, // Nuevo estado para eliminar nodos
      nodes: [],
      showPopup: false,
      showDeletePopup: false,
      nodeName: '',
      nodeColor: '#ff0000',
      tempNodePosition: { x: 0, y: 0 },
      nodeToDelete: null
    };
  },
  methods: {
    toggleAddNode() {
      this.isAddingNode = !this.isAddingNode;
      this.isDeletingNode = false; // Desactiva la opción de eliminar si se activa añadir
    },
    toggleDeleteMode() {
      this.isDeletingNode = !this.isDeletingNode;
      this.isAddingNode = false; // Desactiva la opción de añadir si se activa eliminar
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
        this.nodes.splice(this.nodeToDelete, 1);
        this.nodeToDelete = null;
        this.showDeletePopup = false;
      }
    },
    cancelDelete() {
      this.showDeletePopup = false;
      this.nodeToDelete = null;
    }
  }
};
</script>

<style scoped>
.graphs-page {
  display: flex;
  width: 95vw;
  height: 95vh;
  background: #2d5c88;
  position: relative;
  border-radius: 5px;
}

.sidebar {
  width: 150px;
  height: 60%;
  background: #1b3a5a;
  margin: 20px;
  margin-top: 70px;
  border-radius: 10px;
}

.content {
  flex-grow: 1;
  background: #f7f7f7;
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
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  font-family: Arial, sans-serif;
  cursor: pointer;
}

.bottom-bar {
  height: 50px;
  background: #1b3a5a;
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
  background: #d776e4;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgb(123, 160, 191);
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
  background: #4087ce;
}

.accept-button {
  background: #aa5cb8;
  color: white;
}

.accept-button:hover {
  background: #884394;
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
</style>
