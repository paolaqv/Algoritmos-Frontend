<template>
  <div v-if="showTour" class="tour-overlay">
    <!-- Primer cuadro (centrado) -->
    <div v-if="currentStep === 0" class="tour-step welcome-step" :style="welcomeStepStyle">
      <h3>Bienvenido al Tour de Ayuda</h3>
      <p>
        Este tour te guiará a través de las principales funcionalidades de la aplicación. Sigue los
        pasos para aprender cómo utilizar cada herramienta.
      </p>
      <div class="button-group">
        <button @click="nextStep" class="next-button">Comenzar</button>
        <button @click="closeHelp" class="close-button">Cerrar</button>
      </div>
    </div>

    <!-- Cuadros de los pasos -->
    <div v-if="currentStep > 0" class="tour-step" :style="getStepStyle(currentStep - 1)">
      <h3>
        <i :class="steps[currentStep - 1].icon"></i>
        {{ steps[currentStep - 1].title }}
      </h3>
      <p>{{ steps[currentStep - 1].description }}</p>
      <div class="progress-indicator">Paso {{ currentStep }} de {{ steps.length }}</div>
      <div class="button-group">
        <button v-if="currentStep > 1" @click="prevStep" class="prev-button">Atrás</button>
        <button @click="nextStep" class="next-button">
          {{ currentStep === steps.length ? 'Finalizar' : 'Siguiente' }}
        </button>
        <!-- Mostrar el botón "Cerrar" solo si no es el último paso -->
        <button v-if="currentStep !== steps.length" @click="closeHelp" class="close-button">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTour: true,
      currentStep: 0,
      steps: [
        {
          title: 'Matriz de Adyacencia',
          description:
            'Requiere un grafo dirigido o no dirigido con nodos conectados por aristas. La matriz debe tener una fila y una columna por cada nodo, representando las conexiones entre ellos. Si no hay conexión, el valor será 0 o infinito.',
          icon: 'fas fa-th',
          top: '0',
          left: '0',
        },
        {
          title: 'Algoritmo de Johnson',
          description:
            'Requiere un grafo ponderado dirigido sin ciclos negativos. El algoritmo calcula los caminos más cortos entre todos los pares de nodos en el grafo, utilizando una técnica de reetiquetado y el algoritmo de Dijkstra. Asegúrese de que todos los nodos estén conectados por aristas con pesos definidos.',
          icon: 'fas fa-project-diagram',
          top: '0',
          left: '70',
        },
        {
          title: 'Método Northwest',
          description:
            'Requiere una matriz de costos de transporte, donde las filas representan los orígenes y las columnas los destinos. Las celdas contienen los costos de transporte. El algoritmo asigna unidades de manera que minimice el costo total, comenzando desde la esquina noroeste de la matriz y asignando la cantidad máxima posible a cada celda hasta agotar los suministros o demandas.',
          icon: 'fas fa-truck',
          top: '70',
          left: '0',
        },
        {
          title: 'Minimizar Costo',
          description:
            'Requiere un grafo ponderado donde los nodos representan puntos de origen y destino, y las aristas representan rutas con costos asociados. El algoritmo busca una asignación óptima de recursos o caminos que minimice el costo total de transporte entre los nodos. Es útil para problemas de optimización de rutas o flujos con costos definidos.',
          icon: 'fas fa-arrow-down',
          top: '70',
          left: '70',
        },
        {
          title: 'Maximizar Beneficio',
          description:
            'Requiere un grafo donde las aristas tienen valores de beneficio entre los nodos. El algoritmo calcula una asignación de recursos o rutas que maximiza el beneficio total, considerando las ganancias entre los puntos de origen y destino. Este enfoque es útil para problemas de optimización en los que se buscan maximizar los beneficios de un flujo de recursos.',
          icon: 'fas fa-arrow-up',
          top: '140',
          left: '0',
        },
        {
          title: 'Agregar Nodos',
          description: "Haz clic en el botón '+' para agregar un nodo.",
          icon: 'fas fa-plus-circle',
          top: '0',
          left: '450',
          isBottom: true
        },
        {
          title: 'Enlazar Nodos',
          description: 'Selecciona dos nodos para crear una conexión.',
          icon: 'fas fa-link',
          top: '0',
          left: '520',
          isBottom: true
        },
        {
          title: 'Eliminar Nodos',
          description: 'Selecciona un nodo para eliminarlo.',
          icon: 'fas fa-trash-alt',
          top: '0',
          left: '590',
          isBottom: true
        },
        {
          title: 'Mover Nodos',
          description: 'Arrastra los nodos para cambiar su posición.',
          icon: 'fas fa-arrows-alt',
          top: '0',
          left: '660',
          isBottom: true
        },
        {
          title: 'Editar Nodos y Aristas',
          description: 'Modifica las propiedades de los elementos.',
          icon: 'fas fa-edit',
          top: '0',
          left: '730',
          isBottom: true
        },
        {
          title: 'Limpiar Pizarra',
          description: 'Elimina todos los nodos y aristas.',
          icon: 'fas fa-eraser',
          top: '0',
          left: '800',
          isBottom: true
        },
      ],
    }
  },
  computed: {
    welcomeStepStyle() {
      return {
        top: '-800%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    },
  },
  methods: {
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++
      } else {
        this.closeHelp()
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },
    closeHelp() {
      this.showTour = false
      this.$emit('close')
    },
    getStepStyle(stepIndex) {
      const step = this.steps[stepIndex]
      const h = window.innerHeight;
      console.log(step.top)
      const w = window.innerWidth;
      if (step.isBottom) {
        return {
          top: `${step.top - 370}px`,
          left: `${step.left - w/7}px`,
          right: step.right,
          bottom: step.bottom,
          transform: step.transform,
        }
      }
      return {
        top: `${step.top - h + 200}px`,
        left: `${step.left - w/7}px`,
        right: step.right,
        bottom: step.bottom,
        transform: step.transform,
      }
    },
  },
}
</script>

<style scoped>
.tour-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(85, 91, 110, 0.2); /* tono del color más oscuro con transparencia */
  z-index: 1000;
}

.tour-step {
  position: absolute;
  background: #bee3db; /* verde menta claro como fondo */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(85, 91, 110, 0.3); /* sombra basada en el color oscuro */
  text-align: center;
  width: 300px;
  z-index: 1001;
  color: #555b6e; /* texto con el color oscuro para buen contraste */
}

h3 i {
  margin-right: 8px;
  color: #89b0ae; /* verde grisáceo suave */
}

.progress-indicator {
  margin: 10px 0;
  font-size: 0.9em;
  color: #555b6e; /* tono más oscuro para legibilidad */
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

button {
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  color: #faf9f9; /* texto claro */
}

button:hover {
  transform: scale(1.05);
}

.next-button {
  background: #555b6e; /* oscuro */
}

.next-button:hover {
  background: #89b0ae; /* verde grisáceo suave */
}

.prev-button {
  background: #ffd6ba; /* durazno */
  color: #555b6e; /* más contraste para este fondo claro */
}

.prev-button:hover {
  background: #89b0ae;
  color: #faf9f9;
}

.close-button {
  background: #ffd6ba;
  color: #555b6e;
}

.close-button:hover {
  background: #89b0ae;
  color: #faf9f9;
}

/* Media Queries para hacerlo responsivo */
@media (max-width: 768px) {
  .tour-step {
    width: 250px;
    padding: 15px;
  }

  button {
    padding: 8px 16px;
    font-size: 0.9em;
  }

  .tour-step {
    top: auto !important;
    bottom: 20px !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
  }
}
</style>
