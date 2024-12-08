// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el enrutador
import 'flowbite/dist/flowbite.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/global.css';



const app = createApp(App);

app.use(router); // Usa el enrutador en la aplicación
app.mount('#app'); // Monta la aplicación en el elemento con id "app"
