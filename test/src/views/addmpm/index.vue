<template>
  <div class="app-container">
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
     <el-button type="primary" @click="addoneprogect" style="margin-top:20px;">发布项目</el-button>
  </div>
</template>

<script>
import upload from '@/components/upload';
import {addprogect} from '@/api/progects'; 
export default {
  components:{upload},
  data() {
    return {
      form:{
        name:"",
        description:"",
        order:"1",
        thumb:"",
        url:"",
        github:"测试测试测试测试测试"
      }
    }
  },
  methods: {
    addoneprogect(){
     let obj={...this.form};
     obj.description= obj.description.split(',');
     obj.order = parseInt(obj.order);
     addprogect(obj).then( () =>{
      this.$router.push('/proglist');
      this.$message.success('添加项目成功');
     })
    }
  },
}
</script>

<style scoped>
.title {
  font-size: 17px;
  color: slategray;
  margin: 25px 10px;
}
</style>
