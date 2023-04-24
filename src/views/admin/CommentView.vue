<template>
  <div id="root" >
    <el-row>
      <el-col :span="4" :offset="1">
        <span style="margin-left: 50px">待审核评论：</span>
        <ul
          v-infinite-scroll="load"
          class="infinite-list"
          style="overflow: auto"
        >
          <li v-for="i in count" :key="i" class="infinite-list-item" @click="check(i)">{{ tableData.list[i-1].id }}</li>
        </ul>
      </el-col>
      <el-col :span="12" :offset="1" v-if="!this.empty">
        <div class="basic-box" id="infomation" style="font-size: 8px">
          <p style="text-align: center">基本信息</p>
          <el-row>
            <el-col :span="8">
              <span>帖子id: {{ this.tweetId }}</span>
            </el-col>
            <el-col :span="8">
              <span>用户：{{ this.userName }}</span>
            </el-col>
            <el-col :span="8">
              <span>日期：{{ this.date }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="basic-box" id="comment">
          <p style="text-align: center">评论内容</p>
          <span>{{ this.content }}</span>
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
import { defineComponent, onMounted, ref , reactive} from "vue";
import Axios from "axios";
import { useCookies } from "vue3-cookies";
import { method } from "lodash";

export default defineComponent({
  setup() {
    const { cookies } = useCookies();
    const empty = ref(true);
    const account = ref("");
    var token = ref("aa");
    const password = ref("");
    var config = {
      headers: {
        Authorization: "",
      },
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: cookies.get("myCookie"),
    };
    const count = ref(0);
    const max = ref(0);
    const page = ref(0);
    let tableData = reactive({ list: [] });
    const reason = ref('')
    const tweetId = ref(0)
    const date = ref('')
    const userName = ref('')
    const content = ref('')
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
          tweetId.value = tableData.list[0].tweetId
          id.value = tableData.list[0].id
          // userName.value = tableData.list[0].userName
          // content.value = tableData.list[0].content
          date.value = tableData.list[0].time
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
      headers,
      reason,
      tweetId,
      date,
      userName,
      content
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
    fail() {

    },
    pass() {

    }
  },
});
</script>