<template>
    <div id="root">
        <el-container style="box-sizing: border-box;">
            <el-header>
                <p style="color: white; text-align: center; margin: 5px;font-size: 30px">管理员主页</p>
            </el-header>
            <div>
                <el-container>
                    <el-scrollbar>
                    <el-aside :width="isCollapse ? '64px' : '200px'">
                        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                            text-color="#fff" >
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
                            <el-menu-item index="4" @click="log">
                                <el-icon>
                                    <document />
                                </el-icon>
                                <span>审核日志</span>
                            </el-menu-item>
                            <el-menu-item index="5" @click="response">
                                <el-icon>
                                    <ChatLineRound />
                                </el-icon>
                                <span>求助回应</span>
                            </el-menu-item>
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

export default defineComponent({
    beforeCreate() {
        document.querySelector('body')
        .setAttribute('style', 'margin: 0')
    },
    setup() {
        const router=useRouter();
        const { cookies } = useCookies();
        const comment = () => {
            router.replace('/admin/comment')
        };
        const response = () => {
            router.replace('/admin/response')
        };
        const log = () => {
            router.replace('/admin/checkLog')
        };
        const users = () => {
            router.replace('/admin/users')
        };
        const tweet = () => {
            router.replace('/admin/tweet')
        };
        const record = () => {
            router.replace('/admin/record')
        };
        return {
            record,
            tweet,
            users,
            log,
            response,
            comment
        }
    }
})
</script>