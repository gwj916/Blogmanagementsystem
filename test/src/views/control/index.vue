<template>
  <div class="dashboard-container">
    <el-col :span="6" v-for="(item, index) in list" :key="index">
      <el-card class="box-card">
        <div class="card">
          <i :class="item.icon" class="icon"></i>
          <div>
            <h4>{{ item.name }}</h4>
            <h1>{{ item.count }}</h1>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="margin: 20px 10px">
        <div ref="mian" style="width: 100%; height: 600px"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card style="margin: 20px 10px">
        <div ref="month" style="width: 100%; height: 600px"></div>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import { getcontrol } from "@/api/control";
import { getblogs } from "@/api/blog";
import { getblogtype } from "@/api/blogtype";

import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import * as echarts from "echarts";
echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);
export default {
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.fetchData(); // 获取数据
  },
  mounted() {
    this.fetchchart(); // 获取数据
  },
  methods: {
    fetchchart() {
      getblogtype().then(({ data }) => {
        let newdata = data.map((item) => ({
          name: item.name,
          value: item.articleCount,
        }));
        var chartDom = this.$refs.mian;
        var myChart = echarts.init(chartDom);

        var option = {
          title: {
            text: "文章分类",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            top: "10%",
            left: "center",
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "70%"],
              top: 60,
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: "#fff",
                borderWidth: 2,
              },
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 30,
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: newdata,
            },
          ],
        };

        option && myChart.setOption(option);
      });
      getblogs().then(({ data }) => {
        let newdata = [];
        data.month.map((item) => {
          newdata.push(item.count);
        });
        var chartDom = this.$refs.month;
        var myChart = echarts.init(chartDom);
        var option;
        option = {
           title: {
            text: "一年评论量",
            left: "center",
          },
          xAxis: {
            type: "category",
            data: [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月",
            ],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: newdata,
              type: "bar",
              showBackground: true,
              backgroundStyle: {
                color: "rgba(180, 180, 180, 0.2)",
              },
            },
          ],
        };
        option && myChart.setOption(option);
      });
    },
    fetchData() {
      getcontrol().then((res) => {
        this.list = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 400px;
  margin: 20px 10px;
  .card {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    .icon {
      font-size: 70px;
      color: #409eff;
    }
  }
}
</style>
