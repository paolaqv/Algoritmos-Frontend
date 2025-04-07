<template>
  <div class="matrix-popup" :style="popupStyle">
    <div class="matrix-popup-header" @mousedown="onHeaderMouseDown">
      <span>Caminos más cortos (Johnson)</span>
      <button class="close-button" @click="closePopup">X</button>
    </div>
    <div class="matrix-popup-content">
      <div v-if="matrix.length && cleanNodes.length === matrix.length">
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Origen \ Destino</th>
              <th v-for="(node, index) in cleanNodes" :key="index">{{ node.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in matrix" :key="i">
              <th>{{ cleanNodes[i].name }}</th>
              <td v-for="(cell, j) in row" :key="j">
                {{ cell === Infinity ? '∞' : cell }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="conclusion">
          <p>
            <strong>Conclusión:</strong> El algoritmo de Johnson ha calculado los caminos más cortos entre todos los pares de nodos. Por ejemplo, desde <strong>{{ cleanNodes[0].name }}</strong> hasta <strong>{{ cleanNodes[cleanNodes.length-1].name }}</strong> el costo es <strong>{{ matrix[0][cleanNodes.length-1] === Infinity ? '∞' : matrix[0][cleanNodes.length-1] }}</strong>.
          </p>
        </div>
      </div>
      <div v-else>
        <p>No se han calculado resultados.</p>
      </div>
    </div>
    <div class="resizer" @mousedown="startResizing"></div>
  </div>
</template>

<script>
export default {
  name: 'JohnsonPopup',
  props: {
    nodes: {
      type: Array,
      required: true
    },
    results: {
      type: Object,
      default: () => ({})
    },
    popupStyle: {
      type: Object,
      default: () => ({
        top: '50px',
        left: '50px',
        width: '400px',
        height: '300px'
      })
    }
  },
  computed: {
    // Devuelve los nodos con el nombre limpio (sin comillas ni espacios extra)
    cleanNodes() {
      if (!this.nodes || !this.nodes.length) return [];
      return this.nodes.map(node => ({
        ...node,
        name: (node.name || '').replace(/"/g, '').trim()
      }));
    },
    // Construye la matriz de distancias usando los nombres limpios y el objeto results
    matrix() {
      const m = [];
      const nodes = this.cleanNodes;
      if (!nodes.length || !this.results || Object.keys(this.results).length === 0) return m;
      nodes.forEach(origin => {
        const row = [];
        nodes.forEach(dest => {
          const originResults = this.results.distances?.[origin.name] || {};
          let value = Infinity;
          if (originResults !== undefined && originResults[dest.name] !== undefined) {
            value = originResults[dest.name];
          }
          row.push(value);
        });
        m.push(row);
      });
      return m;
    }
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    onHeaderMouseDown(event) {
      this.$emit('start-drag', event);
    },
    startResizing(event) {
      this.$emit('start-resize', event);
    }
  }
};
</script>

<style scoped>
.matrix-popup {
  position: absolute;
  background: #fff;
  border: 1px solid #ccc;
  z-index: 1000;
}
.matrix-popup-header {
  background: #f0f0f0;
  padding: 5px;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-button {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.matrix-popup-content {
  padding: 10px;
}
.resizer {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #ccc;
  bottom: 0;
  right: 0;
  cursor: se-resize;
}
.conclusion {
  margin-top: 15px;
  padding: 10px;
  background: #e7f3fe;
  border: 1px solid #b3d8fd;
  font-size: 14px;
}
</style>
