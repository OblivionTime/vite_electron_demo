import { createRouter, createWebHashHistory } from 'vue-router'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
        path: '/',
        name: 'index',
        component: () => import('@/views/Index/index.vue')
      },
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/index.vue')
      },
  ]
})
 
export default router;
