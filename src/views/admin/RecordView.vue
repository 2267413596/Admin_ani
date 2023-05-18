<template>
  <div id="root">
    <!-- 搜索框 -->
    <div class="basic-box" style="margin: 20px">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input v-model="context" class="w-50 m-2" placeholder="搜索档案" />
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="search">搜索 </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="Search" @click="add"
            >新增档案</el-button
          >
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div
      id="table"
      class="basic-box"
      style="margin: 20px; margin-bottom: -10px"
    >
      <el-table
        :data="tableData.list"
        style="width: 100%"
        max-height="62vh"
        v-loading="loading"
      >
        <el-table-column prop="id" label="动物id" width="200" />
        <el-table-column prop="name" label="动物名称" width="200" />
        <el-table-column prop="status" label="领养状态" width="120" />
        <el-table-column fixed="right" label="Operations">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="edit(scope.$index)"
            >
              编辑
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="deleteRow(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next"
        :total="totalNum"
        :default-page-size="20"
      >
      </el-pagination>
    </div>
    <el-dialog v-model="dialogVisible" title="编辑档案" 
    width="50%" :before-close="handleClose">
      <el-form :model="form" label-width="120px">
        <el-form-item label="动物名称">
          <el-input v-model="name" />
        </el-form-item>
        <el-form-item label="动物介绍">
          <el-input v-model="intro" type="textarea" />
        </el-form-item>
        <el-form-item label="动物图片">
          <a-upload
          list-type="picture-card"
          v-model:file-list="fileList"
          :customRequest="customRequest"
        >
          <div v-if="fileList.length < 10">
            <plus-outlined />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
        </el-form-item>
        <el-form-item label="领养状态">
          <el-select v-model="adopted">
            <el-option label="已领养" :value="true" />
            <el-option label="未领养" :value="false" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible1" title="新增档案" width="50%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="动物名称">
          <el-input v-model="name" />
        </el-form-item>
        <el-form-item label="动物介绍">
          <el-input v-model="intro" type="textarea" />
        </el-form-item>
        <el-form-item label="动物图片">
          <a-upload
          list-type="picture-card"
          v-model:file-list="fileList"
          :customRequest="customRequest"
        >
          <div v-if="fileList.length < 10">
            <plus-outlined />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
        </el-form-item>
        <el-form-item label="领养状态">
          <el-select v-model="adopted">
            <el-option label="已领养" value="true" />
            <el-option label="未领养" value="false" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取消</el-button>
          <el-button type="primary" @click="confirm1"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisibleCD" title="提示">
    <span>确定要删除“{{ this.name }}”的档案吗</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleCD = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>

<style>
@import "../../assets/styles/userView.css";

#search {
  background-color: aquamarine;
}
.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline :deep(.ant-upload-animate-enter) {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline :deep(.ant-upload-animate-leave) {
  animation-name: uploadAnimateInlineOut;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>

<script>
import { defineComponent, onMounted, ref, reactive } from "vue";
import Axios from "axios";
import { useCookies } from "vue3-cookies";
import { message } from "ant-design-vue";
import { UploadOutlined, PlusOutlined  } from "@ant-design/icons-vue";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const { cookies } = useCookies();
const headers = {
  "Content-Type": "application/json",
  Authorization: cookies.get("myCookie"),
};

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: cookies.get("myCookie"),
  },
};
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default defineComponent({
  components: {
    UploadOutlined,
    PlusOutlined
  },
  beforeCreate() {
    document.querySelector("body").setAttribute("style", "margin: 0");
  },
  setup() {
    const context = ref("");
    const lastImage = ref([]);
    const id = ref(0);
    const loading = ref(false);
    const totalNum = ref(0);
    const handleCancel = () => {
      previewVisible.value = false;
    };
    const handleChange = ({ fileList: newFileList }) => {
      console.log(newFileList)
      fileList.value = newFileList;
    };
    const fileList = ref([]);
    const dialogVisible = ref(false);
    const dialogVisible1 = ref(false);
    let tableData = reactive({ list: [] });
    const intro = ref("");
    const name = ref("");
    const adopted = ref(false);
    const currentPage = ref(1);
    loading.value = true;
    const dialogVisibleCD = ref(false);
    const url = ref('');
    const imageNum = ref(0)
    Axios.post(
      "/api/admin/animal/get/",
      {
        pageNum: 20,
        page: 0,
        context: "",
      },
      { headers }
    )
      .then((response) => {
        console.log(response);
        if (response.data.body != null) {
          for (var i = 0; i < response.data.body.records.length; i++) {
            var item = response.data.body.records[i];
            if (item.adopted == true) {
              item["status"] = "已领养";
            } else {
              item["status"] = "未领养";
            }
            tableData.list.push(item);
          }
          totalNum.value = response.data.body.sumNum;
        }
      })
      .catch((response) => {
        alert("网络错误");
        console.log(response);
      });
    loading.value = false;
    const previewVisible = ref(false);
    const previewImage = ref('');
    return {
      cookies,
      tableData,
      dialogVisible,
      intro,
      name,
      adopted,
      fileList,
      handleChange,
      totalNum,
      context,
      lastImage,
      id,
      dialogVisible1,
      currentPage,
      loading,
      url,
      handleCancel,
      previewVisible,
      previewImage,
      dialogVisibleCD,
      imageNum
    };
  },
  methods: {
    edit(index) {
      this.intro = this.tableData.list[index].intro;
      this.name = this.tableData.list[index].name;
      this.adopted = this.tableData.list[index].adopted;
      this.id = this.tableData.list[index].id;
      this.urls = this.tableData.list[index].avatar;
      this.fileList = []
      for(var i = 0; i < this.urls.length; i++) {
        this.lastImage.push(this.urls[i])
        this.fileList.push({
        uid: i,
        name: 'image' + i + '.png',
        status: 'done',
        url: '/api' + this.urls[i],
      })
      console.log(this.fileList)
      }
      this.dialogVisible = true;
    },
    add() {
      this.intro = "";
      this.name = "";
      this.adopted = "";
      this.avatar = '';
      this.fileList = [];
      this.dialogVisible1 = true;
    },
    confirm() {
      //修改
      Axios.post(
        "/api/admin/animal/modify/",
        {
          recordId: this.id,
          name: this.name,
          intro: this.intro,
          adopted: this.adopted,
          avatar: this.lastImage,
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          this.dialogVisible = false
          this.lastImage = [];
        })
        .catch((response) => {
          console.log(response);
          ElMessage.error("网络错误");
        });
      this.loading = true;
      Axios.post(
        "/api/admin/animal/get",
        {
          pageNum: 20,
          page: 0,
          context: this.context,
        },
        { headers }
      )
        .then((response) => {
          this.tableData.list = [];
          for (var i = 0; i < response.data.body.records.length; i++) {
            var item = response.data.body.records[i];
            if (item.adopted == true) {
              item["status"] = "已领养";
            } else {
              item["status"] = "未领养";
            }
            this.tableData.list.push(item);
          }
          this.totalNum = response.data.body.sumNum;
        })
        .catch((response) => {
          console.log(response);
          ElMessage.error("网络错误");
        });
      this.loading = false;
    },
    confirm1() {
      //新增
      Axios.post(
        "/api/admin/animal/addrecord",
        {
          recordId: this.id,
          name: this.name,
          intro: this.intro,
          adopted: this.adopted,
          avatar: this.lastImage,
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          if (response.data.code != 0) {
            ElMessage(response.data.message);
          } else {
            ElMessage("Success!");
          }
        })
        .catch((response) => {
          console.log(response);
          ElMessage.error("网络错误");
        });
      this.loading = true;
      Axios.post(
        "/api/admin/animal/get",
        {
          pageNum: 20,
          page: 0,
          context: this.context,
        },
        { headers }
      )
        .then((response) => {
          this.tableData.list = [];
          for (var i = 0; i < response.data.body.records.length; i++) {
            var item = response.data.body.records[i];
            if (item.adopted == true) {
              item["status"] = "已领养";
            } else {
              item["status"] = "未领养";
            }
            this.tableData.list.push(item);
          }
          this.totalNum = response.data.body.sumNum;
        })
        .catch((response) => {
          console.log(response);
          ElMessage.error("网络错误");
        });
      this.loading = false;
    },
    handleCurrentChange(index) {
      this.loading = true;
      this.currentPage = index;
      Axios.post(
        "/api/admin/animal/get",
        {
          pageNum: 20,
          page: index - 1,
          context: this.context,
        },
        { headers }
      )
        .then((response) => {
          this.tableData.list = [];
          for (var i = 0; i < response.data.body.records.length; i++) {
            var item = response.data.body.records[i];
            if (item.adopted == true) {
              item["status"] = "已领养";
            } else {
              item["status"] = "未领养";
            }
            this.tableData.list.push(item);
          }
          this.totalNum = response.data.body.sumNum;
        })
        .catch((response) => {
          console.log(response);
        });
      this.loading = false;
    },
    handleClose() {
      this.lastImage = []
      this.dialogVisible = false;
      this.dialogVisible1 = false;
    },
    search() {
      this.loading = true;
      Axios.post(
        "/api/admin/animal/get",
        {
          pageNum: 20,
          page: 0,
          context: this.context,
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          this.tableData.list = [];
          if (response.data.body.records != null) {
            for (var i = 0; i < response.data.body.records.length; i++) {
              var item = response.data.body.records[i];
              if (item.adopted == true) {
                item["status"] = "已领养";
              } else {
                item["status"] = "未领养";
              }
              this.tableData.list.push(item);
            }
            this.totalNum = response.data.body.sumNum;
          }
        })
        .catch((response) => {
          console.log(response);
          ElMessage.error("网络错误");
        });
      this.loading = false;
    },
    customRequest(options) {
      console.log(options);
      let params = new window.FormData();
      params.append("image", options.file);
      params.append("type", "animal");
      Axios.post("/api/image/upload", params, config)
        .then((response) => {
          this.lastImage.push(response.data.body.imagePath);
          this.fileList[0].status = 'done'
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
        });
    },
    deleteRow(index) {
      this.name = this.tableData.list[index].name;
      this.id = this.tableData.list[index].id;
      this.dialogVisibleCD = true;
    },
    confirmDelete() {
      console.log(this.id)
      Axios.post(
        "/api/admin/animal/delete",
        {
          recordId: this.id
        },
        { headers }
      )
        .then((response) => {
          console.log(response);
          this.dialogVisibleCD = false
          ElMessage.success("删除成功");
          setTimeout(1500);
          this.$router.go(0);
        })
        .catch((response) => {
          console.log(response);
          ElMessage.error("网络错误");
        });
    }
  },
});
</script>