<template>
    <div>
      <navBar />
      <div class="container mt-4">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card shadow-lg border-0">
              <div class="card-header bg-primary text-white text-center">
                <h4 class="mb-0">
                  <i class="bi bi-journal-bookmark-fill me-2"></i>
                  {{ nombre }} - {{ seccion }}
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
              <div class="card-footer text-muted text-center">
                <small>Última actualización: </small>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Modal para cambiar docente -->
        <div v-if="showModal" class="modal d-block" tabindex="-1" aria-labelledby="modalChangeTeacher" aria-hidden="true">
          <div class="modal-dialog">
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
  
        <!-- Título de la tabla -->
        <div class="text-center mb-4">
          <h3 class="text-primary">Alumnos Inscritos</h3>
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
            <tr v-if="alumnos.length === 0">
                <td colspan="6">Los alumnos no existen</td>
            </tr>
            <tbody>
              <tr v-for="alumno in alumnos" :key="alumno.matricula">
                <td class="align-middle">
                  <img class="img-fluid rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Avatar" style="width: 50px; height: 50px;" />
                </td>
                <td class="align-middle">{{ alumno.nombres }} {{ alumno.apellidoP }} {{ alumno.apellidoM }}</td>
                <td class="align-middle">{{ alumno.rut }}</td>
                <td class="align-middle">{{ alumno.fecNac }}</td>
                <td class="align-middle">{{ alumno.fecIng }}</td>
                <td class="align-middle">
                  <button @click="goperfilalumno(alumno.matricula,alumno.nombres)" class="btn btn-sm btn-primary mx-1">
                    <i class="far fa-eye"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Mensaje si no hay alumnos -->
        <div v-else class="text-center">
          <p class="text-danger">Los alumnos no existen</p>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import navBar from "@/components/AppNavbarAdm.vue";
  import autenticadorSesion from "../mixins/AutenticadorSesion.js";
  import axios from "axios";
  
  export default {
    name: "CursoPeriodo",
    mixins: [autenticadorSesion],
    components: {
      navBar,
    },
    props: ["nombre", "seccion", "semestre", "codCurso"],
    data() {
      return {
        docente: {
          rut: '',
          nombres: '',
          apellidoM: '',
          apellidoP: ''
        },
        alumnos: [],
        showModal: false,  // Para mostrar el modal
        availableTeachers: [],  // Lista de docentes disponibles
        newDocente: null,  // Docente seleccionado para cambiar
      };
    },
    async created() {
      // Cargar el docente actual desde la API
      const teacherData = await axios.get(`http://localhost:3333/api/courseInstance/get/teacher/${this.codCurso}`);
      this.docente = teacherData.data.teaching;
  
      // Obtener la lista de docentes disponibles
      const teachersData = await axios.get("http://localhost:3333/api/teaching/get");
      console.log(teachersData.data);
      this.availableTeachers = teachersData.data;
      this.fetchAlumnos();
    },
    methods: {
        goperfilalumno(matricula, nombrePrimer) {
            console.log('Datos enviados:', matricula, nombrePrimer); // Debug para confirmar los valores
            this.$router.push({
                name: 'PerfilAlumno',
                params: {
                    matriculaalum: matricula,
                    nombrealum: nombrePrimer
                }
            });
        },
        // Función para seleccionar un docente
        selectTeacher(teacher) {
            this.newDocente = teacher;
        },
        // Función para actualizar el docente en el backend
        async updateTeacher() {
            if (this.newDocente) {
            try {
                await axios.put(`http://localhost:3333/api/courseInstance/setTeaching/${this.codCurso}/${this.newDocente.rut}`, {
                codDocente: this.newDocente.rut
                });
                this.docente = { ...this.newDocente };  // Actualizar los datos del docente
                alert("Docente actualizado correctamente");
            } catch (error) {
                console.error("Error al actualizar el docente", error);
                alert("Hubo un error al actualizar el docente");
            }
            }
        },
        async fetchAlumnos() {
            // Verifica si la lista de alumnos ya tiene datos
            if (this.alumnos.length === 0) {
                try {
                const response = await axios.get(`http://localhost:3333/api/courseInstance/get/students/${this.codCurso}`);
                if (response.data.status) {
                    this.alumnos = response.data.students;
                } else {
                    console.error(response.data.msg);
                }
                } catch (error) {
                console.error('Error al obtener alumnos:', error);
                }
            }
        }
    }
};
</script>

<style scoped>
.card {
    margin-top: 3vw;
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

.table td,
.table th {
  vertical-align: middle;
}

</style>
  
  
  