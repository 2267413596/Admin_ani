import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/main.css'
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueCookies from 'vue-cookies'

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
app.use(ElementPlus)
app.mount('#app')
app.use(VueCookies)
Vue.prototype.$cookies = VueCookies;
app.use(Antd);