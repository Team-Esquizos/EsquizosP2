<template>
  <div class="parent">
    <div class="card">
      <div class="content-box">
        <!-- Mostrar el nombre del módulo recibido como prop -->
        <span class="card-title">{{ nombre }}</span>
        <span class="card-seccion"> {{ seccion }}</span>
        <p class="card-content">
          {{ periodo }} - {{ semestre }}
        </p>
        <button class="see-more"  @click="irAlumnos(nombre, seccion, codigo, periodo)">Entrar</button>
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
    carrera: {
      type: String,
      required:true
    },
    codigo: {
      type: String,
      required:true
    },
    semestre: {
      type: String,
      required:true
    },
    periodo: {
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
        const response = await axios.get('http://localhost:8080/api/getCurso');
        this.cursos = response.data; // Asigna los datos a la propiedad 'cursos'
      } catch (error) {
        console.error(error);
      }
    },
    irAlumnos(nombre, seccion, codigo, periodo) {
      // Pasa la id del curso al navegar a la vista de alumnos
      this.$router.push({ name: 'VistaAlumnos', params: { nombreCurso: nombre, seccionCurso: seccion , codigo: codigo, periodo: periodo} });
    }
  },
  created() {
    this.obtenerModulos(); // Cargar los módulos al iniciar el componente
  }
}
</script>

<style scoped>
.parent {
  width: 300px; /* Ancho fijo para todas las tarjetas */
  padding: 20px;

}
.card {
  background:var(--blue);
  padding-top: 60px;
  border-radius: 15px;
  width: 100%;
  display: flex; /* Flexbox para alinear contenido */
  flex-direction: column;
  height: 310px; /* Altura fija para tarjetas uniformes */
  overflow: hidden; /* Evita que el contenido sobresalga */
}


.content-box {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 25px;
  box-sizing: border-box;
  overflow: hidden;
  text-transform: uppercase;
  background: linear-gradient(135deg, #f0f0f0, #d9d9d9);
}

.content-box .card-content {
  flex-grow: 1;
  text-align: center;

 }

.content-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(165, 162, 162);
  background-size: cover;
  background-position: center;
  filter: blur(2px); /* Ajusta el nivel de difuminado */
  z-index: -1; /* Envía el fondo detrás del contenido */
}

.content-box .card-title {
  display: block;
  color: rgb(0, 0, 0);
  font-size: 20px;
  font-weight: 900;
  transition: all 0.5s ease-in-out;
  
}

.content-box .card-seccion {
  display: block; /* Forzar a ocupar una línea nueva */
  font-size: 18px;
  font-weight: 600;
  color: #000000;

}

.content-box .see-more {
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  color:white;
  background: linear-gradient(135deg, #007bff, #0056b3);
  border-radius: 13px;
  padding: 0.7rem 1.5rem;
  border: none;
  transition: all 0.5s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
.content-box .see-more:hover {
  background: linear-gradient(135deg, #0056b3, #003f7f);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
}

.content-box .see-more:active {
  transform: scale(1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.content-box .see-more span {
  display: inline-block;
  position: relative;
  transition: all 0.3s ease-in-out;
}


/* Media queries para pantallas pequeñas */
@media (max-width: 768px) {
  .parent {
    max-width: 90%; /* Reducir el ancho en pantallas pequeñas */
  }

  .content-box .card-title {
    font-size: 20px; /* Ajustar tamaño de texto */
  }

  .content-box .card-seccion {
    font-size: 16px; /* Ajustar tamaño de texto */
  }

  .content-box .see-more {
    font-size: 10px; /* Ajustar tamaño del botón */
  }
}

/* Media queries para pantallas muy pequeñas */
@media (max-width: 480px) {
  .content-box {
    padding: 40px 15px 15px 15px; /* Reducir el relleno */
  }

  .content-box .card-title {
    font-size: 18px;
  }

  .content-box .card-seccion {
    font-size: 14px;
  }
}
</style>