<template>
<div class="body">
    <navBar class="navbar" />
    <div class="student-profile">
        <header class="header-container">
            <button class="btn btn-secondary back-button button" @click="goBack">
                <i class="fa-solid fa-circle-left"></i> Volver a los estudiantes
            </button>
            <h1>Perfil del alumno</h1>
            <button @click="showChoiceDialog" class="button">Generar Carta</button>
            <button @click="iraEstadisticas" class="button">Ver estadistica</button>
        </header>
        

        <!-- Card -->
        <div class="contenedor-card">
            <div class="card">
                <section class="info-section">
                <div class="background-design">
                    <div class="circle"></div>
                    <div class="circle"></div>
                    <div class="circle"></div>
                </div>
                <div class="left-side">
                    <div class="weather">
                    <div>

                    </div>
                    <div>{{ alumno.matricula }}</div>
                    </div>
                    <div class="temperature"></div>
                    <div class="range">{{ alumno.rut }}</div>
                </div>
                <div class="right-side">
                    <div>
                    <div class="hour"> {{ alumno.nombres }} </div>
                    <div class="date">{{ alumno.apellidoP }} {{ alumno.apellidoM }}</div>
                    </div>
                    <div class="city">{{ alumno.fecIng }}</div>
                </div>
                </section>
                <section class="days-section">
                <button class="verde">
                    <span class="day">Positivos: {{ comentarioStats.buenComportamiento }}</span>
                    <span class="icon-weather-day">
                    
                    </span>
                </button>
                <button class="amarillo">
                    <span class="day">Advertencias:{{ comentarioStats.advertencia }}</span>
                    <span class="icon-weather-day">
                    
                    </span>
                </button>
                <button class="rojo">
                    <span class="day">Negativos:{{ comentarioStats.malComportamiento }}</span>
                    <span class="icon-weather-day">
                    
                    </span>
                </button>
                </section>
            </div>
        </div>
        <!-- Card -->

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
                name: 'VistaEstadisticas'
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
        updateSelectedFlag(flag) {
            this.selectedFlag = flag;
            this.newComment.flag = flag;
        },
    },
};
</script>

<style scoped>
.body {
    font-family: 'Arial', sans-serif;
    background-color: var(--background);
    color: #333;
    margin: 0;
    padding: 0;
}

.header-container {
    display: flex;
    align-items: center;
    gap: 30%;
    /* Espaciado entre el botón y el título */
    justify-content: flex-start;
    /* Alinear los elementos hacia la izquierda */
    margin-top: 5.2%;
}

.back-button {
    margin-left: 1%;
    /* Opcional, ajusta si hay márgenes no deseados */
}

/* Profile Header */
.student-profile {
    text-align: center;
    margin-bottom: 20px;
    
}

.student-profile header h1 {
    color: #4CAF50;
}

.student-info {
    display: inline-block;
    padding: 20px;
    background-color: #ffffffaf;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: left;
}

.student-info p {
    margin: 5px 0;
}

/* Container */
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffffaf;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Default Comments */
.default-comments h2 {
    text-align: center;
    margin-bottom: 20px;
}

.default-comments-group {
    display: flex;
    gap: 20px;
}

.comment-category {
    flex: 1;
    background-color: #ffffff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-category h3 {
    color: #555;
    margin-bottom: 10px;
}

.comment-box {
    cursor: pointer;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    text-align: center;
}

.comment-box.positive {
    background-color: #d9f7d9;
    border: 1px solid #a4d4a4;
}

.comment-box.negative {
    background-color: #fbdcdc;
    border: 1px solid #f5a9a9;
}

.comment-box:hover {
    background-color: #e3e3e3;
}

/* Comment Section */
.comment-section h2 {
    text-align: center;
    margin-bottom: 10px;
}

textarea {
    width: 100%;
    height: 80px;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

/* Comments List */
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

.delete-button {
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
}

.delete-button:hover {
    background-color: #d32f2f;
}

.flags-container {
    margin-top: 2%;
    margin-bottom: 2%;
}

.contenedor-card{
    display: flex;
    align-items: center;
    justify-content: center;
}
.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    width: 855px;
    border-radius: 25px;
    background:var(--blue);
    overflow: hidden;
    transition: 100ms ease;
    box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 4px;
  }
  
  /* ---------- Info section ---------- */
  
  .info-section {
    text-transform: uppercase;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 75%;
    color: rgb(0, 0, 0);
  }
  
  .left-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    z-index: 1;
    padding-left: 18px;
  }
  
  button {
    display: block;
    border: none;
    background: transparent;
  }
  
  .weather {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
  }
  
  .weather div {
    display: flex;
    align-items: center;
  }
  
  .weather div:nth-child(1) {
    width: 40%;
    height: auto;
  }
  
  .temperature {
    font-size: 34pt;
    font-weight: 500;
    line-height: 8%;
  }
  
  .right-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    height: 100%;
    padding-right: 18px;
    z-index: 1;
  }
  
  .right-side > div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .hour {
    font-size: 19pt;
    line-height: 1em;
  }
  
  .date {
    font-size: 15px;
  }
  
  /* ---------- Background ---------- */
  .background-design {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #f0f0f0;
    overflow: hidden;
  }
  
  .circle {
    background-color: #efc745;
  }
  
  .circle:nth-child(1) {
    position: absolute;
    top: -80%;
    right: -50%;
    width: 300px;
    height: 300px;
    opacity: 0.4;
    border-radius: 50%;
  }
  
  .circle:nth-child(2) {
    position: absolute;
    top: -70%;
    right: -30%;
    width: 210px;
    height: 210px;
    opacity: 0.4;
    border-radius: 50%;
  }
  
  .circle:nth-child(3) {
    position: absolute;
    top: -35%;
    right: -8%;
    width: 100px;
    height: 100px;
    opacity: 1;
    border-radius: 50%;
  }
  
  /* ---------- Days section ---------- */
  .days-section {
    
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 25%;
    background-color: #f0f0f0;
    gap: 2px;
    box-shadow: inset 0px 2px 5px #00000049;
  }

  .verde {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: #16831f;
      box-shadow: inset 0px 2px 5px #0c3510;
      cursor: pointer;
      gap: 5px;
  }
  .amarillo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: #d4d64a;
      box-shadow: inset 0px 2px 5px #4d4e1f;
      cursor: pointer;
      transition: 100ms ease;
      gap: 5px;
  }
.rojo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #c73a3a;
    box-shadow: inset 0px 2px 5px #3b1414;
    cursor: pointer;
    transition: 100ms ease;
    gap: 5px;
}
  .days-section button:hover {
    scale: 0.9;
    border-radius: 10px;
  }
  
  .days-section .day {
    font-size: 10pt;
    font-weight: 500;
    color: white;
    opacity: 0.7;
  }
  
  .icon-weather-day {
    display: flex;
    align-items: center;
    width: 20px;
    height: 100%;
  }

/* Button container*/ 
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

</style>
