<template>
    <div class="vista-docente">
      <navBar />
      <div class="body">
        <!-- Usa v-for para iterar sobre los módulos y crear una tarjeta para cada uno -->
        <modulos v-for="modulo in modulosDocente" :key="modulo.id" :nombre="modulo.nombre" />
      </div>
    </div>
  </template>
  

<script>
  import navBar from '@/components/AppNavbar.vue';
  import modulos from '@/components/modulos.vue';
  import autenticadorSesion from '@/mixins/AutenticadorSesion';   // Se debe agregar a nuevos componentes (Que puedan ser accedidos por ruta)
  
  export default {
    name: "VistaDocente",
    mixins: [autenticadorSesion],  // Se debe agregar a nuevos componentes (Que puedan ser accedidos por ruta)
    components: {
      navBar,
      modulos
    },
    data() {
      return {
        // Lista de módulos con nombre y un identificador
        modulosDocente: [
          { id: 1, nombre: "Redes" },
          { id: 2, nombre: "Matemáticas" },
          { id: 3, nombre: "Física" },
          { id: 4, nombre: "Química" },
          { id: 5, nombre: "Programación" },
          { id: 6, nombre: "Inglés" }
        ]
      };
    }
  }
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