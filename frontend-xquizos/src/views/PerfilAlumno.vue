<template>
<div class="body">
    <navBar class="navbar" />
    <div class="student-profile">
        <header class="header-container">
            <button class="btn btn-secondary back-button" @click="goBack">
                <i class="fa-solid fa-circle-left"></i> Volver a los estudiantes
            </button>
            <h1>Perfil del alumno</h1>
        </header>
        <section class="student-info">
            <p><strong>Name:</strong> {{ nombrealum }}</p>
            <p><strong>Matricula:</strong> {{ matriculaalum }}</p>
            <button @click="showChoiceDialog">Generar Carta</button>

            <button @click="iraEstadisticas">Ver estadistica</button>
        </section>
        <ResumenAlum
            :nombres="this.alumno.nombres" 
            :apellidoP="alumno.apellidoP" 
            :apellidoM="alumno.apellidoM"  
            :rut="alumno.rut" 
            :matricula="alumno.matricula" 
            :fecNac="alumno.fecNac"
            :fecIng="alumno.fecIng"
        />
    </div>
    <div class="container">
        <!-- Default Comments -->
        <section class="default-comments">
            <h2>Comentarios por defecto</h2>
            <div class="default-comments-group">
                <div class="comment-category">
                    <h3>Comentarios positivos</h3>
                    <ul>
                        <li class="comment-box positive" @click="addDefaultComment('Ayuda a sus compañeros con la materia', 9)">
                            Ayuda a sus compañeros con la materia
                        </li>
                        <li class="comment-box positive" @click="addDefaultComment('Alumno Puntual', 10)">
                            Alumno Puntual
                        </li>
                        <li class="comment-box positive" @click="addDefaultComment('Participativo en clases', -5)">
                            Participativo en clases
                        </li>
                    </ul>
                </div>
                <div class="comment-category">
                    <h3>comentarios negativos</h3>
                    <ul>
                        <li class="comment-box negative" @click="addDefaultComment('Copia de prueba', -8)">
                            Copia de prueba
                        </li>
                        <li class="comment-box negative" @click="addDefaultComment('Copia proyecto', -10)">
                            Copia proyecto
                        </li>
                        <li class="comment-box negative" @click="addDefaultComment('Golpeo al jefe de grupo', -2)">
                            Golpeo al jefe de grupo
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <div class="flags-container">
            <flag :regularColor="'#00FF00'" :solidColor="'#006400'" :texto="'Buen comportamiento'" :checked="selectedFlag === 'buenComportamiento'" @update:checked="updateSelectedFlag('buenComportamiento')" v-model="newComment.flag" />
            <flag :regularColor="'#FFFF00'" :solidColor="'#FFD700'" :texto="'Advertencia'" :checked="selectedFlag === 'advertencia'" @update:checked="updateSelectedFlag('advertencia')" v-model="newComment.flag" />
            <flag :regularColor="'#FF0000'" :solidColor="'#8B0000'" :texto="'Mal comportamiento'" :checked="selectedFlag === 'malComportamiento'" @update:checked="updateSelectedFlag('malComportamiento')" v-model="newComment.flag" />
        </div>

        <!-- Add a Commentary -->
        <section class="comment-section">
            <h2>añadir comentario personalizado</h2>
            <textarea v-model="newComment.comentario" placeholder="Write a comment..."></textarea>
            <div>
                <Slide v-model="newComment.peso" />
                <p>Peso seleccionado: {{ newComment.peso }}</p>
            </div>
            <button @click="addComment">Añadir Comentario</button>
            <div class="comments-list">
                <h3>Comentarios en el ramo: {{ this.codCurso }} - {{ this.periodo }}</h3>
                <ul>
                    <li v-for="(comment, index) in comments" :key="index" class="comment-box">
                        {{ comment.comentario }}
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
//import ResumenAlum from '@/components/ResumenAlum.vue'


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

    // Logo y encabezado
    doc.addImage(imgData, "PNG", 20, 15, 30, 30); // Logo
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Universidad de Talca", 60, 25);
    doc.setFontSize(12);
    doc.text("Campus Talca", 60, 30);
    doc.text("Dirección: Avenida Lircay s/n, Talca", 60, 35);
    doc.text("Teléfono: +56 71 220 0000", 60, 40);

    doc.setDrawColor(0, 0, 0);
    doc.line(20, 50, 190, 50); // Línea separadora

    if (type === "recomendacion") {
        // Título y contenido de la carta de recomendación
        doc.setFontSize(16);
        doc.setFont("Helvetica", "bold");
        doc.text("CARTA DE RECOMENDACIÓN", 105, 60, { align: "center" });

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);
        const recommendationContent = `
[Destinatario]
______________________________________
[Nombre de la persona o departamento]
______________________________________
Universidad de Talca
Talca

Me dirijo a usted el día ${new Date().toLocaleDateString()} para solicitar una carta de recomendación para ${this.alumno.nombres} ${this.alumno.apellidoP} ${this.alumno.apellidoM}, perteneciente a su departamento.

Conozco al candidato ${this.alumno.nombres} ${this.alumno.apellidoP} ${this.alumno.apellidoM}. Quiero destacar su participación en clases por su profundo interés y dedicación hacia este ámbito.

Además de sus excelentes resultados en las evaluaciones, destaco su gran nivel académico, su determinación en la presentación de su disertación final y habilidades excepcionales como:

${positiveComments.map(comment => `- ${comment.comentario}`).join('\n')}

En el plano personal, admiro su constancia, honradez y marcada persistencia. Estoy plenamente convencido de que tiene mucho por aportar en cualquier desafío que emprenda.

Sin más que añadir, quedo a su disposición para ampliar esta información.

Cordialmente,

${this.profesorNombre}, profesor docente de ${this.codCurso}
Correo electrónico: ${localStorage.getItem('email') || sessionStorage.getItem('email')}`;

            doc.text(recommendationContent, 20, 70, { maxWidth: 170, align: "left" });
            doc.text("___________________", 140, 270, { align: "left" });
            doc.text("Firma del Profesor.", 140, 280, { align: "left" });
            doc.text("___________________", 50, 270, { align: "left" });
            doc.text("Firma del Decano.", 50, 280, { align: "left" });

        } else if (type === "sumario") {
            // Título y contenido de la carta de sumario
            doc.setFontSize(16);
            doc.setFont("Helvetica", "bold");
            doc.text("CARTA DE SUMARIO", 105, 60, { align: "center" });

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(12);
            const summaryContent = `

Sr./Sra. Decano(a) de la Universidad de Talca
     
[Fecha: ${new Date().toLocaleDateString()}]

Me permito presentar un sumario relacionado con el desempeño académico y conductual del estudiante:

Nombre del estudiante: ${this.nombrealum}
Matrícula: ${this.matriculaalum}

Exposición de hechos
A continuación, detallo los principales aspectos observados en el marco de su participación académica:

${negativeComments.map(comment => `- ${comment.comentario}`).join('\n')}

Impacto y medidas propuestas:
Dichos hechos han tenido un impacto negativo en su desempeño y en el ambiente educativo. Por ello, sugiero las siguientes medidas:

1. Establecer un plan de mejora para el estudiante.
2. Programar una reunión con el estudiante y sus representantes, si corresponde.
3. Implementar un seguimiento periódico para evaluar su progreso.
4. Realizar una revisión de las normas y reglamentos internos.
5. Evaluar la posibilidad de expulsión, si la situación no mejora.

Cierre
Estoy a disposición para colaborar en el seguimiento y resolución de esta situación, con el objetivo de garantizar el bienestar académico.

Atentamente,

${this.profesorNombre}, profesor docente de ${this.codCurso}
Correo electrónico: ${localStorage.getItem('email') || sessionStorage.getItem('email')}`;

            doc.text(summaryContent, 20, 70, { maxWidth: 170, align: "left" });
            doc.text("___________________", 140, 270, { align: "left" });
            doc.text("Firma del Profesor.", 140, 280, { align: "left" });
            doc.text("___________________", 50, 270, { align: "left" });
            doc.text("Firma del Decano.", 50, 280, { align: "left" });
        }

        // Guardar el archivo PDF
        doc.save(type === "recomendacion" ? "Carta_de_Recomendacion.pdf" : "Carta_de_Sumario.pdf");
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
}
,

        async showChoiceDialog() {
            try {
                // Obtiene los comentarios
                const response = await axios.get(
                    `http://localhost:3333/api/comments/getFromMatricula/${this.matriculaalum}/${this.codCurso}/${this.periodo}`
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
                params: { matricula: this.matriculaalum, periodo: this.periodo, codCurso: this.codCurso },
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
    background-image: url(../assets/text.jpg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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

button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #45a049;
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
</style>
