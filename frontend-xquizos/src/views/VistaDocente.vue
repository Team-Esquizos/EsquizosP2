/* eslint-disable */
<template>
    <navBar/>
    <div class="body">
        <modulos/>
        <modulos/>
        <modulos/>
        <modulos/>
        <modulos/>
        <modulos/>
    </div>
</template>

<script>
import navBar from '@/components/AppNavbar.vue';
import modulos from '@/components/modulos.vue';

export default {
    name: "VistaDocente",
    components: {
        navBar,
        modulos
    }
}
</script>

<style scoped>
.body {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Ajuste automático */
    gap: 10px; /* Espacio entre módulos */
    padding: 20px;
}

/* Media queries para adaptar el diseño */
@media (max-width: 768px) { /* Pantallas pequeñas */
    .body {
        grid-template-columns: repeat(1, 1fr); /* 1 módulo por fila en pantallas pequeñas */
        padding: 10px;
    }
}

@media (min-width: 769px) and (max-width: 1024px) { /* Pantallas medianas */
    .body {
        grid-template-columns: repeat(2, 1fr); /* 2 módulos por fila en pantallas medianas */
    }
}

@media (min-width: 1025px) { /* Pantallas grandes */
    .body {
        margin-left: 10%; /* Espacios laterales en pantallas grandes */
        margin-right: 10%;
    }
}
</style>