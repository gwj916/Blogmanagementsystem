<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" width="180" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }} </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180" align="center">
      </el-table-column>
      <el-table-column prop="description" label="描述" align="center">
      </el-table-column>
      <el-table-column label="中图" width="180" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.midImg2"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="大图" width="180" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.bigImg2"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column  width="180" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="opendialog(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <upload v-model="form.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页大图">
              <upload v-model="form.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editbanner">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getbanners, setbanners } from "@/api/banner.js";
import { host } from "@/request.config.js";
import upload from "@/components/upload";
export default {
  components: { upload },
  data() {
    return {
      data: [],
      dialogFormVisible: false,
      form: {
        id: "",
        title: "",
        description: "",
        midImg: "",
        bigImg2: "",
      },
    };
  },
  created() {
    this.fetchdata();
  },
  methods: {
    editbanner() {
      let arr = [...this.data ];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == this.form.id) {
          arr[i] = this.form;
        }
      }
      setbanners(arr).then((res) => {
        this.dialogFormVisible = false;
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.fetchdata();
      });
    },
    opendialog(banners) {
      this.form = { ...banners };
      this.dialogFormVisible = true;
    },
    fetchdata() {
      getbanners().then((res) => {
        this.data = res.data;
        for (const item of this.data) {
          item.midImg2 = host + item.midImg;
          item.bigImg2 = host + item.bigImg;
        }
      });
    },
  },
};
</script>

<style>
</style>
