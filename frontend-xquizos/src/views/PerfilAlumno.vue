<template>
    <div class="container">
      <div class="student-profile">
        <h1>Student Profile</h1>
        <div class="student-info">
          <p><strong>Name:</strong> {{ nombrealum }}</p>
          <p><strong>Matricula:</strong> {{ matriculaalum }}</p>
        </div>
      </div>
      <div class="comment-section">
        <h2>Add a Commentary</h2>
        <textarea v-model="newComment" placeholder="Write a comment..."></textarea>
        <button @click="addComment">Add Comment</button>
        <div class="comments-list">
          <h3>Comments:</h3>
          <ul>
            <li v-for="(comment, index) in comments" :key="index" class="comment-box">
              <span>{{ comment }}</span>
              <button @click="deleteComment(index)" class="delete-button">Delete</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PerfilAlumno',
    props: ['matriculaalum', 'nombrealum'],
    data() {
      return {
        newComment: '',
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
      addComment() {
        if (this.newComment.trim() !== '') {
          this.comments.push(this.newComment);
          this.newComment = '';
          this.saveComments();
        }
      },
      deleteComment(index) {
        this.comments.splice(index, 1);
        this.saveComments();
      },
      saveComments() {
        localStorage.setItem('comments', JSON.stringify(this.comments));
      }
    }
  };
  </script>
  
  <style scoped>
  /* General container to center content and add padding */
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .student-profile {
    margin-bottom: 20px;
  }
  
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
  
  /* Comment section styles */
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
  
  .comments-list {
    margin-top: 20px;
  }
  
  .comment-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #fff;
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
  
  /* Ensure the body has some margin and padding */
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #eaeaea;
  }
  </style>
  