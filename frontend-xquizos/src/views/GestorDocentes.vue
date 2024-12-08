<template>
    <navBar />
  
    <div class="maincontent">
      <div class="gestor-docentes-container">
        <!-- Botón de retroceso y título -->
        <div class="header-container">
          <button class="btn btn-secondary back-button" @click="goBack">
            <i class="fa-solid fa-circle-left"></i> Volver a GestorDatos
          </button>
          <h1 class="title">Gestor de Docentes</h1>
        </div>
  
        <!-- Lista de docentes con botones de acción -->
        <div class="section-title">
          <h3>Lista de Docentes</h3>
  
          <div class="action-buttons">
            <button class="btn btn-primary" @click="toggleForm('add')">
              <i class="fa-solid fa-user-plus"></i> Agregar Docente
            </button>
            <button class="btn btn-success" @click="generateExcel">
              <i class="fa-solid fa-file-csv"></i> Descargar en Excel
            </button>
            <button class="btn btn-success" @click="triggerFileInput">
              <i class="fa-solid fa-file-csv"></i> Importar CSV
            </button>
            <input type="file" ref="fileInput" @change="onFileSelected" style="display: none;" accept=".csv" />
          </div>
        </div>
  
        <!-- Tabla de docentes -->
        <div class="table-container">
          <table class="table table-striped table-hover table-bordered text-center">
            <thead class="thead-light">
              <tr>
                <th>Foto</th>
                <th>Nombre Completo</th>
                <th>Rut</th>
                <th>Título</th>
                <th>Grado Máximo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="docente in docentes" :key="docente.rut">
                <td>
                  <img class="img-fluid rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Avatar" />
                </td>
                <td>{{ docente.nombres }} {{ docente.apellidoP }} {{ docente.apellidoM }}</td>
                <td>{{ docente.rut }}</td>
                <td>{{ docente.titulo }}</td>
                <td>{{ docente.gradoMax }}</td>
                <td>
                  <button @click="viewDocente(docente)" class="btn btn-sm btn-primary mx-1">
                    <i class="far fa-eye"></i>
                  </button>
                  <button @click="toggleForm('edit', docente)" class="btn btn-sm btn-info mx-1">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button @click="deleteDocente(docente.rut)" class="btn btn-sm btn-danger mx-1">
                    <i class="far fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Modal del formulario -->
        <div v-if="formVisible" class="modal-overlay" @click.self="clearForm">
          <div class="modal-content">
            <form @submit.prevent="handleSubmit">
              <h3 class="text-center mb-4">{{ isEditMode ? 'Editar Docente' : 'Agregar Docente' }}</h3>
  
              <!-- Campos del formulario -->
              <div class="form-group mb-3" v-for="(label, key) in formFields" :key="key">
                <label :for="key">{{ label }}</label>
                <input type="text" :id="key" v-model="docente[key]" class="form-control" :required="requiredFields.includes(key)" />
              </div>
  
              <!-- Botones de acción -->
              <div class="d-flex justify-content-between mt-4">
                <button type="submit" class="btn btn-success">{{ isEditMode ? 'Actualizar' : 'Agregar' }}</button>
                <button type="button" class="btn btn-secondary" @click="clearForm">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import axios from 'axios';
import navBar from '@/components/AppNavbarAdm.vue';
import autenticadorSesion from '../mixins/AutenticadorSesion.js';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import _ from 'lodash';
export default {
    name: 'GestorDocentes',
    mixins: [autenticadorSesion],
    components: {
        navBar
    },
    data() {
        return {
            docentes: [],
            docente: {
                nombres: '',
                apellidoP: '',
                apellidoM: '',
                rut: '',
                titulo: '',
                gradoMax: ''
            },
            formVisible: false,
            isEditMode: false,
            formFields: {
                nombres: 'Nombre(s) del docente',
                apellidoP: 'Apellido Paterno',
                apellidoM: 'Apellido Materno',
                rut: 'Rut',
                titulo: 'Título',
                gradoMax: 'Grado Máximo',
            },
            requiredFields: ['nombres', 'apellidoP', 'apellidoM', 'rut', 'titulo', 'gradoMax']
        };
    },
    created() {
        this.fetchDocentes();
    },
    methods: {

        goBack() {
            this.$router.push({
                name: 'VistaAdministrador'
            });
        },
        async fetchDocentes() {
            try {
                const response = await axios.get('http://localhost:3333/api/teaching/get');
                this.docentes = response.data;
            } catch (error) {
                console.error('Error al obtener docentes:', error);
            }
        },
        toggleForm(mode, docente = {}) {
            this.isEditMode = mode === 'edit';
            this.docente = {
                ...docente
            };
            this.formVisible = !this.formVisible;
        },
        async handleSubmit() {
            if (this.isEditMode) {
                await this.updateDocente();
            } else {
                await this.addDocente();
            }
            this.clearForm();
        },
        async addDocente() {
            try {
                await axios.post('http://localhost:3333/api/teaching/register', this.docente);
                this.fetchDocentes();
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Profesor agregado exitosamente.',
                    confirmButtonText: 'Aceptar'
                });
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 409) {
                        // Código 409: Duplicado
                        Swal.fire({
                            icon: 'warning',
                            title: 'Registro duplicado',
                            text: 'El Profesor ya está registrado. Verifica los datos.',
                            confirmButtonText: 'Entendido'
                        })
                    } else {
                        // Otros errores con respuesta del servidor
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.response.data.message || 'Ocurrió un problema al agregar el Profesor.',
                            confirmButtonText: 'Aceptar'
                        });
                    }
                } else {
                    // Error sin respuesta del servidor (problemas de red, etc.)
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de conexión',
                        text: 'No se pudo conectar al servidor. Intenta nuevamente.',
                        confirmButtonText: 'Aceptar'
                    })
                }
            }
        },
        async updateDocente() {
            try {
                await axios.put(`http://localhost:3333/api/teaching/${this.docente.rut}`, this.docente);
                this.fetchDocentes();
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Profesor actualizado exitosamente.',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#5cb85c'
                });
            } catch (error) {
                console.error('Error al actualizar docente:', error);
            }
        },
        async deleteDocente(rut) {
            try {
                await axios.delete(`http://localhost:3333/api/teaching/remove/${rut}`);
                this.fetchDocentes();
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Profesor eliminado exitosamente.',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#d33'
                });
            } catch (error) {
                console.error('Error al eliminar Docente:', error);
            }
        },
        clearForm() {
            this.docente = {
                nombres: '',
                apellidoP: '',
                apellidoM: '',
                rut: '',
                titulo: '',
                gradoMax: ''
            };
            this.formVisible = false;
        },

        triggerFileInput() {
            this.$refs.fileInput.click();
        },

        handleAddFile() {
            this.$refs.fileInput.click();
        },

        onFileSelected(event) {
            this.selectedFile = event.target.files[0];
            //this.uploadFile();
            this.uploadDocenteFile(); // Llama a la nueva función para enviar el archivo a importCurso
        },

        async uploadDocenteFile() {
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

                if (response.data.success) {
                    // Aquí llamamos a fetchDocentes después de la subida exitosa del archivo
                    this.fetchDocentes();
                } else {
                    // En caso de que el servidor devuelva un error
                    console.error('Error en el archivo:', response.data.message);
                }
            } catch (error) {
                console.error('Error al subir el archivo de curso:', error);
            }
        },
        
        async generateExcel() {
            try {
                const response = await axios.get('http://localhost:3333/api/teaching/get');
        
                // Asegúrate de que response.data tenga los datos en formato JSON
                const data = response.data;
                const filteredData = data.map(obj => _.omit(obj, ['_id', '__v']));
                // Convertir los datos a una hoja de cálculo
                const worksheet = XLSX.utils.json_to_sheet(filteredData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

                // Exportar el archivo Excel
                XLSX.writeFile(workbook, 'Profesores.xlsx');
            } catch (error) {
                console.error('Error al generar el Excel:', error);
            }
        }
    }
};
</script>

<style scoped>
.maincontent {
  background-color: var(--background);
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-x: hidden;
}

.gestor-docentes-container {
  max-width: 1200px;
  width: 100%;
  margin: auto;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
  position: relative;
}

.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  padding: 10px 20px;
  margin-right: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  color: #333;
}

.back-button:hover {
  background-color: #e2e6ea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: #333;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  padding: 15px;
  border: 2px solid #eaeaea;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
  padding: 10px;
  border-bottom: 3px solid #3498db;
  background-color: #ffffff;
  display: inline-block;
  border-radius: 4px;
}

.section-title h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.table-container {
  overflow-x: auto;
  border-radius: 10px;
}

.table {
  border-radius: 10px;
  overflow: hidden;
}

.table td,
.table th {
  vertical-align: middle;
  padding: 10px;
}

.img-fluid.rounded-circle {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

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
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
}

body {
  background-size: cover;
  background-attachment: fixed; 
} 

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>