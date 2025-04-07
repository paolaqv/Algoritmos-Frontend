<template>
  <div class="matrix-popup" :style="popupStyle">
    <div class="matrix-popup-header" @mousedown="onHeaderMouseDown">
      <span>Caminos más cortos (Johnson)</span>
      <button class="close-button" @click="closePopup">X</button>
    </div>
    <div class="matrix-popup-content">
      <div class="graph-container">
        <!-- Nodos (movibles) -->
        <div
          v-for="(node, index) in nodes"
          :key="index"
          :id="`node-${node.name}`"
          class="node"
          :style="{ top: node.y + 'px', left: node.x + 'px', backgroundColor: node.color }"
          @mousedown="startDrag($event, node)"
        >
          {{ node.name }}
        </div>

        <!-- Aristas -->
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
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          <g v-for="(edge, index) in edges" :key="index" :id="`edge-${edge.node1.name}-${edge.node2.name}`">
            <!-- Línea de la arista -->
            <path
              :d="generateEdgePath(edge)"
              :stroke="edge.color"
              fill="none"
              stroke-width="2"
              :marker-end="edge.direction === 'directed' ? 'url(#arrow)' : ''"
              class="edge-path"
            />

            <!-- Early Start (azul): desde el nodo de origen -->
            <text
              :x="getEdgeLabelPosition(edge, 'earlyStart').x"
              :y="getEdgeLabelPosition(edge, 'earlyStart').y"
              fill="blue"
              font-size="11"
              text-anchor="middle"
            >
              {{ noDecimals(edge.earlyStart) }}
            </text>

            <!-- Early Finish (azul): desde el nodo de destino -->
            <text
              :x="getEdgeLabelPosition(edge, 'earlyFinish').x"
              :y="getEdgeLabelPosition(edge, 'earlyFinish').y"
              fill="blue"
              font-size="11"
              text-anchor="middle"
            >
              {{ noDecimals(edge.earlyFinish) }}
            </text>

            <!-- Late Start (rojo): desde el nodo de origen -->
            <text
              :x="getEdgeLabelPosition(edge, 'lateStart').x"
              :y="getEdgeLabelPosition(edge, 'lateStart').y"
              fill="red"
              font-size="11"
              text-anchor="middle"
            >
              {{ noDecimals(edge.lateStart) }}
            </text>

            <!-- Late Finish (rojo): desde el nodo de destino -->
            <text
              :x="getEdgeLabelPosition(edge, 'lateFinish').x"
              :y="getEdgeLabelPosition(edge, 'lateFinish').y"
              fill="red"
              font-size="11"
              text-anchor="middle"
            >
              {{ noDecimals(edge.lateFinish) }}
            </text>

            <!-- Peso de la arista (centrado, arriba) -->
            <text
              :x="(edge.calculated.x1 + edge.calculated.x2) / 2"
              :y="(edge.calculated.y1 + edge.calculated.y2) / 2 - 20"
              fill="black"
              font-size="11"
              text-anchor="middle"
            >
              {{ noDecimals(edge.label) }}
            </text>

            <!-- Primera h (centrado, justo debajo del peso) -->
            <text
              :x="(edge.calculated.x1 + edge.calculated.x2) / 2"
              :y="(edge.calculated.y1 + edge.calculated.y2) / 2 - 5"
              fill="black"
              font-size="11"
              text-anchor="middle"
            >
              h = {{ noDecimals(edge.hValue) }}
            </text>

            <!-- Segunda h (centrado, un poco más abajo) -->
            <text
              :x="(edge.calculated.x1 + edge.calculated.x2) / 2"
              :y="(edge.calculated.y1 + edge.calculated.y2) / 2 + 10"
              fill="black"
              font-size="11"
              text-anchor="middle"
            >
              h = {{ noDecimals(edge.hValue) }}
            </text>
          </g>
        </svg>
      </div>
    </div>
    <!-- Al final de .matrix-popup-content, justo antes de <div class="resizer"> -->
<div class="critical-path-container" ref="criticalPathContainer">
  <p><strong>Ruta Crítica:</strong> {{ results.critical_path.join(' -> ') }}</p>
</div>

    <div class="resizer" @mousedown="startResizing"></div>
  </div>
</template>

<script>
import { animateGraphCriticalPath } from '@/animations/animateGraphCriticalPath';

export default {
  name: 'JohnsonPopup',
  props: {
    nodes: Array,
    edges: Array,
    popupStyle: Object,
    results: Object, // Respuesta del backend
  },
  data() {
    return {
      draggingNode: null,
      dragOffsetX: 0,
      dragOffsetY: 0,
    };
  },
  mounted() {
    console.log("Respuesta del backend:", this.results);
    this.applyBackendResults();
    if (this.results && this.results.critical_path) {
      animateGraphCriticalPath(this.results.critical_path);
    }
  },
  methods: {
    noDecimals(value) {
      if (value === undefined || value === null) return 0;
      return parseInt(value);
    },
    getTextPosition(x1, y1, x2, y2, distAlong = 10, distNormal = -10) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / length;
      const uy = dy / length;
      const nx = -uy;
      const ny = ux;
      const px = x1 + ux * distAlong + nx * distNormal;
      const py = y1 + uy * distAlong + ny * distNormal;
      return { x: px, y: py };
    },

    getEdgeLabelPosition(edge, type) {
      let distAlong, distNormal;
      let origin, dest;
      if (type === 'earlyStart') {
        distAlong = 4;      // Ajusta este valor para que el label quede cerca del nodo de origen
        distNormal = -2;    // Negativo para colocarlo "ligeramente arriba"
        origin = { x: edge.calculated.x1, y: edge.calculated.y1 };
        dest = { x: edge.calculated.x2, y: edge.calculated.y2 };
      } else if (type === 'earlyFinish') {
        distAlong = 5;
        distNormal = 5;
        origin = { x: edge.calculated.x2, y: edge.calculated.y2 };
        dest = { x: edge.calculated.x1, y: edge.calculated.y1 };
      } else if (type === 'lateStart') {
        distAlong = 1;
        distNormal = 15;     // Positivo para "ligeramente debajo"
        origin = { x: edge.calculated.x1, y: edge.calculated.y1 };
        dest = { x: edge.calculated.x2, y: edge.calculated.y2 };
      } else if (type === 'lateFinish') {
        distAlong = 5;
        distNormal = -15;
        origin = { x: edge.calculated.x2, y: edge.calculated.y2 };
        dest = { x: edge.calculated.x1, y: edge.calculated.y1 };
      }
      return this.getTextPosition(origin.x, origin.y, dest.x, dest.y, distAlong, distNormal);
    },

    applyBackendResults() {
      if (!this.results || !this.results.edges) return;
      Object.values(this.results.edges).forEach((backendEdge) => {
        const foundEdge = this.edges.find(
          (e) =>
            e.node1.name === backendEdge.source &&
            e.node2.name === backendEdge.target
        );
        if (foundEdge) {
          foundEdge.earlyStart = backendEdge.earlyStart;
          foundEdge.earlyFinish = backendEdge.earlyFinish;
          foundEdge.lateStart = backendEdge.lateStart;
          foundEdge.lateFinish = backendEdge.lateFinish;
          const parts = backendEdge.label.split("\n");
          foundEdge.label = parts[0] ? parts[0].trim() : "0";
          if (parts[1]) {
            const splitted = parts[1].split("=");
            foundEdge.hValue = splitted[1] ? splitted[1].trim() : "0";
          } else {
            foundEdge.hValue = "0";
          }
        }
      });
    },
    

    // Genera la ruta de la arista (soporta self-loop y aristas normales)
    generateEdgePath(edge) {
  const { x1, y1, x2, y2 } = edge.calculated;
  return `M ${x1} ${y1} L ${x2} ${y2}`;
},

    // Calcula la posición de la arista según la posición de los nodos
    calculateEdgePosition(node1, node2) {
      const radius = 22.5;
      if (node1 === node2) {
        let selfLoopCount = this.edges.filter(e => e.node1 === node1 && e.node2 === node1).length;
        let offsetFactor = 20 + selfLoopCount * 10;
        return {
          selfLoop: true,
          x1: node1.x + radius,
          y1: node1.y,
          x2: node1.x,
          y2: node1.y - radius,
          offset: offsetFactor,
        };
      }
      const dx = node2.x - node1.x;
      const dy = node2.y - node1.y;
      const angle = Math.atan2(dy, dx);
      return {
        x1: node1.x + Math.cos(angle) * radius,
        y1: node1.y + Math.sin(angle) * radius,
        x2: node2.x - Math.cos(angle) * radius,
        y2: node2.y - Math.sin(angle) * radius,
      };
    },

    // Inicia el arrastre de un nodo
    startDrag(event, node) {
      event.stopPropagation();
      this.draggingNode = node;
      const rect = event.currentTarget.getBoundingClientRect();
      this.dragOffsetX = event.clientX - rect.left;
      this.dragOffsetY = event.clientY - rect.top;
      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.endDrag);
    },

    // Mueve el nodo y recalcula las aristas conectadas
    onDrag(event) {
      if (this.draggingNode) {
        const popupRect = this.$el.getBoundingClientRect();
        let newX = event.clientX - popupRect.left - this.dragOffsetX;
        let newY = event.clientY - popupRect.top - this.dragOffsetY;
        this.draggingNode.x = newX;
        this.draggingNode.y = newY;
        this.edges.forEach(edge => {
          if (edge.node1 === this.draggingNode || edge.node2 === this.draggingNode) {
            edge.calculated = this.calculateEdgePosition(edge.node1, edge.node2);
          }
        });
      }
    },

    // Finaliza el arrastre
    endDrag() {
      this.draggingNode = null;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.endDrag);
    },

    closePopup() {
      this.$emit("close");
    },
    onHeaderMouseDown(event) {
      this.$emit("start-drag", event);
    },
    startResizing(event) {
      this.$emit("start-resize", event);
    },
  },
};
</script>

<style scoped>
.resizer {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  cursor: se-resize;
  background-color: #c64d4d;
}
.matrix-popup {
  position: absolute;
  border: 1px solid #ccc;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.matrix-popup-header {
  display: flex;
  justify-content: space-between;
  background-color: #f0f0f0;
  padding: 10px;
  cursor: move;
  user-select: none;
}
.matrix-popup-content {
  flex-grow: 1;
  position: relative;
  overflow: auto;
}
.close-button {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.graph-container {
  position: relative;
  width: 100%;
  height: 100%;
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
.edge-path {
  pointer-events: stroke;
}
.critical-path-container {
  padding: 10px;
  background-color: #f9f9f9;
  border-top: 1px solid #ccc;
  text-align: center;
}
</style>
