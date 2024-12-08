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
  padding-top: 60px;
  border-radius: 15px;
  border: 3px solid rgb(0, 0, 0);
  transform-style: preserve-3d;
  background: linear-gradient(135deg, #00000000 18.75%, #353535 0 31.25%, #00000000 0),
    repeating-linear-gradient(45deg, #353535 -6.25% 6.25%, #000000 0 18.75%);
  background-size: 60px 60px;
  background-position: 0 0, 0 0;
  background-color: #000000;
  width: 100%;
  box-shadow: rgba(142, 142, 142, 0.3) 0px 30px 30px -10px;
  transition: all 0.5s ease-in-out;
  display: flex; /* Flexbox para alinear contenido */
  flex-direction: column;
  height: 310px; /* Altura fija para tarjetas uniformes */
  overflow: hidden; /* Evita que el contenido sobresalga */
}

.card:hover {
  background-position: -100px 100px, -100px 100px;
}

.content-box {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 60px 25px 25px 25px;
  flex-direction: column; /* Alinear elementos en columna */
  justify-content: space-between; /* Distribuir espacio entre los elementos */
  background-size: cover;
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
  color: #555;

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
  display:inline-flex;
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
  align-items: flex-end;
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