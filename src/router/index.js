import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/pages/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/pages/RegisterView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '/home',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: '/vendas',
          name: 'vendas',
          component: () => import('../views/VendasView.vue'),
        },
        {
          path: '/funcionario',
          name: 'funcionario',
          component: () => import('../views/FuncionarioView.vue'),
        },
        {
          path: '/despesas',
          name: 'despesas',
          component: () => import('../views/DespesasView.vue'),
        },
      ],
    },
  ],
});

export default router;
