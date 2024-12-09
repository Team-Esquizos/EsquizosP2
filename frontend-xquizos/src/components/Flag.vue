<template>
  <label class="container">
    <input 
      type="checkbox" 
      :checked="checked" 
      @change="handleChange"
    >
    <div class="flag-icons">
      <!-- Ícono de bandera regular -->
      <svg 
        :viewBox="'0 0 448 512'" 
        height="1em" 
        xmlns="http://www.w3.org/2000/svg" 
        class="flag-regular" 
        :style="{ fill: regularColor }">
        <path d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z"></path>
      </svg>
      <!-- Ícono de bandera sólida -->
      <svg 
        :viewBox="'0 0 448 512'" 
        height="1em" 
        xmlns="http://www.w3.org/2000/svg" 
        class="flag-solid" 
        :style="{ fill: solidColor }">
        <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"></path>
      </svg>
    </div>
    <!-- Texto dinámico pasado por prop -->
    <span class="flag-text">{{ texto }}</span>
  </label>
</template>

<script>
export default {
  props: {
    regularColor: {
      type: String,
      default: "#a5a5b0", // Color regular por defecto
    },
    solidColor: {
      type: String,
      default: "#FF0000", // Color sólido por defecto
    },
    texto: {
      type: String,
      required: true, // Obliga a que se pase un texto
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleChange(event) {
      // Emitir el cambio para que el componente padre lo controle
      this.$emit("update:checked", event.target.checked);
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  gap: 15px; /* Ajusta el espacio entre ícono y texto */
  cursor: pointer;
  user-select: none;
  margin: 0.8vh;
}

/* Contenedor de íconos */
.flag-icons {
  display: flex;
  position: relative;
}

/* Íconos regulares y sólidos */
.flag-regular,
.flag-solid {
  width: 1.5em;
  height: 1.5em;
  transition: opacity 0.3s;
}

.flag-solid {
  display: none;
}

/* Mostrar el ícono sólido al seleccionar */
  input:checked ~ .flag-icons .flag-regular {
  display: none;
}

input:checked ~ .flag-icons .flag-solid {
  display: block;
}

/* Texto dinámico */
.flag-text {
  font-size: 1.2rem;
  color: #000; /* Cambia el color si es necesario */
}

/* Ocultar completamente el checkbox */
.container input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
</style>
