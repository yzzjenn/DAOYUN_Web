<template>
  <div class="dashboard-editor-container">
    <el-card shadow="hover">
      <div slot="header" class="text">
        <span>欢迎您！</span>
      </div>
      <!-- <el-collapse>
        <el-collapse-item title="右上角" name="1">
          <div>个人中心</div>
          <div>退出登录</div>
        </el-collapse-item>
        <el-collapse-item title="静态界面" name="2">
          <div>静态保存菜单路由，里面菜单的显示不受角色权限控制</div>
        </el-collapse-item>
      </el-collapse> -->
      <el-carousel height="500px" type="card">
        <el-carousel-item v-for="item in 3" :key="item">
          <el-image
            :src="require('@/web/routes/dashboard/images/'+ item +'.png')"
            fit="scale-down"
          />
        </el-carousel-item>
      </el-carousel>
    </el-card>
  </div>
</template>

<script>

import Cookies from 'js-cookie'

export default {
  name: 'DashboardAdmin',
  data() {
    return {
      username: 'user',
      value: new Date(),
      url: [
        '@/web/routes/dashboard/images/login.png',
        '@/web/routes/dashboard/images/login.png',
        '@/web/routes/dashboard/images/login.png'
      ]
    }
  },
  created() {
    this.getCookie()
  },
  methods: {
    getCookie() {
      this.username = Cookies.get('username')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
.text {
    font-size: 25px;
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
