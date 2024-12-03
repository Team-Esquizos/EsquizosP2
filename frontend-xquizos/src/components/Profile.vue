<template>
  <label class="popup">
    <input type="checkbox" />
    <div tabindex="0" class="burger">
      <!-- Usa la imagen como botón -->
      <img :src="profileImage" alt="Profile Icon" class="burger-image" />
    </div>
    <nav class="popup-window">
      <span>Bienvenido {{ userName }}</span>
      <ul>
        <li>
          <button @click="triggerFileInput">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
              stroke-linecap="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 4v6.406l-3.753 3.741-6.463-6.462 3.7-3.685h6.516zm2-2h-12.388l1.497 1.5-4.171 4.167 9.291 9.291 4.161-4.193 1.61 1.623v-12.388zm-5 4c.552 0 1 .449 1 1s-.448 1-1 1-1-.449-1-1 .448-1 1-1zm0-1c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm6.708.292l-.708.708v3.097l2-2.065-1.292-1.74zm-12.675 9.294l-1.414 1.414h-2.619v2h-2v2h-2v-2.17l5.636-5.626-1.417-1.407-6.219 6.203v5h6v-2h2v-2h2l1.729-1.729-1.696-1.685z"
              ></path>
            </svg>
            <span>Editar Imagen</span>
          </button>
          <input type="file" ref="fileInput" @change="onFileSelected" style="display: none;" accept="image/*" />
        </li>
        <li>
          <button>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.598 9h-1.055c1.482-4.638 5.83-8 10.957-8 6.347 0 11.5 5.153 11.5 11.5s-5.153 11.5-11.5 11.5c-5.127 0-9.475-3.362-10.957-8h1.055c1.443 4.076 5.334 7 9.902 7 5.795 0 10.5-4.705 10.5-10.5s-4.705-10.5-10.5-10.5c-4.568 0-8.459 2.923-9.902 7zm12.228 3l-4.604-3.747.666-.753 6.112 5-6.101 5-.679-.737 4.608-3.763h-14.828v-1h14.826z"
              ></path>
            </svg>
            <span><a href="#" @click="cerrarSesion">Salir</a></span>
          </button>
        </li>
      </ul>
    </nav>
  </label>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Profile',
  
  computed: {
    userName() {
      return localStorage.getItem('user') || sessionStorage.getItem('user') || 'Usuario';
    },
    userRole() {
      const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
      return isAdmin === 'true' ? 'Administrador' : 'Docente';
    },
  },
  mounted() {
    this.obtenerImagenPerfil();
},
  methods: {
    cerrarSesion() {
      localStorage.removeItem('email');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('isAdmin');
      this.$router.push('/');
    },
    irAInicio() {
      const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
      if (isAdmin === 'true') {
        this.$router.push({ name: 'VistaAdministrador' });
      } else {
        this.$router.push({ name: 'VistaDocente' });
      }
    },
    GestorAlumnos() {
      this.$router.push({ name: 'GestorAlumnos' });
    },
    GestorDocentes() {
      this.$router.push({ name: 'GestorDocentes' });
    },
    GestorCursos() {
      this.$router.push({ name: 'GestorCursos' });
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const username = localStorage.getItem('user') || sessionStorage.getItem('user');
        const encodedUsername = encodeURIComponent(username);
        try {
          const response = await axios.post(
            `http://localhost:3333/api/usuarito/${encodedUsername}`,
            formData
          );
          this.profileImage = response.data.imageUrl;
          // Forzar un reinicio de la página después de subir la imagen
          window.location.reload();
        } catch (error) {
          console.error('Error al subir la imagen:', error);
        }
      }
    },
    async obtenerImagenPerfil() {
      const username = localStorage.getItem('user') || sessionStorage.getItem('user');
      const encodedUsername = encodeURIComponent(username);
      try {
        const response = await axios.get(`http://localhost:3333/api/usuarito/${encodedUsername}/imagen`, {
          responseType: 'arraybuffer' // Importante para manejar datos binarios
        });
        const imgBase64 = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        this.profileImage = `data:image/png;base64,${imgBase64}`; // Cambia 'image/png' si es necesario
      } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error);
        // Puedes asignar una imagen por defecto si ocurre un error
        this.profileImage = '../assets/Profile.png';
      }
    }
    },

  
  data() {
    return {
      isMobileMenuOpen: false,
       profileImage: ''
    };
  },

}
</script>

<style scoped>
/* Variables de estilo del dropdown y el botón de perfil */
.popup {
  --burger-line-width: 1.125em;
  --burger-line-height: 0.125em;
  --burger-offset: 0.625em;
  --burger-bg: #00bf63;
  --burger-color: #333;
  --burger-line-border-radius: 0.1875em;
  --burger-diameter: 3.125em;
  --burger-btn-border-radius: calc(var(--burger-diameter) / 2);
  --burger-line-transition: 0.3s;
  --burger-transition: all 0.1s ease-in-out;
  --burger-hover-scale: 1.1;
  --burger-active-scale: 0.95;
  --burger-enable-outline-color: var(--burger-bg);
  --burger-enable-outline-width: 0.125em;
  --burger-enable-outline-offset: var(--burger-enable-outline-width);
  /* nav */
  --nav-padding-x: 0.25em;
  --nav-padding-y: 0.625em;
  --nav-border-radius: 0.375em;
  --nav-border-color: #ccc;
  --nav-border-width: 0.0625em;
  --nav-shadow-color: rgba(0, 0, 0, 0.2);
  --nav-shadow-width: 0 1px 5px;
  --nav-bg: #eee;
  --nav-font-family: "Poppins", sans-serif;
  --nav-default-scale: 0.8;
  --nav-active-scale: 1;
  --nav-position-left: 0;
  --nav-position-right: unset;
  /* Título del nav */
  --nav-title-size: 0.625em;
  --nav-title-color: #777;
  --nav-title-padding-x: 1rem;
  --nav-title-padding-y: 0.25em;
  /* Botones del nav */
  --nav-button-padding-x: 1rem;
  --nav-button-padding-y: 0.375em;
  --nav-button-border-radius: 0.375em;
  --nav-button-font-size: 17px;
  --nav-button-hover-bg: #00bf63;
  --nav-button-hover-text-color: #fff;
  --nav-button-distance: 0.875em;
  /* Subrayado */
  --underline-border-width: 0.0625em;
  --underline-border-color: #ccc;
  --underline-margin-y: 0.3125em;
}

/* Contenedor principal del dropdown */
.popup {
  display: inline-block;
  text-rendering: optimizeLegibility;
  position: relative;
}

.popup input {
  display: none;
}

/* Botón de perfil con imagen */
.burger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--burger-diameter);
  height: var(--burger-diameter);
  border-radius: var(--burger-btn-border-radius);
  background: transparent; /* Sin fondo para que la imagen lo ocupe */
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: var(--burger-enable-outline-width) solid transparent;
  outline-offset: 0;
  transition: var(--burger-transition);
}

/* Imagen del botón de perfil */
.burger-image {
  width: var(--burger-diameter);
  height: var(--burger-diameter);
  border-radius: 50%;
  object-fit: cover;
}

/* Ventana del dropdown */
/* Ventana del dropdown */
.popup-window {
  z-index: 9999; /* Asegura que esté por encima de otros elementos */
  transform: scale(var(--nav-default-scale));
  visibility: hidden;
  opacity: 0;
  position: absolute;
  padding: var(--nav-padding-y) var(--nav-padding-x);
  background: var(--nav-bg);
  font-family: var(--nav-font-family);
  color: var(--nav-text-color);
  border-radius: var(--nav-border-radius);
  box-shadow: var(--nav-shadow-width) var(--nav-shadow-color);
  border: var(--nav-border-width) solid var(--nav-border-color);
  top: calc(
    var(--burger-diameter) + var(--burger-enable-outline-width) +
      var(--burger-enable-outline-offset)
  );
  right: 0;
  margin-top: 10px;
  transition: var(--burger-transition);
}



/* Estilos del título del dropdown */
.popup-window legend {
  padding: var(--nav-title-padding-y) var(--nav-title-padding-x);
  margin: 0;
  color: var(--nav-title-color);
  font-size: var(--nav-title-size);
  text-transform: uppercase;
}

/* Lista de opciones en el dropdown */
.popup-window ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.popup-window ul button {
  outline: none;
  width: 100%;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  color: var(--burger-color);
  font-size: var(--nav-button-font-size);
  padding: var(--nav-button-padding-y) var(--nav-button-padding-x);
  white-space: nowrap;
  border-radius: var(--nav-button-border-radius);
  cursor: pointer;
  column-gap: var(--nav-button-distance);
}

/* Colores de íconos en el dropdown */
.popup-window ul li:nth-child(1) svg,
.popup-window ul li:nth-child(2) svg {
  color: #00bf63;
}

.popup-window ul li:nth-child(4) svg,
.popup-window ul li:nth-child(5) svg {
  color: rgb(153, 153, 153);
}

.popup-window ul li:nth-child(7) svg {
  color: red;
}

.popup-window hr {
  margin: var(--underline-margin-y) 0;
  border: none;
  border-bottom: var(--underline-border-width) solid var(--underline-border-color);
}

/* Hover y focus en botones del dropdown */
.popup-window ul button:hover,
.popup-window ul button:focus-visible,
.popup-window ul button:hover svg,
.popup-window ul button:focus-visible svg {
  color: var(--nav-button-hover-text-color);
  background: var(--nav-button-hover-bg);
}

/* Efectos de escala en el botón de perfil */
.burger:hover {
  transform: scale(var(--burger-hover-scale));
}

.burger:active {
  transform: scale(var(--burger-active-scale));
}

.burger:focus:not(:hover) {
  outline-color: var(--burger-enable-outline-color);
  outline-offset: var(--burger-enable-outline-offset);
}

/* Mostrar el dropdown cuando el checkbox está seleccionado */
.popup input:checked ~ .popup-window {
  transform: scale(var(--nav-active-scale));
  visibility: visible;
  opacity: 1;
}

</style>
