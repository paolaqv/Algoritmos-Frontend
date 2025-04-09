<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <button class="btn btn-outline-info position-absolute top-0 start-0 m-2" @click="showHelp = true">
        <i class="fas fa-info-circle"></i>
      </button>
      <HelpNorthWest v-if="showHelp" @skip="showHelp = false" />

      <div class="d-flex justify-content-between align-items-center mb-4  mt-2">
        <div>
          <h2 class="text-primary">Algoritmo North West</h2>
          <h5 class="text-secondary">Llene la tabla de costos:</h5>
        </div>
        <div>
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" id="maximizeSwitch" v-model="maximize" />
            <label :class="{ 'text-success': maximize, 'text-info': !maximize }" class="form-check-label" for="maximizeSwitch">
              {{ maximize ? "Maximizar" : "Minimizar" }}
            </label>
          </div>
          <button class="btn btn-success" @click="solveNorthWest">Resolver</button>
          <button class="btn btn-danger ms-2" @click="$emit('close')">Cerrar</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-hover bg-light table-bordered border-primary text-center">
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
              <input
                v-if="rowIndex !== 0 && cellIndex !== 0"
                type="text"
                class="form-control text-center editable-cell"
                v-model="tableData[rowIndex][cellIndex]"
              />
              <p
                v-else-if="cellIndex === tableData[rowIndex].length - 1 || rowIndex === tableData.length - 1"
                class="bg-warning"
              >{{ tableData[rowIndex][cellIndex] }}</p>
              <input
                v-else-if="rowIndex === 0 && cellIndex === row.length - 1"
                type="text"
                class="form-control text-center"
                v-model="tableData[rowIndex][cellIndex]"
                value="Oferta"
                readonly
              />
              <input
                v-else-if="rowIndex === 0 && cellIndex === 0"
                type="text"
                class="form-control text-center"
                v-model="tableData[rowIndex][cellIndex]"
                readonly
              />
              <input
                v-else
                type="text"
                class="form-control text-center bg-success text-white"
                v-model="tableData[rowIndex][cellIndex]"
              />
            </td>
            <td class="bg-info">
              <button class="btn btn-danger" v-if="rowIndex !== 0 && rowIndex !== tableData.length - 1" @click="removeRow(rowIndex)">
                &#x2716;
              </button>
            </td>
          </tr>
          <tr>
            <td v-for="(cell, cellIndex) in tableData[0]" :key="cellIndex" class="bg-info">
              <button
                class="btn btn-danger"
                v-if="cellIndex !== 0 && cellIndex !== tableData[0].length - 1"
                @click="removeColumn(cellIndex)"
              >&#x2716;</button>
            </td>
          </tr>
        </table>
        <button class="btn btn-primary me-3" @click="addRow">Añadir Fila</button>
        <button class="btn btn-secondary" @click="addColumn">Añadir Columna</button>
      </div>

      <div v-if="solution">
        <h3 class="mt-4">Solución</h3>
        <p><strong>Estado:</strong> {{ solution.status }}</p>
        <p><strong>Objetivo:</strong> {{ solution.objective }}</p>

        <table class="table table-bordered text-center mt-3">
          <thead class="table-info">
            <tr>
              <th></th>
              <th v-for="target in solution.targets" :key="target">{{ target }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="origin in solution.origins" :key="origin">
              <th class="table-warning">{{ origin }}</th>
              <td v-for="target in solution.targets" :key="target">
                {{ solution.solution[origin][target] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import HelpNorthWest from './HelpNorthWest.vue'


export default {
  props: ['nodes', 'edges'],
  components: { HelpNorthWest },

  data() {
    return {
      maximize: false,
      tableData: [],
      solution: null,
      showHelp: false

    }
  },
  watch: {
    nodes: 'buildTable',
    edges: 'buildTable'
  },
  methods: {
    buildTable() {
      const nodeMap = new Map(this.nodes.map(n => [n.id, n.name]))
      const edgeList = this.edges.map(e => ({
        source: nodeMap.get(e.node1.id),
        target: nodeMap.get(e.node2.id),
        label: parseInt(e.weight)
      }))

      const sources = [...new Set(edgeList.map(e => e.source))]
      const targets = [...new Set(edgeList.map(e => e.target))]

      let wasFilled = false

      const costMatrix = sources.map(source => {
        const row = [source]
        targets.forEach(target => {
          const edge = edgeList.find(e => e.source === source && e.target === target)
          if (!edge) wasFilled = true
          row.push(edge ? edge.label : '')
        })
        row.push(0)
        return row
      })

      const header = [''].concat(targets).concat('Oferta')
      const demandRow = ['Demanda', ...new Array(targets.length).fill(0)]
      this.tableData = [header, ...costMatrix, demandRow]

      if (wasFilled) {
        Swal.fire({
          icon: 'info',
          title: 'Tabla generada',
          text: 'Se han rellenado algunas celdas faltantes con valor vacío para aplicar correctamente el algoritmo North West.',
          timer: 3000,
          showConfirmButton: false
        })
      }
    },
    validateTable() {
      const rows = this.tableData.slice(1, -1)
      const supply = rows.map(r => r[r.length - 1])
      const demand = this.tableData[this.tableData.length - 1].slice(1)
      const costs = rows.map(r => r.slice(1, -1))

      const hasEmpty = costs.some(row => row.some(cell => cell === '' || isNaN(cell))) ||
        supply.some(s => s === '' || isNaN(s)) ||
        demand.some(d => d === '' || isNaN(d))

      if (hasEmpty) {
        Swal.fire({
          icon: 'error',
          title: 'Datos incompletos',
          text: 'Todas las celdas de la tabla deben tener valores numéricos.'
        })
        return false
      }

      const totalSupply = supply.reduce((acc, v) => acc + Number(v), 0)
      const totalDemand = demand.reduce((acc, v) => acc + Number(v), 0)

      if (totalSupply !== totalDemand) {
        Swal.fire({
          icon: 'warning',
          title: 'Oferta ≠ Demanda',
          text: `La suma de oferta (${totalSupply}) debe ser igual a la suma de demanda (${totalDemand}).`
        })
        return false
      }

      return true
    },
    solveNorthWest() {
      if (!this.validateTable()) return

      const targets = this.tableData[0].slice(1, -1)
      const origins = this.tableData.slice(1, -1).map(row => row[0])
      const costs = this.tableData.slice(1, -1).map(row => row.slice(1, -1).map(Number))
      const supplyArr = this.tableData.slice(1, -1).map(row => Number(row[row.length - 1]))
      const demandArr = this.tableData[this.tableData.length - 1].slice(1).map(Number)

      const supply = Object.fromEntries(origins.map((o, i) => [o, supplyArr[i]]))
      const demand = Object.fromEntries(targets.map((t, i) => [t, demandArr[i]]))

      const payload = {
        Origins: origins,
        Targets: targets,
        supply,
        demand,
        costs
      }

      axios.post(`http://127.0.0.1:5000/graph/northwest?maximize=${this.maximize}`, payload)
        .then(res => {
          this.solution = res.data
        })
        .catch(err => {
          console.error('Error al resolver:', err)
          Swal.fire({
            icon: 'error',
            title: 'Error al resolver',
            text: 'Verifica los datos o intenta nuevamente.'
          })
        })
    },
    addRow() {
      const columns = this.tableData[0].length
      const newRow = new Array(columns).fill("")
      this.tableData.splice(this.tableData.length - 1, 0, newRow)
    },
    addColumn() {
      this.tableData.forEach((row, index) => {
        if (index === 0 || index === this.tableData.length - 1) {
          row.splice(row.length, 0, '')
        } else {
          row.splice(row.length - 1, 0, '')
        }
      })
    },
    removeRow(index) {
      this.tableData.splice(index, 1)
    },
    removeColumn(cellIndex) {
      this.tableData.forEach(row => row.splice(cellIndex, 1))
    },
  },
  mounted() {
    this.buildTable()
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.popup-content {
  background: white;
  padding: 20px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 10px;
}
.editable-cell {
  background-color: #fff3cd !important;
}
</style>
