<template>
    <navBar />
    <div class="maincontent">
      <div class="gestor-cursos-periodo-container">
        <!-- Botón de retroceso y título -->
        <div class="header-container">
          <button class="btn btn-secondary back-button" @click="goBack">
            <i class="fa-solid fa-circle-left"></i> Volver a GestorDatos
          </button>
          <h1 class="title">Gestor de Cursos Periodo</h1>
        </div>
  
        <!-- Lista de cursos periodo con botones de acción -->
        <div class="section-title">
          <h3>Lista de Cursos Periodo</h3>
  
          <div class="action-buttons">
            <button class="btn btn-primary" @click="toggleForm('add')">
              <i class="fa-solid fa-user-plus"></i> Agregar Curso
            </button>
            <button class="btn btn-success" @click="GenerarExcel">
              <i class="fa-solid fa-file-excel"></i> Exportar Cursos por Excel
            </button>
            <button class="btn btn-success" @click="triggerFileInput">
              <i class="fa-solid fa-file-csv"></i> Importar desde CSV
            </button>
            <input
              type="file"
              ref="fileInput"
              @change="onFileCurso"
              style="display: none;"
              accept=".csv"
            />
          </div>
        </div>
  
        <!-- Tabla de cursos periodo -->
        <div class="table-container">
          <table class="table table-striped table-hover table-bordered text-center">
            <thead class="thead-light">
              <tr>
                <th>Código Curso</th>
                <th>Rut del Docente</th>
                <th>Nombre</th>
                <th>Sección</th>
                <th>Semestre</th>
                <th>Periodo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="cursoPeriodo in cursosPeriodo"
                :key="getCursoPeriodoKey(cursoPeriodo)"
              >
                <td>{{ cursoPeriodo.codCurso }}</td>
                <td>{{ cursoPeriodo.codDocente }}</td>
                <td>{{ cursoPeriodo.course[0]?.nombre }}</td>
                <td>{{ cursoPeriodo.course[0]?.seccion }}</td>
                <td>{{ cursoPeriodo.course[0]?.semestre }}</td>
                <td>{{ cursoPeriodo.periodo }}</td>
                <td>
                  <button
                    @click="viewCurso(cursoPeriodo)"
                    class="btn btn-sm btn-primary mx-1"
                  >
                    <i class="far fa-eye"></i>
                  </button>
                  <button
                    @click="deleteCursoPeriodo(cursoPeriodo.codCurso)"
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
                {{ isEditMode ? "Editar Curso" : "Agregar Curso" }}
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
                  v-model="cursoPeriodo[key]"
                  class="form-control"
                  :required="requiredFields.includes(key)"
                />
              </div>
  
              <!-- Botones de acción -->
              <div class="d-flex justify-content-between mt-4">
                <button type="submit" class="btn btn-success">
                  {{ isEditMode ? "Actualizar" : "Agregar" }}
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="clearForm"
                >
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
  
  export default {
    name: "GestorCursosPeriodo",
    mixins: [autenticadorSesion],
    components: {
      navBar,
    },
    data() {
      return {
        cursosPeriodo: [],
        cursoPeriodo: {
          codCurso: "",
          codDocente: "",
          periodo: "",
        },
        formVisible: false,
        isEditMode: false,
        formFields: {
          codCurso: "Código del Curso",
          codDocente: "Rut del Docente (opcional)",
          periodo: "Periodo (Año)",
        },
        requiredFields: ["codCurso", "periodo"],
      };
    },
    created() {
      this.fetchCursosPeriodo();
    },
    methods: {
      viewCurso(cursoPeriodo){
            console.log(cursoPeriodo.codCurso);
            this.$router.push({
                name: 'CursoPeriodo',
                params: {
                    nombre: cursoPeriodo.course[0].nombre,
                    seccion: cursoPeriodo.course[0].seccion,
                    semestre: cursoPeriodo.course[0].semestre,
                    codCurso: cursoPeriodo.codCurso,
                    periodo: cursoPeriodo.periodo
                }
            });
        },
      getCursoPeriodoKey(cursoPeriodo) {
        return `${cursoPeriodo.codCurso}-${cursoPeriodo.periodo}`;
      },
      goBack() {
        this.$router.push({ name: "VistaAdministrador" });
      },
      async fetchCursosPeriodo() {
        try {
          const response = await axios.get(
            "http://localhost:3333/api/courseInstance/get"
          );
          this.cursosPeriodo = response.data.courseInstances;
        } catch (error) {
          Swal.fire("Error", "No se pudieron obtener los cursos.", "error");
        }
      },
      toggleForm(mode, cursoPeriodo = {}) {
        this.isEditMode = mode === "edit";
        this.cursoPeriodo = { ...cursoPeriodo };
        this.formVisible = !this.formVisible;
      },
      async handleSubmit() {
        if (this.isEditMode) {
          await this.updateCursoPeriodo();
        } else {
          await this.addCursoPeriodo();
        }
        this.clearForm();
      },
      async addCursoPeriodo() {
        try {
          await axios.post(
            "http://localhost:3333/api/courseInstance/register",
            this.cursoPeriodo
          );
          this.fetchCursosPeriodo();
          Swal.fire("¡Éxito!", "Curso Periodo agregado exitosamente.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo agregar el curso.", "error");
        }
      },
      async updateCursoPeriodo() {
        try {
          await axios.put(
            `http://localhost:3333/api/courseInstance/update/${this.cursoPeriodo.codCurso}`,
            this.cursoPeriodo
          );
          this.fetchCursosPeriodo();
          Swal.fire("¡Éxito!", "Curso Periodo actualizado exitosamente.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo actualizar el curso.", "error");
        }
      },
      async deleteCursoPeriodo(codCurso) {
        try {
          await axios.delete(
            `http://localhost:3333/api/courseInstance/remove/${codCurso}`
          );
          this.fetchCursosPeriodo();
          Swal.fire("¡Éxito!", "Curso eliminado exitosamente.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el curso.", "error");
        }
      },
      clearForm() {
        this.cursoPeriodo = { codCurso: "", codDocente: "", periodo: "" };
        this.formVisible = false;
      },
      triggerFileInput() {
        this.$refs.fileInput.click();
      },
      async uploadCursoFile() {
        if (!this.selectedFile) {
          Swal.fire("Advertencia", "Selecciona un archivo primero.", "warning");
          return;
        }
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        try {
          const response = await axios.post(
            "http://localhost:3333/csv/importCurso",
            formData
          );
          if (response.data.success) {
            this.fetchCursosPeriodo();
            Swal.fire(
              "¡Éxito!",
              "Cursos importados correctamente.",
              "success"
            );
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo importar el archivo.", "error");
        }
      },
      getInputType(key) {
        const inputTypes = {
          codCurso: "text",
          codDocente: "text",
          periodo: "number",
        };
        return inputTypes[key] || "text";
      },
    },
  };
</script>
<style scoped>
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.maincontent {
  background-color: var(--background);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-x: hidden;
}

.gestor-cursos-periodo-container {
  max-width: 1200px;
  width: 100%;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
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
  display: flex;
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

  .back-button {
    position: static;
    transform: none;
    margin-bottom: 10px;
  }
}
</style>

