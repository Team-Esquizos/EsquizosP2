<template>
  <div>
    <navBar />
    <div class="maincontent">
      <div class="gestor-docentes-container">
        <div >
          <div class="card" >
            <div class="card-header bg-primary text-white text-center">
              <h4 class="mb-0">
                <i class="bi bi-journal-bookmark-fill me-2"></i>
                {{ nombre }} // {{ periodo }} - {{ seccion }}
              </h4>
            </div>
            <div class="card-body">
              <h5 class="card-title text-center text-secondary">
                <i class="bi bi-calendar-event me-1"></i>
                Semestre: {{ semestre }}
              </h5>
              <ul class="list-group list-group-flush mt-4">
                <li class="list-group-item">
                  <i class="bi bi-code me-2 text-primary"></i>
                  <strong>Código del Curso:</strong> {{ codCurso }}
                </li>
                <li class="list-group-item">
                  <i class="bi bi-person-badge me-2 text-primary"></i>
                  <strong>Docente:</strong> {{ docente.nombres }} {{ docente.apellidoP }} {{ docente.apellidoM }}
                </li>
              </ul>
              <div class="d-flex justify-content-center mt-4 gap-2">
                <button class="btn btn-outline-info" @click="showModal = true">
                  <i class="bi bi-person-plus me-1"></i> Cambiar Docente
                </button>
              </div>
            </div>
          </div>
        </div>
      

      <!-- Modal para cambiar docente -->
      <div v-if="showModal" class="modal d-block" tabindex="-1" aria-labelledby="modalChangeTeacher" aria-hidden="true">
        <div class="modal-dialog modal-lower">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalChangeTeacher">Seleccionar Docente</h5>
              <button type="button" class="btn-close" @click="showModal = false" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="list-group">
                <a 
                  v-for="teacher in availableTeachers" 
                  :key="teacher.rut" 
                  href="#" 
                  class="list-group-item list-group-item-action"
                  :class="{ 'selected': teacher.rut === newDocente?.rut }" 
                  @click="selectTeacher(teacher)"
                >
                  {{ teacher.nombres }} {{ teacher.apellidoP }} {{ teacher.apellidoM }}
                </a>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showModal = false">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="updateTeacher">Confirmar Cambio</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acciones -->
      <div class="section-title">
        <h3>Lista de Docentes</h3>
        
        <div class="action-buttons">
          <input type="file" ref="fileInput" @change="onFileAlumnos" style="display: none;" accept=".csv" />
          <button class="btn btn-success" @click="triggerFileInput">
            <i class="fa-solid fa-file-csv"></i> Importar alumnos por CSV
          </button>
          <button class="btn btn-primary" @click="toggleAddAlumno">
          <i class="fa-solid fa-user-plus"></i> Agregar Alumno
        </button>
        </div>
      
      </div>

      <!-- Formulario Modal para agregar alumno -->
      <div v-if="showAddAlumno" class="modal-overlay" @click.self="closeAddAlumno">
        <div class="modal-content p-4">
          <h3 class="text-center mb-4">Agregar Alumno</h3>
          <form @submit.prevent="handleAddAlumno">
            <!-- Campo de matrícula con autocompletado -->
            <div class="form-group mb-3">
              <label for="matricula">Número de Matrícula</label>
              <input
                type="text"
                id="matricula"
                v-model="newMatricula"
                class="form-control"
                @input="fetchSuggestions"
                autocomplete="off"
                required
              />
              <!-- Lista de sugerencias -->
              <ul v-if="suggestions.length > 0" class="suggestion-list">
                <li
                  v-for="suggestion in suggestions"
                  :key="suggestion.matricula"
                  @click="selectSuggestion(suggestion.matricula)"
                >
                  {{ suggestion.matricula }} - {{ suggestion.nombreCompleto }}
                </li>
              </ul>
            </div>
            <!-- Botones de acción -->
            <div class="d-flex justify-content-between mt-4">
              <button type="submit" class="btn btn-success">Confirmar</button>
              <button type="button" class="btn btn-secondary" @click="closeAddAlumno">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tabla de alumnos -->
      <div v-if="alumnos.length > 0">
        <table class="table table-striped table-hover table-bordered text-center">
          <thead class="thead-light" style="position: sticky; top: 0; z-index: 1; background-color: white;">
            <tr>
              <th>Foto</th>
              <th>Nombre Completo</th>
              <th>Rut</th>
              <th>Fecha Nacimiento</th>
              <th>Fecha Ingreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumno in alumnos" :key="alumno.matricula">
              <td>
                <img class="img-fluid rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Avatar" style="width: 50px; height: 50px;" />
              </td>
              <td>{{ alumno.nombres }} {{ alumno.apellidoP }} {{ alumno.apellidoM }}</td>
              <td>{{ alumno.rut }}</td>
              <td>{{ alumno.fecNac }}</td>
              <td>{{ alumno.fecIng }}</td>
              <td>
                <button @click="goperfilalumno(alumno.matricula, alumno.nombres)" class="btn btn-sm btn-primary mx-1">
                  <i class="far fa-eye"></i>
                </button>
                <button @click="deleteAlumno(alumno.matricula)" class="btn btn-sm btn-danger mx-1">
                    <i class="far fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Mensaje si no hay alumnos -->
      <div v-else class="text-center">
        <p class="text-danger">No se encontraron alumnos.</p>
      </div>
    </div>
    </div>
  </div>
</template>

  
  
<script>
import navBar from "@/components/AppNavbarAdm.vue";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "CursoPeriodo",
  components: { navBar },
  props: ["nombre", "seccion", "semestre", "codCurso", 'periodo'],
  data() {
    return {
      docente: {
        rut: '',
        nombres: '',
        apellidoM: '',
        apellidoP: ''
      },
      alumnos: [],
      showAddAlumno: false,
      newMatricula: "",
      suggestions: [], 
      showModal: false, 
      availableTeachers: [], 
      newDocente: null, 
    };
  },
  async created() {
    try {
      console.log("PERIODO RECIBIDO: ", this.periodo);
      const teachersData = await axios.get("http://localhost:3333/api/teaching/get");
      this.availableTeachers = teachersData.data;
      const teacherData = await axios.get(`http://localhost:3333/api/courseInstance/get/teacher/${this.codCurso}/${this.periodo}`);
      console.log(teachersData.data);

      if (teacherData.data.teaching) {
        this.docente = teacherData.data.teaching;
      } else {
        this.docente = { nombres: "Por", apellidoP: "Definir", apellidoM: "" };
      }
      
    } catch (error) {
      console.error("Error al obtener docente:", error);
      this.docente = { nombres: "Por", apellidoP: "Definir", apellidoM: "" };
    }

    this.fetchAlumnos(); 
  },
  methods: {
    selectTeacher(teacher) {
        this.newDocente = teacher;
    },
    async updateTeacher() {
    if (this.newDocente) {
        try {
            await axios.put(`http://localhost:3333/api/courseInstance/setTeaching/${this.codCurso}/${this.periodo}/${this.newDocente.rut}`, {
                codDocente: this.newDocente.rut
            });
            
            this.docente = { ...this.newDocente }; // Actualizar los datos del docente

            // Alerta de éxito con SweetAlert2
            Swal.fire({
                title: '¡Éxito!',
                text: 'Docente actualizado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#007bff'
            });
        } catch (error) {
            console.error("Error al actualizar el docente", error);

            // Alerta de error con SweetAlert2
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al actualizar el docente. Por favor, intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }
},
    async fetchSuggestions() {
      if (this.newMatricula.length < 2) {
        this.suggestions = [];
        return;
      }
      try {
        const response = await axios.get('http://localhost:3333/api/student/get');
        console.log(response.data);
        if (response.data.status) {
          const query = this.newMatricula.toLowerCase();
          this.suggestions = response.data.filter(student =>
            student.matricula.toLowerCase().includes(query)
          );
        } else {
          console.error(response.data.msg);
          this.suggestions = [];
        }
      } catch (error) {
        console.error("Error al obtener estudiantes:", error);
        this.suggestions = [];
      }
    },
    selectSuggestion(matricula) {
      this.newMatricula = matricula; 
      this.suggestions = []; 
    },
    toggleAddAlumno() {
      this.showAddAlumno = true;
    },
    closeAddAlumno() {
      this.showAddAlumno = false;
      this.newMatricula = "";
    },
    async fetchAlumnos() {
      try {
        const response = await axios.get(`http://localhost:3333/api/courseInstance/get/students/${this.codCurso}/${this.periodo}`);
        if (response.data.status) {
          this.alumnos = response.data.students;
        } else {
          console.error(response.data.msg);
        }
      } catch (error) {
        console.error("Error al obtener alumnos:", error);
      }
    },
    async handleAddAlumno() {
      if (!this.newMatricula) {
        alert("Por favor, ingrese un número de matrícula válido.");
        return;
      }

      try {
        const response = await axios.post(`http://localhost:3333/api/courseInstance/addStudent/${this.codCurso}/${this.periodo}/${this.newMatricula}`);
        this.newMatricula = ''
        if (response.data.status) {
          alert("Alumno agregado exitosamente.");
          this.fetchAlumnos();
          this.closeAddAlumno();
        } else {
          alert("Error: " + response.data.msg);
        }
      } catch (error) {
        console.error("Error al agregar alumno:", error);
        alert("Hubo un problema al agregar al alumno.");
      }
    },
    goperfilalumno(matricula, nombrePrimer) {
      this.$router.push({
        name: "PerfilAlumno",
        params: {
          matriculaalum: matricula,
          nombrealum: nombrePrimer,
        },
      });
    },
    async deleteAlumno(matricula) {
        try {
            await axios.delete(`http://localhost:3333/api/courseInstance/removeStudent/${this.codCurso}/${matricula}`);
            this.fetchAlumnos();
        } catch (error) {
            console.error('Error al eliminar el alumno:', error);
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



.suggestion-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #ddd;
  background: #fff;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  z-index: 1000;
}

.suggestion-list li {
  padding: 10px;
  cursor: pointer;
}

.suggestion-list li:hover {
  background-color: #007bff;
  color: white;
}

</style>
  
  
  