<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <SendCsv ref="sendCsv"/>
  <button @click="enviarcsv">enviarcsv</button>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import SendCsv from './components/sendcsv.vue';
export default {
  name: 'App',
  components: {
    HelloWorld,
    SendCsv
  },

    enviarcsv() {
      console.log("enviarcsv");
      this.$refs.sendCsv.uploadFile();
    }
}
  


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
