<template>
    <div class="gestor-alumnos-container container my-5">
      <h1 class="text-center mb-4">Gestor de Alumnos</h1>

          <!-- Botón para regresar a GestorDatos -->
        <div class="d-flex justify-content-start mb-4">
        <button class="btn btn-secondary" @click="goBack">
            <i class="fas fa-arrow-left"></i> Volver a GestorDatos
        </button>
        </div>
      
      <div class="d-flex justify-content-center mb-4">
        <!-- Botón para agregar alumno -->
        <button class="btn btn-primary" @click="toggleForm('add')">Agregar Alumno</button>
      </div>
      
      <!-- Formulario para agregar/editar alumno -->
      <div v-if="formVisible" class="form-container mx-auto p-4 bg-light border rounded shadow-sm" style="max-width: 600px;">
        <form @submit.prevent="handleSubmit">
          <h3 class="text-center mb-4">{{ isEditMode ? 'Editar Alumno' : 'Agregar Alumno' }}</h3>
          
          <div class="form-group mb-3">
            <label for="nombrePrimer">Primer Nombre:</label>
            <input type="text" v-model="alumno.nombrePrimer" class="form-control" required />
          </div>
  
          <div class="form-group mb-3">
            <label for="nombreSegundo">Segundo Nombre:</label>
            <input type="text" v-model="alumno.nombreSegundo" class="form-control" />
          </div>
          
          <div class="form-group mb-3">
            <label for="apellidoP">Apellido Paterno:</label>
            <input type="text" v-model="alumno.apellidoP" class="form-control" required />
          </div>
          
          <div class="form-group mb-3">
            <label for="apellidoM">Apellido Materno:</label>
            <input type="text" v-model="alumno.apellidoM" class="form-control" />
          </div>
          
          <div class="form-group mb-3">
            <label for="rut">RUT:</label>
            <input type="text" v-model="alumno.rut" class="form-control" required />
          </div>
          
          <div class="form-group mb-3">
            <label for="email">Email:</label>
            <input type="email" v-model="alumno.email" class="form-control" required />
          </div>
          
          <div class="form-group mb-3">
            <label for="matricula">Matrícula:</label>
            <input type="text" v-model="alumno.matricula" class="form-control" required />
          </div>
  
          <div class="form-group mb-3">
            <label for="carrera">Carrera:</label>
            <input type="text" v-model="alumno.carrera" class="form-control" required />
          </div>
  
          <div class="form-group mb-3">
            <label for="cursos">Cursos:</label>
            <div v-for="(curso, index) in alumno.cursos" :key="index" class="input-group mb-2">
              <input type="text" v-model="alumno.cursos[index].nombre" class="form-control" :placeholder="'Curso ' + (index + 1)" />
              <button type="button" class="btn btn-danger input-group-text" @click="removeCurso(index)">Eliminar</button>
            </div>
            <button type="button" class="btn btn-info" @click="addCurso">Agregar Curso</button>
          </div>
          
          <div class="d-flex justify-content-between mt-4">
            <button type="submit" class="btn btn-success">{{ isEditMode ? 'Actualizar' : 'Agregar' }}</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Cancelar</button>
          </div>
        </form>
      </div>
      
      <!-- Lista de alumnos -->
      <div class="alumno-list mt-5">
        <h3 class="text-center mb-4">Lista de Alumnos</h3>
        <div class="row">
          <div class="col-md-4" v-for="alumno in alumnos" :key="alumno.matricula">
            <div class="alumno-card card mb-4 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">{{ alumno.nombrePrimer }} {{ alumno.apellidoP }} {{ alumno.apellidoM }}</h5>
                <p class="card-text">Email: {{ alumno.email }}</p>
                <p class="card-text">Matrícula: {{ alumno.matricula }}</p>
                <p class="card-text">RUT: {{ alumno.rut }}</p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-warning btn-sm" @click="toggleForm('edit', alumno)">Editar</button>
                  <button class="btn btn-danger btn-sm" @click="deleteAlumno(alumno.matricula)">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'GestorAlumnos',
    data() {
      return {
        alumnos: [],  // Alumnos cargados desde el servidor
        alumno: { 
          nombrePrimer: '', 
          nombreSegundo: '', 
          apellidoP: '', 
          apellidoM: '', 
          rut: '', 
          email: '', 
          matricula: '', 
          carrera: '',
          cursos: [] // Inicializamos cursos como arreglo vacío
        },
        formVisible: false,
        isEditMode: false,
      };
    },
    created() {
      this.fetchAlumnos();
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'GestorDatos' });  // Redirige a la vista GestorDatos
        },
      async fetchAlumnos() {
        try {
          const response = await axios.get('http://localhost:3333/student/get');
          this.alumnos = response.data;
        } catch (error) {
          console.error('Error fetching alumnos:', error);
        }
      },
      toggleForm(mode, alumno = {}) {
        this.isEditMode = mode === 'edit';
        this.alumno = { ...alumno };
        this.formVisible = !this.formVisible;
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
          await axios.post('http://localhost:3333/student/register', this.alumno);
          this.fetchAlumnos();
        } catch (error) {
          console.error('Error adding alumno:', error);
        }
      },
      async updateAlumno() {
        try {
          await axios.put(`http://localhost:3333/student/${this.alumno.matricula}`, this.alumno);
          this.fetchAlumnos();
        } catch (error) {
          console.error('Error updating alumno:', error);
        }
      },
      async deleteAlumno(matricula) {
        try {
          await axios.delete(`http://localhost:3333/student/remove/${matricula}`);
          this.fetchAlumnos();
        } catch (error) {
          console.error('Error deleting alumno:', error);
        }
      },
      clearForm() {
        this.alumno = { nombrePrimer: '', nombreSegundo: '', apellidoP: '', apellidoM: '', rut: '', email: '', matricula: '', carrera: '', cursos: [] };
        this.formVisible = false;
      },
      addCurso() {
        this.alumno.cursos.push({ nombre: '' });
      },
      removeCurso(index) {
        this.alumno.cursos.splice(index, 1);
      }
    }
  };
  </script>
  
  <style scoped>
  .gestor-alumnos-container {
    padding-top: 30px;
    padding-bottom: 50px;
  }
  
  .form-container {
    background-color: #f8f9fa;
  }
  
  .alumno-list .alumno-card {
    border-radius: 8px;
  }
  
  .alumno-list .alumno-card .card-body {
    padding: 20px;
  }
  </style>
  
  
  