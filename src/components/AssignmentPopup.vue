<template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-tabs-with-help">
          <div class="modal-tabs">
            <button @click="activeTab = 'min'" :class="{ active: activeTab === 'min' }">
              Minimización
            </button>
            <button @click="activeTab = 'max'" :class="{ active: activeTab === 'max' }">
              Maximización
            </button>
          </div>
          <button class="help-icon-button" @click="showHelpAssignment = true" title="Guía de asignación">❓</button>
        </div>
  
        <h2>
          Resultado de la Asignación ({{ activeTab === 'min' ? 'Minimizar' : 'Maximizar' }})
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
                <td
                  v-for="(nodeB, j) in groupB"
                  :key="j"
                  :class="{ 'highlight-cell': isOptimal(i, j, activeTab) }"
                >
                  {{
                    activeTab === 'min'
                      ? results.min.originalMatrix[i][j]
                      : results.max.maxVal - results.max.originalMatrix[i][j]
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="assignment-result">
          <p>
            <strong>Costo Total:</strong> {{ results[activeTab].totalCost }}
          </p>
          <p><strong>Asignaciones Óptimas:</strong></p>
          <ul>
            <li v-for="(pair, index) in results[activeTab].optimalAssignment" :key="index">
              {{ pair.nodeA.name }} → {{ pair.nodeB.name }} (Costo: {{ pair.cost }})
            </li>
          </ul>
        </div>
        <button class="close-button" @click="$emit('close')">Cerrar</button>
      </div>
    </div>
    <HelpAssignmentPopup v-if="showHelpAssignment" @skip="showHelpAssignment = false" />
  </template>
  
  <script>
  import HelpAssignmentPopup from './HelpAssignmentPopup.vue'
  
  export default {
    name: 'AssignmentPopup',
    props: ['nodes', 'edges'],
    components: { HelpAssignmentPopup },
    data() {
      return {
        activeTab: 'min',
        groupA: [],
        groupB: [],
        results: { min: {}, max: {} },
        showHelpAssignment: false,
      }
    },
    mounted() {
      if (!this.detectGroups()) return
      const minMatrix = this.buildMatrix('min')
      const minResult = this.hungarian(minMatrix.matrix)
      const minAssignment = this.formatAssignment(minResult.assignment, minMatrix.originalMatrix, 'min')
  
      const maxMatrix = this.buildMatrix('max')
      const maxResult = this.hungarian(maxMatrix.matrix)
      const maxAssignment = this.formatAssignment(maxResult.assignment, maxMatrix.originalMatrix, 'max', maxMatrix.maxVal)
  
      this.results = {
        min: {
          matrix: minMatrix.matrix,
          originalMatrix: minMatrix.originalMatrix,
          totalCost: minResult.cost,
          optimalAssignment: minAssignment
        },
        max: {
          matrix: maxMatrix.matrix,
          originalMatrix: maxMatrix.originalMatrix,
          maxVal: maxMatrix.maxVal,
          totalCost: maxAssignment.reduce((sum, pair) => sum + pair.cost, 0),
          optimalAssignment: maxAssignment
        }
      }
    },
    methods: {
      detectGroups() {
        const color = {}, queue = []
        if (!this.nodes.length) return false
        color[this.nodes[0].name] = 0
        queue.push(this.nodes[0])
        while (queue.length) {
          const node = queue.shift()
          const neighbors = this.edges.reduce((acc, e) => {
            if (e.node1.name === node.name) acc.push(e.node2)
            else if (e.node2.name === node.name) acc.push(e.node1)
            return acc
          }, [])
          for (const n of neighbors) {
            if (color[n.name] === undefined) {
              color[n.name] = 1 - color[node.name]
              queue.push(n)
            } else if (color[n.name] === color[node.name]) {
              return false
            }
          }
        }
        this.groupA = this.nodes.filter(n => color[n.name] === 0)
        this.groupB = this.nodes.filter(n => color[n.name] === 1)
        return this.groupA.length > 0 && this.groupB.length > 0
      },
      buildMatrix(mode) {
        const INF = 1e9
        const originalMatrix = this.groupA.map(a =>
          this.groupB.map(b => {
            const edge = this.edges.find(
              e => (e.node1.name === a.name && e.node2.name === b.name) ||
                   (e.node1.name === b.name && e.node2.name === a.name)
            )
            return edge ? Number(edge.weight) : INF
          })
        )
  
        if (mode === 'max') {
          let maxVal = 0
          originalMatrix.forEach(row => row.forEach(val => { if (val < INF) maxVal = Math.max(maxVal, val) }))
          const matrix = originalMatrix.map(row => row.map(val => (val < INF ? maxVal - val : val)))
          return { matrix, originalMatrix, maxVal }
        }
  
        return { matrix: originalMatrix.map(row => [...row]), originalMatrix }
      },
      formatAssignment(assignment, matrix, mode, maxVal = 0) {
        return assignment.map((j, i) => ({
          nodeA: this.groupA[i],
          nodeB: this.groupB[j],
          cost: mode === 'max' ? maxVal - matrix[i][j] : matrix[i][j],
          i, j
        }))
      },
      isOptimal(i, j, mode) {
        return this.results[mode].optimalAssignment.some(p => p.i === i && p.j === j)
      },
      hungarian(matrix) {
        const n = matrix.length, m = matrix[0].length
        const u = Array(n + 1).fill(0), v = Array(m + 1).fill(0), p = Array(m + 1).fill(0), way = Array(m + 1).fill(0)
        for (let i = 1; i <= n; i++) {
          p[0] = i
          const minv = Array(m + 1).fill(1e9), used = Array(m + 1).fill(false)
          let j0 = 0
          do {
            used[j0] = true
            const i0 = p[j0]
            let delta = 1e9, j1 = 0
            for (let j = 1; j <= m; j++) {
              if (!used[j]) {
                const cur = matrix[i0 - 1][j - 1] - u[i0] - v[j]
                if (cur < minv[j]) minv[j] = cur, way[j] = j0
                if (minv[j] < delta) delta = minv[j], j1 = j
              }
            }
            for (let j = 0; j <= m; j++) {
              if (used[j]) u[p[j]] += delta, v[j] -= delta
              else minv[j] -= delta
            }
            j0 = j1
          } while (p[j0] !== 0)
          do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1 } while (j0)
        }
        const assignment = Array(n).fill(0)
        for (let j = 1; j <= m; j++) assignment[p[j] - 1] = j - 1
        return { cost: -v[0], assignment }
      }
    }
  }
  </script>
  
  <style scoped>
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
  .modal-tabs {
  display: flex;
  gap: 10px;
}
  .modal-tabs button {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background: #bee3db;
    color: #555b6e;
    transition: background 0.3s;
  }
  .modal-tabs button.active {
    background: #4a78a2;
    color: white;
  }
  .modal-tabs button:hover {
    background: #92cdc0;
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
  .highlight-cell {
    background-color: #c7efcf;
    font-weight: bold;
    color: #000;
    border: 2px solid #4a78a2;
  }
  .help-icon-button {
  background-color: #ffd166;
  color: #333;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.help-icon-button:hover {
  background-color: #f4a261;
  transform: scale(1.1);
}
.modal-tabs-with-help {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

  </style>
  