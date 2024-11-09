import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue'; 
import Editor from '../components/EditorView.vue';


const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;