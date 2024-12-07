<template>
    <div class="gestor-datos-container">
      <h1 class="header-title">Gestor de Datos</h1>
      <div class="card-container">
        <!-- Card Gestor de Alumnos -->
        <div class="card shadow-lg" @click="goToGestorAlumnos">
          <img src="https://www.utalca.cl/content/uploads/2021/01/web-42.png" class="card-img-top" alt="Gestor Alumnos" />
          <div class="card-body">
            <h5 class="card-title">Gestor de Alumnos</h5>
            <p class="card-text">Administra los alumnos del sistema.</p>
          </div>
        </div>
  
        <!-- Card Gestor de Docentes -->
        <div class="card shadow-lg" @click="goToGestorDocentes">
          <img src="https://www.udima.es/sites/udima.es/files/GettyImages-1468138682.jpg" class="card-img-top" alt="Gestor Docentes" />
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

        <!-- Card Gestor de Cursos -->
        <div class="card shadow-lg" @click="goToGestorCursosPeriodo">
          <img src="https://conidea.mx/wp-content/uploads/2020/06/cursos-en-linea-para-mejorar.jpg" class="card-img-top" alt="Gestor Cursos Periodo" />
          <div class="card-body">
            <h5 class="card-title">Gestor de Cursos Periodo</h5>
            <p class="card-text">Gestiona los cursos disponibles en el sistema por semestre.</p>
          </div>
        </div>
        
        
      </div>
    </div>
  </template>
  
  <script>

import autenticadorSesion from '../mixins/AutenticadorSesion.js';

  export default {
    name: 'GestorDatos',
    mixins: [autenticadorSesion],
    components: {
   
    },
    methods: {
      goToGestorAlumnos() {
        this.$router.push('/gestorAlumnos');
      },
      goToGestorDocentes() {
        this.$router.push('/gestorDocentes');
      },
      goToGestorCursos() {
        this.$router.push('/gestorCursos');
      },
      goToGestorCursosPeriodo() {
        this.$router.push('/gestorCursosPeriodo');
      }
    }
  };
  </script>
  
  <style scoped>
  .gestor-datos-container {
    text-align: center;
    padding: 20px;
  }
  
  .header-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  padding: 15px;
  border: 2px solid #eaeaea;
  border-radius: 20vh;
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  flex-grow: 1; /* Permite al título ocupar el espacio restante */
  margin-top: 3vh;
  margin-bottom: 8vh;
}

  .title {
    font-size: 2.5em;
    color: #333;
    margin-bottom: 30px;
  }
  
  .card-container {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 180px;
    flex-wrap: wrap; /* Permite que las cards se ajusten en pantallas pequeñas */
  }
  
  .card {
    width: 300px; /* Ancho fijo para todas las cards */
    height: 400px; /* Alto fijo para todas las cards */
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .card-img-top {
    height: 200px; /* Alto fijo para todas las imágenes */
    object-fit: cover;
    width: 100%;
    border-bottom: 2px solid #000000;
  }
  
  .card-body {
    padding: 20px;
    height: 200px; /* Alto fijo para el contenido */
    display: flex;
    flex-direction: column;
  }
  
  .card-title {
    font-size: 1.50em;
    color: #000000;
    font-weight: 600; 
    margin-bottom: 10px;
  }
  
  .card-text {
    color: #666;
    font-size: 1.25em;
    flex-grow: 1; /* Permite que el texto ocupe el espacio restante */
  }
  
  .card:hover .card-title {
    color: #232323;
  }
  
  .card:hover .card-text {
    color: #333;
  }
  </style>
