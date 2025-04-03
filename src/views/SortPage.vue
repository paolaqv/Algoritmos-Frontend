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
            <div :class="['bar', { active: index === currentIndex }]" :style="{ height: (value / maxValueComputed) * 100 + '%', backgroundColor: index === currentIndex ? '#00BFFF' : '#8A2BE2' }"></div>
            <div class="x-label">{{ index + 1 }}</div>
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
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';

  // Variables reactivas
  const barValues = ref<number[]>([]);
  const currentIndex = ref<number | null>(null); // El índice de la barra que se está moviendo

  // Modal states
  const showAddListModal = ref(false);
  const showGenerateRandomModal = ref(false);

  // Datos del modal
  const numElements = ref<number | null>(null);
  const randomCount = ref<number | null>(null);
  const minValue = ref<number | null>(null);
  const maxValueInput = ref<number | null>(null); // Renombrado para evitar conflictos

  // Computado para calcular el valor máximo de barValues
  const maxValueComputed = computed(() => Math.max(...barValues.value));

    // Variables para las listas
  const originalList = ref<number[]>([]);
  const sortedList = ref<number[]>([]);
// Definir gapValue como una variable reactiva
const gapValue = ref<number | null>(null);


  // Generación del rango dinámico para el eje Y
  const yAxisRange = computed(() => {
  const max = maxValueComputed.value; // Usamos el valor calculado
  if (max !== null) {
    const range = [];
    // Añadir valores de Y en orden descendente
    for (let i = max; i >= 0; i -= Math.ceil(max / 5)) {
      range.push(i);
    }
    return range;
  }
  return []; // Si max es null, no se genera el rango
});


  // Abrir el modal para agregar lista
  function openAddListModal() {
    showAddListModal.value = true;
  }

  // Cerrar el modal para agregar lista
  function closeAddListModal() {
    showAddListModal.value = false;
  }

  // Confirmar la adición de lista
 // Confirmar la adición de lista
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

    // Actualizamos 'barValues' para que refleje los nuevos valores de la lista
    barValues.value = newList;
    
    // También actualizamos 'originalList' para mostrarla en la sección de "Lista Original"
    originalList.value = [...newList]; // Guardamos la lista original

    closeAddListModal();
  } else {
    alert("Por favor ingresa un número válido de elementos.");
  }
}


  // Abrir el modal para generar números aleatorios
  function openGenerateRandomModal() {
    showGenerateRandomModal.value = true;
  }

  // Cerrar el modal para generar números aleatorios
  function closeGenerateRandomModal() {
    showGenerateRandomModal.value = false;
  }

  // Confirmar la generación de números aleatorios
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
      originalList.value = [...generatedNumbers]; // Guardamos la lista original
      sortedList.value = []; // Limpiamos la lista ordenada
      closeGenerateRandomModal();
    } else {
      alert("Por favor asegúrate de que todos los campos sean válidos.");
    }
  }

  // Función para hacer el Selection Sort con animación
  async function startSelectionSort() {
    let arr = [...barValues.value]; // Creamos una copia del arreglo para manipularlo
    let n = arr.length;

    // Iteramos a través de las barras para ordenar
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      // Resaltamos la barra en el proceso
      currentIndex.value = i;
      await pause(100); // Esperamos para mostrar el estado actual

      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }

        // Resaltamos las barras que se están comparando
        currentIndex.value = j;
        await pause(100); // Esperamos para mostrar la comparación
      }

      // Si encontramos un nuevo mínimo, intercambiamos las barras
      if (minIndex !== i) {
        // Intercambiamos los valores
        let temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;

        // Actualizamos el arreglo de barras para reflejar el cambio
        barValues.value = [...arr];

        // Animación de la barra cambiando de lugar
        await pause(100); // Esperamos para mostrar el intercambio visual
      }
    }
    currentIndex.value = null; // Resaltamos la barra al final
    sortedList.value = [...arr]; // Guardamos la lista ordenada

  }

  // Función para hacer el Insertion Sort con animación
async function startInsertionSort() {
  let arr = [...barValues.value]; // Creamos una copia del arreglo para manipularlo
  let n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    // Resaltamos la barra en el proceso
    currentIndex.value = i;
    await pause(100); // Esperamos para mostrar el estado actual

    // Mueve los elementos de arr[0..i-1] que son mayores que key, a una posición adelante
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;

      // Resaltamos las barras que se están comparando
      currentIndex.value = j;
      await pause(100); // Esperamos para mostrar la comparación
    }
    arr[j + 1] = key;

    // Actualizamos el arreglo de barras para reflejar el cambio
    barValues.value = [...arr];
    await pause(100); // Esperamos para mostrar el intercambio visual
  }

  currentIndex.value = null; // Resaltamos la barra al final
  sortedList.value = [...arr]; // Guardamos la lista ordenada
}

// Función para hacer el Shell Sort con animación
async function startShellSort() {
    if (gapValue.value === null || gapValue.value <= 0) {
      alert("Por favor ingresa un valor válido para el gap.");
      return;
    }

    let arr = [...barValues.value];
    let n = arr.length;
    let gap = gapValue.value; // Usamos el valor de gap ingresado por el usuario

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
      gap = Math.floor(gap / 2); // Reducimos el gap
    }

    barValues.value = [...arr];
    sortedList.value = [...arr];
  }


// Función para fusionar dos arreglos
async function merge(left: number[], right: number[]): Promise<number[]> {
  const result: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // Fusionamos los dos arreglos mientras haya elementos en ambos
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }

    // Resaltamos las barras que se están comparando
    currentIndex.value = leftIndex + rightIndex;
    await pause(100); // Esperamos para mostrar la comparación
  }

  // Si queda algún elemento en el arreglo izquierdo o derecho, lo agregamos
  return result.concat(left.slice(leftIndex), right.slice(rightIndex));
}

// Función para iniciar el Merge Sort
async function startMergeSort() {
  let arr = [...barValues.value]; // Creamos una copia del arreglo para manipularlo

  // Ejecutamos el Merge Sort y actualizamos la visualización
  const sortedArr = await mergeSort(arr);

  // Actualizamos el arreglo de barras con la lista ordenada
  barValues.value = sortedArr;

  // Actualizamos la lista ordenada para mostrarla debajo del gráfico
  sortedList.value = [...sortedArr];
}


// Función Merge Sort con animación
async function mergeSort(arr: number[]): Promise<number[]> {
  if (arr.length <= 1) {
    return arr;
  }

  // Dividimos el arreglo en dos mitades
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  // Realizamos la llamada recursiva para ordenar ambas mitades
  const leftSorted = await mergeSort(left);
  const rightSorted = await mergeSort(right);

  // Fusionamos las dos mitades ordenadas
  return merge(leftSorted, rightSorted);
}

  // Función de espera para controlar los retrasos en la animación
  function pause(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// Función para exportar los datos
function exportData() {
  // Creamos un archivo JSON con los datos de barValues
  const dataStr = JSON.stringify(barValues.value);
  const blob = new Blob([dataStr], { type: 'application/json' });

  // Crear un enlace para descargar el archivo
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'barValues.json'; // Nombre del archivo
  a.click();
  URL.revokeObjectURL(url); // Revocar el URL después de usarlo
}

// Función para importar los datos
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
          // Validamos que los datos sean un arreglo de números
          if (Array.isArray(importedData) && importedData.every(item => typeof item === 'number')) {
            barValues.value = importedData;
            originalList.value = [...importedData]; // Actualizamos también la lista original
            alert('Datos importados correctamente');
          } else {
            alert('El archivo no contiene un formato de lista válido.');
          }
        } catch (error) {
          alert('Error al importar el archivo. Asegúrese de que el archivo esté en formato JSON.');
        }
      }
    };

    reader.readAsText(file); // Leemos el archivo como texto
  }
}

</script>

<script lang="ts">
  export default {
    name: 'SortPage'
  }
</script>

<style>
  :root {
    --primary-color: #41658A;
    --secondary-color: #F0B67F;
    --background-color: #EEF5DB;
    --accent-color: #C7EFCF;
    --text-color: #D6D1B1;
  }

  .container {
    display: flex;
    gap: 20px;
    padding: 20px;
    background-color: var(--background-color);
    height: 60vh;
    min-height: calc(100vh - 40px);
  }

  .sidebar {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 60vh;
  }

  .button-group {
    background-color: white;
    border: 2px solid var(--primary-color);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  .button-group h2 {
    color: var(--primary-color);
    text-align: center;
    margin: 0 0 10px 0;
    font-size: 1.5rem;
  }

  .action-button {
    padding: 10px;
    background-color: white;
    border: 2px solid var(--secondary-color);
    border-radius: 5px;
    color: var(--primary-color);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-button:hover {
    background-color: var(--accent-color);
  }

  .chart-container {
    flex: 1;
    background-color: white;
    border: 2px solid var(--primary-color);
    border-radius: 5px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50vh;
  }

  .chart {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
  }

  .y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 10px;
    height: 100%;
  }

  .y-label {
    color: var(--primary-color);
    font-weight: bold;
  }

  .bars-container {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 100%;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }

  .bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
  }

  .bar {
    width: 40px;
    background-color: transparent;
    border: 2px solid #4CAF50;
    margin: 0 5px;
    transition: height 0.5s ease; /* Animación de cambio de altura */
  }

  .bar.active {
    background-color: #00BFFF; /* Barra activa de color azul */
  }

  .x-label {
    margin-top: 10px;
    color: var(--primary-color);
    font-weight: bold;
  }

  .chart-container {
    background-image: linear-gradient(#ddd 1px, transparent 1px),
                        linear-gradient(90deg, #ddd 1px, transparent 1px);
    background-size: 20px 20px;
  }

  /* Estilos adicionales para los modales */
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
  }

  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .modal-content input {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .modal-content button {
    padding: 10px;
    background-color: #41658A;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .modal-content button:hover {
    background-color: #355a6a;
  }
  .list-container {
  margin-top: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.list-container h3 {
  color: #41658A;
  font-size: 1.2rem;
}

.list-container p {
  font-size: 1rem;
  color: #555;
}

</style>
