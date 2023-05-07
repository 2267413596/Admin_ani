<template>
    <div id="root">
        <el-container style="box-sizing: border-box;">
            <el-header>
                <p style="color: white; text-align: center; margin: 5px;font-size: 30px">管理员主页</p>
            </el-header>
            <div>
                <el-container>
                    <el-scrollbar>
                    <el-aside :width="'180px'">
                        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                            text-color="#fff" default-active="active" vue-router="true" >
                            <el-menu-item index="1" @click="tweet"> 
                                <span>帖子审核</span>
                            </el-menu-item>
                            <el-menu-item index="2" @click="comment">
                                <span>评论审核</span>
                            </el-menu-item>
                            <el-menu-item index="3" @click="record">
                                <span>编辑档案</span>
                            </el-menu-item>
                            <el-menu-item index="4" @click="adopt">
                                <span>审核领养</span>
                            </el-menu-item>
                            <el-menu-item index="5" @click="response">
                                <span>求助管理</span>
                            </el-menu-item>
                            <el-menu-item index="6" @click="users">
                                <span>用户管理</span>
                            </el-menu-item>
                        </el-menu>
                    </el-aside>
                </el-scrollbar>
                    <el-main class="main">
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </div>
        </el-container>
    </div>
</template>

<style>
@import '../assets/styles/global.css';
</style>


<script>
import { defineComponent, ref , computed} from 'vue';
import Axios from 'axios';
import { useCookies } from "vue3-cookies"; 
import {useRouter} from 'vue-router'

const router=useRouter();
export default defineComponent({
    beforeCreate() {
        document.querySelector('body')
        .setAttribute('style', 'margin: 0')
    },
    setup() {
        const router=useRouter();
        const active = ref(router.currentRoute.value.name)
        const { cookies } = useCookies();
        const comment = () => {
            active.value = "2"
            router.replace('/admin/comment')
            
        };
        const response = () => {
            active.value = "5"
            router.push('/admin/response')
            
        };
        const adopt = () => {
            active.value = "4"
            router.replace('/admin/adopt')
        };
        const users = () => {
            active.value = "6"
            router.replace('/admin/users')
            
        };
        const tweet = () => {
            active.value = "1"
            router.replace('/admin/tweet')
            
        };
        const record = () => {
            active.value = "3"
            router.replace('/admin/record')
        };
        return {
            record,
            tweet,
            users,
            adopt,
            response,
            comment,
            active
        }
    }
})
</script>