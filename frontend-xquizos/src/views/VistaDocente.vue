<template>
    <div class="vista-docente">
      <navBara />
      <div class="body">
        <!-- Usa v-for para iterar sobre los módulos y crear una tarjeta para cada uno -->
        <modulos v-for="curso in cursos" :key="curso.id" :nombre="curso.nombre" :seccion="curso.seccion" :area="curso.area" />
      </div>
    </div>
  </template>
  

<script>
  import navBara from '@/components/AppNavbarAdm.vue';
  import modulos from '@/components/modulos.vue';
  import axios from 'axios';
  import autenticadorSesion from '@/mixins/AutenticadorSesion';   // Se debe agregar a nuevos componentes (Que puedan ser accedidos por ruta)
  
  export default {
    name: "VistaDocente",
    mixins: [autenticadorSesion],  // Se debe agregar a nuevos componentes (Que puedan ser accedidos por ruta)
    components: {
      navBara,
      modulos
    },
    data() {
        return {
        cursos: [],
        curso: {
            nombre: '', seccion: '', area: '', docente: '',
            alumnos: ''
        },
        formFields: {
            nombre: 'Nombre Curso', seccion: 'Sección',
            area: 'Area', docente: 'Docente a cargo'
        },
        requiredFields: ['nombre','seccion', 'area']
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
                const response = await axios.get('http://localhost:3333/api/courses/get');
                this.cursos = response.data;
            } catch (error) {
                console.error('Error al obtener cursos:', error);
            }
        },
    }
  };
</script>

<style scoped>
.vista-docente {
  background-image: url('../assets/oficina.jpg'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Estilos del contenedor de módulos */
.body {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 10px;
    padding: 20px;
}

/* Media queries para adaptar el diseño */
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