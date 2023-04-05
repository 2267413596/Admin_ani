import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/main.css'
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

const app = createApp(App)

app.use(router)
// app.use(store)

// router.beforeEach((to,from,next)=>{
//     // if (to.meta.requireAuth) {
//     //     if(store.state.user.account ) {
//     //        next()
//     //     } else {
//     //        next({
//     //           name: 'login',
//     //           query: {redirect: to.fullPath}
//     //        })
//     //     }
//     // } else {
//     //    next()
//     // }
//  })

app.mount('#app')

app.use(Antd);