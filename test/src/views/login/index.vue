<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item prop="loginId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginId"
          v-model="loginForm.loginId"
          placeholder="请输入管理员账号"
          name="loginId"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="loginPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.loginPwd"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <div class="captcha">
        <el-form-item prop="captcha" class="captchacode">
          <span class="svg-container">
            <svg-icon icon-class="nested" />
          </span>
          <el-input
            :key="passwordType"
            ref="captcha"
            v-model="loginForm.captcha"
            :type="passwordType"
            placeholder="请输入验证码"
            name="captcha"
            tabindex="3"
            auto-complete="on"
          />
        </el-form-item>
        <div class="code" @click="getcaptchafunc" v-html="svg" />
      </div>

      <el-checkbox v-model="loginForm.checked">七天内免登录</el-checkbox>
      <el-button
        :loading="loading"
        type="primary"
        class="loginbtn"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { getcaptcha } from "@/api/captcha";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        loginId:'',
        loginPwd:'',
        captcha: '',
        checked: true,
      },
      loginRules: {
        loginId: [{ required: true, trigger: "blur", message: "请输入账号" }],
        loginPwd: [{ required: true, trigger: "blur", message: "请输入密码" }],
        captcha: [{ required: true, trigger: "blur", message: "请输入验证码" }],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      svg: "",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getcaptchafunc();
  },
  methods: {
    getcaptchafunc() {
      getcaptcha().then((res) => {
        this.svg = res;
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.checked) {
            this.loginForm.remember = 7;
          }
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch((res) => {
              if (typeof res === "string") {
                this.$message.error("验证码错误");
              } else {
                this.$message.error("账号密码错误");
              }
              this.getcaptchafunc();
              this.loading = false;
              this.loginForm.captcha ='';
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-checkbox {
    margin: 0 0 20px 4px;
  }
}
.captcha {
  justify-content: space-between;
  display: flex;
  box-sizing: border-box;
  .captchacode {
    width: 280px;
  }
  .code {
    width: 150px;
    height: 52px;
    cursor: pointer;
  }
}
.loginbtn {
  width: 100%;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
