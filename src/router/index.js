import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      children:[
        {
          path:'/admin/users',
          component:()=>import('../views/admin/UsersView.vue'),
        },
      ]
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path == '/') {
      next();
  } else {
      // 获取 token
      const token = cookies.get('myCookie');
      console.log(token)
      // token 不存在
      if(from.path == '/') {
        alert('身份验证失败');
      } else if (token === null || token === 'aa') {
          alert('登录已过期');
          next('/');
      } else {
          next();
      }
  }
});

export default router
