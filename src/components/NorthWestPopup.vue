<template>
  <div class="popup-overlay">
    <div class="popup-content">
      <button class="btn btn-outline-info position-absolute top-0 start-0 m-2" @click="showHelp = true">
        <i class="fas fa-info-circle"></i>
      </button>
      <HelpNorthWest v-if="showHelp" @skip="showHelp = false" />

      <div class="header-container">
        <div>
          <h2>Algoritmo North West</h2>
          <h5>Llene la tabla de costos:</h5>
        </div>
        <div class="actions">
          <div class="form-check form-switch mb-2">
            <input class="form-check-input" type="checkbox" id="maximizeSwitch" v-model="maximize" />
            <label :class="{ 'text-maximize': maximize, 'text-minimize': !maximize }" class="form-check-label" for="maximizeSwitch">
              {{ maximize ? "Maximizar" : "Minimizar" }}
            </label>
          </div>
          <button class="btn btn-solve" @click="solveNorthWest">Resolver</button>
          <button class="btn btn-close" @click="$emit('close')">Cerrar</button>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table custom-table">
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
                class="cell-highlight"
              >{{ tableData[rowIndex][cellIndex] }}</p>
              <input
                v-else-if="rowIndex === 0 && cellIndex === row.length - 1"
                type="text"
                class="form-control text-center read-only-input"
                v-model="tableData[rowIndex][cellIndex]"
                readonly
              />
              <input
                v-else-if="rowIndex === 0 && cellIndex === 0"
                type="text"
                class="form-control text-center read-only-input"
                v-model="tableData[rowIndex][cellIndex]"
                readonly
              />
              <input
                v-else
                type="text"
                class="form-control text-center cost-cell"
                v-model="tableData[rowIndex][cellIndex]"
              />
            </td>
            <td class="action-cell">
              <button class="btn btn-remove" v-if="rowIndex !== 0 && rowIndex !== tableData.length - 1" @click="removeRow(rowIndex)">
                &#x2716;
              </button>
            </td>
          </tr>
          <tr>
            <td v-for="(cell, cellIndex) in tableData[0]" :key="cellIndex" class="action-cell">
              <button
                class="btn btn-remove"
                v-if="cellIndex !== 0 && cellIndex !== tableData[0].length - 1"
                @click="removeColumn(cellIndex)"
              >&#x2716;</button>
            </td>
          </tr>
        </table>
        <div class="table-buttons">
          <button class="btn btn-add" @click="addRow">Añadir Fila</button>
          <button class="btn btn-add-secondary" @click="addColumn">Añadir Columna</button>
        </div>
      </div>

      <div v-if="solution" class="solution-container">
        <h3 class="mt-4">Solución</h3>
        <p><strong>Estado:</strong> {{ solution.status }}</p>
        <p><strong>Objetivo:</strong> {{ solution.objective }}</p>

        <table class="table solution-table">
          <thead>
            <tr>
              <th>Origen \\ Destino</th>
              <th v-for="target in solution.targets" :key="target">{{ target }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="origin in solution.origins" :key="origin">
              <th>{{ origin }}</th>
              <td v-for="target in solution.targets" :key="target">
                {{ solution.solution[origin][target] }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="interpretation-box">
          <h5 class="text-info">Interpretación:</h5>
          <p>
            Esta asignación inicial se ha generado utilizando el método de la Esquina Noroeste. El valor objetivo representa el {{ maximize ? 'máximo beneficio alcanzado' : 'costo total mínimo' }} de la distribución. Los valores en la tabla indican la cantidad asignada desde cada origen hacia cada destino según el criterio seleccionado.
          </p>
          <p>
            Si aparece un <strong>Origen Ficticio</strong> o un <strong>Destino Ficticio</strong>, significa que se ajustó automáticamente la tabla para balancear oferta y demanda desiguales.
          </p>
        </div>
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
  const supply = rows.map(r => Number(r[r.length - 1]))
  const demand = this.tableData[this.tableData.length - 1].slice(1).map(Number)
  const costs = rows.map(r => r.slice(1, -1))

  const hasEmpty = costs.some(row => row.some(cell => cell === '' || isNaN(cell))) ||
    supply.some(s => isNaN(s)) ||
    demand.some(d => isNaN(d))

  if (hasEmpty) {
    Swal.fire({
      icon: 'error',
      title: 'Datos incompletos',
      text: 'Todas las celdas de la tabla deben tener valores numéricos.'
    })
    return false
  }

  return true
},
solveNorthWest() {
  if (!this.validateTable()) return

  let targets = this.tableData[0].slice(1, -1)
  let origins = this.tableData.slice(1, -1).map(row => row[0])
  let costs = this.tableData.slice(1, -1).map(row => row.slice(1, -1).map(Number))
  let supplyArr = this.tableData.slice(1, -1).map(row => Number(row[row.length - 1]))
  let demandArr = this.tableData[this.tableData.length - 1].slice(1).map(Number)

  let totalSupply = supplyArr.reduce((acc, val) => acc + val, 0)
  let totalDemand = demandArr.reduce((acc, val) => acc + val, 0)

  if (totalSupply !== totalDemand) {
    if (totalSupply > totalDemand) {
      // Agregar columna ficticia
      targets.push('Destino Ficticio')
      costs.forEach((row, i) => row.push(0))
      demandArr.push(totalSupply - totalDemand)

      this.tableData[0].splice(this.tableData[0].length - 1, 0, 'Destino Ficticio')
      for (let i = 1; i < this.tableData.length - 1; i++) {
        this.tableData[i].splice(this.tableData[i].length - 1, 0, '0')
      }
      this.tableData[this.tableData.length - 1].splice(this.tableData[0].length - 1, 0, (totalSupply - totalDemand).toString())

      Swal.fire({
        icon: 'info',
        title: 'Columna ficticia agregada',
        text: `Se agregó un destino ficticio con demanda ${totalSupply - totalDemand} para igualar la oferta.`
      })
    } else {
      // Agregar fila ficticia
      origins.push('Origen Ficticio')
      const fictRow = new Array(targets.length).fill(0)
      costs.push(fictRow)
      supplyArr.push(totalDemand - totalSupply)

      const newRow = ['Origen Ficticio', ...new Array(targets.length).fill('0'), (totalDemand - totalSupply).toString()]
      this.tableData.splice(this.tableData.length - 1, 0, newRow)

      Swal.fire({
        icon: 'info',
        title: 'Fila ficticia agregada',
        text: `Se agregó un origen ficticio con oferta ${totalDemand - totalSupply} para igualar la demanda.`
      })
    }
  }

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
    }
  },
  mounted() {
    this.buildTable()
  }
}
</script>

<style scoped>
/* Estilos de la paleta:
   - Primario:      #555b6e
   - Secundario:    #89B0AE
   - Terciario:     #BEE3DB
   - Fondo claro:   #faf9f9
   - Acento:        #ffd6ba
*/

.popup-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #1616168f; /* Fondo sólido de la paleta */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 10px;
}

/* Contenedor principal */
.popup-content {
  background: #ecf6f5;
  padding: 25px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}
.popup-content:hover {
  transform: scale(1.02);
}

/* Cabecera y botones de acción */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}
.header-container h2 {
  color: #555b6e;
  margin: 0;
}
.header-container h5 {
  color: #89B0AE;
  margin: 0;
}
.actions .btn-solve {
  background-color: #89B0AE;
  border: none;
  color: #faf9f9;
  transition: background-color 0.3s;
}
.actions .btn-solve:hover {
  background-color: #555b6e;
}
.actions .btn-close {
  background-color: #ffd6ba;
  border: none;
  color: #555b6e;
  margin-left: 10px;
  transition: background-color 0.3s;
}
.actions .btn-close:hover {
  background-color: #89B0AE;
  color: #faf9f9;
}

/* Estilos para la tabla */
.custom-table {
  width: 100%;
  margin-bottom: 20px;
  border-collapse: separate;
  border-spacing: 0;
}
.custom-table th,
.custom-table td {
  border: 2px solid #89B0AE;
  padding: 8px;
}
.custom-table thead th {
  background-color: #89B0AE;
  color: #faf9f9;
  font-weight: bold;
}
.custom-table tbody tr:nth-child(even) {
  background-color: #ffd6ba;
}

/* Estilo de celdas */
.read-only-input {
  background-color: #faf9f9;
  font-weight: bold;
  color: #555b6e;
}
.editable-cell {
  background-color: #fff;
  transition: background-color 0.3s;
}
.editable-cell:focus {
  background-color: #BEE3DB;
}
.cost-cell {
  background-color: #89B0AE;
  color: #faf9f9;
  transition: background-color 0.3s;
}
.cost-cell:focus {
  background-color: #555b6e;
}

/* Destacados */
.cell-highlight {
  background-color: #ffd6ba;
  font-weight: bold;
  padding: 6px;
  border-radius: 4px;
  margin: 0;
}

/* Botones en las celdas de acción */
.action-cell {
  background-color: #BEE3DB;
  vertical-align: middle;
}
.btn-remove {
  background-color: #555b6e;
  color: #faf9f9;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.btn-remove:hover {
  background-color: #89B0AE;
}

/* Botones de agregar fila y columna */
.table-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.btn-add {
  background-color: #89B0AE;
  color: #faf9f9;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.btn-add:hover {
  background-color: #555b6e;
}
.btn-add-secondary {
  background-color: #ffd6ba;
  color: #555b6e;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.btn-add-secondary:hover {
  background-color: #89B0AE;
  color: #faf9f9;
}

/* Estilos para la sección de solución */
.solution-container h3 {
  color: #555b6e;
}
.solution-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.solution-table {
  width: auto;
  max-width: 100%;
  margin: 0 auto;
  border-collapse: collapse;
}
.solution-table th,
.solution-table td {
  padding: 12px 18px;
  min-width: 60px;
  text-align: center;
  vertical-align: middle;
  word-wrap: break-word;
  white-space: nowrap;
  background-color: #ffffff;
  border: 1px solid #dee2e6;
}
.solution-table thead {
  background-color: #89B0AE;
  color: #faf9f9;
}
.solution-table thead th {
  background-color: #d1efe9;
  color: #555b6e;
  font-weight: bold;
  text-align: center;
}
.solution-table tbody th {
  background-color: #d1efe9;
  color: #555b6e;
  text-align: center;
  font-weight: bold;
}

.text-maximize {
  color: #89B0AE;
}
.text-minimize {
  color: #555b6e;
}

.interpretation-box {
  background-color: #f3f9ff;
  padding: 16px;
  border-left: 5px solid #ffd6ba;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 15px;
}
.solution-container p {
  margin-bottom: 6px;
}
.solution-table th, .solution-table td {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  padding: 8px;
}
.bounce-resolve-enter-active,
.bounce-resolve-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
.bounce-resolve-enter-from {
  transform: scale(0.8) translateY(20px);
  opacity: 0;
}
.bounce-resolve-leave-to {
  transform: scale(1.1) translateY(-10px);
  opacity: 0;
}
</style>
