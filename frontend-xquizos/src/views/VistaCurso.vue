<template>
    <div>
      <navBar />
      <div class="maincontent">
        <div class="gestor-docentes-container">
          <div class="container mt-4">
            <div class="row justify-content-center">
              <div class="col-md-8">
                <div class="card shadow-lg border-0">
                  <div class="card-header bg-primary text-white text-center">
                    <h4 class="mb-0">
                      <i class="bi bi-journal-bookmark-fill me-2"></i>
                      {{ nombre }} // SECCIÓN {{ seccion }}
                    </h4>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title text-center text-secondary">
                      <i class="bi bi-calendar-event me-1"></i>
                      Semestre dictado: {{ semestre }}
                    </h5>
                    <ul class="list-group list-group-flush mt-4">
                      <li class="list-group-item">
                        <i class="bi bi-code me-2 text-primary"></i>
                        <strong>Código del Curso:</strong> {{ codCurso }}
                      </li>
                    </ul>
  
                    <h5 class="text-center text-primary mt-4">Aprendizajes</h5>
                    <ul class="list-group mt-3">
                      <li
                        v-for="aprendizaje in aprendizajes"
                        :key="aprendizaje._id"
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {{ aprendizaje.aprendizaje }}
                        <button
                          class="btn btn-outline-danger btn-sm"
                          @click="eliminarAprendizaje(aprendizaje._id)"
                        >
                          <i class="bi bi-trash"></i> Eliminar
                        </button>
                      </li>
                    </ul>
  
                    <p v-if="aprendizajes.length === 0" class="text-center mt-3 text-muted">
                      No hay aprendizajes registrados para este curso.
                    </p>
  
                    <div class="d-flex justify-content-center mt-4">
                      <button
                        class="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#agregarAprendizajeModal"
                      >
                        <i class="bi bi-plus-circle me-2"></i> Agregar Aprendizaje
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal -->
      <div
        class="modal fade"
        id="agregarAprendizajeModal"
        tabindex="-1"
        aria-labelledby="agregarAprendizajeLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="agregarAprendizajeLabel">Agregar Aprendizaje</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="agregarAprendizaje()">
                <div class="mb-3 text-center">
                  <label for="aprendizaje" class="form-label">Selecciona un aprendizaje</label>
                  <select
                    v-model="aprendizajeSeleccionado"
                    class="form-select mx-auto"
                    id="aprendizaje"
                    style="width: 70%;"
                    required
                  >
                    <option disabled value="">-- Selecciona un aprendizaje --</option>
                    <option
                      v-for="option in opciones"
                      :key="option._id"
                      :value="option._id"
                    >
                      {{ option.aprendizaje }}
                    </option>
                  </select>
                </div>
                <div class="text-end">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    Cancelar
                  </button>
                  <button type="submit" class="btn btn-primary">Agregar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import navBar from "@/components/AppNavbarAdm.vue";
  import axios from "axios";
  import bootstrap from "bootstrap";
  
  export default {
    name: "VistaCurso",
    components: { navBar },
    props: ["nombre", "seccion", "semestre", "codCurso"],
    data() {
      return {
        aprendizajes: [],
        opciones: [],
        aprendizajeSeleccionado: null,
      };
    },
    mounted() {
      this.obtenerAprendizajes();
      this.obtenerOpciones();
    },
    methods: {
      async obtenerAprendizajes() {
        try {
          const response = await axios.get(
            `http://localhost:3333/api/courseLearnings/getFromCourse/${this.codCurso}`
          );
          if (response.status) {
            this.aprendizajes = response.data;
          } else {
            console.error(response.msg);
          }
        } catch (error) {
          console.error("Error al obtener aprendizajes:", error);
        }
      },
      async obtenerOpciones() {
        try {
          const response = await axios.get("http://localhost:3333/api/learning/get");
          this.opciones = response.data;
        } catch (error) {
          console.error("Error al obtener las opciones:", error);
        }
      },
      async agregarAprendizaje() {
        try {
          const id = this.aprendizajeSeleccionado;
          if (!id) {
            console.error("No se seleccionó ningún aprendizaje.");
            return;
          }
          const response = await axios.post(
            `http://localhost:3333/api/courseLearnings/addToCourse/${this.codCurso}/${id}`
          );
          if (response.status === 200) {
            this.aprendizajes.push(response.data);
            this.aprendizajeSeleccionado = null;
            const modalElement = document.getElementById("agregarAprendizajeModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            this.obtenerAprendizajes();
            if (modalInstance) modalInstance.hide();
          } else {
            console.error("Error al agregar aprendizaje:", response.data.msg);
          }
        } catch (error) {
          console.error("Error al agregar aprendizaje:", error);
        }
      },
      async eliminarAprendizaje(id) {
        try {
          const response = await axios.delete(
            `http://localhost:3333/api/courseLearnings/remove/${this.codCurso}/${id}`
          );
          if (response.status === 200) {
            this.aprendizajes = this.aprendizajes.filter(
              (aprendizaje) => aprendizaje._id !== id
            );
            this.obtenerAprendizajes();
          } else {
            console.error("Error al eliminar aprendizaje:", response.data.msg);
          }
        } catch (error) {
          console.error("Error al intentar eliminar el aprendizaje:", error);
        }
      },
    },
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
.modal-lower {
  margin-top: 150px; /* Ajusta este valor según lo que necesites */
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
.card {
  display: grid;
  
  width: 100%  ;
  margin-top: 3vw;
    margin-bottom: 1vw;
    margin: 0;
}

.card-header {
    background: linear-gradient(45deg, #007bff, #4facfe);
}

.card-header h4 {
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.card-title {
    font-weight: 600;
}

.list-group-item {
    font-size: 1rem;
}

.list-group-item.selected {
    background-color: #007bff;
    color: white;
}

.btn-outline-primary:hover {
    background-color: #007bff;
    color: #fff;
}

.btn-outline-danger:hover {
    background-color: #dc3545;
    color: #fff;
}

.card-footer {
    font-size: 0.85rem;
}

.text-primary {
  color: #007bff !important;
}

.text-center {
  text-align: center !important;
}

.text-danger {
  color: #dc3545;
}

  .modal-dialog-centered {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .form-select {
    margin: 0 auto;
  }
  </style>
  
  
  