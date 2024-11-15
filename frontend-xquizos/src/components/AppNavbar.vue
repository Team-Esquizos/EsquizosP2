
<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <img src="../assets/school.svg" alt="Logo" />
      <span>Administración</span>
    </div>
    <ul class="navbar-links" :class="{ 'navbar-links-mobile': isMobileMenuOpen }">
      <li><a href="#" class="active" @click="irAInicio">Inicio</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Pricing</a></li>
      <li><a href="#" @click="cerrarSesion">Salir</a></li>
    </ul>
    <div class="navbar-toggle" @click="toggleMobileMenu">
      <span class="navbar-toggle-icon"></span>
    </div>
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
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px 50px;
  color: #333;
  position: absolute;
  top: 0;
  height: 80px;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.navbar-logo {
  color: #333;
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
  justify-content: center;
  margin: 0;
  flex: 1;
}

.navbar-links li {
  display: inline;
}

.navbar-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.navbar-links a:hover {
  background-color: #f0f0f0;
  color: #000;
}

.navbar-links a.active {
  font-weight: bold;
  background-color: #007bff;
  color: #fff;
}

.navbar-toggle {
  display: none;
  cursor: pointer;
}

.navbar-toggle-icon {
  width: 25px;
  height: 3px;
  background-color: #333;
  display: block;
  margin: 5px 0;
}

@media (max-width: 768px) {
  .navbar {
    padding: 10px 20px;
  }

  .navbar-links {
    display: none;
    flex-direction: column;
    gap: 10px;
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .navbar-links.navbar-links-mobile {
    display: flex;
  }

  .navbar-toggle {
    display: block;
  }
}
</style>