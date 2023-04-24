<template>
  <div id="root" v-loading="this.loading">
    <el-row>
      <el-col :span="4" :offset="1">
        <span style="margin-left: 50px">待审核帖子：</span>
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
        <div
          class="basic-box"
          id="infomation"
          style="font-size: 8px; height: fix-content"
        >
          <p style="text-align: center">基本信息</p>
          <el-row>
            <el-col :span="8">
              <span>标题：{{ this.titleC }}</span>
            </el-col>
            <el-col :span="8">
              <span>用户：{{ this.userC }}</span>
            </el-col>
            <el-col :span="8">
              <span>日期：{{ this.dateC }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="basic-box" id="comment">
          <p style="text-align: center">帖子内容</p>
          <span>{{ this.contentC }}</span>
        </div>
        <div class="basic-box" id="bottom">
          <el-input
            v-model="reason"
            placeholder="请输入内容"
            style="margin-bottom: 20px"
          ></el-input>
          <el-row>
            <el-col :span="20">
              <el-button type="danger" @click="fail">驳回</el-button>
            </el-col>
              <el-col :span="2">
                <el-button type="success" @click="pass">通过</el-button>
              </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12" :offset="1" v-if="this.empty">
        <div style="margin-top: 20vh; margin-left: 20vw">
          <img src="/relex.jpg" alt="Header" height="200" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
  
  <style>
@import "../../assets/styles/global.css";
@import "../../assets/styles/userView.css";

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
import { Message, Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'

const { cookies } = useCookies();
const headers = {
  "Content-Type": "application/json",
  Authorization: cookies.get("myCookie"),
};
const max = ref(0);
export default defineComponent({
  setup() {
    var titleC = ref("");
    var userC = ref(0);
    var reason = ref("");
    var dateC = ref("");
    var contentC = ref("");
    var idC = ref(0);
    var totalNum = ref(0);
    const count = ref(0);
    const router = useRouter();
    let tableData = reactive({ list: [] });
    const { cookies } = useCookies();
    const empty = ref(true);
    const page = ref(0);
    const headers = {
      "Content-Type": "application/json",
      Authorization: cookies.get("myCookie"),
    };
    Axios.post(
      "/api/admin/tweet/get/",
      {
        pageNum: 20,
        page: 0,
      },
      { headers }
    )
      .then((response) => {
        console.log(response);
        if (response.data.body != null) {
          for (var i = 0; i < response.data.body.tweets.length; i++) {
            var item = response.data.body.tweets[i];
            tableData.list.push(item);
          }
          max.value = response.data.body.sumNum;
          page.value += 1;
          count.value = tableData.list.length; 
        }
        if (count.value > 0) {
          Axios.post(
            "/api/admin/tweet/content/",
            {
              tweetId: tableData.list[0].id,
            },
            { headers }
          )
            .then((response) => {
              console.log(response);
              titleC.value = tableData.list[0].title;
              dateC.value = response.data.body.time
              contentC.value = response.data.body.content;
              userC.value = tableData.list[0].username;
            })
            .catch((response) => {
              ElMessage("网络错误");
              console.log(response);
            });
          empty.value = false;
        }
      })
      .catch((response) => {
        console.log(response);
      });
    return {
      tableData,
      headers,
      titleC,
      userC,
      dateC,
      contentC,
      idC,
      totalNum,
      empty,
      reason,
      router,
      page,
      count
    };
  },
  methods: {
    load() {
      if (this.count == max.value) {
        return;
      }
      Axios.post(
        "/api/admin/tweet/get/",
        {
          pageNum: 20,
          page: this.page,
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          if (response.data.body.tweets != null) {
            for (var i = 0; i < response.data.body.tweets.length; i++) {
              var item = response.data.body.tweets[i];
              tableData.list.push(item);
            }
          }
          this.count = this.tableData.list.length;
          this.page += 1;
        })
        .catch((response) => {
          console.log(response);
        });
      if (this.count + 20 <= max.value) {
        this.count += 20;
      } else {
        this.count = max.value;
      }
    },
    handelClick(i) {
      console.log(i);
      this.idC = this.tableData.list[i - 1].id;
      Axios.post(
            "/api/admin/tweet/content/",
            {
              tweetId: this.idC,
            },
            { headers }
          )
            .then((response) => {
              console.log(response);
              this.titleC = response.data.body.title;
              this.dateC = response.data.body.time
              this.contentC = response.data.body.content;
              this.userC = response.data.body.username;
            })
            .catch((response) => {
              ElMessage("网络错误");
              console.log(response);
            });
    },
    pass() {
      Axios.post(
        "/api/admin/tweet/censor/",
        {
          tweetId: this.idC,
          operate: 0,
          reason: "",
        },
        {headers}
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
        "/api/admin/tweet/censor/",
        {
          tweetId: this.idC,
          operate: 1,
          reason: this.reason,
        },
        {headers}
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