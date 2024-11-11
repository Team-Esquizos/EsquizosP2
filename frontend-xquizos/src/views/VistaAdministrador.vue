<template>
  <div class="admin-container">
    <navBar/>
    <div class="content">
      <div class="transparent-box">
        <h1 class="highlight-title">Administrador de cursos</h1>
        <div class="button-container">
          <div class="button-wrapper">
            <p class="button-name">Añadir archivo</p>
            <!-- Botón para abrir la ventana de selección de archivo -->
            <a href="#" @click.prevent="handleAddFile">
              <svg viewBox="0 0 256 256" height="32" width="38" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M74.34 85.66a8 8 0 0 1 11.32-11.32L120 108.69V24a8 8 0 0 1 16 0v84.69l34.34-34.35a8 8 0 0 1 11.32 11.32l-48 48a8 8 0 0 1-11.32 0ZM240 136v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-64a16 16 0 0 1 16-16h52.4a4 4 0 0 1 2.83 1.17L111 145a24 24 0 0 0 34 0l23.8-23.8a4 4 0 0 1 2.8-1.2H224a16 16 0 0 1 16 16m-40 32a12 12 0 1 0-12 12a12 12 0 0 0 12-12"
                  fill="currentColor"
                ></path>
              </svg>
            </a>
            <!-- Input file oculto -->
            <input
              type="file"
              ref="fileInput"
              style="display: none;"
              @change="onFileSelected"
            />
          </div>
      
          <div class="button-wrapper">
            <p class="button-name">Editar cursos</p>
            <button class="Btn" @click.prevent="handleEditCourses">
              Editar
              <svg class="svg" viewBox="0 0 512 512">
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
              </svg>
            </button>
          </div>

          <!--- Botón gestor de datos !--->
          <div class="button-wrapper">
            <router-link to="/gestorDatos" class="btn btn-primary">
              <p class="Btn">Gestor de datos</p>
            </router-link>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/AppNavbar.vue';
import autenticadorSesion from '@/mixins/AutenticadorSesion';
import axios from 'axios';

export default {
  name: 'VistaAdministrador',
  mixins: [autenticadorSesion],
  components: {
    navBar
  },
  data() {
    return {
      selectedFile: null,
      message: "",
    };
  },
  methods: {
    handleAddFile() {
      this.$refs.fileInput.click();
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      //this.uploadFile();
      this.uploadCursoFile(); // Llama a la nueva función para enviar el archivo a importCurso
    },
    async uploadFile() {
      console.log('Subir archivo');
      if (!this.selectedFile) {
        this.message = "Por favor, selecciona un archivo primero.";
        return;
      }
      
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      
      try {
        const response = await axios.post('http://localhost:8081/importDatos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.message = response.data.message;
      } catch (error) {
        console.error('Error al subir el archivo:', error);
      }
    },
    async uploadCursoFile() {
      console.log('Subir archivo de curso');
      if (!this.selectedFile) {
        this.message = "Por favor, selecciona un archivo primero.";
        return;
      }
      
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      
      try {
        const response = await axios.post('http://localhost:8081/importCurso', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.message = response.data.message;
      } catch (error) {
        console.error('Error al subir el archivo de curso:', error);
      }
    },
    handleEditCourses() {
      // Lógica para editar cursos
      console.log('Editar cursos');
    }
  }
};
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
  background-image: url('../assets/oficina.jpg'); /* Ruta a tu imagen de fondo */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw; /* Asegúrate de que el contenedor ocupe todo el ancho de la ventana */
  height: calc(100vh - 60px);
  overflow: hidden; /* Evita que el contenido se desborde */
}

.content {
  margin-top: 100px; /* Ajusta este valor según la altura de tu navbar */
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px); /* Ajusta la altura del contenido */
  width: 100%;
}

.transparent-box {
  background-color: rgba(255, 255, 255, 0.3); /* Fondo blanco medio transparente */
  backdrop-filter: blur(10px); /* Aplica el efecto de desenfoque */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px #007bff;
  text-align: center;
  width: 80%; /* Ajusta el ancho del rectángulo */
  max-width: 800px; /* Ancho máximo del rectángulo */
  height: auto; /* Ajusta la altura automáticamente */
  min-height: 200px; /* Altura mínima del rectángulo */
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 120px; /* Espacio entre los botones */
  margin-top: 100px;
}

.button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-name {
  margin-bottom: 5px;
  font-weight: bold;
}

/* From Uiverse.io by cybrejon */
a {
  color: rgba(0, 0, 0, 0.692); /* Cambiado a negro */
  padding: 30px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.397);
  background: rgba(255, 255, 255, 0.068);
  overflow: hidden;
  font-size: 0.9rem;
  font-weight: 600;
  gap: 8px;
  border-radius: 5px;
  margin: 0 5px;
  transition: 0.2s;
  border: 1px solid transparent;
}

a:hover {
  border-color: #007bff;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.144),
    rgba(255, 255, 255, 0.247),
    rgba(255, 255, 255, 0.39)
  );
  box-shadow: 0 6px #007bff;
  transform: translateY(-6px);
}

a:active {
  transform: translateY(2px);
  box-shadow: none;
}

h1 {
  color: #333;
  font-size: 2em;
  margin-bottom: 10px;
}

p {
  color: #666;
  font-size: 1.2em;
}

.Btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 120px;
  height: 60px;
  border: none;
  padding: 20px 20px;
  background-color:#007bff;
  color: white;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 5px 5px 0px#007bff;
  transition-duration: .3s;
  top: 10px;
}

.svg {
  width: 13px;
  position: absolute;
  right: 0;
  margin-right: 20px;
  fill: white;
  transition-duration: .3s;
}

.Btn:hover {
  color: transparent;
}

.Btn:hover svg {
  right: 43%;
  margin: 0;
  padding: 0;
  border: none;
  transition-duration: .3s;
}

.Btn:active {
  transform: translate(3px , 3px);
  transition-duration: .3s;
  box-shadow: 2px 2px 0px rgb(140, 32, 212);
}

.highlight-title {
  color: #333;
  font-size: 2.5em; /* Aumenta el tamaño de la fuente */
  font-weight: bold; /* Hace el texto más audaz */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Agrega una sombra al texto */
  margin-bottom: 20px; /* Aumenta el espacio inferior */
}
</style>