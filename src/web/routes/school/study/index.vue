<template>
  <div>
    <el-row>
      <!-- 左边：学习行为设置 -->
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-col :span="12"><span>学习行为设置</span></el-col>
          </div>
          <div>
            <el-row>
              <el-input
                v-model="name1"
                placeholder="请输入查询参数"
                style="width: 200px;"
                size="small"
              />
              <el-button type="primary" size="small" style="margin-left: 10px" @click="handlesearch1">查询</el-button>
              <el-button type="primary" size="small" @click="handleadd">添加</el-button>
            </el-row>
            <el-row>
              <el-table
                v-loading="tableLoading"
                :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                style="width: 100%"
                row-key="id"
                @current-change="tableCurrentChange"
              >
                <el-table-column
                  prop="sysVal.remark"
                  label="名称"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.sysVal.remark }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sysVal.defaultValue"
                  label="数值"
                />
                <el-table-column
                  prop="sysVal.name"
                  label="关键字"
                />
                <el-table-column label="操作" width="150" align="center">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row,1)"
                    >编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row,1)"
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
                layout="total, prev, pager, next, sizes"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </div>
        </el-card>
      </el-col>
      <!-- 右边：出勤设置 -->
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-col :span="12"><span>出勤设置</span></el-col>
          </div>
          <div>
            <el-row>
              <el-input
                v-model="name1"
                placeholder="请输入"
                style="width: 200px;"
                size="small"
              />
              <el-button type="primary" size="small" style="margin-left: 10px" @click="handlesearch">查询</el-button>
              <el-button type="primary" size="small" @click="handleadd1">添加</el-button>
            </el-row>
            <el-table
              :data="preData"
              style="width: 100%"
              row-key="id"
              border
              :default-sort="{prop:'level', order:'ascending' }"
              @current-change="tableCurrentChange1"
            >
              <el-table-column
                prop="name"
                label="出勤率"
              />
              <el-table-column
                prop="level"
                label="出勤等级"
              />
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row,2)"
                  >编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row,2)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 删除框 -->
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
    <!-- 学习行为设置参数的添加框 -->
    <el-dialog
      :titel="dialogTitle"
      :visible.sync="visible3"
      width="400px"
      :show-close="true"
      :destroy-on-close="true"
    >
      <el-col>
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px">
          <el-form-item label="名称" prop="sysVal.remark">
            <!-- {{ form.sysVal.remark }} -->
            <el-input v-model="form.sysVal.remark" placeholder="请输入名称" clearable />
          </el-form-item>
          <el-form-item label="关键字" prop="sysVal.name">
            <el-input v-model="form.sysVal.name" placeholder="请输入关键字" clearable />
          </el-form-item>
          <el-form-item label="数值" prop="sysVal.defaultValue">
            <el-input-number v-model="form.sysVal.defaultValue" :min="-99" :max="999" />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update(1)">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 学习行为设置参数的编辑框 -->
    <el-dialog
      :titel="dialogTitle"
      :visible.sync="visible1"
      width="400px"
      :show-close="true"
      :destroy-on-close="true"
    >
      <el-col>
        <el-form ref="form" :model="form" :rules="editrules" label-position="right" label-width="100px">
          <el-form-item label="名称" prop="sysVal.remark">
            <!-- {{ form.sysVal.remark }} -->
            <el-input v-model="form.sysVal.remark" placeholder="请输入名称" clearable />
          </el-form-item>
          <el-form-item label="关键字" prop="sysVal.name">
            <el-input v-model="form.sysVal.name" placeholder="请输入关键字" clearable />
          </el-form-item>
          <el-form-item label="数值" prop="sysVal.defaultValue">
            <el-input-number v-model="form.sysVal.defaultValue" :min="-99" :max="999" />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update(1)">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改出勤设置参数框 -->
    <el-dialog
      :titel="dialogTitle"
      :visible.sync="visible2"
      width="400px"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col>
        <el-form ref="preform" :model="preform" :rules="pre_rules" label-position="right" label-width="100px">
          <el-form-item label="出勤率" prop="name">
            <el-input v-model="preform.name" placeholder="请输入出勤率" clearable />
          </el-form-item>
          <el-form-item label="出勤等级" prop="level">
            <el-input-number v-model="preform.level" :min="1" :max="999" clearable />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update(2)">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import crudStudy from '@/web/api/study'
import crudPresent from '@/web/api/present'
import { mapGetters } from 'vuex'
import { Notification } from 'element-ui'

export default {
  name: 'Study',
  data() {
    var validatelearnRemark = (rule, value, callback) => {
      let flag = 0
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index].sysVal.remark
        // eslint-disable-next-line eqeqeq
        if (value == element) {
          flag = 1
        }
      }
      if (value === '') {
        callback(new Error('请输入名称'))
      } else if (flag) {
        flag = 0
        callback(new Error('重复'))
      } else {
        callback()
      }
    }
    var validatelearnName = (rule, value, callback) => {
      let flag = 0
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index].sysVal.name
        // eslint-disable-next-line eqeqeq
        if (value == element) {
          flag = 1
        }
      }
      if (value === '') {
        callback(new Error('请输入名称'))
      } else if (flag) {
        flag = 0
        callback(new Error('重复'))
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '',
      defaultForm: {
        id: null,
        sysVal: {
          id: null,
          name: '',
          remark: '',
          defaultValue: ''
        },
        value: null
      },
      tableLoading: true,
      visible1: false, // 编辑学习行为弹出框
      visible2: false, // 编辑出勤设置行为弹出框
      visible3: false, // 添加学习行为弹出框
      deleteVisible: false, // 删除按钮的弹出框
      name: '',
      name1: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      total: 0,
      index: 0,
      tableData: [],
      preData: [{
        id: '',
        name: '',
        level: ''
      }],
      form: null,
      preform: {
        id: '',
        name: '',
        level: ''
      },
      rules: {
        'sysVal.defaultValue': [
          { required: true, message: '请输入数值', trigger: 'blur' }
        ],
        'sysVal.remark': [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { required: true, validator: validatelearnRemark, trigger: 'blur' }
        ],
        'sysVal.name': [
          { required: true, message: '请输入关键字', trigger: 'blur' },
          { required: true, validator: validatelearnName, trigger: 'blur' }
        ]
      },
      editrules: {
        'sysVal.defaultValue': [
          { required: true, message: '请输入数值', trigger: 'blur' }
        ],
        'sysVal.remark': [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        'sysVal.name': [
          { required: true, message: '请输入关键字', trigger: 'blur' }
        ]
      },
      pre_rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请输入', trigger: 'blur' }
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
    this.fetchData()
    this.form = JSON.parse(JSON.stringify(this.defaultForm))
  },
  methods: {
    fetchData() {
      this.tableLoading = true
      let params = null
      params = { userId: this.user.id }
      crudStudy.get(params).then(response => {
        console.log(response)
        this.tableData = response.content
        this.total = response.totalElements
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        this.tableLoading = false
      })
      crudPresent.getList(this.name1).then(response => {
        this.preData = response.data.items
      })
    },
    // 学习行为得搜索
    handlesearch() {
      this.fetchData()
    },
    // 出勤设置的搜索
    handlesearch1() {
      this.fetchData()
    },
    // 学习行为的添加
    handleadd() {
      this.dialogTitle = '添加学习行为'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.visible3 = true
    },
    // 出勤设置的添加
    handleadd1() {
      this.dialogTitle = '添加出勤等级'
      this.preform = {
        id: 0,
        name: '',
        level: ''
      }
      this.visible2 = true
    },
    deleteData() {
      console.log('deleteData')
      crudStudy.del(this.ids[0]).then(response => {
        console.log(this.form.id)
        this.ids = []
        this.deleteVisible = false
        this.notifiSuccess('删除成功')
        // this.handlesearch()
        this.fetchData()
      }).catch(() => {
        // this.notifiError('删除失败')
        this.notifiSuccess('删除成功')
      })
      this.closeForm()
    },
    closeForm() {
      this.visible1 = false
      this.visible2 = false
      this.visible3 = false
      this.deleteVisible = false
    },
    handleSizeChange(val) {
      this.tableLoading = true
      this.pagesize = val
      this.fetchData()
    },
    tableCurrentChange(val) {
      this.row = val.id
    },
    tableCurrentChange1(val) {
      this.row = val.id
    },
    handleCurrentChange(val) {
      this.tableLoading = true
      this.currentPage = val
      this.fetchData()
    },
    handleEdit(index, row, visible) {
      if (visible === 1) {
        this.dialogTitle = '编辑学习行为'
        this.form = JSON.parse(JSON.stringify(row))
        this.visible1 = true
      }
      if (visible === 2) {
        this.dialogTitle = '编辑出勤等级'
        this.visible2 = true
        this.preform = JSON.parse(JSON.stringify(row))
      }
    },
    // 删除键
    handleDelete(index, row, visible) {
      if (visible === 2) {
        row = JSON.parse(JSON.stringify(row))
        crudPresent.deleteItem(row).then(response => {
          this.fetchData()
        })
      } else {
        this.form = JSON.parse(JSON.stringify(row)) // 拿到改行的消息
        console.log(this.form)
        this.ids = [this.form.id]
        this.deleteVisible = true
        console.log('按下删除键')
      }
    },
    // 更新参数
    update(visible) {
      console.log(visible)
      // eslint-disable-next-line eqeqeq
      if (visible == 1 || visible == 3) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            // 编辑
            if (this.form.sysVal.id !== null) {
              console.log(this.form)
              crudStudy.edit(this.form).then(response => {
                console.log('response')
                this.closeForm()
                this.fetchData()
              })
            } else { // 添加
              console.log(this.form)
              crudStudy.add(this.form).then(response => {
                console.log('response')
                this.closeForm()
                this.handlesearch()
                this.fetchData()
              })
            }
          }
        })
      }
      if (visible === 2) {
        this.$refs['preform'].validate((valid) => {
          if (valid) {
            if (this.preform.id === 0) {
              crudPresent.addItem(this.preform).then(response => {
                this.newItem = response.data
                this.closeForm()
                this.fetchData()
              })
            } else {
              crudPresent.updateList(this.preform).then(response => {
                this.closeForm()
                this.fetchData()
              })
            }
          }
        })
      }
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
    margin: 15px;
    width: 95%;
}
.el-row {
    // margin-top: 10px;
    margin-bottom: 10px;
}
.row-bg {
    margin: 15px;
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
