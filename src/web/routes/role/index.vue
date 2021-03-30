<template>
  <div class="app-container">
    <el-card class="box-card">
      <div>
        <el-row>
          <span>角色名：</span>
          <el-input
            v-model="name"
            placeholder="请输入角色名"
            style="width: 200px;"
          />
          <el-button type="primary" style="margin-left: 10px" @click="handlesearch">查询</el-button>
          <el-button @click="resetData">重置</el-button>
        </el-row>
        <el-row>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          <el-button :disabled="ids.length === 0" type="danger" size="small" @click="deleteVisible = true">删除</el-button>
        </el-row>
      </div>
      <div>
        <el-row>
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="tableData"
            style="width: 100%"
            row-key="id"
            highlight-current-row
            @current-change="tableCurrentChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="id"
              label="编号"
              width="80"
            />
            <el-table-column
              prop="name"
              label="角色名"
              width="100"
            />
            <el-table-column
              prop="dataScope"
              label="数据权限"
            />
            <el-table-column
              prop="level"
              label="角色级别"
            />
            <el-table-column
              prop="description"
              label="描述"
              width="200"
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
      </div>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="visible"
        width="650px"
        :show-close="false"
        :destroy-on-close="true"
      >
        <el-col :span="24">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="form.name" placeholder="请输入角色名" clearable />
            </el-form-item>
            <el-form-item label="角色级别" prop="level" size="mini">
              <el-input-number v-model="form.level" :min="1" :max="999" clearable />
            </el-form-item>
            <el-form-item label="数据权限" prop="dataScopes">
              <el-select v-model="form.dataScope" placeholder="请选择数据权限" @change="changeScope">
                <el-option
                  v-for="item in dataScopes"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="description" size="mini">
              <el-input
                v-model="form.description"
                type="textarea"
                autosize
                placeholder="请输入内容"
              />
            </el-form-item>
            <el-form-item v-if="form.dataScope === '自定义'" label="数据权限" prop="depts">
              <treeselect
                v-model="form.depts"
                :load-options="loadDepts"
                :options="depts"
                multiple
                style="width: 480px"
                placeholder="请选择"
              />
            </el-form-item>
            <el-form-item v-if="form.id !== null" label="菜单权限">
              <treeselect
                v-model="roleMenus"
                :options="menus"
                :default-expand-level="1"
                :load-options="loadMenus"
                :value-consists-of="valueConsistsOf"
                multiple
                style="width: 480px"
                placeholder="请选择菜单"
              />
            </el-form-item>
          </el-form>
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="update">确 定</el-button>
          <el-button @click="closeForm">取 消</el-button>
        </span>
      </el-dialog>
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
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import crudRoles from '@/web/api/role'
import { getDepts, getDeptSuperior } from '@/web/api/dept'
import { getMenus, getMenuSuperior } from '@/web/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { Notification } from 'element-ui'

export default {
  name: 'Role',
  components: {
    Treeselect
  },
  data() {
    return {
      name: '',
      dialogTitle: '',
      valueConsistsOf: 'ALL',
      visible: false,
      deleteVisible: false,
      save: false,
      listLoading: true,
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      tableData: [],
      treeData: [],
      roleMenus: [],
      delateDatas: [],
      props: { children: 'children', label: 'label', isLeaf: 'leaf' },
      total: 0,
      dataScopes: ['全部', '本级', '自定义'],
      rules: {
        name: [
          { type: 'string', required: true, message: '名称不能为空', trigger: 'blur' }
        ]
      },
      defaultForm: {
        id: null,
        name: null,
        depts: [],
        description: null,
        dataScope: '全部',
        level: 3
      },
      form: null,
      row: null,
      menus: [],
      depts: [],
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
      this.ids = []
      this.listLoading = true
      const page = this.currentPage - 1
      const size = this.pagesize
      const sort = 'level,asc'
      const blurry = this.name
      let params = null
      params = { page, size, sort, blurry }
      crudRoles.getList(params).then(response => {
        this.tableData = response.content
        this.total = response.totalElements
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.pagesize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    tableCurrentChange(val) {
    },
    handleAdd() {
      this.dialogTitle = '新增角色'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.roleMenus = []
      this.getMenus()
      this.visible = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑角色'
      this.form = JSON.parse(JSON.stringify(row))
      this.roleMenus = []
      if (this.form.dataScope === '自定义') {
        if (this.form.id === null) {
          this.getDepts()
        } else {
          this.getSupDepts(this.form.depts)
        }
      }
      if (this.form.id === null) {
        this.getMenus()
      } else {
        this.getSupMenus(this.form.menus)
        const menus = []
        this.form.menus.forEach(function(menu) {
          menus.push(menu.id)
        })
        this.roleMenus = menus
      }
      const depts = []
      this.form.depts.forEach(function(dept) {
        depts.push(dept.id)
      })
      this.form.depts = depts
      this.visible = true
    },
    handleDelete(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.ids = [this.form.id]
      this.deleteVisible = true
    },
    handlesearch() {
      this.listLoading = true
      this.fetchData()
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (this.form.dataScope === '自定义' && this.form.depts.length === 0) {
          this.$message({
            message: '自定义数据权限不能为空',
            type: 'warning'
          })
        } else if (valid) {
          this.listLoading = true
          if (this.form.dataScope === '自定义') {
            const depts = []
            this.form.depts.forEach(function(data) {
              const dept = { id: data }
              depts.push(dept)
            })
            this.form.depts = depts
          } else {
            this.form.depts = []
          }
          if (this.form.id === null) {
            crudRoles.add(this.form).then(response => {
              this.notifiSuccess('新增成功')
              this.closeForm()
              this.fetchData()
            }).catch(() => {
              this.notifiError('新增失败')
              this.closeForm()
              this.fetchData()
            })
          } else {
            crudRoles.edit(this.form).then(response => {
              this.notifiSuccess('编辑成功')
              this.saveMenu()
              this.closeForm()
              this.fetchData()
            }).catch(() => {
              this.notifiError('编辑失败')
              this.closeForm()
              this.fetchData()
            })
          }
        }
      })
    },
    deleteData() {
      crudRoles.del(this.ids).then(response => {
        this.row = JSON.parse(JSON.stringify(this.defaultForm))
        this.$refs.table.setCurrentRow()
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
    setTreeData(source, id) {
      const cloneData = JSON.parse(JSON.stringify(source)) // 对源数据深度克隆
      return cloneData.filter(father => { // 循环所有项，并添加children属性
        const branchArr = cloneData.filter(child => Number(father.id) === Number(child.fatherId)) // 返回每一项的子级数组
        branchArr.length > 0 ? father.children = branchArr : father.children = [] // 给父级添加一个children属性，并赋值
        return father.fatherId === id // 返回第一层
      })
    },
    resetData() {
      this.listLoading = true
      this.name = ''
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.row = JSON.parse(JSON.stringify(this.defaultForm))
      this.$refs.table.setCurrentRow()
      this.fetchData()
    },
    // 替换树形选择器
    normalizer(node) {
      return {
        label: node.name,
        value: node.id,
        key: node.id
      }
    },
    // 树形控件过滤
    filterNode(value, data) {
      if (!value) return true
      return value.indexOf(data.id) !== -1
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
    getSupDepts(depts) {
      const ids = []
      depts.forEach(dept => {
        ids.push(dept.id)
      })
      getDeptSuperior(ids).then(res => {
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
    getMenus() {
      getMenus({ enabled: true }).then(res => {
        this.menus = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupMenus(menus) {
      const ids = []
      menus.forEach(menu => {
        ids.push(menu.id)
      })
      getMenuSuperior(ids).then(res => {
        const date = res
        this.buildMenus(date)
        this.menus = date
      })
    },
    buildMenus(menus) {
      menus.forEach(data => {
        if (data.children) {
          this.buildMenus(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getMenus({ enabled: true, pid: parentNode.id }).then(res => {
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
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getDepts()
      }
    },
    handleSelectionChange(val) {
      const ids = []
      val.forEach(data => {
        ids.push(data.id)
      })
      this.ids = ids
    },
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.form.id, menus: [] }
      this.roleMenus.forEach(function(id) {
        const menu = { id: id }
        role.menus.push(menu)
      })
      this.$refs.table.setCurrentRow()
      crudRoles.editMenu(role).then(() => {
        this.notifiSuccess('编辑菜单成功')
      }).catch(() => {
        this.notifiError('编辑菜单失败')
      })
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
// .box-card {
//     margin: 15px;
//     width: 100%;
// }
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
<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: center;
  }
  /deep/ .vue-treeselect__multi-value{
    margin-bottom: 0;
  }
  /deep/ .vue-treeselect__multi-value-item{
    border: 0;
    padding: 0;
  }
</style>
