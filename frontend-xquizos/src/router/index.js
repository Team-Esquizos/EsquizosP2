import { createRouter, createWebHistory } from 'vue-router';

import Login from '../components/Login.vue'; 
import Editor from '../components/EditorView.vue';
import VistaAdministrador from '@/views/VistaAdministrador.vue';
import VistaDocente from '@/views/VistaDocente.vue';
import temp from '@/views/temp.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor
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
  },
  {
    path: '/temp',
    name: 'temp',
    component: temp
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;