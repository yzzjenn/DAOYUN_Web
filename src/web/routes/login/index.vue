<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 标题 -->
      <div class="avater_box"><h3>到云签到</h3></div>
      <!-- 选项卡 -->
      <div class="login_header">
        <span :class="{active:cur==0}" style="padding: 0 20px" @click="cur=0">账号登录</span>
        <span :class="{active:cur==1}" style="padding: 0 20px" @click="cur=1">手机号登录</span>
      </div>
      <!-- 登录表单区域  手机号登录-->
      <el-form v-show="cur==1" ref="loginform" :model="loginform" :rules="loginrules" label-width="0px" class="login_form" autocomplete="on">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginform.username" placeholder="请输入手机号" prefix-icon="el-icon-mobile-phone" />
          <el-button type="warning" style="position:absolute; right: 0;" :disabled="resend" @click="sendCode()">{{ codeStatus }}</el-button>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="code">
          <el-input v-model="loginform.password" placeholder="请输入验证码" prefix-icon="el-icon-chat-dot-round" />
        </el-form-item>
        <!-- tip -->
        <el-form-item>
          <el-row type="flex" justify="end">
            <el-col :span="12" :offset="15">
              <!-- <el-link type="primary" :underline="false" @click="dialogFormVisible = true">密码登录</el-link> -->
              <!-- <el-link type="primary" :underline="false" @click="dialogFormVisible = true">密码登录</el-link> -->
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" style="width:450px;" :loading="loading" round @click.native.prevent="handleLogin()">登录</el-button>
        </el-form-item>
      </el-form>
      <!-- 登录表单区域  账号登录-->
      <el-form v-show="cur==0" ref="loginform_user" :model="loginform_user" :rules="loginrules_user" label-width="0px" class="login_form" autocomplete="on">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginform_user.username" placeholder="请输入用户名" prefix-icon="el-icon-user" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginform_user.password" placeholder="请输入密码" prefix-icon="el-icon-unlock" type="password" />
        </el-form-item>
        <!-- tip -->
        <!-- <el-link type="primary" :underline="false" @click="dialogFormVisible = true">忘记密码</el-link> -->
        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" style="width:450px;" :loading="loading" round @click.native.prevent="handleLogin_byusername()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="忘记密码" :visible.sync="dialogFormVisible" width="50%" append-to-body :close-on-click-modal="false" center>
      <el-form ref="passwordform" :model="passwordform" :rules="passwordrules">
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="passwordform.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="passwordform.code" autocomplete="off" />
          <el-button type="warning" style="position:absolute; right: 0;" :disabled="resend" @click="sendCode()">{{ codeStatus }}</el-button>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="passwordform.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="rePassword">
          <el-input v-model="passwordform.rePassword" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeForm()">取 消</el-button>
          <el-button type="primary" @click="changePassword()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import Config from '@/settings'
import { encrypt } from '@/web/utils/rsaEncrypt'
import { changePassword } from '@/web/api/user'
import { sendCode, checkCode } from '@/web/api/code'
import { removeToken } from '@/web/utils/auth'

export default {
  name: 'Login',
  data() {
    var validateRePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordform.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validatecode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入验证码'))
      // eslint-disable-next-line eqeqeq
      } else if (value != this.truecode) {
        callback(new Error('验证码输入错误!'))
      } else {
        callback()
      }
    }
    return {
      // 登录表单
      loginform: {
        username: '18750062313',
        password: ''
      },
      loginform_user: {
        username: 'admin',
        password: '123456'
      },
      loginrules: {
        username: [{ required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入正确的手机号', trigger: 'blur' }],
        password: [{ required: true, validator: validatecode, trigger: 'blur' }]

      },
      loginrules_user: {
        username: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 忘记验证码表单，
      dialogFormVisible: false,
      passwordform: {
        email: '',
        code: '',
        password: '',
        rePassword: ''
      },
      passwordrules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/, message: '请输入正确的邮箱', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '请输入正确的验证码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){6,15}$/, message: '密码为数字，字母或特殊符号至少包含两种，长度为6 - 15位' }],
        rePassword: [{ required: true, validator: validateRePass, trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      cookiePass: '',
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      activeName: 'username',
      codeStatus: '获取验证码',
      resend: false,
      truecode: '123456',
      cur: 1
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCookie()
  },
  methods: {
    getCookie() {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      // const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password
        // rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    // showPwd() {
    //   if (this.passwordType === 'password') {
    //     this.passwordType = ''
    //   } else {
    //     this.passwordType = 'password'
    //   }
    //   this.$nextTick(() => {
    //     this.$refs.password.focus()
    //   })
    // },
    /* 关闭忘记密码窗口 */
    closeForm() {
      this.dialogFormVisible = false
    },
    // findPwd() {
    //   this.findPwdVisible = true
    // },
    /* 发送验证码 */
    sendCode() {
      // 判断是否填写手机号
      if (this.loginform.username) {
        this.resend = !this.resend
        const TIME_COUNT = 60
        let count = TIME_COUNT
        this.codeStatus = count.toString() + '秒'
        const userPhone = this.loginform.username
        const codeData = { phone: this.loginform.username }
        // codeData.value
        let timer = setInterval(() => {
          if (count > 0 && count <= TIME_COUNT) {
            count--
            this.codeStatus = count.toString() + '秒'
          } else {
            this.codeStatus = '获取验证码'
            this.resend = !this.resend
            clearInterval(timer)
            timer = null
          }
        }, 1000)
        // 发送request sendCode()函数请求
        sendCode(codeData, userPhone).then(response => {
          this.truecode = response
          console.log(response)
          // this.loginform.password = response
          this.$message({
            showClose: true,
            message: '发送成功，验证码有效期5分钟',
            type: 'success'
          })
        }).catch((e) => {
          console.log(e)
          this.codeStatus = '获取验证码'
          this.resend = !this.resend
          clearInterval(timer)
          timer = null
        })
      } else {
        this.$message({
          showClose: true,
          message: '请输入手机号',
          type: 'error'
        })
      }
    },
    /* 修改密码 */
    changePassword() {
      // 验证表单是否填写正确
      this.$refs.passwordform.validate(valid => {
        this.passwordform.password = encrypt(this.passwordform.password)
        const verification = {
          code: this.passwordform.code,
          type: 'email',
          scenes: '重置密码',
          value: this.passwordform.email
        }
        checkCode(verification).then(response => {
          if (valid) {
            const info = {
              email: this.passwordform.email,
              password: this.passwordform.password
            }
            changePassword(info).then(response => {
              this.closeForm()
              removeToken()
              Cookies.remove('password')
            })
          }
        }).catch(() => {
          this.$message({
            message: '验证码错误',
            type: 'warning'
          })
        })
      })
    },
    /* 登录 */
    handleLogin() {
      this.$refs.loginform.validate(valid => {
        const user = {
          username: this.loginform.username,
          phone: this.loginform.username
        }
        if (valid) {
          this.loading = true
          Cookies.set('username', user.username, { expires: Config.passCookieExpires })
          // Cookies.set('password', user.password, { expires: Config.passCookieExpires })
          this.$store.dispatch('user/loginbyphone', user).then(() => {
            console.log('login请求成功')
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((e) => {
            this.loading = false
          })
        }
      })
    },
    /* 登录  账号密码登录*/
    handleLogin_byusername() {
      this.$refs.loginform_user.validate(valid => {
        const user = {
          username: this.loginform_user.username,
          password: this.loginform_user.password
        }
        // const UserPhone = this.loginform.username
        if (user.password !== this.cookiePass) {
          user.password = encrypt(user.password)
        }
        if (valid) {
          this.loading = true
          Cookies.set('username', user.username, { expires: Config.passCookieExpires })
          Cookies.set('password', user.password, { expires: Config.passCookieExpires })
          this.$store.dispatch('user/login', user).then(() => {
            console.log('login请求成功')
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((e) => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;

  .login_box{
    width: 500px;
    height: 400px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;

    .avater_box{
      flex : 1;
      text-align: center;
      line-height: 40px;
    }
    .login_header{
      flex: 1;
      position: absolute;
      left: 27%;
      top: 20%;
      transform: translate(-50%,-50%);
      .active{
          color: #3f7dff;
          padding-bottom: 10px;
          border-bottom: 3px solid #3f7dff;
          cursor: pointer;
      }
    }
    .login_form{
      flex : 3;
      position: absolute;
      left: 50%;
      top: 55%;
      transform: translate(-50%,-50%);
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;

      .btn{
      width: 500px;
      }
    }
  }
}
</style>
