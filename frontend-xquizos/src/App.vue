<template>
  <div id="app">
    <nav>
      <!-- Enlaces de navegación -->
      <router-link to="/login">Login</router-link>
      <router-link to="/editor">Editor</router-link>
    </nav>
    <!-- Vista de la ruta actual -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
nav {
  padding: 1rem;
  background-color: #f4f4f4;
}

nav a {
  margin-right: 1rem;
  color: #42b983;
  text-decoration: none;
}

nav a.router-link-active {
  font-weight: bold;
  color: #35495e;
}
</style>
