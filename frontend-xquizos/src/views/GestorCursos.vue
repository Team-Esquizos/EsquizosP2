<template>
    <img src="../assets/fondogestor2.jpg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
    <navBar />
  
    <div class="gestor-cursos-container container my-5" style="opacity: 0.9;">
      <div class="header-container container my-5">
          <div class="d-flex align-items-center">
              <button class="btn btn-secondary back-button" @click="goBack">
                  <i class="fa-solid fa-circle-left"></i> Volver a GestorDatos
              </button>
  
              <h1 class="title" style="border-radius: 15px;">Gestor de Cursos</h1>
          </div>
      </div>
  
      <div v-if="formVisible" class="modal-overlay" @click.self="clearForm">
          <div class="modal-content">
              <form @submit.prevent="handleSubmit">
                  <h3 class="text-center mb-4">{{ isEditMode ? 'Editar Curso' : 'Agregar Curso' }}</h3>
  
                  <div class="form-group mb-3" v-for="(label, key) in formFields" :key="key">
                      <label :for="key">{{ label }}</label>
                      <input type="text" :id="key" v-model="curso[key]" class="form-control" :required="requiredFields.includes(key)" />
                  </div>
  
                  <div class="d-flex justify-content-between mt-4">
                      <button type="submit" class="btn btn-success">{{ isEditMode ? 'Actualizar' : 'Agregar' }}</button>
                      <button type="button" class="btn btn-secondary" @click="clearForm">Cancelar</button>
                  </div>
              </form>
          </div>
      </div>
  
      <div class="d-flex align-items-center justify-content-between section-title mb-4">
          <h3 style="border-radius: 15px;">Lista de Cursos</h3>
          <div class="d-flex">
              <button class="btn btn-primary" @click="toggleForm('add')"><i class="fa-solid fa-user-plus"></i> Agregar Curso</button>
              <div class="ms-2">
                  <input type="file" ref="fileInput" @change="onFileSelected" style="display: none;" accept=".csv" />
                  <button class="btn btn-success" @click="triggerFileInput">
                      <i class="fa-solid fa-file-csv"></i> Importar desde CSV
                  </button>
  
                  <input type="file" ref="fileInput" @change="onFileAlumnos" style="display: none;" accept=".csv" />
                  <button class="btn btn-success" @click="triggerFileInput">
                      <i class="fa-solid fa-file-csv"></i> Importar alumnos por CSV
                  </button>
  
                  <input type="file" ref="fileInput" @change="onFileModulos" style="display: none;" accept=".xlsx" />
                  <button class="btn btn-success" @click="triggerFileInput">
                      <i class="fa-solid fa-file-"></i> Importar Modulos por excel
                  </button>
              </div>
          </div>
      </div>
  
      <div class="table-responsive" ref="tableContainer" style="border-radius: 15px;">
          <table class="table table-striped table-hover table-bordered text-center">
              <thead class="thead-light" style="position: sticky; top: 0; z-index: 1; background-color: white;">
                  <tr>
                      <th>Código</th>
                      <th>Carrera</th>
                      <th>Nombre</th>
                      <th>Semestre</th>
                      <th>Sección</th>
                      <th>Acciones</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="curso in paginatedCursos" :key="curso.nombre + '-' + curso.seccion">
                      <td class="align-middle">{{ curso.codigo }}</td>
                      <td class="align-middle">{{ curso.carrera }}</td>
                      <td class="align-middle">{{ curso.nombre }}</td>
                      <td class="align-middle">{{ curso.semestre }}</td>
                      <td class="align-middle">{{ curso.seccion }}</td>
                      <td class="align-middle">
                          <button @click="viewCurso(curso)" class="btn btn-sm btn-primary mx-1">
                              <i class="far fa-eye"></i>
                          </button>
                          <button @click="toggleForm('edit', curso)" class="btn btn-sm btn-info mx-1">
                              <i class="fas fa-pencil-alt"></i>
                          </button>
                          <button @click="deleteCurso(curso.nombre, curso.seccion)" class="btn btn-sm btn-danger mx-1">
                              <i class="far fa-trash-alt"></i>
                          </button>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  
      <!-- Paginación -->
      <div class="pagination-container d-flex justify-content-center mt-4">
          <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="btn btn-secondary mx-2">
              Anterior
          </button>
          <button v-for="page in totalPages" :key="page" :class="{'btn-primary': page === currentPage, 'btn-outline-primary': page !== currentPage}" class="btn mx-1" @click="changePage(page)">
              {{ page }}
          </button>
          <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" class="btn btn-secondary mx-2">
              Siguiente
          </button>
      </div>
  </div>
  </template>
  

  <script>
  import axios from 'axios';
  import navBar from '@/components/AppNavbarAdm.vue';
  import autenticadorSesion from '../mixins/AutenticadorSesion.js';
  import Swal from 'sweetalert2';
  
  export default {
      name: 'GestorCursos',
      mixins: [autenticadorSesion],
      components: {
          navBar
      },
      data() {
          return {
              cursos: [],
              curso: {
                  codigo: '',
                  carrera: '',
                  nombre: '',
                  semestre: '',
                  seccion: ''
              },
              formVisible: false,
              isEditMode: false,
              formFields: {
                  codigo: 'Código del curso',
                  carrera: 'Carrera',
                  nombre: 'Nombre Curso',
                  semestre: 'Semestre',
                  seccion: 'Sección'
              },
              requiredFields: ['codigo', 'carrera', 'nombre', 'semestre', 'seccion'],
              currentPage: 1, // Página actual
              perPage: 5, // Número de cursos por página
              totalPages: 1 // Total de páginas (se actualizará dinámicamente)
          };
      },
      created() {
          this.fetchCursos();
      },
      computed: {
          // Cursos para la página actual
          paginatedCursos() {
              const start = (this.currentPage - 1) * this.perPage;
              const end = start + this.perPage;
              return this.cursos.slice(start, end);
          }
      },
      methods: {
          goBack() {
              this.$router.push({
                  name: 'VistaAdministrador'
              });
          },
  
          async fetchCursos() {
              try {
                  const response = await axios.get('http://localhost:3333/api/courses/get');
                  this.cursos = response.data;
                  this.totalPages = Math.ceil(this.cursos.length / this.perPage);
              } catch (error) {
                  console.error('Error al obtener cursos:', error);
              }
          },
  
          changePage(page) {
              if (page >= 1 && page <= this.totalPages) {
                  this.currentPage = page;
              }
          },
  
          toggleForm(mode, curso = {}) {
              this.isEditMode = mode === 'edit';
              this.curso = { ...curso };
              this.formVisible = !this.formVisible;
          },
  
          async handleSubmit() {
              if (this.isEditMode) {
                  await this.updateCurso();
              } else {
                  await this.addCurso();
              }
              this.clearForm();
          },
  
          async addCurso() {
              try {
                  await axios.post('http://localhost:3333/api/courses/register', this.curso);
                  this.fetchCursos();
                  Swal.fire({
                      icon: 'success',
                      title: '¡Éxito!',
                      text: 'Curso agregado exitosamente.',
                      confirmButtonText: 'Aceptar'
                  });
              } catch (error) {
                  console.error('Error al agregar Curso:', error);
              }
          },
  
          async updateCurso() {
              try {
                  await axios.put('http://localhost:3333/api/courses/update', this.curso);
                  this.fetchCursos();
                  Swal.fire({
                      icon: 'success',
                      title: '¡Éxito!',
                      text: 'Curso actualizado exitosamente.',
                      confirmButtonText: 'Aceptar'
                  });
              } catch (error) {
                  console.error('Error al actualizar Curso:', error);
              }
          },
  
          async deleteCurso(codigo, seccion) {
              try {
                  await axios.delete(`http://localhost:3333/api/courses/delete/${codigo}/${seccion}`);
                  this.fetchCursos();
                  Swal.fire({
                      icon: 'success',
                      title: '¡Éxito!',
                      text: 'Curso eliminado exitosamente.',
                      confirmButtonText: 'Aceptar'
                  });
              } catch (error) {
                  console.error('Error al eliminar Curso:', error);
              }
          },
  
          clearForm() {
              this.formVisible = false;
              this.curso = {
                  codigo: '',
                  carrera: '',
                  nombre: '',
                  semestre: '',
                  seccion: ''
              };
          },
  
          viewCurso(curso) {
              console.log(curso);
          },
  
          triggerFileInput() {
              this.$refs.fileInput.click();
          },
  
          onFileSelected(event) {
              const file = event.target.files[0];
              if (file) {
                  const formData = new FormData();
                  formData.append('file', file);
                  axios.post('http://localhost:3333/api/courses/import', formData, {
                      headers: {
                          'Content-Type': 'multipart/form-data'
                      }
                  })
                  .then(() => {
                      this.fetchCursos();
                      Swal.fire('¡Éxito!', 'Archivo CSV importado exitosamente', 'success');
                  })
                  .catch(() => {
                      Swal.fire('Error', 'Ocurrió un error al importar el archivo', 'error');
                  });
              }
          },
  
          onFileAlumnos(event) {
              const file = event.target.files[0];
              if (file) {
                  const formData = new FormData();
                  formData.append('file', file);
                  axios.post('http://localhost:3333/api/courses/import-alumnos', formData, {
                      headers: {
                          'Content-Type': 'multipart/form-data'
                      }
                  })
                  .then(() => {
                      this.fetchCursos();
                      Swal.fire('¡Éxito!', 'Alumnos importados exitosamente', 'success');
                  })
                  .catch(() => {
                      Swal.fire('Error', 'Ocurrió un error al importar el archivo', 'error');
                  });
              }
          },
  
          onFileModulos(event) {
              const file = event.target.files[0];
              if (file) {
                  const formData = new FormData();
                  formData.append('file', file);
                  axios.post('http://localhost:3333/api/courses/import-modulos', formData, {
                      headers: {
                          'Content-Type': 'multipart/form-data'
                      }
                  })
                  .then(() => {
                      this.fetchCursos();
                      Swal.fire('¡Éxito!', 'Módulos importados exitosamente', 'success');
                  })
                  .catch(() => {
                      Swal.fire('Error', 'Ocurrió un error al importar el archivo', 'error');
                  });
              }
          }
      }
  };
  </script>
  

<style scoped>
.gestor-cursos-container {
    padding-top: 30px;
    padding-bottom: 50px;
}

.d-flex {
    justify-content: left;
}

.back-button {
    margin-right: 20px;
}

.title {
    font-size: 2.5rem;
    font-weight: bold;
    color: #2c3e50;
    padding: 15px;
    border: 2px solid #eaeaea;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
    flex-grow: 1;
    /* Permite al título ocupar el espacio restante */
}

.section-title h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #34495e;
    padding: 10px;
    margin-bottom: 0;
    background-color: #ffffff;
    display: inline-block;
    border-radius: 4px;
}

.section-title h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #34495e;
    padding: 10px;
    border-bottom: 3px solid #3498db;
    margin-bottom: 20px;
    background-color: #ffffff;
    display: inline-block;
    border-radius: 4px;
}

.table td,
.table th {
    vertical-align: middle;
}

.img-fluid.rounded-circle {
    width: 50px;
    height: 50px;
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
</style>
