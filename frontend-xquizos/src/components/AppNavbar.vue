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
        <Profile/>
    </nav>
</template>

<script>
import Profile from '@/components/Profile.vue';

export default {
  name: 'AppNavbar',
  components: {
    Profile,
  },

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
    background-color: transparent; 
    padding: 20px 50px;
    color: #fff;
    position: absolute;
    top: 0;
    height: 80px;
    box-sizing: border-box;
    backdrop-filter: blur(5px); 
  }
  
  .navbar-logo {
    color: #000000;
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
    gap: 10%;
    justify-content: center;
    margin: 0;
    flex: 1; 
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