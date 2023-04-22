<template>
    <div id="root">
        <!-- 搜索框 -->
        <div class="basic-box" style="margin:20px;">
            <el-row :gutter="20">
                <el-select v-model="select">
                        <el-option label="所有求助" value=0 />
                        <el-option label="已解决求助" value=1 />
                        <el-option label="待解决求助" value=2 />
                    </el-select>
                <el-col :span="5">
                    <el-input v-model="context" class="w-50 m-2" placeholder="搜索求助" />
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" :icon="Search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- 表格 -->
        <div id="table" class="basic-box" style="margin:20px;">
            <el-table :data="tableData.list" style="width: 100%" max-height="250" v-loading="loading">
                <el-table-column prop="id" label="id" width="200" />
                <el-table-column prop="username" label="用户昵称" width="120" />
                <el-table-column prop="title" label="求助标题" width="180" />
                <el-table-column prop="status" label="状态" width="100" />
                <el-table-column fixed="right" label="Operations">
                    <template #default="scope">
                        <el-button link type="primary" size="small" v-if="isPass == 1" @click.prevent="reply(scope.$index)">
                            查看
                        </el-button>
                        <el-button link type="primary" size="small" v-if="isPass == 0" @click.prevent="check(scope.$index)">
                            审核
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                layout="total, prev, pager, next" :total="2">
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
import { Search} from '@element-plus/icons-vue'
import { useCookies } from "vue3-cookies";
import {useRouter} from 'vue-router'


export default defineComponent({
    
    beforeCreate() {
        document.querySelector('body')
        .setAttribute('style', 'margin: 0')
    },
    setup() {
        const router = useRouter();
        let tableData = reactive({list:[
        ]})
        let formData = new window.FormData();
        const { cookies } = useCookies();
        const select = ref('筛选求助')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': cookies.get('myCookie'),
        }
        const context = ref('')
        const loading = ref(true)
        const isPass = ref(0)
        const currentPage = ref(1)
        if(router.params.index == 0) {  //审核求助
            Axios.post('/api/admin/help/get', {
                "pageNum": 20,
                "page": 1,
                "context": "",
                "isPass": isPass.value
            }, {headers}
            ).then((response) =>{
                console.log(response)
                for (var i = 0; i < response.data.body.helps.length; i++) {
                    var item = response.data.body.helps[i]
                    tableData.list.push(item)
                }
                console.log(tableData.list)
            })
            .catch((response) => {
                alert('网络错误');
                console.log(response);
            })
        } else {    //求助管理
            isPass.value = 3
            Axios.post('/api/admin/help/get', {
                "pageNum": 20,
                "page": 1,
                "context": "",
                "isPass": isPass.value
            }, {headers}
            ).then((response) =>{
                console.log(response)
                for (var i = 0; i < response.data.body.helps.length; i++) {
                    var item = response.data.body.helps[i]
                    tableData.list.push(item)
                }
                console.log(tableData.list)
            })
            .catch((response) => {
                alert('网络错误');
                console.log(response);
            })
        }
        loading = false
        return {
            formData,
            cookies,
            headers,
            loading,
            tableData,
            select,
            context,
            isPass,
            currentPage
        }
    },
    methods: {
        search() {
            this.loading = true
            Axios.post('/api/admin/help/get', {
                "pageNum": 20,
                "page": 1,
                "context": this.context,
                "isPass": this.isPass
            }, {headers}
            ).then((response) =>{
                this.tableData.list = []
                for (var i = 0; i < response.data.body.helps.length; i++) {
                    var item = response.data.body.helps[i]
                    tableData.list.push(item)
            }
                totalNum.value = response.data.body.sumNum
            })
            .catch((response) => {
                ElMessage.error('网络错误')
            })
            this.loading = false
        },
        handleCurrentChange(index) {
            this.loading = true
            this.currentPage = index
            Axios.post('/api/admin/help/get', {
                "pageNum": 20,
                "page": index,
                "context": this.context
            }, {headers}
            ).then((response) =>{
                this.tableData.list = []
                for (var i = 0; i < response.data.body.helps.length; i++) {
                    var item = response.data.body.helps[i]
                    tableData.list.push(item)
                }
                totalNum.value = response.data.body.sumNum
                }
            )
            .catch((response) => {
                ElMessage.error('网络错误')
            })
            this.loading = false
        }
    }
})
</script>