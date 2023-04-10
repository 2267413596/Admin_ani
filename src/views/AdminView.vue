<template>
    <div id="root">
        <el-container style="box-sizing: border-box;">
            <el-header>
                <p style="color: white; margin-top: 10px; margin-left: 20px; text-align: center; font-size: 30px">管理员主页</p>
            </el-header>
            <div>
                <el-container>
                    <el-scrollbar>
                    <el-aside :width="isCollapse ? '64px' : '200px'">
                        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                            text-color="#fff" @open="handleOpen" @close="handleClose">
                            <el-menu-item index="1" @click="tweet">
                                <el-icon><View /></el-icon>
                                <span>帖子审核</span>
                            </el-menu-item>
                            <el-menu-item index="2" @click="record">
                                <el-icon>
                                    <setting />
                                </el-icon>
                                <span>编辑档案</span>
                            </el-menu-item>
                            <el-menu-item index="3" @click="log">
                                <el-icon>
                                    <document />
                                </el-icon>
                                <span>审核日志</span>
                            </el-menu-item>
                            <el-menu-item index="4" @click="respone">
                                <el-icon>
                                    <ChatLineRound />
                                </el-icon>
                                <span>求助回应</span>
                            </el-menu-item>
                            <el-menu-item index="5" @click="userManage">
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
export default {
    methods: {
        tweet() {
            this.$router.replace('/admin/tweet')
        },
        record() {
            this.$router.replace('/admin/record')
        },
        log() {
            this.$router.replace('/admin/log')
        },
        respone() {
            this.$router.replace('/admin/respone')
        },
        userManage() {
            this.$router.replace('/admin/users')
        }
    },
    data() {
        return {
            input1: '',
            input2: '',
            isCollapse: false
        }
    }
}
</script>