<template>
  <div class="modal-overlay" @click.self="clearForm">
    <div class="modal-content">
      <form @submit.prevent="handleSubmit">
        <h3 class="text-center mb-4">Agregar Comentario</h3>

        <h1>nombre apellido apellido</h1>
        <h2>matricula</h2>

        <!-- Contenedor para las flags y el recuadro -->
        <div class="flags-action-container">
          <!-- Contenedor para las flags -->
          <div class="flags-container">
            <flag 
              :regularColor="'#00FF00'" 
              :solidColor="'#006400'" 
              :texto="'Buen comportamiento'" 
              :checked="selectedFlag === 'buenComportamiento'"
              @update:checked="updateSelectedFlag('buenComportamiento')"
            />
            <flag 
              :regularColor="'#FFFF00'" 
              :solidColor="'#FFD700'" 
              :texto="'Advertencia'" 
              :checked="selectedFlag === 'advertencia'"
              @update:checked="updateSelectedFlag('advertencia')"
            />
            <flag 
              :regularColor="'#FF0000'" 
              :solidColor="'#8B0000'" 
              :texto="'Mal comportamiento'" 
              :checked="selectedFlag === 'malComportamiento'"
              @update:checked="updateSelectedFlag('malComportamiento')"
            />
          </div>

          <!-- Contenedor para "Valor acción" -->
          <div class="action-value-container">
            <label for="valorAccion">Valor acción</label>
            <input
              id="valorAccion"
              type="text"
              v-model="alumno.valorAccion"
              class="form-control"
              placeholder="Ingrese valor"
            />
          </div>
        </div>

        <!-- Sección para agregar comentario -->
        <div class="comment-container">
          <label for="comentario">Comentario</label>
          <textarea
            id="comentario"
            v-model="alumno.comentario"
            class="form-control"
            placeholder="Escribe tu comentario aquí..."
            rows="4"
          ></textarea>
        </div>

        <!-- Botones de acción -->
        <div class="d-flex justify-content-between mt-4">
          <button type="submit" class="btn btn-success">{{ isEditMode ? 'Actualizar' : 'Agregar' }}</button>
          <button type="button" class="btn btn-secondary" @click="clearForm">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import flag from '@/components/Flag.vue';

export default {
  name: 'AppNavbar',
  components: {
    flag,
  },
  data() {
    return {
      alumnos: [],
      alumno: {
        nombres: '',
        apellidoP: '',
        apellidoM: '',
        rut: '',
        matricula: '',
        fecNac: '',
        fecIng: '',
        valorAccion: '',
        comentario: '',
      },
      formVisible: false,
      isEditMode: false,
      formFields: {
        comentario: 'Accion realizada',
      },
      selectedFlag: null, // Controla la flag seleccionada
      requiredFields: ['nombres', 'apellidoP', 'apellidoM', 'rut', 'matricula', 'fecNac', 'fecIng'],
    };
  },
  methods: {
    clearForm() {
      this.alumno = {
        nombres: '',
        apellidoP: '',
        apellidoM: '',
        rut: '',
        matricula: '',
        fecNac: '',
        fecIng: '',
        valorAccion: '',
        comentario: '',
      };
      this.selectedFlag = null; // Limpia la selección de flags
    },
    updateSelectedFlag(flagId) {
      // Si la flag seleccionada ya está activa, la deselecciona
      this.selectedFlag = this.selectedFlag === flagId ? null : flagId;
    },
    handleSubmit() {
      if (this.selectedFlag) {
        console.log('Flag seleccionada:', this.selectedFlag);
        console.log('Datos del alumno:', this.alumno);
      } else {
        console.log('Debe seleccionar una flag antes de enviar.');
      }
    },
  },
};
</script>

<style>
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
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
}

.flags-action-container {
  display: flex; /* Alinea flags y recuadro horizontalmente */
  align-items: center; /* Centra verticalmente los elementos */
  gap: 20px; /* Espaciado entre flags y recuadro */
  margin-top: 15px; /* Separación superior */
}

.flags-container {
  display: flex;
  flex-direction: column; /* Alinea las flags verticalmente */
  gap: 10px; /* Espaciado entre cada flag */
}

.action-value-container {
  display: flex;
  flex-direction: column; /* Alinea etiqueta y recuadro verticalmente */
  flex-shrink: 0; /* Previene que el recuadro cambie de tamaño */
  width: 200px; /* Ancho del recuadro */
}

.action-value-container label {
  font-size: 14px; /* Tamaño de texto para la etiqueta */
  margin-bottom: 5px; /* Espaciado debajo de la etiqueta */
}

.action-value-container input {
  width: 100%; /* Asegura que el recuadro tome el ancho disponible */
  padding: 8px; /* Espaciado interno del recuadro */
  border: 1px solid #ccc; /* Borde del recuadro */
  border-radius: 4px; /* Esquinas redondeadas */
}
</style>
