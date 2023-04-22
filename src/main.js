import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import  VueCookies  from 'vue3-cookies';
import "./assets/styles/scrollbar.css";
import "./assets/styles/global.css";
import "./assets/styles/userView.css";
import {Upload} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';


const app = createApp(App)

app.use(router)
// app.use(store)


app.use(ElementPlus)
// Vue.prototype.$cookies = VueCookies;
app.use(VueCookies);
app.use(Upload)

// Or to set default config:



// set global cookie in component:
app.mount('#app')
