<template>
  <nav class="navbar">
    <img src="@/assets/logo.svg" alt="Logo" class="logo">
    <ul class="nav-links">
      <li><router-link to="/">Inicio</router-link></li>
      <li><router-link to="/graphs">Grafos</router-link></li>
      <li><router-link to="/sort">Sorting</router-link></li>
      <li><router-link to="#">Contacto</router-link></li>
    </ul>
  </nav>

  <div class="container">
    <div class="sidebar">
      <div class="button-group">
        <h2>Cargar Listas</h2>
        <button class="action-button" @click="openAddListModal">Agregar Lista</button>
        <button class="action-button" @click="openGenerateRandomModal">Generar Aleatoriamente</button>
        <button class="action-button" @click="cleanList">Limpiar</button>
        <button class="action-button" @click="exportData">Exportar</button>
        <button class="action-button">
    <input type="file" accept=".json" @change="importData" style="display: none" id="importFile"/>
    <label for="importFile" class="action-button">Importar</label>
  </button>
  <button class="action-button" >Limpiar</button>


      </div>
      
      <div class="button-group">
        <h2>Ordenar</h2>
        <button class="action-button" @click="startSelectionSort">Selection Sort</button>
        <button class="action-button" @click="startInsertionSort">Insertion Sort</button>
        <button class="action-button" @click="startMergeSort">Merge Sort</button>
        <!-- Campo para ingresar el gap -->
        <input v-model="gapValue" type="number" min="1" placeholder="Ingresa el valor del gap" />
        <button class="action-button" @click="startShellSort">Shell Sort</button>
      </div>
    </div>
    
    <div class="chart-container">
      <div class="chart">
        <div class="y-axis">
          <!-- Generar etiquetas dinámicas para el eje Y -->
          <div v-for="n in yAxisRange" :key="n" class="y-label">{{ n }}</div>
        </div>
        
        <div class="bars-container">
          <div v-for="(value, index) in barValues" :key="index" class="bar-wrapper">
            <!-- Cambiar el color de la barra activa -->
            <div :class="['bar', { active: activeIndices.includes(index) }]" :style="{ height: (value / maxValueComputed) * 100 + '%'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para agregar lista -->
  <div v-if="showAddListModal" class="modal">
    <div class="modal-content">
      <h2>¿Cuántos números deseas agregar a la lista?</h2>
      <input v-model="numElements" type="number" min="1" placeholder="Número de elementos" />
      <button @click="confirmAddList">Aceptar</button>
      <button @click="closeAddListModal">Cancelar</button>
    </div>
  </div>

  <!-- Modal para generar números aleatorios -->
  <div v-if="showGenerateRandomModal" class="modal">
    <div class="modal-content">
      <h2>¿Cuántos números aleatorios deseas generar?</h2>
      <input v-model="randomCount" type="number" min="1" placeholder="Cantidad" />
      <h2>Valor mínimo:</h2>
      <input v-model="minValue" type="number" placeholder="Valor mínimo" />
      <h2>Valor máximo:</h2>
      <input v-model="maxValueInput" type="number" placeholder="Valor máximo" />
      <button @click="confirmGenerateRandom">Generar</button>
      <button @click="closeGenerateRandomModal">Cancelar</button>
    </div>
  </div>

   <!-- Mostrar lista original y ordenada -->
   <div class="list-container">
      <h3>Lista Original:</h3>
      <p>{{ originalList }}</p>
      <h3>Lista Ordenada:</h3>
      <p>{{ sortedList }}</p>
    </div>
    <HelpSortingPopup />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import HelpSortingPopup from '@/components/HelpSortingPopup.vue'; // ✅ Importa aquí

const barValues = ref<number[]>([]);
const currentIndex = ref<number | null>(null); 
const showAddListModal = ref(false);
const showGenerateRandomModal = ref(false);
const numElements = ref<number | null>(null);
const randomCount = ref<number | null>(null);
const minValue = ref<number | null>(null);
const maxValueInput = ref<number | null>(null);
const maxValueComputed = computed(() => Math.max(...barValues.value));
const originalList = ref<number[]>([]);
const sortedList = ref<number[]>([]);
const gapValue = ref<number | null>(null);
const activeIndices = ref<number[]>([]);

// Computed
const yAxisRange = computed(() => {
  const max = maxValueComputed.value;
  if (max !== null) {
    const range = [];
    for (let i = max; i >= 0; i -= Math.ceil(max / 5)) {
      range.push(i);
    }
    return range;
  }
  return [];
});

// Funciones
function cleanList() {
  barValues.value = [];
  currentIndex.value = null;
  originalList.value = [];
  sortedList.value = [];
}
function openAddListModal() {
  showAddListModal.value = true;
}
function closeAddListModal() {
  showAddListModal.value = false;
}
function confirmAddList() {
  if (numElements.value && numElements.value > 0) {
    const newList: number[] = [];
    for (let i = 0; i < numElements.value; i++) {
      const value = prompt(`Ingresa el valor para el elemento ${i + 1}:`);
      if (value && !isNaN(Number(value))) {
        newList.push(Number(value));
      } else {
        alert("Por favor ingresa un valor numérico válido.");
        return;
      }
    }
    barValues.value = newList;
    originalList.value = [...newList];
    closeAddListModal();
  } else {
    alert("Por favor ingresa un número válido de elementos.");
  }
}
function openGenerateRandomModal() {
  showGenerateRandomModal.value = true;
}
function closeGenerateRandomModal() {
  showGenerateRandomModal.value = false;
}
function confirmGenerateRandom() {
  if (
    randomCount.value &&
    minValue.value !== null &&
    maxValueInput.value !== null &&
    randomCount.value > 0 &&
    minValue.value < maxValueInput.value
  ) {
    const generatedNumbers: number[] = [];
    for (let i = 0; i < randomCount.value; i++) {
      generatedNumbers.push(
        Math.floor(Math.random() * (maxValueInput.value - minValue.value + 1)) + minValue.value
      );
    }
    barValues.value = generatedNumbers;
    originalList.value = [...generatedNumbers];
    sortedList.value = [];
    closeGenerateRandomModal();
  } else {
    alert("Por favor asegúrate de que todos los campos sean válidos.");
  }
}

async function startSelectionSort() {
  let arr = [...barValues.value];
  let n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    currentIndex.value = i;
    await pause(100);

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
      currentIndex.value = j;
      await pause(100);
    }
    if (minIndex !== i) {
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
      barValues.value = [...arr];
      await pause(100);
    }
  }
  currentIndex.value = null;
  sortedList.value = [...arr];
}

async function startInsertionSort() {
  let arr = [...barValues.value];
  let n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    activeIndices.value = [i];
    await pause(150);

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
      activeIndices.value = [j + 1, j + 2];
      barValues.value = [...arr];
      await pause(150);
    }
    arr[j + 1] = key;
    barValues.value = [...arr];
    await pause(150);
  }
  activeIndices.value = [];
  sortedList.value = [...arr];
}

async function startShellSort() {
  if (gapValue.value === null || gapValue.value <= 0) {
    alert("Por favor ingresa un valor válido para el gap.");
    return;
  }

  let arr = [...barValues.value];
  let n = arr.length;
  let gap = gapValue.value;

  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      let temp = arr[i];
      let j = i;

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
        currentIndex.value = j;
        await pause(100);
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }

  barValues.value = [...arr];
  sortedList.value = [...arr];
}

async function merge(left: number[], right: number[]): Promise<number[]> {
  const result: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }

    activeIndices.value = [leftIndex, rightIndex];
    barValues.value = [...originalList.value.slice(0, result.length), ...left.slice(leftIndex), ...right.slice(rightIndex)];
    await pause(150);
  }

  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}

async function startMergeSort() {
  let arr = [...barValues.value];
  const sortedArr = await mergeSort(arr);
  barValues.value = sortedArr;
  sortedList.value = [...sortedArr];
}

async function mergeSort(arr: number[]): Promise<number[]> {
  if (arr.length <= 1) {
    return arr;
  }
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  const leftSorted = await mergeSort(left);
  const rightSorted = await mergeSort(right);
  const merged = await merge(leftSorted, rightSorted);
  barValues.value = [...merged];
  return merged;
}

function pause(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



function exportData() {
  const dataStr = JSON.stringify(barValues.value);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'barValues.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput?.files?.[0]) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target?.result;
      if (content) {
        try {
          const importedData = JSON.parse(content as string);
          if (Array.isArray(importedData) && importedData.every(item => typeof item === 'number')) {
            barValues.value = importedData;
            originalList.value = [...importedData];
            alert('Datos importados correctamente');
          } else {
            alert('El archivo no contiene un formato de lista válido.');
          }
        } catch (error) {
          alert('Error al importar el archivo. Asegúrese de que el archivo esté en formato JSON.');
        }
      }
    };

    reader.readAsText(file);
  }
}
</script>


<style>
/* Estilo principal */
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #333333;
  min-height: 100vh;
}

/* Barra lateral */
.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #555b6e;
  border-radius: 8px;
  padding: 15px;
}

/* Grupo de botones */
.button-group {
  background-color: #555b6e;
  border: 2px solid #ffd6ba;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.button-group h2 {
  color: #bee3db;
  text-align: center;
  margin-bottom: 10px;
  font-size: 1.6rem;
}

/* Botones */
.action-button {
  padding: 12px;
  background-color: #89b0ae;
  border: none;
  border-radius: 8px;
  color: #333333;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.action-button:hover {
  background-color: #ffd6ba;
  transform: scale(1.05);
}

/* Contenedor del gráfico */
.chart-container {
  flex: 1;
  background-color: #333333;
  border: 2px solid #89b0ae;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  background-image: linear-gradient(#555b6e 1px, transparent 1px),
                    linear-gradient(90deg, #555b6e 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Gráfico */
.chart {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

/* Eje Y */
.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 10px;
  height: 100%;
}

.y-label {
  color: #bee3db;
  font-weight: bold;
  font-size: 0.9rem;
}

/* Barras */
.bars-container {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
  border-left: 2px solid #ffd6ba;
  border-bottom: 2px solid #ffd6ba;
  padding: 0 10px;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

/* Estilo de las barras */
.bar {
  width: 20px;
  background-color: #89b0ae;
  border-radius: 5px 5px 0 0;
  margin: 0 5px;
  transition: transform 0.4s ease-in-out, height 0.4s ease, background-color 0.3s;
  transform-origin: bottom;
}

/* Barra activa */
.bar.active {
  background-color: #ffd6ba;
}

/* Etiqueta X */
.x-label {
  margin-top: 8px;
  color: #bee3db;
  font-weight: bold;
  font-size: 0.85rem;
}

/* Modales */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.modal-content {
  background-color: #555b6e;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 300px;
  
}

.modal-content input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #89b0ae;
  border-radius: 8px;
}

.modal-content button {
  padding: 10px;
  background-color: #89b0ae;
  color: #333333;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #ffd6ba;
}

/* Listas (original y ordenada) */
.list-container {
  margin-top: 20px;
  background-color: #555b6e;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.list-container h3 {
  color: #bee3db;
  font-size: 1.2rem;
}

.list-container p {
  color: #fff;
  font-size: 1rem;
  word-break: break-word;
}
/* Títulos */
h2, h3 {
  color: #bee3db; /* Verde clarito */
}

/* Texto normal */
p, span, li {
  color: #ccd6dd; /* Gris muy clarito */
}

/* Botones */
button, .action-button, .tutorial-button {
  color: #333333; /* Texto oscuro para fondo claro */
}

/* Texto dentro del modal */
.modal-content h2, 
.modal-content p {
  color: #ffffff; /* Texto blanco en modales */
}

/* Textos en el contenedor de listas */
.list-container h3 {
  color: #bee3db;
}
.list-container p {
  color: #ccd6dd;
}

</style>

