<template>
    <div id="root">
        <!-- 搜索框 -->
        <div class="basic-box" style="margin:20px;">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-input v-model="context" class="w-50 m-2" placeholder="搜索档案" />
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" icon="Search">搜索  </el-button>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" icon="Search">新增档案</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- 表格 -->
        <div id="table" class="basic-box" style="margin:20px;">
            <el-table :data="tableData.list" style="width: 100%" max-height="250" v-loading="loading">
                <el-table-column prop="id" label="动物id" width="200" />
                <el-table-column prop="name" label="动物名称" width="200" />
                <el-table-column prop="status" label="领养状态" width="120" />
                <el-table-column fixed="right" label="Operations">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click.prevent="edit(scope.$index)">
                            编辑
                        </el-button>
                        <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage"
                layout="total, prev, pager, next" :total="1">
            </el-pagination>
        </div>
        <el-dialog
            v-model="dialogVisible"
            title="编辑档案"
            width="50%"
            :before-close="handleClose"
            >
            <el-form :model="form" label-width="120px">
                <el-form-item label="动物名称">
                    <el-input v-model="name" />
                </el-form-item>
                <el-form-item label="动物介绍">
                    <el-input v-model="intro" type="textarea" />
                </el-form-item>
                <el-form-item label="领养状态">
                    <el-select v-model="adopted">
                        <el-option label="已领养" value=true />
                        <el-option label="未领养" value=false />
                    </el-select>
                    </el-form-item>
                </el-form>
            <template #footer>
                <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirm">
                    保存
                </el-button>
                </span>
            </template>
        </el-dialog>
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

const loading = ref(false)
const context = ref('')
const { cookies } = useCookies();
const headers = {
    'Content-Type': 'application/json',
    'Authorization': cookies.get('myCookie'),
}
export default defineComponent({
    
    beforeCreate() {
        document.querySelector('body')
        .setAttribute('style', 'margin: 0')
    },
    setup() {
        const dialogVisible = ref(false)
        let tableData = reactive({list:[
            {
                id: 1,
                name: '馆长',
                status: '未领养',
                intro: '馆长是一只可爱的猫猫',
                adopted: false
            }
        ]})
        const intro = ref('')
        const name = ref('')
        const adopted = ref(false)
        let formData = new window.FormData();
        Axios.post('api/admin/anim/get', {
            "pageNum": 20,
	        "page": 0,
	        "context": "",
	        "isBlack": false,
        }, {headers}
        ).then((response) =>{
            for (var i = 0; i < response.data.body.record.length; i++) {
                var item = response.data.body.record[i]
                if(item.adopted == true) {
                    item['status'] = '已领养'
                } else {
                    item['status'] = '未领养'
                }
                this.tableData.list.push(item)
        }
        })
        .catch((response) => {
            alert('网络错误');
            console.log(response);
        })
        return {
            formData,
            cookies,
            loading,
            tableData,
            dialogVisible,
            intro,
            name,
            adopted
        }
    },
    methods: {
        edit(index) {
            this.intro = this.tableData.list[index].intro
            this.name = this.tableData.list[index].name
            this.adopted = this.tableData.list[index].adopted
            this.dialogVisible = true;
        },
        confirm() {
            Axios.post('api/admin/record/modify/', {
                "name": name.value,
                "intro": intro.value,
                "adopted": adopted.value,
            }, {headers}
            ).then((response) =>{
                if(response.data.body.code == 0) {
                    alert('请重新登录');
                }
                console.log(response);
            }
            )
            .catch((response) => {
                alert('网络错误');
                console.log(response);
            })
        }
    }
})
</script>