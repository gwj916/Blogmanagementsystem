<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" width="180" align="center">
        <template slot-scope="scope"
          >{{ scope.$index + (currentPage - 1) * eachPage + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="头像" width="180" align="center">
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar2"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="昵称" align="center">
        <template slot-scope="scope">{{ scope.row.nickname }} </template>
      </el-table-column>
      <el-table-column prop="description" label="内容" align="center">
        <template slot-scope="scope">{{ scope.row.content }} </template>
      </el-table-column>
      <el-table-column prop="description" label="创建日期" align="center">
        <template slot-scope="scope">{{ scope.row.createDate }} </template>
      </el-table-column>
      <el-table-column width="180" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="操作" placement="top">
               <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="delmessagehandler(scope.row)"
              ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
      <el-pagination
      style="margin-top:20px;"
      layout="sizes, prev, pager,next, ->, total"
      background
      :page-size="eachPage"
      :page-sizes="[5, 10, 20, 30]"
      :total="count"
      :current-page.sync="pagercurrentPage"
      @size-change="sizechangehandler"
      @current-change="currentchangehandler"
      @prev-click="prevclickhandler"
      @next-click="nextclickhandler"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getMessages,delMessage } from "@/api/message";
import { formatDate } from "@/utils/tools";
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
    fetchData() {
      getMessages(this.currentPage, this.eachPage).then(({ data }) => {
        this.data = data.rows;
        for (var i of this.data) {
          i.createDate = formatDate(i.createDate);
          i.avatar2 = host + i.avatar
        }
        this.count = data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage);
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    delmessagehandler({id}){
        this.$confirm(
        "此操作将永久删除该评论, 是否继续",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delMessage(id).then(() => {
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


