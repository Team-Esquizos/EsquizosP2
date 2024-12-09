<template>
<div class="maincontent">
      <div class="gestor-cursos-periodo-container">
        <!-- Botón de retroceso y título -->
        <div class="header-container">
          <button class="btn btn-secondary back-button" @click="goBack">
            <i class="fa-solid fa-circle-left"></i> Volver a GestorDatos
          </button>
          <h1 class="title">Gestor de Cursos Periodo</h1>
        </div>

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
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="container">
        <!-- Add a Commentary -->
        <section class="comment-section">
            <h2>Añadir comentario personalizado</h2>
            <textarea v-model="newComment.comentario" placeholder="Escribe un comentario..."></textarea>
            <div class="flags-container">
            <flag :regularColor="'#00FF00'" :solidColor="'#006400'" :texto="'Buen comportamiento'" :checked="selectedFlag === 'buenComportamiento'" @update:checked="updateSelectedFlag('buenComportamiento')" v-model="newComment.flag" />
            <flag :regularColor="'#FFFF00'" :solidColor="'#FFD700'" :texto="'Advertencia'" :checked="selectedFlag === 'advertencia'" @update:checked="updateSelectedFlag('advertencia')" v-model="newComment.flag" />
            <flag :regularColor="'#FF0000'" :solidColor="'#8B0000'" :texto="'Mal comportamiento'" :checked="selectedFlag === 'malComportamiento'" @update:checked="updateSelectedFlag('malComportamiento')" v-model="newComment.flag" />
        </div>
            <div>
                <Slide v-model="newComment.peso" />
                <p>Peso seleccionado: {{ newComment.peso }}</p>
            </div>
            <div class="button-container">
                <button @click="addComment" class="button">Añadir Comentario</button>
            </div>
            
            <div class="comments-list">
                <h3>Comentarios postivios:</h3>
                <h3>Comentarios negativos:</h3>
                <ul>
                    <li v-for="(comment, index) in comments" :key="index" class="comment-box">
                        {{ comment.comentario }}
                        <p>{{ comment.peso }}</p>
                        <button @click="deleteComment(comment._id)" class="delete-button">Eliminar</button>
                    </li>
                </ul>
            </div>
        </section>
        
    </div>

      </div>
    </div>
</template>

<script>
import axios from 'axios';
import GoBackMixin from '@/mixins/AutenticadorSesion';
import Swal from 'sweetalert2';
import Slide from '@/components/Slide.vue';
import flag from '@/components/Flag.vue';

export default {
    name: 'PerfilAlumno',
    props: ['matriculaalum', 'nombrealum', 'codCurso', 'periodo'],
    mixins: [GoBackMixin],
    components: {
        Slide,
        flag,
    },
    data() {
        return {
            newComment: {
                matricula: '',
                codDocente: '',
                codCurso: this.codCurso,
                periodo: this.periodo,
                comentario: '',
                peso: 0,
                flag: '',
            },
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
            profesorNombre: '',
            comments: [],
            selectedFlag: null, // Controla la flag seleccionada
            requiredFields: ['nombrePrimer', 'apellidoP', 'rut', 'matricula', 'fecNac', 'fecIng'],
        };
    },
    created() {
        this.fetchComments();
        this.fetchAlumno()
        this.profesorNombre = localStorage.getItem('user') || sessionStorage.getItem('user') || 'Usuario';
    },
    computed: {
        comentarioStats() {
            if (!this.comments) return { buenComportamiento: 0, advertencia: 0, malComportamiento: 0 };

            const buenComportamiento = this.comments.filter(c => c.flag === 'buenComportamiento').length;
            const advertencia = this.comments.filter(c => c.flag === 'advertencia').length;
            const malComportamiento = this.comments.filter(c => c.flag === 'malComportamiento').length;

            return {
                buenComportamiento,
                advertencia,
                malComportamiento,
            };
        },
    },
    methods: {
        async fetchAlumno() {
            try {
                const response = await axios.get(`http://localhost:3333/api/student/get/${this.matriculaalum}`);
                console.log("response", response.data.nombres)
                if (response.data) {
                    console.log("data", response.data)
                    this.alumno = response.data;
                    console.log("alumnos", this.alumno)
                    console.log("Alumno:", this.alumno[0])
                } else {
                console.error(response.data.msg);
                }
            } catch (error) {
                console.error("Error al obtener alumnos:", error);
            }
        },
        async fetchComments() {
            try {
                const response = await axios.get(
                    `http://localhost:3333/api/comments/getFromMatricula/${this.matriculaalum}/${this.codCurso}/${this.periodo}`
                );
                this.comments = response.data.comments;
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        },
        async addComment() {
            try {
                // Determina el texto del cuadro de diálogo según el puntaje del comentario
                let confirmationText = '¿Deseas agregar este comentario?';
                if (this.newComment.peso < 0) {
                    confirmationText = '¿Seguro que quieres añadir este comentario negativo?';
                } else if (this.newComment.peso > 0) {
                    confirmationText = '¿Seguro que quieres añadir este comentario positivo?';
                }

                // Mostrar el cuadro de confirmación con SweetAlert2
                const confirmation = await Swal.fire({
                    title: '¿Estás seguro?',
                    text: confirmationText,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sí, añadir',
                    cancelButtonText: 'Cancelar',
                });

                // Si el usuario confirma, se envía el comentario
                if (confirmation.isConfirmed) {
                    this.newComment.matricula = this.matriculaalum;
                    this.newComment.codDocente = localStorage.getItem('rut') || sessionStorage.getItem('rut');
                    this.newComment.peso = this.newComment.peso || 0; // Asegura que tenga un valor

                    await axios.post('http://localhost:3333/api/comments/add', this.newComment);
                    this.newComment = {};
                    this.fetchComments();
                    this.selectedFlag = null;

                    Swal.fire({
                        title: 'Comentario añadido',
                        text: 'El comentario se agregó exitosamente.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar',
                    });
                }
            } catch (error) {
                console.error('Error adding comment:', error);

                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al agregar el comentario. Por favor, inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        },
        async deleteComment(index) {
            try {
                await axios.delete(`http://localhost:3333/api/comments/remove/${index}`);
                this.fetchComments();
                Swal.fire({
                    title: 'Comentario eliminado',
                    text: 'El comentario se eliminó exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6',
                });
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        },
        updateSelectedFlag(flag) {
            this.selectedFlag = flag;
            this.newComment.flag = flag;
        },
    },
};
</script>

<style>
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

.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffffaf;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.comment-section h2 {
    text-align: center;
    margin-bottom: 10px;
}
.flags-container {
    margin-top: 2%;
    margin-bottom: 2%;
}
.button-container {
    display: flex;
    justify-content: center;
    gap: 20px; /* Espaciado entre los botones */
}

.button-container .button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button-container .button:hover {
    background-color: #45a049;
}

.comments-list ul {
    list-style-type: none;
    padding: 0;
}

.comments-list .comment-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 10px;
    background-color: #f4f4f9;
}
textarea {
    width: 100%;
    height: 80px;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 16px;
}

</style>
