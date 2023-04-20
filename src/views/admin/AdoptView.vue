<template>
    <div id="root" v-loading="this.loading">
    <el-row >
      <el-col :span="4" :offset="1">
        <span style="margin-left: 50px;">待审核申请：</span>
        <span v-if="this.empty">无</span>
        <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto" v-if="!this.empty">
          <li v-for="i in count" :key="i" class="infinite-list-item">{{ tableData.list[i-1].username }}:...</li>
        </ul>
      </el-col>
      <el-col :span="12" :offset="1" v-if="!this.empty">
        <div class="basic-box" id="infomation" style="font-size: 8px">
          <p style="text-align: center;">基本信息</p>
          <el-row>
            <el-col :span="8">
              <span>领养申请动物: {{ this.aniname }}</span>
            </el-col>
            <el-col :span="8">
              <span>用户：{{ this.username }}</span>
            </el-col>
            <el-col :span="8">
              <span>日期：2023-04-18</span>
            </el-col>
          </el-row>
        </div>
        <div class="basic-box" id="comment">
          <p >申请理由</p>
          <span style="font-size: small;">{{ content }}</span>
          <el-divider />
          <p >联系方式</p>
          <p style="font-size: small;">手机号:{{ this.phone }}</p>
          <p style="font-size: small; ">邮箱:{{ this.email }}</p>
        </div>
      </el-col>
    </el-row>
    <div class="basic-box" id="bottom" v-if="!this.empty">
      <el-input v-model="this.reason" placeholder="请输入内容" style="margin-bottom: 20px;"></el-input>
      <el-row :gutter="900">
        <el-col :span="3">
          <el-button type="danger" @click="fail">拒绝</el-button>
        </el-col>
        <el-row>
          <el-col :span="3">
            <el-button type="success" @click="pass">同意</el-button>
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
import { defineComponent, onMounted, ref, reactive } from 'vue';
import Axios from 'axios';
import { useCookies } from "vue3-cookies";
import {useRouter} from 'vue-router'


const loading = ref(false)
export default defineComponent({
    
    beforeCreate() {
        document.querySelector('body')
        .setAttribute('style', 'margin: 0')
    },
    setup() {
        let tableData = reactive({list:[
            {
            'phone': '12345678901',
            'content': '本人具有专业的养猫知识、丰富的养猫经验和对猫猫狂热的心',
            'email': '20373593@buaa.edu.cn',
            'aniname': '馆长',
            'username': 'test',
            'time': '2023-04-19'
            }
        ]})
        const count = ref(0)
        const phone = ref('')
        const content = ref('')
        const email = ref('')
        const aniname = ref('')
        const username = ref('')
        const time = ref('')
        const empty = ref(true)
        const { cookies } = useCookies();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': cookies.get('myCookie'),
        }
        Axios.post('/api/admin/adopt/get', {
            "pageNum": 20,
	        "page": 1,
        }, {headers}
        ).then((response) =>{
            console.log(response)
            for (var i = 0; i < response.data.body.users.length; i++) {
                var item = response.data.body.users[i]
                tableData.list.push(item)
            }
            console.log(tableData.list)
        })
        .catch((response) => {
            alert('网络错误');
            console.log(response);
        })
        if(tableData.list.length > 0) {
            empty.value = false
            phone.value = tableData.list[0].phone
            content.value = tableData.list[0].content
            email.value = tableData.list[0].email
            aniname.value = tableData.list[0].aniname
            username.value = tableData.list[0].username
            time.value = tableData.list[0].time
            count.value = tableData.list.length < 10 ? tableData.list.length : 10
        }
        return {
            cookies,
            headers,
            loading,
            tableData,
            empty,
            phone,
            content,
            email,
            aniname,
            username,
            count
        }
    },
    methods: {
        load() {
            console.log(count.value)
            if(this.count < 1) {
                this.count += 1
            }
            console.log(count.value)
        }
    }
})
</script>