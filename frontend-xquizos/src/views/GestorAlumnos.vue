<template>
    <navBar />
    <div class="maincontent">
      <div class="gestor-alumnos-container">
        <!-- Botón de retroceso y título -->
        <div class="header-container">
          <button class="btn btn-secondary back-button" @click="goBack">
            <i class="fa-solid fa-circle-left"></i> Volver a GestorDatos
          </button>
          <h1 class="title">Gestor de Alumnos</h1>
        </div>
  
        <!-- Lista de alumnos con botones de acción -->
        <div class="section-title">
          <h3>Lista de Alumnos</h3>
  
          <div class="action-buttons">
            <button class="btn btn-primary" @click="toggleForm('add')">
              <i class="fa-solid fa-user-plus"></i> Agregar Alumno
            </button>
            <button class="btn btn-success" @click="generateExcel">
              <i class="fa-solid fa-file-csv"></i> Exportar Excel
            </button>
            <button class="btn btn-success" @click="triggerFileInput">
              <i class="fa-solid fa-file-csv"></i> Importar CSV
            </button>
            <input type="file" ref="fileInput" @change="onFileSelected" style="display: none;" accept=".csv" />
          </div>
        </div>
  
        <!-- Tabla de alumnos -->
        <div class="table-container">
          <table class="table table-striped table-hover table-bordered text-center">
            <thead class="thead-light">
              <tr>
                <th>Foto</th>
                <th>Nombre Completo</th>
                <th>Rut</th>
                <th>Matricula</th>
                <th>Fecha Nacimiento</th>
                <th>Fecha Ingreso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alumno in alumnos" :key="alumno.matricula">
                <td>
                  <img class="img-fluid rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Avatar" />
                </td>
                <td>{{ alumno.nombres }} {{ alumno.apellidoP }} {{ alumno.apellidoM }}</td>
                <td>{{ alumno.rut }}</td>
                <td>{{ alumno.matricula }}</td>
                <td><input type="date" v-model="alumno.fecNac" class="form-control" readonly></td>
                <td><input type="date" v-model="alumno.fecIng" class="form-control" readonly></td>
                <td>
                  <button @click="goperfilalumno(alumno.matricula, alumno.nombres)" class="btn btn-sm btn-primary mx-1">
                    <i class="far fa-eye"></i>
                  </button>
                  <button @click="toggleForm('edit', alumno)" class="btn btn-sm btn-info mx-1">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button @click="deleteAlumno(alumno.matricula)" class="btn btn-sm btn-danger mx-1">
                    <i class="far fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Formulario modal -->
        <div v-if="formVisible" class="modal-overlay" @click.self="clearForm">
          <div class="modal-content">
            <form @submit.prevent="handleSubmit">
              <h3 class="text-center mb-4">{{ isEditMode ? 'Editar Alumno' : 'Agregar Alumno' }}</h3>
  
              <!-- Campos del formulario -->
              <div class="form-group mb-3" v-for="(label, key) in formFields" :key="key">
                <label :for="key">{{ label }}</label>
                <input
                  :type="getInputType(key)"
                  :id="key"
                  v-model="alumno[key]"
                  class="form-control"
                  :required="requiredFields.includes(key)"
                />
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
    name: 'GestorAlumnos',
    mixins: [autenticadorSesion],
    components: {
      navBar
    },
    computed: {
      userRole() {
        const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
        return isAdmin === 'true' ? 'Administrador' : 'Docente';
      },
      // Computed property para verificar si el usuario es admin
      isAdmin() {
        return localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';
      }
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
          nombres: 'Nombre(s) del alumno',
          apellidoP: 'Apellido Paterno',
          apellidoM: 'Apellido Materno',
          rut: 'RUT',
          matricula: 'Numero de matrícula',
          fecNac: 'Fecha de nacimiento',
          fecIng: 'Fecha de ingreso'
        },
        requiredFields: ['nombres', 'apellidoP', 'apellidoM', 'rut', 'matricula', 'fecNac', 'fecIng']
      };
    },
    created() {
      this.fetchAlumnos();
    },
    methods: {
      goperfilalumno(matricula, nombrePrimer) {
        console.log('Datos enviados:', matricula, nombrePrimer); // Debug para confirmar los valores
        this.$router.push({
          name: 'PerfilAlumno',
          params: {
            matriculaalum: matricula,
            nombrealum: nombrePrimer,
            codCurso: 'admin',
            periodo: 'admin'
          }
        });
      },
      goBack() {
        this.$router.push({
          name: 'VistaAdministrador'
        });
      },
      async fetchAlumnos() {
        try {
          const response = await axios.get('http://localhost:3333/api/student/get');
          this.alumnos = response.data;
        } catch (error) {
          console.error('Error al obtener alumnos:', error);
        }
      },
      toggleForm(mode, alumno = {}) {
        this.isEditMode = mode === 'edit';
        this.alumno = {
          ...alumno
        };
        this.formVisible = !this.formVisible;
      },
      getInputType(key) {
        if (key === 'fecNac' || key === 'fecIng') {
          return 'date';
        }
        return 'text';
      },
      async handleSubmit() {
        if (this.isEditMode) {
          await this.updateAlumno();
        } else {
          await this.addAlumno();
        }
        this.clearForm();
      },
      async addAlumno() {
        try {
          // Enviar datos del alumno al backend
          await axios.post('http://localhost:3333/api/student/register', this.alumno);
  
          // Actualizar la lista de alumnos después de agregar uno nuevo
          this.fetchAlumnos();
  
          // Mostrar alerta de éxito
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Alumno agregado exitosamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4CAF50'
          });
        } catch (error) {
          // Mostrar detalles del error en la consola para depuración
          console.error('Error al agregar alumno:', error);
  
          // Manejar errores específicos basados en la respuesta del servidor
          if (error.response) {
            if (error.response.status === 409) {
              // Código 409: Duplicado
              Swal.fire({
                icon: 'warning',
                title: 'Registro duplicado',
                text: 'El alumno ya está registrado. Verifica los datos.',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#d33'
              })
            } else {
              // Otros errores con respuesta del servidor
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message || 'Ocurrió un problema al agregar el alumno.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
              });
            }
          } else {
            // Error sin respuesta del servidor (problemas de red, etc.)
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: 'No se pudo conectar al servidor. Intenta nuevamente.',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#d33'
            })
          }
        }
      },
      async updateAlumno() {
        try {
          await axios.put(`http://localhost:3333/api/student/${this.alumno.matricula}`, this.alumno);
          this.fetchAlumnos();
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Alumno actualizado exitosamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4CAF50'
          });
        } catch (error) {
          console.error('Error al actualizar alumno:', error);
        }
      },
      async deleteAlumno(matricula) {
        try {
          await axios.delete(`http://localhost:3333/api/student/remove/${matricula}`);
          this.fetchAlumnos();
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Alumno eliminado exitosamente.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4CAF50'
          });
        } catch (error) {
          console.error('Error al eliminar alumno:', error);
        }
      },
      clearForm() {
        this.alumno = {
          nombres: '',
          apellidoP: '',
          apellidoM: '',
          rut: '',
          matricula: '',
          fecNac: '',
          fecIng: ''
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
        this.uploadAlumnoFile(); // Llama a la nueva función para enviar el archivo a importCurso
      },
      async uploadAlumnoFile() {
        console.log('Subir archivo de curso');
        if (!this.selectedFile) {
          this.message = "Por favor, selecciona un archivo primero.";
          return;
        }
  
        const formData = new FormData();
        formData.append('file', this.selectedFile);
  
        try {
          const response = await axios.post('http://localhost:3333/csv/importEstudiante', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
  
          });
          this.message = response.data.message;
  
          if (response.data.success) {
            this.fetchAlumnos();
          } else {
            console.error('Error en el archivo:', response.data.message);
          }
  
        } catch (error) {
          console.error('Error al subir el archivo de curso:', error);
        }
      },
      async generateExcel() {
        try {
          const response = await axios.get('http://localhost:3333/api/student/get');
  
          // Asegúrate de que response.data tenga los datos en formato JSON
          const data = response.data;
          const filteredData = data.map(obj => _.omit(obj, ['_id', 'lista_de_acciones', '__v']));
          // Convertir los datos a una hoja de cálculo
          const worksheet = XLSX.utils.json_to_sheet(filteredData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  
          // Exportar el archivo Excel
          XLSX.writeFile(workbook, 'Alumnos.xlsx');
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
  
  .gestor-alumnos-container {
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
  
  .d-flex {
    justify-content: left;
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
    background-size: cover; /* Cubrir todo el contenedor */
    background-attachment: fixed; /* Fijar la imagen de fondo */
  }
  
  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  </style>