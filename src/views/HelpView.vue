<template>
  <div v-if="showTour" class="tour-overlay">
    <!-- Primer cuadro (centrado) -->
    <div 
      v-if="currentStep === 0" 
      class="tour-step welcome-step"
      :style="welcomeStepStyle"
    >
      <h3>Bienvenido al Tour de Ayuda</h3>
      <p>
        Este tour te guiará a través de las principales funcionalidades de la aplicación.
        Sigue los pasos para aprender cómo utilizar cada herramienta.
      </p>
      <div class="button-group">
        <button @click="nextStep" class="next-button">Comenzar</button>
        <button @click="closeHelp" class="close-button">Cerrar</button>
      </div>
    </div>

    <!-- Cuadros de los pasos -->
    <div 
      v-if="currentStep > 0" 
      class="tour-step"
      :style="getStepStyle(currentStep - 1)"
    >
      <h3>
        <i :class="steps[currentStep - 1].icon"></i>
        {{ steps[currentStep - 1].title }}
      </h3>
      <p>{{ steps[currentStep - 1].description }}</p>
      <div class="progress-indicator">
        Paso {{ currentStep }} de {{ steps.length }}
      </div>
      <div class="button-group">
        <button v-if="currentStep > 1" @click="prevStep" class="prev-button">Atrás</button>
        <button @click="nextStep" class="next-button">
          {{ currentStep === steps.length ? "Finalizar" : "Siguiente" }}
        </button>
        <!-- Mostrar el botón "Cerrar" solo si no es el último paso -->
        <button v-if="currentStep !== steps.length" @click="closeHelp" class="close-button">Cerrar</button>
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
          title: "Agregar Nodos", 
          description: "Haz clic en el botón '+' para agregar un nodo.",
          icon: "fas fa-plus-circle",
          top: "-260px", 
          left: "150px"
        },
        { 
          title: "Enlazar Nodos", 
          description: "Selecciona dos nodos para crear una conexión.",
          icon: "fas fa-link",
          top: "-260px", 
          right: "450px"
        },
        { 
          title: "Eliminar Nodos", 
          description: "Selecciona un nodo para eliminarlo.",
          icon: "fas fa-trash-alt",
          top: "-243px", 
          left: "290px"
        },
        { 
          title: "Mover Nodos", 
          description: "Arrastra los nodos para cambiar su posición.",
          icon: "fas fa-arrows-alt",
          bottom: "80px", 
          left: "50%",
          transform: "translateX(-50%)" 
        },
        { 
          title: "Editar Nodos y Aristas", 
          description: "Modifica las propiedades de los elementos.",
          icon: "fas fa-edit",
          top: "-528%", 
          left: "400px"
        },
        { 
          title: "Limpiar Pizarra", 
          description: "Elimina todos los nodos y aristas.",
          icon: "fas fa-eraser",
          bottom: "80px", 
          right: "200px"
        }
      ],
    };
  },
  computed: {
    welcomeStepStyle() {
      return {
        top: "-800%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      };
    }
  },
  methods: {
    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
      } else {
        this.closeHelp();
      }
    },
    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    closeHelp() {
      this.showTour = false;
      this.$emit("close");
    },
    getStepStyle(stepIndex) {
      const step = this.steps[stepIndex];
      return {
        top: step.top,
        left: step.left,
        right: step.right,
        bottom: step.bottom,
        transform: step.transform
      };
    }
  }
};
</script>

<style scoped>
.tour-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.tour-step {
  position: absolute;
  background: rgb(255, 240, 182);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 300px; /* Ancho fijo */
  z-index: 1001;
}

h3 i {
  margin-right: 8px;
  color: #41658A;
}

.progress-indicator {
  margin: 10px 0;
  font-size: 0.9em;
  color: #666;
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
  transition: background 0.3s ease, transform 0.2s ease;
}

button:hover {
  transform: scale(1.05);
}

.next-button {
  background: #41658A;
  color: white;
}

.next-button:hover {
  background: #D6D1B1;
}

.prev-button {
  background: #F0B67F;
  color: white;
}

.prev-button:hover {
  background: #D6D1B1;
}

.close-button {
  background: #F0B67F;
  color: white;
}

.close-button:hover {
  background: #D6D1B1;
}

/* Media Queries para hacerlo responsivo */
@media (max-width: 768px) {
  .tour-step {
    width: 250px; /* Reducir el ancho en pantallas pequeñas */
    padding: 15px;
  }

  button {
    padding: 8px 16px;
    font-size: 0.9em;
  }

  /* Ajustar posiciones en pantallas pequeñas */
  .tour-step {
    top: auto !important;
    bottom: 20px !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
  }
}
</style>