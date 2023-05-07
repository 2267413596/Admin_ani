<template>
  <div id="root">
    <!-- 搜索框 -->
    <div class="basic-box" style="margin: 20px">
      <el-row >
        <el-col :span="4" :offset="2">
          <el-checkbox v-model="checked1" label="只显示拉黑用户" size="large" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="context" class="w-50 m-2" placeholder="搜索用户" />
        </el-col>
        <el-col :span="6" :offset="1">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div id="table" class="basic-box" style="margin: 20px">
      <el-table
        :data="tableData.list"
        style="width: 100%"
        max-height="250"
        v-loading="loading"
      >
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="username" label="用户昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="180" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="bio" label="个性签名" width="400" />
        <el-table-column fixed="right" label="Operations">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="black(scope.$index)"
              v-if="!tableData.list[scope.$index].blacked"
            >
              拉黑
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="undoblack(scope.$index)"
              v-if="tableData.list[scope.$index].blacked"
            >
              取消拉黑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :total="totalNum"
      >
      </el-pagination>
    </div>
  </div>
</template>

<style>
@import "../../assets/styles/userView.css";

#search {
  background-color: aquamarine;
}
</style>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import Axios from "axios";
import { useCookies } from "vue3-cookies";
import { Search } from "@element-plus/icons-vue";

const loading = ref(false);
const { cookies } = useCookies();
const headers = {
  "Content-Type": "application/json",
  Authorization: cookies.get("myCookie"),
};
export default defineComponent({
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "margin: 0");
  },
  setup() {
    let tableData = reactive({ list: [] });
    let formData = new window.FormData();
    const { cookies } = useCookies();
    const checked1 = ref(false);
    const currentPage = ref(0);
    const headers = {
      "Content-Type": "application/json",
      Authorization: cookies.get("myCookie"),
    };
    const totalNum = ref(0);
    const context = ref("");
    Axios.post(
      "/api/admin/user/get",
      {
        pageNum: 20,
        page: 0,
        context: "",
        isBlack: false,
      },
      { headers }
    )
      .then((response) => {
        console.log(response);
        if (response.data.body.users != null) {
          for (var i = 0; i < response.data.body.users.length; i++) {
            var item = response.data.body.users[i];
            if (item.blacked == true) {
              item["status"] = "已拉黑";
            } else {
              item["status"] = "正常";
            }
            tableData.list.push(item);
          }
        totalNum.value = response.data.body.sumNum;
        }
        console.log(tableData.list);
      })
      .catch((response) => {
        alert("网络错误");
        console.log(response);
      });
    return {
      formData,
      cookies,
      headers,
      loading,
      tableData,
      checked1,
      totalNum,
      currentPage,
      context,
    };
  },
  methods: {
    search() {
      this.loading = true;
      Axios.post(
        "/api/admin/user/get",
        {
          pageNum: 20,
          page: 0,
          context: this.context,
          isBlack: this.checked1,
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          this.tableData.list = [];
          if (response.data.body.users != null) {
            for (var i = 0; i < response.data.body.users.length; i++) {
              var item = response.data.body.users[i];
              if (item.blacked == true) {
                item["status"] = "已拉黑";
              } else {
                item["status"] = "正常";
              }
              this.tableData.list.push(item);
            }
          }
          this.totalNum = response.data.body.sumNum;
        })
        .catch((response) => {
          console.log(response);
        });
      this.loading = false;
    },
    handleCurrentChange(index) {
      this.loading = true;
      this.currentPage = index;
      Axios.post(
        "/api/admin/user/get",
        {
          pageNum: 20,
          page: index - 1,
          context: this.context,
          isBlack: this.checked1,
        },
        { headers }
      )
        .then((response) => {
          this.tableData.list = [];
          if (response.data.body.users != null) {
            for (var i = 0; i < response.data.body.users.length; i++) {
              var item = response.data.body.users[i];
              if (item.blacked == true) {
                item["status"] = "已拉黑";
              } else {
                item["status"] = "正常";
              }
              tableData.list.push(item);
            }
          }
          this.totalNum = response.data.body.sumNum;
          this.loading = false;
        })
        .catch((response) => {
          console.log(response);
        });
    },
    black(index) {
      Axios.post(
        "/api/admin/user/black",
        {
          userId: this.tableData.list[index].id,
          operation: 1,
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          this.tableData.list[index].blacked = true;
          this.tableData.list[index].status = "已拉黑";
        })
        .catch((response) => {
          console.log(response);
        });
    },
    undoblack(index) {
      Axios.post(
        "/api/admin/user/black",
        {
          userId: this.tableData.list[index].id,
          operation: 0,
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          this.tableData.list[index].blacked = false;
          this.tableData.list[index].status = "正常";
        })
        .catch((response) => {
          console.log(response);
        });
    },
  },
});
</script>