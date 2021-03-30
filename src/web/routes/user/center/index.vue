<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
        </div>
        <el-form ref="form" :model="form" :rules="rules" style="margin-top: 10px;" size="small" label-width="80px">
          <el-form-item label="登录帐号" prop="nickName">
            <el-input v-model="form.username" :disabled="true" style="width: 35%" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="form.nickName" style="width: 35%" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" style="width: 35%;" />
          </el-form-item>
          <el-form-item label="邮箱" prop="nickName">
            <el-input v-model="form.email" :disabled="true" style="width: 35%" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.gender" style="width: 178px">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="操作">
            <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存信息</el-button>
            <el-button :loading="saveLoading" size="mini" type="primary" @click="$refs.pass.dialog = true">修改密码</el-button>
            <el-button :loading="saveLoading" size="mini" type="primary" @click="$refs.email.dialog = true">修改邮箱</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-row>
    <updateEmail ref="email" :email="user.email" />
    <updatePass ref="pass" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { editUser } from '@/web/api/user'
import { getToken } from '@/web/utils/auth'
import updatePass from './dialog/updatePass'
import updateEmail from './dialog/updateEmail'
import Avatar from '@/assets/images/avatar.png'

export default {
  name: 'Center',
  components: { updatePass, updateEmail },
  data() {
    return {
      Avatar: Avatar,
      activeName: 'first',
      saveLoading: false,
      headers: {
        'Authorization': getToken()
      },
      form: {},
      rules: {
        user: [
          { required: true, message: '请输入帐号', trigger: 'blur' }
        ]
      },
      defaultUser: {
        id: 0,
        username: 'admin',
        nickName: 'adc',
        gender: '男',
        phone: '123456',
        email: '123@asd',
        dept: 'aaa',
        job: 'bbb'
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.form = { id: this.user.id, username: this.user.username, nickName: this.user.nickName, gender: this.user.gender, phone: this.user.phone, email: this.user.email }
    this.$store.dispatch('user/getInfo').then(() => {})
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.init()
      }
    },
    handleSuccess(response, file, fileList) {
      this.$notify({
        title: '头像修改成功',
        type: 'success',
        duration: 2500
      })
      this.$store.dispatch('user/getInfo').then(() => {})
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            editUser(this.form).then(() => {
              this.editSuccessNotify()
              this.$store.dispatch('user/getInfo').then(() => {})
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
}
</script>

