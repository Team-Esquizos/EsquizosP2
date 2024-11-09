<template>
    <div class="admin-container">
      <nav class="navbar">
        <div class="navbar-logo">
          <img src="../assets/school.svg" alt="Logo" />
          <span>Administración</span>
        </div>
        <ul class="navbar-links">
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
      <div class="content">
        <h1>Vista Administrador</h1>
        <p>Esta es la vista del administrador.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VistaAdministrador'
  };
  </script>
  
  <style scoped>
  .admin-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    margin: 0;
    background-image: url('../assets/oficina.jpg'); /* Ruta a tu imagen de fondo */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100vw; /* Asegúrate de que el contenedor ocupe todo el ancho de la ventana */
    height: 100vh; /* Asegúrate de que el contenedor ocupe toda la altura de la ventana */
    overflow: hidden; /* Evita que el contenido se desborde */
  }
  
  .navbar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #007bff; /* Fondo azul sólido */
    padding: 20px 50px; /* Ajusta el padding según sea necesario */
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    height: 80px; /* Ajusta la altura de la barra de navegación */
    box-sizing: border-box; /* Asegúrate de que el padding se incluya en la altura total */
  }
  
  .navbar-logo {
    display: flex;
    align-items: center;
  }
  
  .navbar-logo img {
    height: 40px;
    margin-right: 10px;
  }
  
  .navbar-links {
    list-style: none;
    display: flex;
    gap: 20px;
  }
  
  .navbar-links li {
    display: inline;
  }
  
  .navbar-links a {
    color: #fff;
    text-decoration: none;
  }
  
  .navbar-links a.active {
    font-weight: bold;
  }
  
  .content {
    margin-top: 100px; /* Ajusta este valor según la altura de tu navbar */
    text-align: center;
    color: #fff; /* Asegúrate de que el texto sea legible sobre la imagen de fondo */
  }
  
  h1 {
    color: #fff;
    font-size: 2em;
    margin-bottom: 10px;
  }
  
  p {
    color: #fff;
    font-size: 1.2em;
  }
  </style>