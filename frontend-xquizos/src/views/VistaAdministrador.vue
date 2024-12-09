<template>
  <div class="admin-container">
    <navBar/>
    <div class="content">
      <div class="transparent-box">
      <gestor-datos></gestor-datos>
   
      </div>
    </div>
  </div>
</template>

<script>
import navBar from '@/components/AppNavbarAdm.vue';
import autenticadorSesion from '@/mixins/AutenticadorSesion';  // Se debe agregar a nuevos componentes (Que puedan ser accedidos por ruta)
import axios from 'axios';
import gestorDatos from '@/views/GestorDatos.vue';

export default {
  name: 'VistaAdministrador',
  mixins: [autenticadorSesion],   // Se debe agregar a nuevos componentes (Que puedan ser accedidos por ruta)
  components: {
    navBar,
    gestorDatos
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
    /*async uploadFile() {
      console.log('Subir archivo');
      if (!this.selectedFile) {
        this.message = "Por favor, selecciona un archivo primero.";
        return;
      }
      
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      
      try {
        const response = await axios.post('http://localhost:3333/importDatos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.message = response.data.message;
      } catch (error) {
        console.error('Error al subir el archivo:', error);
      }
    },*/
    async uploadCursoFile() {
      console.log('Subir archivo de curso');
      if (!this.selectedFile) {
        this.message = "Por favor, selecciona un archivo primero.";
        return;
      }
      
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      
      try {
        const response = await axios.post('http://localhost:3333/csv/importProfesor', formData, {
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
  background-color: var(--background);
  width: 100vw; /* Asegúrate de que el contenedor ocupe todo el ancho de la ventana */
  height: calc(100vh - 80px);
  overflow: hidden; /* Evita que el contenido se desborde */
}

.content {
  margin:0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;/* Ajusta la altura del contenido */
  width: 100%;
  overflow: auto;
}

.transparent-box {
  width: 100%;
  max-width: 1400px; /* Limita el ancho del contenido */
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  height: auto;
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