<template>
  <div class="app-container">
    <div class="title">文章标题</div>
    <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    <div class="title">文章编辑</div>
    <editor
      height="800px"
      initialEditType="markdown"
      :initialValue="form.editorText"
      previewStyle="vertical"
      :options="editorOptions"
      ref="toastuiEditor"
    />
    <div class="title">文章描述</div>
    <el-input
      type="textarea"
      :rows="7"
      v-model="form.description"
      placeholder="请输入文章描述"
    ></el-input>
    <upload v-model="form.thumb" uploadtitle="文章头图" />
    <div class="title">选择分类</div>
    <el-select
      v-model="form.select"
      placeholder="请选择活动区域"
      class="select"
    >
      <el-option
        :label="item.name"
        :value="item.id"
        v-for="item in blogtype"
        :key="item.id"
      ></el-option> </el-select
    ><br />
    <el-button type="primary" style="margin-top: 20px" @click="addarticle"
      >{{btncontent}}</el-button
    >
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import { Editor } from "@toast-ui/vue-editor";
import upload from "@/components/upload";
import { getblogtype } from "@/api/blogtype";
import { addblog, editblog, findoneblog } from "@/api/blog";

export default {
  components: {
    editor: Editor,
    upload,
  },
  props: ["mode"],
  data() {
    return {
      editorOptions: { language: "zh-CN" },
      form: {
        title: "",
        description: "",
        editorText: "",
        thumb: "",
        select: "",
      },
      blogtype: [],
      btncontent:'发布文章'
    };
  },
  created() {
    getblogtype().then(({ data }) => {
      this.blogtype = data;
    });
    if (this.mode === "edit") {
      this.id = this.$route.params.id;
      findoneblog(this.id).then((res) => {
        this.form = res.data;
        this.form.select =
          res.data.category === null ? "" : res.data.category.id;
        this.$refs.toastuiEditor.invoke("setHTML", res.data.htmlContent);
      });
      this.btncontent = '确认修改'
    }
  },
  methods: {
    addarticle() {
      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("getMarkdown");
      var obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime(),
        categoryId: this.form.select,
        toc: [],
        htmlContent: html,
        thumb: this.form.thumb,
        markdownContent: markdown,
      };
      console.log(obj);
      if (obj.title && obj.description && obj.htmlContent && obj.categoryId) {
        if (this.mode === "add") {
          addblog(obj).then(() => {
            this.$router.push("/bloglist");
            this.$message.success("添加文章成功");
          });
        } else {
          editblog({ id: this.form.id, data: obj }).then(() => {
            this.$router.push("/bloglist");
            this.$message.success("修改文章成功");
          });
        }
      } else {
        this.$message.error("请填写所有内容");
      }
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 17px;
  color: slategray;
  margin: 25px 10px;
}
</style>