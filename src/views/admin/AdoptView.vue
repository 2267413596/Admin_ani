<template>
  <div id="root" v-loading="this.loading">
    <el-row>
      <el-col :span="4" :offset="1">
        <span style="margin-left: 50px">待审核申请：</span>
        <div v-if="this.empty" style="margin-left: 50px; top: 30px">
          无待审核内容
        </div>
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
            style="cursor: pointer;"
          >
            {{ this.tableData.list[i - 1].username }}:...
          </li>
        </ul>
      </el-col>
      <el-col :span="12" :offset="1" v-if="!this.empty">
        <div class="basic-box" id="infomation" style="font-size: 8px">
          <p style="text-align: center">基本信息</p>
          <el-row>
            <el-col :span="8">
              <span>领养申请动物: {{ this.aniname }}</span>
            </el-col>
            <el-col :span="8">
              <span>用户：{{ this.username }}</span>
            </el-col>
            <el-col :span="8">
              <span>日期：{{ this.date }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="basic-box" id="comment">
          <p>申请理由</p>
          <span style="font-size: small">{{ this.content }}</span>
          <el-divider />
          <!-- <p>联系方式</p>
          <p style="font-size: small">手机号:{{ this.phone }}</p>
          <p style="font-size: small">邮箱:{{ this.email }}</p> -->
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
        <el-col :span="20">
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
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'

const { cookies } = useCookies();
const headers = {
      "Content-Type": "application/json",
      Authorization: cookies.get("myCookie"),
    };
const loading = ref(false);
export default defineComponent({
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "margin: 0");
  },
  setup() {
    let tableData = reactive({ list: [] });
    const count = ref(0);
    const phone = ref("");
    const content = ref("");
    const email = ref("");
    const aniname = ref("");
    const username = ref("");
    const idC = ref(0);
    const date = ref("");
    const reason = ref("");
    const empty = ref(true);
    const max = ref(0)
    Axios.post(
      "/api/admin/adoption/get/",
      {
        pageNum: 20,
        page: 0,
      },
      { headers }
    )
      .then((response) => {
        console.log(response);
        if (response.data.body.adoptions != null) {
          for (var i = 0; i < response.data.body.adoptions.length; i++) {
            var item = response.data.body.adoptions[i];
            
            tableData.list.push(item);
          }
        console.log(tableData.list);
        empty.value = false;
        idC.value = tableData.list[0].id;
        content.value = tableData.list[0].reason;
        aniname.value = tableData.list[0].aniname;
        username.value = tableData.list[0].username;
        date.value = tableData.list[0].time;
        count.value = tableData.list.length;
        max.value = response.data.body.sumNum
        }
      })
      .catch((response) => {
        alert("网络错误");
        console.log(response);
      });
    return {
      loading,
      tableData,
      empty,
      phone,
      content,
      email,
      aniname,
      username,
      count,
      idC,
      date,
      max,
      date,
      reason
    };
  },
  methods: {
    load() {
      if (this.count == this.max) {
        return;
      }
      Axios.post(
        "/api/admin/adoption/get/",
        {
          pageNum: 20,
          page: this.page,
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          if (response.data.body.adoptions != null) {
            for (var i = 0; i < response.data.body.adoptions.length; i++) {
              var item = response.data.body.adoptions[i];
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
      this.idC = this.tableData.list[i-1].id;
      this.content = this.tableData.list[i-1].reason;
      this.aniname = this.tableData.list[i-1].aniname;
      this.username = this.tableData.list[i-1].username;
      this.date = this.tableData.list[i-1].time;
    },
    pass() {
      Axios.post(
        "/api/admin/adoption/censor/",
        {
          adoptionId: this.idC,
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
          this.$router.go(0)
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    },
    fail() {
      console.log(this.idC)
      Axios.post(
        "/api/admin/adoption/censor/",
        {
          adoptionId: this.idC,
          operate: 1,
          reason: this.reason,
        },
        { headers }
      )
        .then((response) => {
          console.log(response)
          if(response.data.code != 0) {
            ElMessage(response.data.message);
          } else {
            ElMessage('Success!');
          }
          setTimeout(1000);
          this.$router.go(0)
        })
        .catch((response) => {
          ElMessage("网络错误");
          console.log(response);
        });
    },
  },
});
</script>