<template>
    <navBar />
  
    <div class="maincontent">
      <div class="gestor-cursos-container">
        <!-- Botón de retroceso y título -->
        <div class="header-container">
          <button class="btn btn-secondary back-button" @click="goBack">
            <i class="fa-solid fa-circle-left"></i> Volver a GestorDatos
          </button>
          <h1 class="title">Gestor de Cursos</h1>
        </div>
  
        <!-- Lista de cursos con botones de acción -->
        <div class="section-title">
          <h3>Lista de Cursos</h3>
  
          <div class="action-buttons">
            <button class="btn btn-primary" @click="toggleForm('add')">
              <i class="fa-solid fa-user-plus"></i> Agregar Curso
            </button>
            <button class="btn btn-success" @click="GenerarExcel">
              <i class="fa-solid fa-file-excel"></i> Exportar Cursos por Excel
            </button>
            <button class="btn btn-success" @click="triggerFileInput">
              <i class="fa-solid fa-file-import"></i> Importar Módulos por Excel
            </button>
            <input
              type="file"
              ref="fileInput"
              @change="onFileModulos"
              style="display: none;"
              accept=".xlsx, .xls"
            />
          </div>
        </div>
  
        <!-- Tabla de cursos -->
        <div class="table-container">
          <table class="table table-striped table-hover table-bordered text-center">
            <thead class="thead-light">
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
              <tr v-for="curso in cursos" :key="curso.codigo">
                <td>{{ curso.codigo }}</td>
                <td>{{ curso.carrera }}</td>
                <td>{{ curso.nombre }}</td>
                <td>{{ curso.semestre }}</td>
                <td>{{ curso.seccion }}</td>
                <td>
                  <button @click="viewCurso(curso)" class="btn btn-sm btn-primary mx-1">
                    <i class="far fa-eye"></i>
                  </button>
                  <button
                    @click="toggleForm('edit', curso)"
                    class="btn btn-sm btn-info mx-1"
                  >
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button
                    @click="deleteCurso(curso.codigo)"
                    class="btn btn-sm btn-danger mx-1"
                  >
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
              <h3 class="text-center mb-4">
                {{ isEditMode ? 'Editar Curso' : 'Agregar Curso' }}
              </h3>
  
              <!-- Campos del formulario -->
              <div
                class="form-group mb-3"
                v-for="(label, key) in formFields"
                :key="key"
              >
                <label :for="key">{{ label }}</label>
                <input
                  :type="getInputType(key)"
                  :id="key"
                  v-model="curso[key]"
                  class="form-control"
                  :required="requiredFields.includes(key)"
                />
              </div>
  
              <!-- Botones de acción -->
              <div class="d-flex justify-content-between mt-4">
                <button type="submit" class="btn btn-success">
                  {{ isEditMode ? 'Actualizar' : 'Agregar' }}
                </button>
                <button type="button" class="btn btn-secondary" @click="clearForm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import navBar from "@/components/AppNavbarAdm.vue";
  import autenticadorSesion from "../mixins/AutenticadorSesion.js";
  import Swal from "sweetalert2";
  import * as XLSX from "xlsx";
  import _ from "lodash";
  
  export default {
    name: "GestorCursos",
    mixins: [autenticadorSesion],
    components: {
      navBar,
    },
    data() {
      return {
        cursos: [],
        curso: {
          codigo: "",
          carrera: "",
          nombre: "",
          semestre: "",
          seccion: "",
        },
        formVisible: false,
        isEditMode: false,
        formFields: {
          codigo: "Código del curso",
          carrera: "Carrera",
          nombre: "Nombre Curso",
          semestre: "Semestre",
          seccion: "Sección",
        },
        requiredFields: ["codigo", "carrera", "nombre", "semestre", "seccion"],
      };
    },
    created() {
      this.fetchCursos();
    },
    methods: {
      goBack() {
        this.$router.push({ name: "VistaAdministrador" });
      },
      async fetchCursos() {
        try {
          const response = await axios.get("http://localhost:3333/api/courses/get");
          this.cursos = response.data;
        } catch (error) {
          console.error("Error al obtener cursos:", error);
        }
      },
      toggleForm(mode, curso = {}) {
        this.isEditMode = mode === "edit";
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
          await axios.post("http://localhost:3333/api/courses/register", this.curso);
          this.fetchCursos();
          Swal.fire("¡Éxito!", "Curso agregado exitosamente.", "success");
        } catch (error) {
          console.error("Error al agregar curso:", error);
          Swal.fire("Error", "No se pudo agregar el curso.", "error");
        }
      },
      async updateCurso() {
        try {
          await axios.put(
            `http://localhost:3333/api/courses/${this.curso.codigo}`,
            this.curso
          );
          this.fetchCursos();
          Swal.fire("¡Éxito!", "Curso actualizado exitosamente.", "success");
        } catch (error) {
          console.error("Error al actualizar curso:", error);
          Swal.fire("Error", "No se pudo actualizar el curso.", "error");
        }
      },
      async deleteCurso(codigo) {
        try {
          await axios.delete(`http://localhost:3333/api/courses/remove/${codigo}`);
          this.fetchCursos();
          Swal.fire("¡Éxito!", "Curso eliminado exitosamente.", "success");
        } catch (error) {
          console.error("Error al eliminar curso:", error);
          Swal.fire("Error", "No se pudo eliminar el curso.", "error");
        }
      },
      clearForm() {
        this.curso = {
          codigo: "",
          carrera: "",
          nombre: "",
          semestre: "",
          seccion: "",
        };
        this.formVisible = false;
      },
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      onFileModulos(event) {
        this.selectedFile = event.target.files[0];
        this.uploadModulosFile();
      },
      async uploadModulosFile() {
        if (!this.selectedFile) {
          Swal.fire("Advertencia", "Por favor selecciona un archivo.", "warning");
          return;
        }
  
        const formData = new FormData();
        formData.append("file", this.selectedFile);
  
        try {
          const response = await axios.post(
            "http://localhost:3333/csv/importModulos",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          if (response.data.success) {
            this.fetchCursos();
          }
        } catch (error) {
          console.error("Error al subir el archivo:", error);
        }
      },
      async GenerarExcel() {
        try {
          const response = await axios.get("http://localhost:3333/api/courses/get");
          const data = response.data.map((obj) => _.omit(obj, ["_id", "__v"]));
          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Cursos");
          XLSX.writeFile(workbook, "Cursos.xlsx");
        } catch (error) {
          console.error("Error al generar el Excel:", error);
        }
      },
      getInputType(key) {
        const inputTypes = {
          codigo: "text",
          carrera: "text",
          nombre: "text",
          semestre: "number",
          seccion: "text",
        };
        return inputTypes[key] || "text";
      },
    },
  };
</script>

<style scoped>
/* Fondo de la página */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

/* Contenedor principal */
.maincontent {
  background-color: var(--background);
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-x: hidden;
}

/* Contenedor de Gestor de Cursos */
.gestor-cursos-container {
  max-width: 1200px;
  width: 100%;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.9); /* Añadido opacidad */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* Header */
.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
  position: relative;
}

/* Botón de retroceso */
.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  padding: 10px 20px;
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

/* Título */
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

/* Sección de título y botones de acción */
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

.action-buttons {
  display: flex;
  gap: 10px;
}

/* Contenedor de la tabla */
.table-container {
  overflow-x: auto;
  border-radius: 10px;
}

/* Estilos de la tabla */
.table {
  border-radius: 10px;
  overflow: hidden;
}

.table td,
.table th {
  vertical-align: middle;
  padding: 10px;
}

/* Imágenes redondas */
.img-fluid.rounded-circle {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

/* Modal */
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
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
}

/* Responsividad */
@media (max-width: 768px) {
  .section-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-buttons .btn {
    width: 100%;
  }
}
</style>
