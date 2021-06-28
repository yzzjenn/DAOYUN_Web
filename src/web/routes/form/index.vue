<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>编辑信息</span>
    </div>
    <div>
      <el-col :span="22" :offset="1">
        <div style="margin: 20px 0;" />
        <el-form ref="form" :model="form" label-width="auto" label-position="left">
          <el-form-item label="邮箱">
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="所属部门">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="研发部" value="yanfa" />
              <el-option label="教师" value="jiaoshi" />
            </el-select>
          </el-form-item>
          <el-form-item label="登录帐号">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="地址" label-position="right">
            <el-row type="flex" justify="start">
              <el-col :span="1">
                省市
              </el-col>
              <el-col :span="6">
                <el-cascader
                  v-model="value"
                  :options="options"
                  @change="handleChange"
                />
              </el-col>
              <el-col :span="2">
                详细地址
              </el-col>
              <el-col :span="6">
                <el-input v-model="form.location" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">更新信息</el-button>
            <el-button>修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>更新成功</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
  // eslint-disable-next-line vue/name-property-casing
  name: 'Form',
  data() {
    return {
      value: 10,
      options: [{
        value: 1,
        label: '福建',
        children: [{
          value: 10,
          label: '福州'
        }, {
          value: 11,
          label: '泉州'
        }]
      }, {
        value: 2,
        label: '湖北',
        children: [{
          value: 20,
          label: '武汉'
        }]
      }],
      form: {
        name: '吴老师',
        email: '123@asd.com',
        region: 'jiaoshi',
        location: '福州大学',
        province: 2,
        username: 'admin',
        phone: '13231313131'
      },
      dialogVisible: false
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    handleClose(value) {
      console.log(value)
    },
    onSubmit() {
      console.log('submit!')
      this.dialogVisible = true
    }
  }
  // eslint-disable-next-line vue/order-in-components
  // computed: {
  //   ...mapGetters([
  //     'name'
  //   ])
  // }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 25px;
    line-height: 46px;
  }
}
.line{
  text-align: center;
}
.box-card {
    margin: 15px;
    width: 95%;
}
</style>
