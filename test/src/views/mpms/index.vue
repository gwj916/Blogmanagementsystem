<template>
  <div class="app-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column label="序号" width="180" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }} </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">{{ scope.row.name }} </template>
      </el-table-column>
      <el-table-column label="项目描述" align="center">
        <template slot-scope="scope">{{ scope.row.description.toString() }} </template>
      </el-table-column>
      <el-table-column label="预览图" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.thumb2"
            fit="full"
            :preview-src-list="srcList">
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <el-table-column width="180" align="center">
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
                @click="editprogect(scope.row)"
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
                @click="deloneprogect(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-dialog
  title="请编辑项目信息"
  :visible.sync="dialogVisible"
  fullscreen
  width="30%">
  <el-form v-model="form">
  <div class="title">项目名称</div>
    <el-input
      v-model="form.name"
      placeholder="请输入项目名称"
    ></el-input>
     <div class="title">项目描述(每一项以逗号分割)</div>
    <el-input
      v-model="form.description"
      placeholder="请输入项目描述,每一项以逗号分割"
    ></el-input>
     <div class="title">项目链接</div>
    <el-input
      v-model="form.url"
      placeholder="请输入项目链接"
    ></el-input>
     <upload uploadtitle="项目预览图地址" v-model="form.thumb"/>
     <div class="title">项目等级</div>
     <el-select v-model="form.order" placeholder="请选择项目等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
    </el-select><br>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setoneproject ">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { getprogect, setprogect,  delprogect } from "@/api/progects";
import {host} from '@/request.config.js';
import upload from '@/components/upload';

export default {
  components:{upload},
  data() {
    return {
      data: [],
      srcList:[],
      dialogVisible:false,
       form:{
        name:"",
        description:"",
        order:"1",
        thumb:"",
        url:"",
        github:"测试测试测试测试测试"
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getprogect().then((res) => {
        this.data = res.data;
        console.log(this.data);
        for (var i of this.data) {
          i.thumb2 = host + i.thumb;
          this.srcList.push(i.thumb2);
        }
      });
    },
    editprogect(projecrinfo) {
      this.dialogVisible=true;
      this.form = {...projecrinfo,description:projecrinfo.description.toString()}
    },
    deloneprogect(info) {
       this.$confirm("此操作将永久删除该项目, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delprogect(info.id).then(() => {
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
    setoneproject(){
      let obj={...this.form};
     obj.description= obj.description.split(',');
     obj.order = parseInt(obj.order);
     setprogect(obj.id,obj).then(() =>{
      this.dialogVisible=false;
      this.fetchData();  
      this.$message.success('修改成功') 
     })
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
</style>