// vue-cli的配置文件
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        // target: "http://test.my-site.com",
        target: "http://127.0.0.1:6080"
      },
    },
  },
  configureWebpack: require("./webpack.config"),
};
