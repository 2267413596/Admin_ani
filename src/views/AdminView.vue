<template>
    <div id="root">
        <el-container style="box-sizing: border-box;">
            <el-header>
                <p style="color: white; text-align: center; margin: 5px;font-size: 30px">管理员主页</p>
            </el-header>
            <div>
                <el-container>
                    <el-scrollbar>
                    <el-aside :width="'200px'">
                        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                            text-color="#fff" default-active="1" vue-router="true">
                            <el-menu-item index="1" @click="tweet">
                                <el-icon><View /></el-icon>
                                <span>帖子审核</span>
                            </el-menu-item>
                            <el-menu-item index="2" @click="comment">
                                <el-icon><View /></el-icon>
                                <span>评论审核</span>
                            </el-menu-item>
                            <el-menu-item index="3" @click="record">
                                <el-icon>
                                    <setting />
                                </el-icon>
                                <span>编辑档案</span>
                            </el-menu-item>
                            <el-menu-item index="4" @click="adopt">
                                <el-icon>
                                    <document />
                                </el-icon>
                                <span>审核领养</span>
                            </el-menu-item>
                            <el-menu-item-group title="求助管理">
                                <el-menu-item index="5-1" @click="response1">求助审核</el-menu-item>
                                <el-menu-item index="5-2" @click="response2">求助回应</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item index="6" @click="users">
                                <el-icon>
                                    <User />
                                </el-icon>
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
            activePath = router.currentRoute.value.path
        };
        const response1 = () => {
            router.push({path:'/admin/response', params:{index: 1}})
            activePath = router.currentRoute.value.path
        };
        const response2 = () => {
            router.push({path:'/admin/response', params:{index: 2}})
            activePath = router.currentRoute.value.path
        };
        const adopt = () => {
            router.push('/admin/adopt')
            activePath = router.currentRoute.value.path
        };
        const users = () => {
            router.push('/admin/users')
            activePath = router.currentRoute.value.path
        };
        const tweet = () => {
            router.push('/admin/tweet')
            activePath = router.currentRoute.value.path
        };
        const record = () => {
            router.push('/admin/record')
            activePath = router.currentRoute.value.path
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