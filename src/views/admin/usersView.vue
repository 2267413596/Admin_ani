<template>
    <div id="root">
        <!-- 搜索框 -->
        <div class="basic-box" style="margin:20px;">
            <el-row :gutter="20">
                <el-col :span="3" :offset="2">
                    <el-checkbox v-model="checked1" label="显示拉黑用户" size="large" />
                </el-col>
                <el-col :span="5">
                    <el-input v-model="search_content" class="w-50 m-2" placeholder="搜索用户" />
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="Search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- 表格 -->
        <div id="table" class="basic-box" style="margin:20px;">
            <el-table :data="tableData.list" style="width: 100%" max-height="250" v-loading="loading">
                <el-table-column prop="email" label="邮箱" width="200" />
                <el-table-column prop="username" label="用户昵称" width="120" />
                <el-table-column prop="password" label="密码" width="180" />
                <el-table-column prop="phone" label="手机号" width="180" />
                <el-table-column prop="status" label="状态" width="100" />
                <el-table-column fixed="right" label="Operations">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">
                            拉黑
                        </el-button>
                        <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                layout="total, prev, pager, next" :total="10">
            </el-pagination>
        </div>
    </div>
</template>

<style>
@import '../../assets/styles/userView.css';

#search {
    background-color: aquamarine;
}
</style>

<script>
import { defineComponent, onMounted, ref, reactive } from 'vue';
import Axios from 'axios';
import { useCookies } from "vue3-cookies";
import {useRouter} from 'vue-router'

const loading = ref(true)
export default defineComponent({
    
    beforeCreate() {
        document.querySelector('body')
        .setAttribute('style', 'margin: 0')
    },
    setup() {
        let tableData = reactive({list:[]})
        let formData = new window.FormData();
        const { cookies } = useCookies();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': cookies.get('myCookie'),
        }
        Axios.post('/api/admin/user/get', {
            "pageNum": 20,
	        "page": 1,
	        "context": "",
	        "isBlack": false,
        }, {headers}
        ).then((response) =>{
            console.log(response)
            for (var i = 0; i < response.data.body.users.length; i++) {
                var item = response.data.body.users[i]
                if(item.isBlack == true) {
                    item['status'] = '已拉黑'
                } else {
                    item['status'] = '正常'
                }
                tableData.list.push(item)
            }
            console.log(tableData.list)
        })
        .catch((response) => {
            alert('网络错误');
            console.log(response);
        })
        return {
            formData,
            cookies,
            headers,
            loading,
            tableData
        }
    },
    beforeCreate() {
        loading.value = false
    }
})
</script>