<template>
  <div class="modal-overlay" @click.self="clearForm">
    <div class="modal-content">
      <form @submit.prevent="handleSubmit">
        <h3 class="text-center mb-4">{{ isEditMode ? 'Editar Alumno' : 'Agregar Alumno' }}</h3>

        <h1>nombre apellido apellido</h1>
        <h2>matricula</h2>

        <!-- Contenedor para las flags -->
        <div class="flags-container">
          <span><flag />Green Flag</span>
          <span><flag />Yellow Flag</span>
          <span><flag />Red Flag</span>
        </div>

        <!-- Campos del formulario -->
        <div class="form-group mb-3" v-for="(label, key) in formFields" :key="key">
          <label :for="key">{{ label }}</label>
          <input type="text" :id="key" v-model="alumno[key]" class="form-control" :required="requiredFields.includes(key)" />
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
            },
            formVisible: false,
            isEditMode: false,
            formFields: {
                valor: 'Valor acción',
                comentario: 'Accion realizada',
                

            },
            requiredFields: ['nombres', 'apellidoP','apellidoM', 'rut', 'matricula', 'fecNac', 'fecIng']
        };
    },
}
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

.flags-container {
  display: flex;              /* Activa flexbox */
  flex-direction: column;     /* Ordena los elementos en columna */
  gap: 10px;                  /* Espaciado vertical entre las flags */
  justify-content: flex-start; /* Alinea las flags al inicio verticalmente */
  margin-top: 20px;           /* Espaciado superior opcional */
}

.flags-container {
  margin-top: 20px;           /* Espaciado superior */
}

.flags-container > * {
  margin-bottom: 25px;        /* Espaciado entre cada flag */
}
</style>