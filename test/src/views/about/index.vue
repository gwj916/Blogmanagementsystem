<template>
  <div class="app-container">
    <div>关于我</div>
    <el-input
      v-model="url"
      placeholder="请输入内容"
      :disabled="isdisabled"
    ></el-input>
    <el-button type="primary" style="margin-top: 20px" @click="clickhandle">{{
      btncontent
    }}</el-button>
  </div>
</template>

<script>
import { getabout, editabout } from "@/api/about";
export default {
  data() {
    return {
      url: "",
      isdisabled: true,
      btncontent: "编辑",
    };
  },
  created() {
    this.fetchdata();
  },
  methods: {
    fetchdata() {
      getabout().then(({ data }) => {
        this.url = data;
      });
    },
    clickhandle() {
      if (this.btncontent == "编辑") {
        this.isdisabled = !this.isdisabled;
        this.btncontent = "完成";
      } else {
        if (this.url) {
          this.btncontent = "编辑";
          this.isdisabled = !this.isdisabled;
          editabout({ url: this.url }).then((res) => {
            console.log(res, "cvdf");
          });
          this.$message({
            type: "success",
            message: "更改成功",
          });
        } else {
          this.$message({
            type: "warning",
            message: "输入框不能为空",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
.app-container {
  margin-top: 20px;
}
.app-container div {
  margin-top: 20px;
}
</style>
