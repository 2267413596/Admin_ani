import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import  VueCookies  from 'vue3-cookies';


const app = createApp(App)

app.use(router)
// app.use(store)


app.use(ElementPlus)
// Vue.prototype.$cookies = VueCookies;
app.use(VueCookies);

// Or to set default config:



// set global cookie in component:
app.mount('#app')
