<template>
  <div id="root">
    <!-- 搜索框 -->
    <div class="basic-box" style="margin: 20px">
      <el-row :gutter="20">
        <el-select v-model="select">
          <el-option label="审核求助" value="0" />
          <el-option label="已解决求助" value="1" />
          <el-option label="待解决求助" value="2" />
        </el-select>
        <el-col :span="5">
          <el-input v-model="context" class="w-50 m-2" placeholder="搜索求助" />
        </el-col>
        <el-col :span="6">
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
        <el-table-column prop="id" label="id" width="200" />
        <el-table-column prop="username" label="用户昵称" width="120" />
        <el-table-column prop="title" label="求助标题" width="180" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column fixed="right" label="Operations">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              v-if="
                tableData.list[scope.$index].censored == 1 &&
                tableData.list[scope.$index].solved
              "
              @click.prevent="reply(scope.$index)"
            >
              查看
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              v-if="
                tableData.list[scope.$index].censored == 1 &&
                !tableData.list[scope.$index].solved
              "
              @click.prevent="reply(scope.$index)"
            >
              回应
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              v-if="tableData.list[scope.$index].censored == 0"
              @click.prevent="check(scope.$index)"
            >
              审核
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
      <el-dialog  
        v-model="dialogVisible1"
        title="审核求助"
        width="50%"
        :before-close="handleClose"
      >
        <el-form :model="form" label-width="120px">
          <el-form-item label="基本信息">
            <el-row>
              <el-col :span="24">
                <span>标题: {{ titleC }}<br/>用户: {{ userC }}<br/>时间: {{ dateC }}</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="求助内容">
            <span>{{ contentC }}</span>
          </el-form-item>
          <div class="demo-image__lazy">
            <el-image v-for="url in urls.list" :key="url" :src="url" lazy />
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-input v-model="reason" />
            <el-button @click="fail">驳回</el-button>
            <el-button type="primary" @click="pass"> 通过 </el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog
        v-model="dialogVisible2"
        title="求助回应"
        width="50%"
        :before-close="handleClose"
      >
        <el-form :model="form" label-width="120px">
          <el-form-item label="基本信息">
            <el-row>
              <el-col :span="24">
                <span>标题: {{ titleC }}<br/>用户: {{ userC }}<br/>时间: {{ dateC }}</span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="求助状态">
            <el-switch
              v-model="solve"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              @click="changeStatus"
            />
            <span v-if="solve">已解决</span>
            <span v-if="!solve">未解决</span>
          </el-form-item>
          <el-form-item label="求助内容">
            <span>{{ contentC }}</span>
          </el-form-item>
          <div class="demo-image__lazy">
            <el-image v-for="url in urls.list" :key="url" :src="url" lazy />
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-input v-model="response" />
            <el-button @click="dialogVisible1 = false">取消</el-button>
            <el-button type="primary" @click="solveRsponse"> 回复 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style>
@import "../../assets/styles/userView.css";

#search {
  background-color: aquamarine;
}
.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}
.el-form-item__content{
  width: 100%;
}
</style>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import Axios from "axios";
import { Search } from "@element-plus/icons-vue";
import { useCookies } from "vue3-cookies";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const { cookies } = useCookies();
const router = useRouter();
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
    const select = ref("待审核求助");
    const context = ref("");
    const loading = ref(true);
    const empty = ref(true)
    const isPass = ref(0);
    const currentPage = ref(1);
    var titleC = ref("");
    var userC = ref(0);
    var reason = ref("");
    var dateC = ref("");
    var contentC = ref("");
    var idC = ref(0);
    var totalNum = ref(0);
    var solve = ref(true);
    var response = ref('');
    const dialogVisible1 = ref(false);
    const dialogVisible2 = ref(false);
    const index = ref(0);
    const urls = reactive({ list: [] });
    //审核求助
    console.log("aaa");
    Axios.post(
      "/api/admin/help/get",
      {
        pageNum: 20,
        page: 0,
        context: "",
        censored: 0,
        solved: false,
      },
      { headers }
    )
      .then((response) => {
        console.log(response);
        if (response.data.body.helps != null) {
        for (var i = 0; i < response.data.body.helps.length; i++) {
          var item = response.data.body.helps[i];
          item["status"] = "待审核";
          tableData.list.push(item);
        }
        empty.value = false
        totalNum.value = response.data.body.sumNum
      }
        console.log(tableData.list);
      })
      .catch((response) => {
        alert("网络错误");
        console.log(response);
      });
    loading.value = false;
    return {
      formData,
      loading,
      tableData,
      select,
      context,
      isPass,
      currentPage,
      titleC,
      userC,
      dateC,
      contentC,
      idC,
      reason,
      dialogVisible1,
      dialogVisible2,
      totalNum,
      empty,
      solve,
      response,
      index,
      urls
    };
  },
  methods: {
    search() {
      this.loading = true;
      Axios.post(
        "/api/admin/help/get",
        {
          pageNum: 20,
          page: 0,
          context: this.context,
          censored: this.select == 0 ? 0 : 1,
          solved: this.select == 1
        },
        { headers }
      )
        .then((response) => {
          console.log(response)
          this.tableData.list = [];
          if(response.data.body.helps != null) {
            for (var i = 0; i < response.data.body.helps.length; i++) {
            var item = response.data.body.helps[i];
            if (item.censored == 0) {
              item["status"] = "待审核";
            } else if (item.solved){
              item["status"] = "已解决";
            } else {
              item["status"] = "待解决";
            }
            this.tableData.list.push(item);
          }
          }
          this.totalNum = response.data.body.sumNum;  
        })
        .catch((response) => {
          console.log(response)
          ElMessage.error("网络错误");
        });
      this.loading = false;
    },
    handleCurrentChange(index) {
      this.loading = true;
      this.currentPage = index;
      Axios.post(
        "/api/admin/help/get",
        {
          pageNum: 20,
          page: index,
          context: this.context,
          censored: this.select == 0 ? 0 : 1,
          solved: this.select == 1
        },
        { headers }
      )
        .then((response) => {
          this.tableData.list = [];
          for (var i = 0; i < response.data.body.helps.length; i++) {
            var item = response.data.body.helps[i];
            if (item.censored == 0) {
              item["status"] = "待审核";
            } else if (item.solved){
              item["status"] = "已解决";
            } else {
              item["status"] = "待解决";
            }
            this.tableData.list.push(item);
          }
          this.totalNum = response.data.body.sumNum;
        })
        .catch((response) => {
          console.log(response)
          ElMessage.error("网络错误");
        });
      this.loading = false;
    },
    pass() {
      Axios.post(
        "/api/admin/tweet/censor/",
        {
          tweetId: this.idC,
          operate: 0,
          reason: this.reason
        },
        { headers }
      )
        .then((response) => {
          if (response.data.code != 0) {
            ElMessage(response.data.message);
          } else {
            ElMessage("Success!");
          }
          setTimeout(1000);
          this.$router.go(0)
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    },
    fail() {
      Axios.post(
        "/api/admin/tweet/censor/",
        {
          tweetId: this.idC,
          operate: 1,
          reason: this.reason
        },
        { headers }
      )
        .then((response) => {
          if (response.data.code != 0) {
            ElMessage(response.data.message);
          } else {
            ElMessage("Success!");
          }
          setTimeout(1000);
          this.$router.go(0)
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    },
    solveRsponse() {
      Axios.post(
        "/api/admin/help/reply/",
        {
          helpId: this.idC,
          content: this.response
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          console.log(this.idC);
          console.log(this.response);
          if (response.data.code != 0) {
            ElMessage(response.data.message);
          } else {
            ElMessage("Success!");
          }
          setTimeout(1000);
          this.$router.go(0)
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    },
    check(index) {
      this.index = index
      this.idC = this.tableData.list[index].id
      this.dialogVisible1 = true
      Axios.post(
        "/api/admin/help/content/",
        {
          helpId: this.idC,
        },
        { headers }
      )
        .then((response) => {
          console.log(response)
          this.titleC = response.data.body.title
          this.dateC = response.data.body.time
          this.contentC = response.data.body.content
          this.userC = response.data.body.username
          this.urls.list = []
          if (response.data.body.images != null) {
            for (var i = 0; i < response.data.body.images.length; i++) {
              var item = response.data.body.images[i];
              this.urls.list.push('/api' + item)
            }
            console.log(this.urls.list)
          }
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    },
    reply(index) {
      this.index = index
      this.idC = this.tableData.list[index].id
      this.solve = this.tableData.list[index].solved
      this.dialogVisible2 = true
      Axios.post(
        "/api/admin/help/content/",
        {
          helpId: this.idC,
        },
        { headers }
      )
        .then((response) => {
          this.titleC = response.data.body.title
          this.dateC = response.data.body.time
          this.contentC = response.data.body.content
          this.userC = response.data.body.username
          this.urls.list = []
          if (response.data.body.images != null) {
            for (var i = 0; i < response.data.body.images.length; i++) {
              var item = response.data.body.images[i];
              this.urls.list.push('/api' + item)
            }
            console.log(this.urls.list)
          }
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    },
    changeStatus() {
      Axios.post(
        "/api/admin/help/changeStatus/",
        {
          tweetId: this.idC,
        },
        { headers }
      )
        .then((response) => {
          ElMessage(response.data.message);
          this.tableData.list[this.index].status = this.solve ? '已解决' : '待解决'
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    }
  },
});
</script>