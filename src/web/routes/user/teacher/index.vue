<template>
  <div class="app-container">
    <el-row>
      <!-- 第一列，左边 -->
      <el-col :span="18">
        <el-card class="box-card">
          <!-- 搜索框 -->
          <el-row>
            <span>昵称或用户名：</span>
            <el-input
              v-model="name"
              placeholder="请输入昵称或用户名"
              style="width: 200px;"
              @keyup.enter.native="search"
            />
            <el-button type="primary" style="margin-left: 10px" @click="search">查询</el-button>
            <el-button @click="resetData">
              重置</el-button>
          </el-row>
          <!-- 按钮栏 -->
          <el-row>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            <el-button :disabled="ids.length === 0" type="danger" size="small" @click="deleteVisible = true">删除</el-button>
          </el-row>
          <!-- 表格栏 -->
          <el-row>
            <el-table
              v-loading="listLoading"
              :data="tableData"
              style="width: 100%"
              row-key="id"
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="55"
              />
              <el-table-column
                prop="nickName"
                label="昵称"
              />
              <el-table-column
                prop="username"
                label="用户名"
                width="155"
              />
              <el-table-column
                prop="dept.name"
                label="院校"
              />
              <el-table-column
                prop="type"
                label="角色"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.type.toString() === '1' ? '员工' : '教师' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="gender"
                label="性别"
              />
              <el-table-column
                prop="phone"
                label="电话"
                width="135"
              />
              <el-table-column
                prop="email"
                label="邮箱"
                width="165"
              />
              <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!-- 页码栏 -->
          <el-row>
            <el-pagination
              background
              :current-page="currentPage"
              :page-sizes="pagesizes"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-row>
          <!-- 编辑或添加弹出框 -->
          <el-dialog
            :title="dialogTitle"
            :visible.sync="visible"
            width="650px"
            :show-close="false"
            :destroy-on-close="true"
          >
            <el-col :span="22">
              <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="form.nickName" />
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                  <el-input v-model.number="form.phone" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="form.email" />
                </el-form-item>
                <el-form-item label="院校" prop="dept.id">
                  <treeselect
                    v-model="form.dept.id"
                    :options="depts"
                    :load-options="loadDepts"
                    style="width: 185px"
                    placeholder="选择院校"
                  />
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="form.gender" style="width: 150px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="角色" prop="roles">
                  <el-select
                    v-model="form.roles"
                    style="width: 185px"
                    multiple
                    placeholder="请选择"
                    @remove-tag="deleteTag"
                    @change="changeRole"
                  >
                    <el-option
                      v-for="item in roles"
                      :key="item.name"
                      :disabled="level !== 1 && item.level <= level"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-radio-group v-model="form.enabled" style="width: 150px">
                    <el-radio label="true">启用</el-radio>
                    <el-radio label="false">停用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-col>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="update">确 定</el-button>
              <el-button @click="closeForm">取 消</el-button>
            </span>
          </el-dialog>
          <!-- 删除提示框 -->
          <el-dialog
            title="确认删除"
            :visible.sync="deleteVisible"
            width="400px"
            :show-close="false"
            :destroy-on-close="true"
          >
            <el-col :span="22">
              <span>确认删除选中项？</span>
            </el-col>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="deleteData">确 定</el-button>
              <el-button @click="closeForm">取 消</el-button>
            </span>
          </el-dialog>
        </el-card>
      </el-col>
      <!-- 第二列右边卡片 -->
      <el-col :span="6">
        <el-card class="box-card">
          <!-- 头部 -->
          <div slot="header" class="clearfix">
            <span>用户所在院校/部门</span>
          </div>
          <!-- 搜索区域 -->
          <div class="head-container">
            <el-input
              v-model="deptName"
              clearable
              size="small"
              placeholder="输入院校/部门名称搜索"
              prefix-icon="el-icon-search"
              class="filter-item"
              @input="getDeptDatas"
            />
          </div>
          <!-- 学校选项 -->
          <el-tree
            :data="depts"
            :load="getDeptDatas"
            :props="defaultProps"
            :expand-on-click-node="false"
            :highlight-current="true"
            lazy
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import crudUser from '@/web/api/userinfo'
import { getDepts, getDeptSuperior } from '@/web/api/dept'
import { getAll, getLevel } from '@/web/api/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { Notification } from 'element-ui'

export default {
  name: 'User',
  components: { Treeselect },
  data() {
    return {
      dialogTitle: '',
      visible: false,
      disabled: true,
      deleteVisible: false,
      total: 0, // response返回总条数
      name: '', // 搜索关键字
      deptName: '',
      deptId: null,
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      tableData: [],
      defaultForm: {
        id: null,
        username: null,
        nickName: null,
        gender: '男',
        type: 2,
        email: null,
        enabled: 'false',
        roles: [],
        jobs: [],
        dept: { id: null },
        phone: null
      },
      form: null,
      row: null,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '请输入正确的邮箱', trigger: 'blur' }],
        'dept.id': [{ required: true, message: '请选择院校', trigger: 'blur' }],
        roles: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      depts: [],
      roles: [],
      level: 3,
      userRoles: [],
      ids: []
    }
  },
  created() {
    this.fetchData()
    this.form = JSON.parse(JSON.stringify(this.defaultForm))
    this.row = JSON.parse(JSON.stringify(this.defaultForm))
  },
  methods: {
    fetchData() {
      this.listLoading = true
      this.ids = []
      const page = this.currentPage - 1
      const size = this.pagesize
      const sort = 'id,desc'
      const blurry = this.name // 搜索框的搜索关键字
      const deptId = this.deptId
      let params = null
      params = { page, size, sort, blurry, deptId }
      // console.log('params:' + JSON.stringify(params))
      crudUser.get(params).then(response => {
        // console.log('response:' + JSON.stringify(response.content))
        // response:{"content":[{行对象},{行对象}]，“totalElement”:"数据库中符合条件的总条数"}
        this.tableData = response.content
        this.total = response.totalElements
        // 如果这里面的最后一页不满，就执行下列。
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          // console.log('fetchData tableData2 = ' + this.currentPage)
          this.currentPage -= 1
          this.fetchData()
        }
        this.listLoading = false
      })
    },
    // 搜索框功能
    search() {
      if (this.name.length === 0) {
        this.$message('请输入搜索关键字！')
      } else {
        this.listLoading = true
        const page = this.currentPage - 1
        const size = this.pagesize
        const sort = 'id,desc'
        const blurry = this.name // 搜索框的搜索关键字
        const deptId = this.deptId
        let params = null
        params = { page, size, sort, blurry, deptId }
        console.log(JSON.stringify(params))
        crudUser.get(params).then(response => {
          this.tableData = response.content
          this.total = response.totalElements
          if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
            console.log('search tableData2 = ' + this.currentPage)
            this.currentPage -= 1
            this.search()
          }
          this.listLoading = false
        })
      }
    },
    // 搜索框重置
    resetData() {
      this.listLoading = true
      this.currentPage = 1
      this.name = ''
      this.deptId = null
      this.fetchData()
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.dept.id) {
            this.$message({
              message: '院校/部门不能为空',
              type: 'warning'
            })
            return false
          } else if (this.form.roles.length === 0) {
            this.$message({
              message: '角色不能为空',
              type: 'warning'
            })
            return false
          }
          if (this.form.dept.id === 56 || this.form.dept.id === 57) {
            this.form.type = 1
          }
          this.form.roles = this.userRoles
          this.listLoading = true
          if (this.form.id === null) {
            crudUser.add(this.form).then(response => {
              this.notifiSuccess('新增成功')
              this.closeForm()
              this.fetchData()
            }).catch(() => {
              this.notifiError('新增失败')
            })
          } else {
            crudUser.edit(this.form).then(response => {
              this.notifiSuccess('编辑成功')
              this.closeForm()
              this.fetchData()
            }).catch(() => {
              this.notifiError('编辑失败')
            })
          }
        }
      })
    },
    deleteData() {
      crudUser.del(this.ids).then(response => {
        this.notifiSuccess('删除成功')
        this.fetchData()
      }).catch(() => {
        this.notifiError('删除失败')
      })
      this.closeForm()
    },
    closeForm() {
      this.visible = false
      this.deleteVisible = false
      this.ids = []
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
    },
    // 当前每页显示条数改变
    handleSizeChange(val) {
      this.pagesize = val
      this.fetchData()
    },
    // 当前页码一改变执行
    handleCurrentChange(val) {
      console.log('当前页码改变了' + val)
      this.currentPage = val
      this.fetchData()
    },
    handleAdd() {
      this.dialogTitle = '添加用户'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.getRoles()
      if (this.form.id === null) {
        this.getDepts()
      } else {
        this.getSupDepts(this.form.dept.id)
      }
      this.getRoleLevel()
      this.form.enabled = this.form.enabled.toString()
      this.visible = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑用户信息'
      this.form = JSON.parse(JSON.stringify(row))
      this.getRoles()
      if (this.form.id === null) {
        this.getDepts()
      } else {
        this.getSupDepts(this.form.dept.id)
      }
      this.getRoleLevel()
      this.form.enabled = this.form.enabled.toString()
      const roles = []
      const userRoles = []
      this.form.roles.forEach(function(role, index) {
        roles.push(role.id)
        // 初始化编辑时候的角色
        const rol = { id: role.id }
        userRoles.push(rol)
      })
      this.userRoles = userRoles
      this.form.roles = roles
      this.visible = true
    },
    handleDelete(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.ids = [this.form.id]
      this.deleteVisible = true
    },
    getDeptDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getDepts(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.depts = res.content
          }
        })
      }, 100)
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const date = res.content
        this.buildDepts(date)
        this.depts = date
      })
    },
    buildDepts(depts) {
      depts.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    getRoles() {
      getAll().then(res => {
        this.roles = res
      }).catch(() => { })
    },
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(() => { })
    },
    changeRole(value) {
      const userRoles = []
      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
      this.userRoles = userRoles
    },
    deleteTag(value) {
      this.userRoles.forEach(function(data, index) {
        if (data.id === value) {
          this.userRoles.splice(index, value)
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.enabled.toString() === 'false') {
        return 'warning-row'
      } else {
        return ''
      }
    },
    handleSelectionChange(val) {
      const ids = []
      val.forEach(data => {
        ids.push(data.id)
      })
      this.ids = ids
    },
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.deptId = null
      } else {
        this.deptId = data.id
      }
      this.fetchData()
    },
    notifiSuccess(title) {
      Notification.success({
        title: title,
        duration: 4000
      })
    },
    notifiError(title) {
      Notification.error({
        title: title,
        duration: 4000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
    // margin: 15px;
    width: 98%;
}
.el-row {
    // margin-top: 10px;
    margin-bottom: 10px;
    &:last-child {
    margin-bottom: 0;
    }
}
.row-bg {
    margin: 15px;
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
