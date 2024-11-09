import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import VistaAdministrador from '@/views/VistaAdministrador.vue';
import VistaDocente from '@/views/VistaDocente.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/vistaAdministrador',
    name: 'VistaAdministrador',
    component: VistaAdministrador
  },
  {
    path: '/vistaDocente',
    name: 'VistaDocente',
    component: VistaDocente
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;