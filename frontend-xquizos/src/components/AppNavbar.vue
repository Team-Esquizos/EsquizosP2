<template>
    <nav class="navbar">
        <div class="navbar-logo">
            <img src="../assets/school.svg" alt="Logo" />
            <span>Administración</span>
        </div>
        <ul class="navbar-links">
            <li><a href="#" class="active">Inicio</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#" @click="cerrarSesion">Salir</a></li>
        </ul>

        <div class="btn-group">
          <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            Bienvenido, {{ username }}
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Algo</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click="cerrarSesion">Cerrar sesión</a></li>
            <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#invitacionesModal">Invitaciones</a></li>
          </ul>
        </div>
    </nav>
</template>

<script>
export default {

methods: {
  cerrarSesion () {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      this.$router.push('/');
    }

}


}
</script>

<style scoped>
  .navbar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent; /* Fondo completamente transparente */
    padding: 20px 50px;
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    height: 80px;
    box-sizing: border-box;
    backdrop-filter: blur(5px); /* Efecto de desenfoque detrás de la navbar */
  }
  
  .navbar-logo {
    color: #000000;
    display: flex;
    align-items: center; /* Alinea la imagen y el texto en el centro verticalmente */
  }
  
  .navbar-logo img {
    height: 40px;
    margin-right: 10px;
  }
  
  .navbar-links {
    list-style: none;
    display: flex;
    gap: 10%;
    justify-content: center;
    margin: 0;
    flex: 1; /* Ocupa el espacio restante para centrar los enlaces */
  }
  
  .navbar-links li {
    display: inline;
  }
  
  .navbar-links a {
    color: #000000;
    text-decoration: none;
  }
  
  .navbar-links a.active {
    font-weight: bold;
  }
</style>