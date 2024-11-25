<template>
  <navBar/>
  <div class="student-profile">
    <header>
      <h1>Student Profile</h1>
    </header>
    <section class="student-info">
      <p><strong>Name:</strong> {{ nombrealum }}</p>
      <p><strong>Matricula:</strong> {{ matriculaalum }}</p>
    </section>
  </div>
  <div class="container">
    <!-- Default Comments -->
    <section class="default-comments">
      <h2>Default Comments</h2>
      <div class="default-comments-group">
        <div class="comment-category">
          <h3>Positive Comments</h3>
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
          <h3>Negative Comments</h3>
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

    <!-- Add a Commentary -->
    <section class="comment-section">
      <h2>Add a Custom Comment</h2>
      <textarea v-model="newComment.comentario" placeholder="Write a comment..."></textarea>
      <button @click="addComment">Add Comment</button>
      <div class="comments-list">
        <h3>Comments:</h3>
        <ul>
          <li v-for="(comment, index) in comments" :key="index" class="comment-box">
            {{ comment.comentario }}
            <button @click="deleteComment(comment._id)" class="delete-button">Delete</button>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import navBar from '@/components/AppNavbarAdm.vue';

export default {
  name: 'PerfilAlumno',
  props: ['matriculaalum', 'nombrealum'],
  components: {
      navBar
  },
  data() {
    return {
      newComment: {
        matricula: '',
        codDocente: '',
        comentario: '',
        peso: '',
      },
      comments: [],
    };
  },
  created() {
    this.fetchComments();
  },
  methods: {
    async fetchComments() {
      try {
        const response = await axios.get(
          `http://localhost:3333/api/comments/getFromMatricula/${this.matriculaalum}`
        );
        this.comments = response.data.comments;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    async addComment() {
      try {
        this.newComment.matricula = this.matriculaalum;
        this.newComment.codDocente = 'XD';
        this.newComment.peso = 0;

        await axios.post('http://localhost:3333/api/comments/add', this.newComment);
        this.newComment = {};
        this.fetchComments();
      } catch (error) {
        console.error('Error adding comment:', error);
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
      } catch (error) {
        console.error('Error adding default comment:', error);
      }
    },
    async deleteComment(index) {
      try {
        await axios.delete(`http://localhost:3333/api/comments/remove/${index}`);
        this.fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    },
  },
};
</script>

<style scoped>
/* General Styling */
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f9;
  color: #333;
  margin: 0;
  padding: 0;
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
  background-color: #ffffff;
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
  background-color: #fff;
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
  background-color: #f9f9f9;
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
</style>


