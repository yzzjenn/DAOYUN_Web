<template>
  <div>
    <el-row>
      <el-col :span="17">
        <el-card class="box-card">
          <div class="head-container">
            <div v-if="crud.props.searchToggle">
              <span>用户名或邮箱：</span>
              <el-input
                v-model="query.blurry"
                clearable
                placeholder="输入用户名或邮箱搜索"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="crud.toQuery"
              />
              <rrOperation />
            </div>
            <crudOperation />
          </div>
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            row-key="id"
            :row-class-name="tableRowClassName"
            @select="crud.selectChange"
            @select-all="crud.selectAllChange"
            @selection-change="crud.selectionChangeHandler"
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
              label="帐号"
              width="155"
            />
            <el-table-column
              prop="type"
              label="身份"
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
              width="155"
            />
            <el-table-column label="操作" width="150px" align="center" fixed="right">
              <template slot-scope="scope">
                <udOperation
                  :data="scope.row"
                  :disabled-dle="scope.row.id === 1"
                  msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
                />
              </template>
            </el-table-column>
          </el-table>
          <pagination />
          <el-dialog
            append-to-body
            :close-on-click-modal="false"
            :before-close="crud.cancelCU"
            :visible.sync="crud.status.cu > 0"
            :title="crud.status.title"
            width="620px"
          >
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
              <el-form-item label="院校/部门" prop="dept.id">
                <treeselect
                  v-model="form.dept.id"
                  :options="depts"
                  :load-options="loadDepts"
                  style="width: 178px"
                  placeholder="选择院校/部门"
                />
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="form.gender" style="width: 178px">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="帐号状态">
                <el-radio-group v-model="form.enabled" style="width: 178px">
                  <el-radio label="true">启用</el-radio>
                  <el-radio label="false">停用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
                <el-select
                  v-model="form.roles"
                  style="width: 450px"
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
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
              <el-button type="text" @click="crud.cancelCU">取消</el-button>
            </div>
          </el-dialog>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
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
          <el-tree
            :data="deptDatas"
            :load="getDeptDatas"
            :props="defaultProps"
            :expand-on-click-node="false"
            lazy
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import crudUser from '@/web/api/userinfo'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import pagination from '@/components/Crud/Pagination'
import { getDepts, getDeptSuperior } from '@/web/api/dept'
import { getAll, getLevel } from '@/web/api/role'
import { isvalidPhone } from '@/web/utils/validate'
import { mapGetters } from 'vuex'

let userRoles = []
const defaultForm = { id: null, username: null, nickName: null, gender: '男', email: null, enabled: 'false', roles: [], jobs: [], dept: { id: null }, phone: null }
export default {
  name: 'User',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination },
  cruds() {
    return CRUD({ title: '用户', url: 'api/users', crudMethod: { ...crudUser }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['user_status'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '', depts: [], deptDatas: [], level: 3, roles: [],
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.crud.msg.add = '新增成功，默认密码：123456'
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      console.log(row)
      if (row.enabled.toString() === 'false') {
        return 'warning-row'
      } else {
        return ''
      }
    },
    changeRole(value) {
      userRoles = []
      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud)
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud)
    },
    afterErrorMethod(crud) {
      // 恢复select
      const initRoles = []
      userRoles.forEach(function(role, index) {
        initRoles.push(role.id)
      })
      crud.form.roles = initRoles
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getRoles()
      if (form.id === null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.dept.id)
      }
      this.getRoleLevel()
      form.enabled = form.enabled.toString()
    },
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      userRoles = []
      const roles = []
      form.roles.forEach(function(role, index) {
        roles.push(role.id)
        // 初始化编辑时候的角色
        const rol = { id: role.id }
        userRoles.push(rol)
      })
      form.roles = roles
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.dept.id) {
        this.$message({
          message: '院校/部门不能为空',
          type: 'warning'
        })
        return false
      } else if (crud.form.roles.length === 0) {
        this.$message({
          message: '角色不能为空',
          type: 'warning'
        })
        return false
      }
      crud.form.roles = userRoles
      return true
    },
    // 获取左侧院校/部门数据
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
            this.deptDatas = res.content
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
    // 获取弹窗内院校/部门数据
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
    // 切换院校/部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.deptId = null
      } else {
        this.query.deptId = data.id
      }
      this.crud.toQuery()
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll().then(res => {
        this.roles = res
      }).catch(() => { })
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(() => { })
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
    margin: 15px;
    width: 95%;
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
<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: center;
  }
  /deep/ .vue-treeselect__control, /deep/ .vue-treeselect__placeholder, /deep/ .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
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
