<template>
  <div id="root" v-loading="this.loading">
  <el-dialog v-model="this.error" width="30%" center>
    <span>
      {{ this.warning }}
    </span>
  </el-dialog>
  <el-row >
    <el-col :span="4" :offset="1">
      <span style="margin-left: 50px;">待审核评论：</span>
      <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
        <li v-for="i in count" :key="i" class="infinite-list-item">abc</li>
      </ul>
    </el-col>
    <el-col :span="12" :offset="1" v-if="!this.empty">
      <div class="basic-box" id="infomation" style="font-size: 8px">
        <p style="text-align: center;">基本信息</p>
        <el-row>
          <el-col :span="8">
            <span>帖子id: {{ this.pr_name }}</span>
          </el-col>
          <el-col :span="8">
            <span>用户：{{ this.user_name }}</span>
          </el-col>
          <el-col :span="8">
            <span>日期：{{ this.review_date }}</span>
          </el-col>
        </el-row>
      </div>
      <div class="basic-box" id="comment">
        <p style="text-align: center;">评论内容</p>
        <span>{{ content }}</span>
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
import { defineComponent, onMounted, ref } from 'vue';
import Axios from 'axios';
import { useCookies } from "vue3-cookies";
import { method } from 'lodash';

export default defineComponent({
    setup() {
        const { cookies } = useCookies();
        let formData = new window.FormData();
        const visible = ref(false);
        const account = ref('');
        var token = ref('aa');
        const password = ref('');
        var config = {
            headers:{
                "Authorization": "",
            }
        };
        const count = ref(1)
        const showModal = () => {
        visible.value = true;
        };
        const handleOk = () => {
        visible.value = false;
        };
        const login = () => {
            formData.append('username', account.value);
            formData.append('password', password.value);
            Axios.post('/api/login', formData)
            .then((response) => {
                console.log(response);
                token = response.data.body.token;
                console.log(token.value);
                cookies.set("myCookie", token.value);
                // this.$router.replace('/admin')
                this.config.headers.value = cookies.get('myCookie')
                Axios.get('/api/hello', this.config)
                .then((response) =>{
                    alert(0);
                    console.log(response);
                })
                .catch((response) => {
                    alert(1);
                    console.log(response);
                })
            })
            .catch((response) => {
                console.log(response);
            })
        };
        return {
            password,
            account,
            visible,
            showModal,
            handleOk,
            login,
            token,
            cookies,
            config,
            count
        };
    },
    data() {
      return {
        reason: '',
        review_list: [
        ],
        content: "abc",
        review_id: -1,
        empty: false,
        review_date: '2023-4-12 10:43:13',
        review_status: '未知',
        user_name: '123',
        get_reviewurl: 'http://database.vip.cpolar.cn/admin_page/get_review',
        check_reviewurl: 'http://database.vip.cpolar.cn/admin_page/check_review',
        review_index: -1,
        pr_name: '0',
        pr_id: 0,
      }
    },
    methods: {
      load() {
        if(this.count < 1) {
          this.count += 1
        }
      }
    }
});

// export default {

//   // mounted() {
//   //   this.loading = true;
//   //   this.$axios.post(this.get_reviewurl)
//   //     .then(res => {
//   //       this.loading = false;
//   //       console.log(res)
//   //       for (var i = 0; i < res.data.length; i++) {
//   //         var item = res.data[i]
//   //         this.review_list.push(item)
//   //         // console.log(item)
//   //       }
//   //       if (res.data.length == 0) {
//   //         this.empty = true;
//   //       } else {
//   //         this.empty = false;
//   //       }
//   //     })
//   //     .catch(res => {
//   //       this.loading = false;
//   //       console.log(res)
//   //       for (var i = 0; i < res.data.length; i++) {
//   //         var item = res.data[i]
//   //         this.review_list.push(item)
//   //         // console.log(item)
//   //       }
//   //       if (res.data.length == 0) {
//   //         this.empty = true;
//   //       } else {
//   //         this.empty = false;
//   //       }
//   //       // console.log(res)
//   //       // this.warning = '获取评论失败';
//   //       // this.error = true;
//   //     })
//   // },
//   // data() {
//   //   return {
//   //     error: false,
//   //     warning: '',
//   //     loading: false,
//   //     reason: '',
//   //     review_list: [
//   //     ],
//   //     content: "abc",
//   //     review_id: -1,
//   //     empty: false,
//   //     review_date: '2022-12-19 10:43:13',
//   //     review_status: '未知',
//   //     user_name: '',
//   //     get_reviewurl: 'http://database.vip.cpolar.cn/admin_page/get_review',
//   //     check_reviewurl: 'http://database.vip.cpolar.cn/admin_page/check_review',
//   //     review_index: -1,
//   //     pr_name: 'a',
//   //     pr_id: 0,
//   //   }
//   // },
//   // methods: {
//   //   init() {
//   //     this.review_index = 0
//   //     this.review_id = this.review_list[0].review_id;
//   //     this.content = this.review_list[0].content;
//   //     this.review_date = this.review_list[0].review_date;
//   //     this.review_status = this.review_list[0].review_status;
//   //     this.user_name = this.review_list[0].user_name;
//   //     this.pr_id = this.review_list[0].pr_id;
//   //     this.pr_name = this.review_list[0].pr_name;
//   //   },
//   //   jump: function (index) {
//   //     this.review_index = index
//   //     this.review_id = this.review_list[index].review_id;
//   //     this.content = this.review_list[index].content;
//   //     this.review_date = this.review_list[index].review_date;
//   //     this.review_status = this.review_list[index].review_status;
//   //     this.user_name = this.review_list[index].user_name;
//   //     this.pr_id = this.review_list[index].pr_id;
//   //     this.pr_name = this.review_list[index].pr_name;
//   //   },
//   //   pass() {
//   //     this.loading = true
//   //     this.$axios.post(this.check_reviewurl, null,
//   //       {
//   //         params: {
//   //           pr_id: this.pr_id,
//   //           review_id: this.review_id,
//   //           pass_status: '通过',
//   //           reason: this.reason
//   //         }
//   //       })
//   //       .then(res => {
//   //         this.loading = false
//   //         this.reason = ''
//   //         console.log(res)
//   //         this.review_list.splice(this.review_index, 1);
//   //         this.review_index = 0;
//   //         this.init()
//   //       })
//   //       .catch(err => {
//   //         console.error(err);
//   //         this.loading = false
//   //       })

//   //   },
//   //   fail() {
//   //     this.loading = true
//   //     this.review_list.splice(this.review_index, 1);
//   //     this.$axios.post(this.check_reviewurl, null,
//   //       {
//   //         params: {
//   //           pr_id: this.pr_id,
//   //           review_id: this.review_id,
//   //           pass_status: '不通过',
//   //           reason: this.reason
//   //         }
//   //       })
//   //       .then(res => {
//   //         console.log(res)
//   //         this.review_list.splice(this.review_index, 1);
//   //         this.review_index = 0;
//   //         this.init()
//   //         this.loading = false
//   //         this.reason = ''
//   //       })
//   //       .catch(err => {
//   //         console.error(err);
//   //         this.loading = false
//   //       })
//   //   }
//   // }
// };
</script>