<template>
  <div class="login_container">
    <div class="login_box">
      <!--用户头像-->
      <div class="avatar_box">
        <img src="../assets/img/avatar.jpg" alt="Slienfore">
      </div>
      <!--表单区域-->
      <el-form ref="loginFormRef"
               :rules="loginRules"
               :model="loginForm"
               label-width="0"
               class="login_form">
        <!--用户名-->
        <el-form-item prop="username"><!--验证规则 名称-->
          <el-input v-model="loginForm.username"
                    prefix-icon="iconfont icon-login">
          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password"><!--验证规则 名称-->
          <el-input v-model="loginForm.password"
                    prefix-icon="iconfont icon-password"
                    show-password
                    type="password">
          </el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="login">提交
          </el-button>
          <el-button type="primary"
                     @click="resetLoginForm">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 表单绑定属性
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginRules: {
        username: [
          // 必填项验证
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          // 长度验证
          {min: 5, max: 12, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [// 触发规则均 => 失去焦点
          // 必填项验证
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          // 长度验证
          {min: 6, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLoginForm() {
      // 获取到表单 实例 => 进行重置
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login() {
      // 检测表单输入是否符合规则
      this.$refs.loginFormRef.validate(valid => {// 异步
        // 验证失败
        if (!valid) return

        // 将回传数据中 data 解构成 res
        this.$http.post('/login',
            // 请求体参数
            this.loginForm)
            .then(({data: res}) => {
              console.log('获取到的数据 => ', res)
              if (res.flag) {
                this.$message.success('操作成功')

                // 将用户信息存储到 session 域中(必须在路由跳转之前(触发路由守卫) => 否则获取不到 session)
                window.sessionStorage.setItem('user', res.user)

                // 进行路由跳转
                this.$router.push({path: '/home'})
              } else {
                this.$message.error('操作失败')
              }
            }).catch(err => {
          this.$message.error('请求失败')
        })

      })
    }
  }
}
</script>

<!--添加 lang 符合 less 语法-->
<style scoped lang="less">
.login_container {
  background: #C8EBDF;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login_box {
  position: relative;
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;

  // 头像
  .avatar_box {
    position: absolute;
    width: 150px;
    height: 150px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 3px;
    box-shadow: 0 0 10px #ddd;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #e4f5ef;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 90%;
      height: 90%;
      border-radius: inherit;
    }
  }

  // 表单
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>