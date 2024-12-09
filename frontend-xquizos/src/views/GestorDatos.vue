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
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  padding: 10px 20px;
  border:1px solid #eaeaea;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  margin-bottom:80px;
}

.title {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 30px;
}

.card-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  padding-bottom: 20px;
}

.card {
  width: 280px;
  height: 360px;
  cursor: pointer;
  background-color: var(--background);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  height: 180px; /* Alto fijo para todas las imágenes */
  object-fit: cover;
  width: 100%;
  border-bottom: 2px solid #000000;
}

.card-body {
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 180px); /* Resta el alto de la imagen */
}

.card-title {
  font-size: 1.4em;
  color: #2c3e50;
  font-weight: 600; 
  margin-bottom: 10px;
}

.card-text {
  color: #666;
  font-size: 1.2em;
  flex-grow: 1; /* Permite que el texto ocupe el espacio restante */
  display: flex;
  align-items: center;
  text-align: center;

}

</style>
