<template>
  <div id="root">
    <el-row>
      <el-col :span="4" :offset="1">
        <span style="margin-left: 50px">待审核评论：</span>
        <ul
          v-infinite-scroll="load"
          class="infinite-list"
          style="overflow: auto"
          v-if="!this.empty"
        >
          <li
            v-for="i in count"
            :key="i"
            class="infinite-list-item"
            @click="handelClick(i)"
          >
            {{ tableData.list[i - 1].username }}
          </li>
        </ul>
        <div v-if="this.empty" style="margin-left: 50px; top: 30px">
          无待审核内容
        </div>
      </el-col>
      <el-col :span="12" :offset="1" v-if="!this.empty">
        <div class="basic-box" id="infomation" style="font-size: 8px">
          <p style="text-align: center">基本信息</p>
          <el-row>
            <el-col :span="4">
              <span>帖子id: {{ this.idC }}</span>
            </el-col>
            <el-col :span="4">
              <span>用户：{{ this.userName }}</span>
            </el-col>
            <el-col :span="16">
              <span>时间: {{ this.date }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="basic-box" id="comment">
          <p style="text-align: center">评论内容</p>
          <span>{{ this.content }}</span>
        </div>
      </el-col>
      <el-col :span="12" :offset="1" v-if="this.empty">
        <div style="margin-top: 20vh; margin-left: 20vw">
          <img src="/relex.jpg" alt="Header" height="200" />
        </div>
      </el-col>
    </el-row>
    <div class="basic-box" id="bottom" v-if="!this.empty">
      <el-input
        v-model="this.reason"
        placeholder="请输入内容"
        style="margin-bottom: 20px"
      ></el-input>
      <el-row>
        <el-col :span="22">
          <el-button type="danger" @click="fail">驳回</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="success" @click="pass">通过</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style>
@import "../../assets/styles/global.css";
@import "../../assets/styles/userView.css";

#bottom {
  bottom: 10px;
  position: fixed;
  left: calc(35vw + 4px);
  width: calc(40vw + 30px);
}

#comment {
  min-height: 60%;
}

#infomation {
  margin-bottom: 20px;
}
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import Axios from "axios";
import { useCookies } from "vue3-cookies";
import { method } from "lodash";
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'


const { cookies } = useCookies();
const headers = {
  "Content-Type": "application/json",
  Authorization: cookies.get("myCookie"),
};
export default defineComponent({
  setup() {
    const empty = ref(true);
    const account = ref("");
    var token = ref("aa");
    const password = ref("");
    const router = useRouter();
    var config = {
      headers: {
        Authorization: "",
      },
    };
    const count = ref(0);
    const max = ref(0);
    const page = ref(0);
    let tableData = reactive({ list: [] });
    const reason = ref("");
    const tweetId = ref(0);
    const date = ref("");
    const userName = ref("");
    const content = ref("");
    const idC = ref(0);
    Axios.post(
      "/api/admin/comment/get/",
      {
        pageNum: 20,
        page: 0,
      },
      { headers }
    )
      .then((response) => {
        console.log(response);
        if (response.data.body.comments != null) {
          for (var i = 0; i < response.data.body.comments.length; i++) {
            var item = response.data.body.comments[i];
            tableData.list.push(item);
          }
        }
        count.value = tableData.list.length;
        page.value += 1;
        max.value = response.data.body.sumNum;
        if (count.value > 0) {
          empty.value = false;
          tweetId.value = tableData.list[0].tweetId;
          idC.value = tableData.list[0].id;
          userName.value = tableData.list[0].username;
          content.value = tableData.list[0].content;
          date.value = tableData.list[0].time;
        }
      })
      .catch((response) => {
        console.log(response);
      });
    return {
      password,
      account,
      empty,
      token,
      cookies,
      config,
      count,
      tableData,
      page,
      max,
      reason,
      tweetId,
      date,
      userName,
      content,
      router,
      idC,
    };
  },
  methods: {
    load() {
      if (this.count == this.max) {
        return;
      }
      Axios.post(
        "/api/admin/comment/get/",
        {
          pageNum: 20,
          page: this.page,
        },
        { headers  }
      )
        .then((response) => {
          console.log(response);
          if (response.data.body.comments != null) {
            for (var i = 0; i < response.data.body.comments.length; i++) {
              var item = response.data.body.comments[i];
              tableData.list.push(item);
            }
          }
          count.value = tableData.list.length;
          page.value += 1;
          max.value = response.data.body.sumNum;
          if (count.value > 0) {
            empty.value = false;
          }
        })
        .catch((response) => {
          console.log(response);
        });
      if (this.count + 20 <= this.max) {
        this.count += 20;
      } else {
        this.count = this.max;
      }
    },
    handelClick(i) {
      this.idC = this.tableData.list[i - 1].id;
      this.userName = this.tableData.list[i - 1].username;
      this.date = this.tableData.list[i - 1].time;
      this.content = this.tableData.list[i - 1].content;
    },
    pass() {
      Axios.post(
        "/api/admin/comment/censor/",
        {
          commentId: this.idC,
          operate: 0,
          reason: "",
        },
        { headers }
      )
        .then((response) => {
          if(response.data.code != 0) {
            ElMessage(response.data.message);
          } else {
            ElMessage('Success!');
          }
          setTimeout(1000);
          this.router.go(0)
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    },
    fail() {
      Axios.post(
        "/api/admin/comment/censor/",
        {
          commentId: this.idC,
          operate: 1,
          reason: this.reason,
        },
        { headers }
      )
        .then((response) => {
          if(response.data.code != 0) {
            ElMessage(response.data.message);
          } else {
            ElMessage('Success!');
          }
          setTimeout(1000);
          this.router.go(0)
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    },
  },
});
</script>