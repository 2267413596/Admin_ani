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
          name: 6
        },
        {
          path:'/admin/comment',
          component:()=>import('../views/admin/CommentView.vue'),
          name: 2
        },
        {
          path:'/admin/tweet',
          component:()=>import('../views/admin/TweetView.vue'),
          name: 1
        },
        {
          path:'/admin/record',
          component:()=>import('../views/admin/RecordView.vue'),
          name: 3
        },
        {
          path:'/admin/adopt',
          component:()=>import('../views/admin/AdoptView.vue'),
          name: 4
        },
        {
          path:'/admin/response',
          component:()=>import('../views/admin/ResponseView.vue'),
          name: 5
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
      if (token === null) {
          alert('登录已过期，请重新登录');
          next('/');
      } else {
          next();
      }
  }
});

export default router
