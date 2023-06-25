<template>
  <div>
    <div class="title">{{ uploadtitle }}</div>
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
       :on-success="handleAvatarSuccess"
      :show-file-list="false"
      :headers="headers"
    >
      <img v-if="value" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { host } from "@/request.config.js";
export default {
  name: "upload",
  props: ["uploadtitle", "value"],
  computed: {
    imageUrl() {
      return host + this.value;
    },
    headers() {
      return {
        Authorization: "Bearer " + localStorage.getItem("admintoken"),
      };
    },
  },
  methods: {
    handleAvatarSuccess(res){
      if (!res.code && res.data) {
        this.$emit('input',res.data)
      }
    }
  },
};
</script>

<style scoped>
.title {
  font-size: 17px;
  color: slategray;
  margin: 25px 10px;
}
.avatar-uploader .el-upload {

  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 50px 20px 0px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
  border-radius: 6px;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
