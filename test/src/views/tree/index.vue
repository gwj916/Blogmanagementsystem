<template>
  <div class="app-container">
    <div style="margin: 20px 0; width: 500px; display: flex">
      <el-input
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select"
      >
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </el-input>
      <el-button type="primary" @click="addblogtypehandler">添加</el-button>
    </div>

    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" width="180" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }} </template>
      </el-table-column>
      <el-table-column label="博客类别" align="center">
        <template slot-scope="scope">{{ scope.row.name }} </template>
      </el-table-column>
      <el-table-column label="文章数量" align="center">
        <template slot-scope="scope">{{ scope.row.articleCount < 0 ? '0' : scope.row.articleCount }} </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <el-table-column width="220" align="center">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="confirmedit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deloneblogtype(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑分类信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="请选择活动区域">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateblogtype">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getblogtype,
  delblogtype,
  addblogtype,
  findoneblogtype,
  updateoneblogtype,
} from "@/api/blogtype";
export default {
  data() {
    return {
      data: [],
      input: "",
      form: {
        name: "",
        order: "",
      },
      select: "1",
      dialogFormVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getblogtype().then((res) => {
        this.data = res.data;
      });
    },
    addblogtypehandler() {
      if (this.input) {
        addblogtype({ name: this.input, order: this.select }).then(() => {
          this.fetchData();
          this.$message.success("添加成功");
        });
      } else {
        this.$message.error("分类名称不能为空");
      }
    },
    deloneblogtype({ id }) {
      this.$confirm(
        "删除分类后，多有文章变为未分类状态?",
        "此操作将永久删除该分类, 是否继续",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delblogtype(id).then(() => {
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
    confirmedit({ id }) {
      findoneblogtype(id).then((res) => {
        this.form = res.data;
        this.dialogFormVisible = true;
      });
    },
    updateblogtype() {
      updateoneblogtype({
        id: this.form.id,
        data: this.form,
      }).then((res) => {
        this.fetchData();
        this.$message.success("更新分类信息成功");
        this.dialogFormVisible = false;
      });
    },
  },
};
</script>

<style scoped>
</style>