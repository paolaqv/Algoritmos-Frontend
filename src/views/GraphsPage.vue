<template>
  <div class="graphs-page">
    <aside class="sidebar"></aside>
    <main class="content" @click="openNodePopup">
      <div v-for="(node, index) in nodes" :key="index" class="node" :style="{ top: node.y + 'px', left: node.x + 'px', backgroundColor: node.color }">
        {{ node.name }}
      </div>
    </main>
    <footer class="bottom-bar">
      <button class="menu-button add-button" :class="{ active: isAddingNode }" @click="toggleAddNode" title="Agregar nodo">
        <i class="fas fa-plus"></i>
      </button>
      <button class="menu-button delete-button" title="Eliminar">
        <i class="fas fa-trash"></i>
      </button>
      <button class="menu-button move-button" title="Mover">
        <i class="fas fa-arrows-alt"></i>
      </button>
    </footer>
    
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <label>Nombre del nodo:</label>
        <input type="text" v-model="nodeName" placeholder="Ingrese nombre..."/>
        <label>Color del nodo:</label>
        <div class="color-picker-container">
          <input type="color" v-model="nodeColor" @change="closeColorPicker" class="color-picker"/>
        </div>
        <div class="popup-buttons">
          <button class="cancel-button" @click="cancelPopup">Cancelar</button>
          <button class="accept-button" @click="confirmNode">Aceptar</button>
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
      nodes: [],
      showPopup: false,
      nodeName: '',
      nodeColor: '#ff0000',
      tempNodePosition: { x: 0, y: 0 }
    };
  },
  methods: {
    toggleAddNode() {
      this.isAddingNode = !this.isAddingNode;
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
  border-radius: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
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
</style>
