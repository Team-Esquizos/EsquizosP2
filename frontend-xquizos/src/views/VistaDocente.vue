<template>
  <div class="vista-docente">
    <navBara />
    <div class="filtros">
      <!-- Dropdown para seleccionar el periodo -->
      <label for="periodo">Selecciona el periodo:</label>
      <select id="periodo" v-model="periodoAct" @change="fetchCursos">
        <option v-for="year in periodos" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>
    <div class="body">
      <!-- Solo muestra los cursos si hay datos disponibles -->
      <modulos 
        v-for="curso in cursos" 
        :key="`${curso.codigo}-${curso.instancia.periodo}`" 
        :nombre="curso.nombre" 
        :seccion="curso.seccion" 
        :area="curso.carrera"  
        :codigo="curso.codigo" 
        :semestre="curso.semestre" 
        :periodo="curso.instancia.periodo"
      />
      <!-- Mensaje si no hay cursos -->
      <p v-if="cursos.length === 0" class="text-center">No hay cursos disponibles para el periodo seleccionado.</p>
    </div>
  </div>
</template>

<script>
import navBara from '@/components/AppNavbarAdm.vue';
import modulos from '@/components/modulos.vue';
import axios from 'axios';
import autenticadorSesion from '@/mixins/AutenticadorSesion';

export default {
  name: "VistaDocente",
  mixins: [autenticadorSesion],
  components: {
    navBara,
    modulos
  },
  data() {
    return {
      cursos: [],
      periodoAct: new Date().getFullYear(), // Año actual como valor predeterminado
      periodos: Array.from({ length: 26 }, (_, i) => 2000 + i), // Genera años desde 2000 hasta 2025
    };
  },
  created() {
    this.fetchCursos();
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'VistaDocente' });
    },
    async fetchCursos() {
      try {
        const storedUser = localStorage.getItem('rut') || sessionStorage.getItem('rut');
        console.log('Rut:', storedUser);
        console.log('Periodo seleccionado:', this.periodoAct);

        // Limpia los cursos anteriores al cambiar el periodo
        this.cursos = [];

        const response = await axios.get(`http://localhost:3333/api/courseInstance/getteacherinstance/${storedUser}/${this.periodoAct}`);
        
        if (response.data.status) {
          const { courses, instance } = response.data;

          // Combinar cursos e instancias en el frontend
          this.cursos = courses.map(course => {
            const relatedInstance = instance.find(inst => inst.codCurso === course.codigo);
            return {
              ...course, // Datos del curso
              instancia: relatedInstance ? relatedInstance : null // Instancia relacionada o null si no hay coincidencia
            };
          });

          console.log('Cursos obtenidos:', this.cursos);
        } else {
          console.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error al obtener cursos:', error);
      }
    }
  }
};
</script>

<style scoped>
.vista-docente {
  background-color: var(--background);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.filtros {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.body {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
  padding: 20px;
}

@media (max-width: 768px) {
  .body {
    grid-template-columns: repeat(1, 1fr);
    padding: 10px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .body {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .body {
    margin-left: 10%;
    margin-right: 10%;
  }
}
</style>


