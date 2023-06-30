import { createRouter, createWebHistory } from 'vue-router'
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Index/index.vue')
      },
  ]
})
 
export default router;
