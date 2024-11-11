<template>
    <div class="gestor-datos-container">
      <h1 class="title">Gestor de Datos</h1>
      <div class="card-container">
        <!-- Card Gestor de Alumnos -->
        <div class="card shadow-lg" @click="goToGestorAlumnos">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTqj1l24c3TO8_1DiRxDWOAWXoQRIuCr17Hg&s" class="card-img-top" alt="Gestor Alumnos" />
          <div class="card-body">
            <h5 class="card-title">Gestor de Alumnos</h5>
            <p class="card-text">Administra los alumnos del sistema.</p>
          </div>
        </div>
  
        <!-- Card Gestor de Docentes -->
        <div class="card shadow-lg" @click="goToGestorDocentes">
          <img src="https://www.cinconoticias.com/wp-content/uploads/tipos-de-profesores.1.jpg" class="card-img-top" alt="Gestor Docentes" />
          <div class="card-body">
            <h5 class="card-title">Gestor de Docentes</h5>
            <p class="card-text">Gestiona la información de los docentes.</p>
          </div>
        </div>
  
        <!-- Card Gestor de Cursos -->
        <div class="card shadow-lg" @click="goToGestorCursos">
          <img src="https://d11cuk1a0j5b57.cloudfront.net/blog/wp-content/uploads/2022/08/18125803/Mejores-plataformas-de-cursos.jpg" class="card-img-top" alt="Gestor Cursos" />
          <div class="card-body">
            <h5 class="card-title">Gestor de Cursos</h5>
            <p class="card-text">Gestiona los cursos disponibles en el sistema.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GestorDatos',
    methods: {
      goToGestorAlumnos() {
        this.$router.push('/gestorAlumnos');
      },
      goToGestorDocentes() {
        this.$router.push('/gestorDocentes');
      },
      goToGestorCursos() {
        this.$router.push('/gestorCursos');
      }
    }
  };
  </script>
  
  <style scoped>
  .gestor-datos-container {
    text-align: center;
    padding: 20px;
  }
  
  .title {
    font-size: 2.5em;
    color: #333;
    margin-bottom: 30px;
  }
  
  .card-container {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .card {
    width: 18rem;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .card-img-top {
    height: 200px;
    object-fit: cover;
    border-bottom: 2px solid #007bff;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .card-title {
    font-size: 1.25em;
    color: #007bff;
  }
  
  .card-text {
    color: #666;
  }
  
  .card:hover .card-title {
    color: #0056b3;
  }
  
  .card:hover .card-text {
    color: #333;
  }
  </style>
  