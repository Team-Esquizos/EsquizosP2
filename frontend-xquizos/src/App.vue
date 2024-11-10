<template>
<router-view/>
</template>

<script>
import SendCsv from './components/sendcsv.vue';
export default {
  name: 'App',
  components: {
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
