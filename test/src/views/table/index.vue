<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" width="180" align="center">
        <template slot-scope="scope">{{ scope.$index + (currentPage - 1) * eachPage + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="文章名称" width="180" align="center">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="博客预览图" width="200" trigger="hover">
            <el-image style="width: 200px" :src="scope.row.thumb" fit="fill" :preview-src-list="srcList">
              ></el-image>
            <div slot="reference" target="_blank" @click="gotoblog(scope.row)">{{ scope.row.title }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="文章描述" align="center">
        <template slot-scope="scope">{{ scope.row.description }} </template>
      </el-table-column>
      <el-table-column label="浏览数" align="center">
        <template slot-scope="scope">{{ scope.row.scanNumber }} </template>
      </el-table-column>
      <el-table-column label="评论量" align="center">
        <template slot-scope="scope">{{ scope.row.commentNumber }} </template>
      </el-table-column>
      <el-table-column label="所属分类" align="center">
        <template slot-scope="scope">{{
          scope.row.category === null ? "未分类" : scope.row.category.name
        }}
        </template>
      </el-table-column>
      <el-table-column label="创建日期" align="center">
        <template slot-scope="scope">{{ scope.row.createDate }} </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <el-table-column width="180" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" @click="editbanner(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" circle @click="deloneblog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination class="page" layout="sizes, prev, pager,next, ->, total" background :page-size="eachPage"
      :page-sizes="[5, 10, 20, 30]" :total="count" @size-change="sizechangehandler" @current-change="currentchangehandler"
      @prev-click="prevclickhandler" @next-click="nextclickhandler">
    </el-pagination>
  </div>
</template>

<script>
import { formatDate } from "@/utils/tools";
import { getblogs, delblog } from "@/api/blog";
import { host } from "@/request.config.js";
export default {
  data() {
    return {
      data: [],
      srcList: [],
      eachPage: 5,
      currentPage: 1,
      totalPage: 0,
      count: 0,
      pagercurrentPage: 1,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    editbanner(bloginfo) {
      this.$router.push(`/editblog/${bloginfo.id}`)
    },
    fetchData() {
      getblogs(this.currentPage, this.eachPage).then(({ data }) => {
        this.data = data.rows;
        for (var i of this.data) {
          i.createDate = formatDate(i.createDate);
          i.thumb = host + i.thumb;
          this.srcList.push(i.thumb);
        }
        this.count = data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage);
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    gotoblog(bloginfo) {
      window.open(`http://localhost:8080/article/${bloginfo.id}`)
    },
    deloneblog(blog) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delblog(blog.id).then(() => {
            this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    sizechangehandler(size) {
      this.eachPage = parseInt(size);
      this.currentPage = 1;
      this.pagercurrentPage = 1;
      this.fetchData();
    },
    currentchangehandler(pagenum) {
      this.currentPage = parseInt(pagenum);
      this.fetchData();
    },
    prevclickhandler() {
      this.currentPage -= 1;
    },
    nextclickhandler() {
      this.currentPage += 1;
    },
  },
};
</script>

<style scoped>
.page{
  margin-top: 20px;
}
</style>