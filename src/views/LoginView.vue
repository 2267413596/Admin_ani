<script setup>
</script>
<template>
    <div id="root">
        <div id="windows">
            <div id="title">欢迎使用管理系统</div>
            <div class="input">
                <el-input v-model="account" placeholder="请输入账号">
                </el-input>
            </div>
            <div class="input">
                <el-input type="password" v-model="password" show-password placeholder="请输入密码" />
            </div>
            <div>
            <el-row>
                <el-col :span="7" :offset="10">
                    <el-button @click="login">登录</el-button>
                </el-col>
                <el-col :span="7">
                    <p class="p" @click="showModal" style="margin-top: 1vh; font-size: 2px">登录遇到问题？</p>
                </el-col>
              </el-row>
            <el-dialog v-model="visible" title="登录异常" width="30%">
                <p style="text-align: center; font-size: large">请联系15816546794</p>
            </el-dialog>
        </div>
        </div>
    </div>
</template>

<style>
#title{
    text-align: center;
    position: relative;
    font-size: larger;
}
#windows {
    width: 28vw;
    min-width: 250pt;
    height: 35vh;
    background-color: rgba(30, 100, 30, 0.2);
    margin: 0 auto;
    top: 30vh;
    position: relative;
    border-radius: 20px;
    padding: 2vh;
    padding-top: 3vh;
}
.input{
    width: 20vw;
    margin: 2vh auto;
    border-radius: 10px;
}
</style>

<script>
import { defineComponent, ref } from 'vue';
import Axios from 'axios';
import { useCookies } from "vue3-cookies";
import {useRouter} from 'vue-router'

export default defineComponent({
    beforeCreate() {
        document.querySelector('body')
        .setAttribute('style', 'background-image: url(/back.jpg); background-size: 100% 100%; background-repeat: no-repeat;')
    },
    setup() {
        const { cookies } = useCookies();
        const router=useRouter();
        let formData = new window.FormData();
        const visible = ref(false);
        const account = ref('');
        var token = ref('aa');
        const password = ref('');
        var config = {
            headers:{
                "Authorization": "",
            }
        };
        const showModal = () => {
        visible.value = true;
        };
        const handleOk = () => {
        visible.value = false;
        };
        const login = () => {
            formData.append('username', account.value);
            formData.append('password', password.value);
            cookies.set('myCookie', 'aa')
            Axios.post('/api/login', formData)
            .then((response) => {
                console.log(response.data.body.token);
                cookies.set("myCookie", response.data.body.token);
                // this.$router.replace('/admin')
                router.replace('/admin')
                console.log(cookies.get("myCookie"));
            })
            .catch((response) => {
                alert('网络错误!')
                console.log(response);
            })
        };
        return {
            password,
            account,
            visible,
            showModal,
            handleOk,
            login,
            token,
            cookies,
            config
        };
    },
});
</script>