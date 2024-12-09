<template>
    <navBar class="navbar" />
    <div class="maincontent">
          <div class="gestor-cursos-periodo-container">
            <!-- Botón de retroceso y título -->
            <div class="header-container">
                <button class="btn btn-secondary back-button" @click="goBack">
                    <i class="fa-solid fa-circle-left"></i> Volver a los estudiantes
                </button>
                <h1 class="title">Perfil del alumno</h1>
                <div class="button-header">
                    <button @click="showChoiceDialog" class="button">Generar Carta</button>
                    <button @click="iraEstadisticas" class="button">Ver estadistica</button>
                </div>
            </div>
    
            <div class="gestor-docentes-container">
              <div >
                <div class="card" >
                  <div class="card-header bg-primary text-white text-center">
                    <h4 class="mb-0">
                      <i class="bi bi-journal-bookmark-fill me-2"></i>
                      {{ alumno.nombres }} {{ alumno.apellidoP }} {{ alumno.apellidoM }}
                    </h4>
                  </div>
                  <div class="card-body">
                    <h5 class="card-title text-center text-secondary">
                      <i class="bi bi-calendar-event me-1"></i>
                      <strong>Fecha ingreso: </strong> {{ alumno.fecIng }}
                    </h5>
                    <ul class="list-group list-group-flush mt-4">
                      <li class="list-group-item">
                        <i class="bi bi-code me-2 text-primary"></i>
                        <strong>Rut: </strong> {{ alumno.rut }} // <strong>Matricula: </strong> {{ alumno.matricula }}
                      </li>
                      <li class="list-group-item">
                        <i class="bi bi-person-badge me-2 text-primary"></i>
                        <span class="positive"><strong> Comentarios positivos: </strong>{{ comentarioStats.buenComportamiento }}</span>
                        <span class="alert"><strong> Comentarios de advertencias: </strong>{{ comentarioStats.advertencia }}</span>
                        <span class="negative"><strong> Comentarios negativos: </strong>{{ comentarioStats.malComportamiento }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
    
            <!-- Add a Commentary -->
            <section class="comment-section">
                <h1 class="title2">Añadir comentario personalizado</h1>
                <textarea v-model="newComment.comentario" placeholder="Escribe un comentario..."></textarea>
                <div class="flags-container">
                    <flag :regularColor="'#00FF00'" :solidColor="'#006400'" :texto="'Buen comportamiento'" :checked="selectedFlag === 'buenComportamiento'" @update:checked="updateSelectedFlag('buenComportamiento')" v-model="newComment.flag" />
                    <flag :regularColor="'#FFFF00'" :solidColor="'#FFD700'" :texto="'Advertencia'" :checked="selectedFlag === 'advertencia'" @update:checked="updateSelectedFlag('advertencia')" v-model="newComment.flag" />
                    <flag :regularColor="'#FF0000'" :solidColor="'#8B0000'" :texto="'Mal comportamiento'" :checked="selectedFlag === 'malComportamiento'" @update:checked="updateSelectedFlag('malComportamiento')" v-model="newComment.flag" />
                </div>

                <div>
                    <Slide v-model="newComment.peso" @input="validatePeso" :disabled="selectedFlag === 'advertencia'"/>
                    <p>Peso seleccionado: {{ newComment.peso }}</p>
                </div>
                <div class="button-container">
                    <button @click="addComment" class="button">Añadir Comentario</button>
                </div>
                
                <div class="comments-list">
                    <div class="comments-container">
                        <!-- Comentarios positivos -->
                        <div class="positive-comments">
                        <h3 class="comments-title">Comentarios positivos:</h3>
                        <ul>
                            <li v-for="(comment, index) in goodComments" :key="index" class="comment-box">
                            {{ comment.comentario }}
                            <p>{{ comment.peso }}</p>
                            <button @click="deleteComment(comment._id)" class="delete-button">Eliminar</button>
                            </li>
                        </ul>
                        </div>

                        <!-- Comentarios negativos -->
                        <div class="negative-comments">
                        <h3 class="comments-title">Comentarios negativos:</h3>
                        <ul>
                            <li v-for="(comment, index) in badComments" :key="index" class="comment-box">
                            {{ comment.comentario }}
                            <p>{{ comment.peso }}</p>
                            <button @click="deleteComment(comment._id)" class="delete-button">Eliminar</button>
                            </li>
                        </ul>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
    
    </div>
 </template>

<script>
import axios from 'axios';
import navBar from '@/components/AppNavbarAdm.vue';
import GoBackMixin from '@/mixins/AutenticadorSesion';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import logo from '@/assets/Utalca.png';
import Slide from '@/components/Slide.vue';
import flag from '@/components/Flag.vue';


export default {
    name: 'PerfilAlumno',
    props: ['matriculaalum', 'nombrealum', 'codCurso', 'periodo'],
    mixins: [GoBackMixin],
    components: {
        navBar,
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
            isDisabled: false,
            requiredFields: ['nombrePrimer', 'apellidoP', 'rut', 'matricula', 'fecNac', 'fecIng'],
        };
    },
    watch: {
        selectedFlag(newFlag) {
            // Si la bandera verde está seleccionada y el peso es 0 o menor, ajustarlo a 1.
            if (newFlag === 'buenComportamiento' && this.newComment.peso <= 0) {
                this.newComment.peso = 1;
            }
            if (newFlag === 'advertencia' ) {
                this.newComment.peso = 0;
            }
            if (newFlag === 'malComportamiento' && this.newComment.peso >= 0) {
                this.newComment.peso = -1;
            }
        },
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
        goodComments() {
            return this.comments.filter(
            (comment) => comment.flag === "buenComportamiento"
            );
        },
        badComments() {
            return this.comments.filter(
            (comment) => comment.flag === "malComportamiento"
            );
        },
    },
    methods: {
        updateSelectedFlag(flag) {
            this.selectedFlag = flag;
            this.newComment.flag = flag;

            if (flag === 'advertencia') {
                this.newComment.peso = 0; // Bloquear slider en 0
                this.isDisabled = true;
            }
        },
        validatePeso() {
            // Si la bandera verde está seleccionada, asegurarse de que el peso sea al menos 1.
            if (this.selectedFlag === 'buenComportamiento' && this.newComment.peso <= 0) {
                this.newComment.peso = 1;
            }
            if (this.selectedFlag === 'advertencia') {
                this.newComment.peso = 0;
                this.isDisabled = true; // Deshabilitar el slider
            }
            if (this.selectedFlag === 'malComportamiento' && this.newComment.peso >= 0) {
                this.newComment.peso = -1;
            }
        },
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
        async generatePDF(type, positiveComments, negativeComments) {
            const doc = new jsPDF();
            const imgData = await this.loadLogo();

            if (type === "recomendacion") {
                // Encabezado de carta de recomendación
                doc.addImage(imgData, "PNG", 10, 10, 30, 30); // Logo
                doc.setFont("Times", "bold");
                doc.setFontSize(16);
                doc.text("Carta de Recomendación", 60, 20);

                // Contenido de la carta de recomendación
                const recommendationContent = `
[Fecha: ${new Date().toLocaleDateString()}]

A quien corresponda,

Por medio de la presente, me permito recomendar de manera entusiasta y formal al estudiante:

Nombre: ${this.nombrealum}  
Matrícula: ${this.matriculaalum}  

Contexto y méritos destacados  

Durante su participación en el programa académico, ${this.nombrealum} ha demostrado ser un(a) estudiante altamente comprometido(a), proactivo(a) y orientado(a) a resultados. Entre las cualidades y logros que lo/la distinguen, destaco los siguientes:

${positiveComments.map(comment => `- ${comment.comentario}`).join('\n')}

Estas cualidades no solo reflejan su excelencia académica, sino también su capacidad para colaborar efectivamente en equipo, asumir retos con determinación y contribuir de manera significativa al éxito de proyectos en los que participa.

Conclusión  

Estoy plenamente convencido(a) de que ${this.nombrealum} será un recurso invaluable para cualquier organización o proyecto en el que decida participar. Su dedicación y habilidades garantizan un desempeño sobresaliente en cualquier entorno.

Sin más que agregar, quedo a su disposición para ampliar esta información o responder cualquier consulta que considere necesaria.

Atentamente,  
${this.profesorNombre}
Profesor(a) responsable  
`;
                doc.setFont("Times", "normal");
                doc.setFontSize(12);
                doc.text(recommendationContent, 10, 40, {
                    maxWidth: 190
                });
            } else if (type === "sumario") {
                // Encabezado de carta de sumario
                doc.addImage(imgData, "PNG", 10, 10, 30, 30); // Logo
                doc.setFont("Times", "bold");
                doc.setFontSize(16);
                doc.text("Carta de Sumario", 70, 20);

                // Contenido de la carta de sumario
                const summaryContent = `
[Fecha: ${new Date().toLocaleDateString()}]

A quien corresponda,

Por medio de la presente, y en mi calidad de profesor(a), me permito presentar un sumario relacionado con el desempeño académico y comportamental del estudiante identificado como:

Nombre del estudiante: ${this.nombrealum}  
Matrícula: ${this.matriculaalum}  

Exposición de hechos  
A continuación, se detalla una relación de los principales aspectos observados que fundamentan esta comunicación:

${negativeComments.map(comment => `- ${comment.comentario}`).join('\n')}

Estos hechos han sido constatados en el marco de su participación en las actividades académicas y/o conductas dentro del aula, impactando negativamente en su desempeño y/o en el ambiente educativo.

Solicitud y medidas solicitadas  

Con base en lo anterior, se solicita que se tomen las medidas correspondientes para atender esta situación. Entre las posibles acciones, se sugiere:  
1. Establecer un plan de mejora para el estudiante.  
2. Programar una reunión con el estudiante y sus representantes, de ser aplicable.  
3. Implementar un seguimiento periódico para evaluar su progreso.  

Quedo en espera de su respuesta y a disposición para colaborar en el seguimiento y resolución de esta situación, en aras de favorecer el bienestar académico y personal del estudiante.

Atentamente,  
${this.profesorNombre}
Profesor(a) responsable  
`;
                doc.setFont("Times", "normal");
                doc.setFontSize(12);
                doc.text(summaryContent, 10, 40, {
                    maxWidth: 190
                });
            }

            // Guardar el archivo PDF
            doc.save(type === "recomendacion" ? "carta_recomendacion.pdf" : "carta_sumario.pdf");
        },

        loadLogo() {
            // Método para cargar el logo como Base64
            return new Promise((resolve) => {
                const img = new Image();
                img.src = logo;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL("image/png"));
                };
            });
        },

        async showChoiceDialog() {
            try {
                // Obtiene los comentarios
                const response = await axios.get(
                    `http://localhost:3333/api/comments/getFromMatricula/${this.matriculaalum}`
                );
                this.comments = response.data.comments || [];

                // Filtra comentarios positivos y negativos
                const positiveComments = this.comments.filter(comment => comment.peso > 0);
                const negativeComments = this.comments.filter(comment => comment.peso < 0);

                // Determina el tipo de carta según la suma total
                const totalPeso = this.comments.reduce((sum, comment) => sum + (comment.peso || 0), 0);
                const type = totalPeso > 0 ? "recomendacion" : "sumario";

                // Genera la carta automáticamente
                await this.generatePDF(type, positiveComments, negativeComments);

                Swal.fire({
                    title: `Carta generada`,
                    text: `Se ha descargado automáticamente la carta de ${type === "recomendacion" ? "recomendación" : "sumario"}.`,
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#3085d6",
                });
            } catch (error) {
                console.error("Error al calcular los comentarios o generar la carta:", error);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un problema al generar la carta. Por favor, inténtalo de nuevo.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            }
        },
        async iraEstadisticas() {
            this.$router.push({
                name: 'VistaEstadisticas',
                params: { matricula: this.matriculaalum },
            });
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
        async addDefaultComment(commentText, commentWeight) {
            try {
                const defaultComment = {
                    matricula: this.matriculaalum,
                    codDocente: 'XD',
                    comentario: commentText,
                    peso: commentWeight,
                };

                await axios.post('http://localhost:3333/api/comments/add', defaultComment);
                this.fetchComments();
                Swal.fire({
                    title: 'Comentario añadido',
                    text: 'El comentario se agregó exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6',
                });
            } catch (error) {
                console.error('Error adding default comment:', error);
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
        async generateLetter() {
            try {
                const response = this.fetchComments(); // Endpoint para obtener los comentarios
                const comments = response.data;

                if (!comments || comments.length === 0) {
                    Swal.fire({
                        title: 'Sin comentarios',
                        text: 'No hay comentarios registrados para calcular el promedio.',
                        icon: 'info',
                        confirmButtonText: 'Aceptar',
                    });
                    return;
                }

                // Calcula el promedio de los pesos
                const totalPeso = comments.reduce((sum, comment) => sum + (comment.peso || 0), 0);
                const promedioPeso = totalPeso / comments.length;

                // Decide el tipo de carta según el promedio
                let letterType;
                let letterMessage;
                if (promedioPeso >= 3) {
                    letterType = 'recomendacion';
                    letterMessage = 'Se generó una carta de recomendación debido al buen desempeño.';
                } else {
                    letterType = 'sumario';
                    letterMessage = 'Se generó una carta de sumario debido a los resultados negativos.';
                }

                // Simula la generación de la carta
                Swal.fire({
                    title: `Carta de ${letterType === 'recomendacion' ? 'Recomendación' : 'Sumario'}`,
                    text: letterMessage,
                    icon: letterType === 'recomendacion' ? 'success' : 'warning',
                    confirmButtonText: 'Descargar',
                }).then(() => {
                    // Lógica para descargar la carta
                    this.downloadLetter(letterType);
                });
            } catch (error) {
                console.error('Error al generar la carta:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un problema al generar la carta. Por favor, inténtalo de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
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
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
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
  margin-left: auto;
}

.button-header {
  margin-left: 5%;
}

.button-header button {
  margin: 0.3vh;
}

.title2 {
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
  max-width: 49%;
  padding: 15px;
  border: 2px solid #eaeaea;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
  display: block;
  text-align: center;
  margin-top: 1.5vh;
  margin-bottom: 1.5vh;
  margin-left: auto;
  margin-right: auto;
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
  padding: 2vh;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px; /* Espaciado entre los botones */
}

.button {
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  color: white;
  background: linear-gradient(135deg, #007bff, #0056b3);
  padding: 0.7rem 1.5rem;
  border: none;
  transition: all 0.5s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.button:hover {
  background: linear-gradient(135deg, #0056b3, #003f7f);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
}

.button:active {
  transform: scale(1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.comments-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2vh;
}

.comments-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
}

.positive-comments,
.negative-comments {
  flex: 1;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.positive-comments {
  margin-right: 10px;
  border: 1px solid #4caf50; /* Verde */
}

.negative-comments {
  margin-left: 10px;
  border: 1px solid #f44336; /* Rojo */
}

.comments-list ul {
  list-style-type: none;
  padding: 0;
}

.comment-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #1111e9;
}

.comments-title {
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.positive-comments .comments-title {
  color: #4caf50; /* Verde */
}

.negative-comments .comments-title {
  color: #f44336; /* Rojo */
}

textarea {
  width: 80%;
  height: 80px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 16px;
}

.positive {
  color: #1d832a;
}

.alert {
  color: #cece27;
}

.negative {
  color: #ce2727;
}


</style>
