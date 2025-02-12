<template>
  <div class="graphs-page">
    <aside class="sidebar"></aside>
    <main class="content"></main>
    <footer class="bottom-bar">
      <button class="menu-button add-button" title="Agregar nodo">
        <i class="fas fa-plus"></i>
      </button>
      <button class="menu-button delete-button" title="Eliminar">
        <i class="fas fa-trash"></i>
      </button>
      <button class="menu-button move-button" title="Mover">
        <i class="fas fa-arrows-alt"></i>
      </button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'GraphsPage',
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
}

.menu-button:hover {
  background: #4a78a2;
}

.add-button {
  position: relative;
}

.add-button i {
  color: rgb(228, 228, 210);
  font-size: 24px;
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
  content: 'mover nodo';
  position: absolute;
  bottom: 50px;
  left: 57%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  white-space: nowrap;
}
</style>