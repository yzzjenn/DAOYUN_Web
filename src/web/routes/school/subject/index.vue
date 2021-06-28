<template>
  <div class="app-container">
    <el-card class="box-card">
      <div>
        <el-row>
          <span>课程名：</span>
          <el-input
            v-model="name"
            placeholder="请输入课程"
            style="width: 200px;"
            @keyup.enter.native="search"
          />
          <el-button type="primary" style="margin-left: 10px" @click="search">查询</el-button>
          <el-button @click="resetData">重置</el-button>
        </el-row>
        <el-row>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          <el-button :disabled="ids.length === 0" type="danger" size="small" @click="deleteVisible = true">删除</el-button>
        </el-row>
      </div>
      <div>
        <el-row>
          <!-- 数据表格 -->
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="tableData"
            style="width: 100%"
            row-key="id"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="id"
              label="课程编号"
            />
            <el-table-column
              prop="courseName"
              label="课程名"
              align="center"
            />
            <el-table-column
              prop="college.name"
              min-width="140px"
              label="归属院校"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.school }}
                {{ scope.row.college.name }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="170">
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
        <!-- 分页 -->
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
      <!-- 添加和编辑框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="visible"
        width="800px"
        :show-close="false"
        :destroy-on-close="true"
      >
        <el-col :span="22">
          <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
            <el-form-item label="课程名" prop="courseName">
              <el-input v-model="form.courseName" style="width: 370px;" />
            </el-form-item>
            <el-form-item label="院校">
              <treeselect
                v-model="form.college.id"
                :options="colleges"
                :load-options="loadColleges"
                :disable-branch-nodes="true"
                style="width: 370px"
                placeholder="选择院校"
              />
            </el-form-item>
            <!-- 课程详情 -->
            <!-- <el-form-item v-if="form.id !== null" label="字典详情" label-position="top">
              <el-table
                ref="lableList"
                v-loading="formLoading"
                :data.sync="formlableData"
                style="width: 630px"
                row-key="id"
                lazy
                :default-sort="{prop: 'dictSort', order: 'ascending'}"
              >
                <el-table-column label="所属字典">
                  {{ form.name }}
                </el-table-column>
                <el-table-column
                  prop="label"
                  label="标签名"
                >
                  <template slot-scope="scope">
                    <span v-show="!scope.row.inputShow">{{ scope.row.label }}</span>
                    <el-input v-show="scope.row.inputShow" v-model="scope.row.label" class="table-input" placeholder="请输入标签名" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="标签值"
                />
                <el-table-column
                  prop="dictSort"
                  label="排序"
                  sortable
                />
                <el-table-column
                  prop="isdefault"
                  label="是否默认值"
                />
                <el-table-column label="操作" width="150">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleLabelEdit(scope.$index, scope.row)"
                    >编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleLabelDelete(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="handleLabelAdd">添加</el-button>
            </el-form-item> -->
          </el-form>
        </el-col>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="update">确 定</el-button>
          <el-button @click="closeForm">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 删除框 -->
      <el-dialog
        title="删除选中课程"
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
import crudClass from '@/web/api/class'
import { getDepts, getDeptSuperior } from '@/web/api/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { Notification } from 'element-ui'

export default {
  name: 'Subject',
  components: { Treeselect },
  data() {
    return {
      addLoading: false,
      editLoading: false,
      dialogTitle: '',
      visible: false,
      disabled: true,
      deleteVisible: false,
      total: 0,
      name: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      listLoading: true,
      tableData: [],
      defaultForm: {
        id: null,
        className: null,
        courseName: null,
        courseCode: null,
        enabled: 'true',
        joinPermission: 'true',
        studentCount: '0',
        teacherName: 'default',
        userName: '123',
        college: { id: null },
        signCount: '0',
        semester: '2019-2020-1',
        signHistory: []
      },
      form: null,
      row: null,
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      colleges: [],
      ids: [],
      fetchOrSearch: true
    }
  },
  created() {
    this.fetchData()
    this.form = JSON.parse(JSON.stringify(this.defaultForm))
    this.row = JSON.parse(JSON.stringify(this.defaultForm))
  },
  methods: {
    fetchData() {
      this.fetchOrSearch = true
      this.ids = []
      this.listLoading = true
      crudClass.getPart().then(response => {
        const content = response
        const res = new Map()
        // 过滤操作，用来过滤重复的课程名与学院id
        this.tableData = content.filter((arr) => {
          let value = [arr.courseName, arr.college.id]
          value = value.toString()
          // 去重，如果课程名和学院id在res里面不存在，则返回
          return !res.has(value) && res.set(value, 1)
        })
        this.total = this.tableData.length
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        // 这里slice(start,end)[start,end)
        this.tableData = this.tableData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize)
        this.listLoading = false
      })
    },
    search() {
      this.fetchOrSearch = false
      if (this.name.length === 0) {
        this.$message('不能为空')
      } else {
        this.listLoading = true
        const page = this.currentPage - 1
        const size = this.pagesize
        const blurry = this.name // 搜索框的搜索关键字
        let params = null
        params = { page, size, blurry }
        crudClass.get(params).then(response => {
          this.tableData = response.content
          console.log(JSON.stringify(response.content))
          this.total = response.totalElements
        })
        this.listLoading = false
      }
    },
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.className = this.form.courseName
          this.listLoading = true
          if (this.form.id === null) {
            crudClass.add(this.form).then(response => {
              this.notifiSuccess('新增成功')
              this.closeForm()
              this.fetchData()
            }).catch(() => {
              this.notifiError('新增失败')
            })
          } else {
            crudClass.edit(this.form).then(response => {
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
      crudClass.del(this.ids).then(response => {
        this.row = JSON.parse(JSON.stringify(this.defaultForm))
        this.$refs.table.setCurrentRow()
        this.notifiSuccess('删除成功')
        this.fetchData()
      }).catch(() => {
        this.notifiError('删除失败')
      })
      this.closeForm()
      this.closeForm()
      this.fetchData()
    },
    closeForm() {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.ids = []
      this.visible = false
      this.deleteVisible = false
    },
    resetData() {
      this.listLoading = true
      this.currentPage = 1
      this.name = ''
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      if (this.fetchOrSearch) {
        this.fetchData()
      } else {
        this.search()
      }
    },
    handleAdd() {
      this.dialogTitle = '添加课程'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.getDepts()
      this.visible = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑课程'
      this.form = JSON.parse(JSON.stringify(row))
      // {"id":50,"courseName":"工程训练","school":"开发者","college":{"id":57,"name":"15小组"}}
      console.log('当前的row=' + JSON.stringify(row))
      this.getSupDepts(this.form.college.id)
      this.visible = true
    },
    handleDelete(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.ids = [this.form.id]
      this.deleteVisible = true
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.colleges = res.content.map(function(obj) {
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
        console.log('getSupDepts = ' + JSON.stringify(res.content))
        this.buildColleges(date)
        this.colleges = date
      })
    },
    buildColleges(depts) {
      depts.forEach(data => {
        if (data.children) {
          this.buildColleges(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    loadColleges({ action, parentNode, callback }) {
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
    handleSelectionChange(val) {
      const ids = []
      val.forEach(data => {
        ids.push(data.id)
      })
      this.ids = ids
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
//     width: 95%;
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
