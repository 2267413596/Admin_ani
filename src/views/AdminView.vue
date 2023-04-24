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
                            text-color="#fff" default-active="1" vue-router="true">
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
                            <el-sub-menu index="5">
                                <template #title>
                                    <span>求助管理</span>
                                </template>
                                <el-menu-item index="5-1" @click="response1">求助审核</el-menu-item>
                                <el-menu-item index="5-2" @click="response2">求助回应</el-menu-item>
                            </el-sub-menu>
                            <el-menu-item index="6" @click="users">
                                <span>用户管理</span>
                            </el-menu-item>
                        </el-menu>
                    </el-aside>
                </el-scrollbar>
                    <el-main class="main">
                        <router-view/>
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
import { defineComponent, ref } from 'vue';
import Axios from 'axios';
import { useCookies } from "vue3-cookies";
import {useRouter} from 'vue-router'

const activePath = ref('/admin/tweet')
export default defineComponent({
    beforeCreate() {
        document.querySelector('body')
        .setAttribute('style', 'margin: 0')
    },
    setup() {
        const router=useRouter();
        const { cookies } = useCookies();
        const comment = () => {
            router.push('/admin/comment')
        };
        const response1 = () => {
            router.replace({path:'/admin/response', query:{index: 1}})
        };
        const response2 = () => {
            router.replace({path:'/admin/response', query:{index: 2}})
        };
        const adopt = () => {
            router.push('/admin/adopt')
        };
        const users = () => {
            router.push('/admin/users')
        };
        const tweet = () => {
            router.push('/admin/tweet')
        };
        const record = () => {
            router.push('/admin/record')
        };
        return {
            record,
            tweet,
            users,
            adopt,
            response1,
            comment,
            response2
        }
    }
})
</script>