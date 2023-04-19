<template>
    <div id="root" v-loading="this.loading">
    <el-dialog v-model="this.error" width="30%" center>
      <span>
        {{ this.warning }}
      </span>
    </el-dialog>
    <el-row >
      <el-col :span="4" :offset="1">
        <span style="margin-left: 50px;">待审核帖子：</span>
        <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
          <li v-for="i in count" :key="i" class="infinite-list-item" @click="handelClick(i)"></li>
        </ul>
      </el-col>
      <el-col :span="12" :offset="1" v-if="!this.empty" style="margin-">
        <div class="basic-box" id="infomation" style="font-size: 8px; height: fix-content">
          <p style="text-align: center;">基本信息</p>
          <el-row>
            <el-col :span="8">
              <span>标题：{{this.titleC}}</span>
            </el-col>
            <el-col :span="8">
              <span>用户：{{this.userC}}</span>
            </el-col>
            <el-col :span="8">
              <span>日期：{{ this.dateC }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="basic-box" id="comment">
          <p style="text-align: center;">帖子内容</p>
          <span>{{ content }}</span>
          <div>
            <img src="/ani1.jpg" alt="Header" height="200"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="basic-box" id="bottom" v-if="!this.empty">
      <el-input v-model="this.reason" placeholder="请输入内容" style="margin-bottom: 20px;"></el-input>
      <el-row :gutter="1000">
        <el-col :span="3">
          <el-button type="danger" @click="fail">驳回</el-button>
        </el-col>
        <el-row>
          <el-col :span="3">
            <el-button type="success" @click="pass">通过</el-button>
          </el-col>
        </el-row>
      </el-row>
    </div>
  </div>
  </template>
  
  <style>
  @import '../../assets/styles/global.css';
  @import '../../assets/styles/userView.css';
  
  #bottom {
    margin-top: 10px;
    bottom: 10px;
    margin-left: calc(18vw + 4px);
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
  import { defineComponent, onMounted, ref ,reactive} from 'vue';
  import Axios from 'axios';
  import { useCookies } from "vue3-cookies";
  import { method } from 'lodash';

  export default defineComponent({
    beforeCreate() {
        const imgUrl = new URL('../../../public/ani1.jpg', import.meta.url).href
        return{
            imgUrl
        }
    },
      setup() {
          var titleC = ref('')
          var userC = ref(0)
          var dateC = ref('')
          var contentC = ref('')
          var idC = ref(0)
          var totalNum = ref(0)
          let tableData = reactive({list:[]})
          const { cookies } = useCookies();
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': cookies.get('myCookie'),
          }
          Axios.post('/api/admin/tweet/get/', {
            "pageNum": 20,
            "page": 1,
          }, {headers}
          ).then((response) =>{
            for (var i = 0; i < response.data.body.tweets.length; i++) {
                var item = response.data.body.tweets[i]
                tableData.list.push(item)
            }
            totalNum = response.data.body.sumNum
            if(totalNum > 0) {
              titleC.value = tableData.list[0].title
              dateC.value = tableData.list[0].time
              contentC.value = tableData.list[0].content
            }
          })
          .catch((response) => {
              console.log(response);
          })
          Axios.post('/api/admin/tweet/content/', {
            "tweetId": 1
          }, {headers})
          .then((response) =>{
          })
          .catch((response) => {
              alert('网络错误');
              console.log(response);
          })
          Axios.post('/api/admin/tweet/censor/', {
            "tweetId": 1,
            "operate": 1,
            "reason": "abcd"
          }, {headers})
          .then((response) =>{
              console.log(response)
          })
          .catch((response) => {
              alert('网络错误');
              console.log(response);
          })
          return {
            tableData,
            headers,
            titleC,
            userC,
            dateC,
            contentC,
            idC,
            totalNum
          };
      },
      data() {
        return {
        }
      },
      methods: {
        load() {
          if(this.count < 1) {
            this.count += 1
          }
        },
        handelClick(i) {
          console.log(i)
          Axios.post('/api/admin/tweet/content/', {
            "tweetId": 1
          }, headers)
          .then((response) =>{
              this.titleC = response.data.body.title
              this.dateC = response.data.body.time
              this.contentC = response.data.body.contentC
              this.userC = response.data.body.userC
          })
          .catch((response) => {
              alert('网络错误');
              console.log(response);
          })
          this.content = this.tableData.list[i-1].content
          this.title = this.tableData.list[i-1].title

        },
        pass() {
          
        }
      }
  });
  </script>