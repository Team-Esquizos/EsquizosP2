<template>
  <div class="student-profile">
      <h1>Student Profile</h1>
      <div class="student-info">
        <p><strong>Name:</strong> {{ nombrealum }}</p>
        <p><strong>Matricula:</strong> {{ matriculaalum }}</p>
      </div>
    </div>
  <div class="container">
    <!-- Default Comments -->
    <div class="default-comments">
      <h2>Default Comments</h2>
      <ul>
        <li class="comment-box" @click="addDefaultComment('Great student, very punctual.', 9)">
          <span>Ayuda a sus compañeros con la materia</span>
        </li>
        <li class="comment-box" @click="addDefaultComment('Excellent performance in mathematics.', 10)">
          <span>Alumno Puntual</span>
        </li>
        <li class="comment-box" @click="addDefaultComment('Needs improvement in participation.', -5)">
          <span>Participativo en clases</span>
        </li>
        <li class="comment-box2" @click="addDefaultComment('Shows great interest in science projects.', -8)">
          <span>Copia de prueba</span>
        </li>
        <li class="comment-box2" @click="addDefaultComment('Has strong teamwork skills.', -10)">
          <span>Copia proyecto</span>
        </li>
        <li class="comment-box2" @click="addDefaultComment('Lacks attention to detail.', -2)">
          <span>Golpeo al jefe de grupo</span>
        </li>
      </ul>
    </div>


    <!-- Add a Commentary -->
    <div class="comment-section">
      <h2>Añadir comentario manual</h2>
      <textarea v-model="comentario" placeholder="Write a comment..."></textarea>
      <button @click="addComment">Añadir comentario</button>
      <div class="comments-list">
        <h3>Comentarios:</h3>
        <ul>
          <li v-for="(comment, index) in comments" :key="index" class="comment-box">
            <span>{{ comment }} </span>
            <button @click="deleteComment(index)" class="delete-button">Delete</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PerfilAlumno',
  props: ['matriculaalum', 'nombrealum'],
  data() {
    return {
      newComment: {
        matricula: '',
        codDocente: '',
        comentario: '',
        peso: ''
      },
      comments: []
    };
  },
  created() {
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      this.comments = JSON.parse(savedComments);
    }
  },
  methods: {
    async addComment() {
      try {
        this.newComment.matricula = this.matriculaalum;
        this.newComment.codDocente = 'XD';
        this.newComment.peso = 0; // Peso fijo para los comentarios ingresados manualmente

        const response = await axios.post('http://localhost:3333/api/comments/add', this.newComment);

        this.comments.push(response.data);
        this.newComment = {};
      } catch (error) {
        console.error('Error al agregar el comentario:', error.response?.data || error.message);
        alert('Hubo un problema al agregar el comentario. Revisa la consola para más detalles.');
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

        const response = await axios.post('http://localhost:3333/api/comments/add', defaultComment);

        this.comments.push(response.data);
      } catch (error) {
        console.error('Error al agregar el comentario predeterminado:', error.response?.data || error.message);
        alert('No se pudo agregar el comentario predeterminado.');
      }
    },
    async deleteComment(index) {
      try {
                await axios.delete(`http://localhost:3333/api/remove/${this.comments[index].id}`);
            } catch (error) {
                console.error('Error al eliminar el comentario:', error);
            }
    },
    saveComments() {
      localStorage.setItem('comments', JSON.stringify(this.comments));
    }
  }
};
</script>

<style scoped>
/* General container */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Default Comments Section */
.default-comments h2 {
  text-align: center;
  margin-bottom: 10px;
}
.default-comments .comment-box {
  cursor: pointer;
  background-color: #d9f7d9;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.default-comments .comment-box2{
  cursor: pointer;
  background-color: #fc7861;
  transition: background-color 0.3s ease;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.comment-box2:hover{
  background-color: #f8664d;
}

.default-comments .comment-box:hover {
  background-color: #b8e6b8;
}

/* Student Profile */
.student-profile h1 {
  margin-bottom: 10px;
  text-align: center;
}
.student-info {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  background-color: #fff;
}
.student-info p {
  margin: 5px 0;
}

/* Comment Section */
.comment-section h2 {
  text-align: center;
  margin-bottom: 10px;
}
textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}

/* Comments List */
.comments-list {
  margin-top: 20px;
}

.delete-button {
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.delete-button:hover {
  background-color: #e53935;
}
</style>
