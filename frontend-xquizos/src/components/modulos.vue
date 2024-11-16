<template>
  <div class="parent">
    <div class="card">
      <div class="content-box">
        <!-- Mostrar el nombre del módulo recibido como prop -->
        <span class="card-title">{{ nombre }}</span>
        <span class="card-seccion"> {{ seccion }}</span>
        <p class="card-content">
          {{ area }}
        </p>
        <button class="see-more" @click.prevent="obtenerModulos">Entrar</button>

        <!-- Mostrar la información obtenida -->
        <div v-if="cursos.length">
          <h3>Información del Curso:</h3>
          <ul>
            <li v-for="(curso, index) in cursos" :key="index">
              <p><strong>ID:</strong> {{ curso.ID }}</p>
              <p><strong>Curso:</strong> {{ curso.curso }}</p>
              <p><strong>Nombre del Alumno:</strong> {{ curso.nombreAlumno }}</p>
              <p><strong>Apellido del Alumno:</strong> {{ curso.apellidoAlumno }}</p>
              <hr>
            </li>
          </ul>
        </div>
        <router-link to="/alumnos"> <span class="see-more">Entrar</span></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import autenticadorSesion from '@/mixins/AutenticadorSesion';
import axios from 'axios';

export default {
  mixins: [autenticadorSesion],
  props: {
    nombre: {
      type: String,
      required: true
    },
    seccion: {
      type: String,
      required:true
    },
    area: {
      type: String,
      required:true
    },

  },
  data() {
    return {
      cursos: [] // Almacenará los datos del curso
    };
  },
  methods: {
    async obtenerModulos() {
      try {
        const response = await axios.get('http://localhost:8081/getCurso');
        this.cursos = response.data; // Asigna los datos a la propiedad 'cursos'
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>

<style scoped>
.parent {
  width: 300px;
  padding: 20px;
  perspective: 1000px;
}

.card {
  padding-top: 50px;
  border-radius: 10px; 
  border: 3px solid rgb(0, 0, 0);
  transform-style: preserve-3d;
  background: linear-gradient(135deg,#00000000 18.75%,#353535 0 31.25%,#00000000 0),
      repeating-linear-gradient(45deg,#353535 -6.25% 6.25%,#000000 0 18.75%);
  background-size: 60px 60px;
  background-position: 0 0, 0 0;
  background-color: #000000;
  width: 100%;
  box-shadow: rgba(142, 142, 142, 0.3) 0px 30px 30px -10px;
  transition: all 0.5s ease-in-out;
}

.card:hover {
  background-position: -100px 100px, -100px 100px;
}

.content-box {
  position: relative;
  max-width: 100%;
  padding: 60px 25px 25px 25px;
}

.content-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/red.png');
  background-size: cover;
  background-position: center;
  filter: blur(2px); /* Ajusta el nivel de difuminado */
  z-index: -1; /* Envía el fondo detrás del contenido */
}

.content-box .card-title {
  display: inline-block;
  color: rgb(0, 0, 0);
  font-size: 25px;
  font-weight: 900;
  transition: all 0.5s ease-in-out;
}


.content-box .card-content {
  margin-top: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  transition: all 0.5s ease-in-out;
}



.content-box .see-more {
  cursor: pointer;
  margin-top: 1rem;
  display: inline-block;
  font-weight: 900;
  font-size: 9px;
  text-transform: uppercase;
  color: rgb(0, 0, 0);
  border-radius: 5px; 
  background: white;
  padding: 0.5rem 0.7rem;
  transition: all 0.5s ease-in-out;
  transform: translate3d(0px, 0px, 20px);
  border: 0.5px solid #000000;
}


/* Estilos para la lista de cursos */
.content-box h3 {
  margin-top: 20px;
  color: #333;
  font-size: 18px;
}
.content-box ul {
  list-style-type: none;
  padding: 0;
}
.content-box li {
  margin-bottom: 15px;
}
.content-box p {
  margin: 5px 0;
  color: #555;
}
</style>