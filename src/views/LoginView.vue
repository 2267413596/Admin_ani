<script setup>
</script>
<template>
    <div id="root">
        <div id="windows">
            <div id="title">欢迎使用管理系统</div>
            <div class="input">
                <a-input v-model:value="account" placeholder="请输入账号" />
            </div>
            <div class="input">
                <a-input v-model:value="password" placeholder="请输入密码" />
            </div>
            <div>
            <a-row>
                <a-col :span="4" :offset="10">
                    <a-button @click="login">登录</a-button>
                </a-col>
                <a-col :span="7">
                    <p class="p" @click="showModal" style="margin-top: 1vh; font-size: 2px">登录遇到问题？</p>
                </a-col>
              </a-row>
            <a-modal v-model:visible="visible" title="登陆异常" @ok="handleOk">
                <p style="text-align: center; font-size: large">请联系15816546794</p>
            </a-modal>
        </div>
        </div>
    </div>
</template>

<style>
#title{
    text-align: center;
    top: -5vh;
    position: relative;
}
#windows {
    width: 28vw;
    min-width: 250pt;
    /* 水平垂直居中 */
    background-color: rgba(255, 255, 255, 0.5);
    margin: 0 auto;
    top: 30vh;
    position: relative;
    border-radius: 20px;
    padding-bottom: 2vh;
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

export default defineComponent({
    beforeCreate() {
        document.querySelector('body')
        .setAttribute('style', 'background-image: url(/back.jpg); background-size: 100% 100%; background-repeat: no-repeat;')
    },
    setup() {
        let formData = new window.FormData();
        const visible = ref(false);
        const account = ref('');
        const password = ref('');
        const showModal = () => {
        visible.value = true;
        };
        const handleOk = () => {
        visible.value = false;
        };
        const login = () => {
            formData.append('username', account.value);
            formData.append('password', password.value);
            Axios.post('/api/login', formData)
            .then((response) => {   
                alert(1)
                console.log(response);
            })
            .catch((response) => {
                alert(2)
                console.log(response);
            } 
            )
        };
        return {
            password,
            account,
            visible,
            showModal,
            handleOk,
            login,
        };
    },
});
</script>