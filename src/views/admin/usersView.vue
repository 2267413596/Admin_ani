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
            <el-table :data="tableData" style="width: 100%" max-height="250">
                <el-table-column prop="date" label="邮箱" width="200" />
                <el-table-column prop="name" label="用户昵称" width="120" />
                <el-table-column prop="state" label="密码" width="180" />
                <el-table-column prop="city" label="手机号" width="180" />
                <el-table-column prop="zip" label="状态" width="100" />
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
@import '../assets/styles/userView.css';

#search {
    background-color: aquamarine;
}
</style>

<script>
export default {
    data() {
        return {
            checked1: true,
            currentPage: 1,
            search_content: '',
            tableData: [
                {
                    date: '20373593@buaa.edu.cn',
                    name: 'Tom',
                    state: 'abcd1234',
                    city: '12345678901',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: '正常',
                    tag: 'Home',
                },
                {
                    date: '20373593@buaa.edu.cn',
                    name: 'Tom',
                    state: 'abcd1234',
                    city: '12345678901',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: '正常',
                    tag: 'Home',
                },
                {
                    date: '20373593@buaa.edu.cn',
                    name: 'Tom',
                    state: 'abcd1234',
                    city: '12345678901',
                    address: 'No. 189, Grove St, Los Angeles',
                    zip: '正常',
                    tag: 'Home',
                },
            ]
        }
    },
    methods: {
        handleCurrentChange() {
            Console.log(currentPage)
        },
        editPage() {
            this.$router.replace('/administrator/edit')
        }
    }
}
</script>