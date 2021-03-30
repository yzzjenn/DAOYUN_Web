<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-col :span="12"><span>学习行为设置</span></el-col>
          </div>
          <div>
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
                  label="参数"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.sysVal.remark }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="值"
                />
                <el-table-column label="操作" width="100" align="center">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      @click="handleEdit(scope.$index, scope.row,1)"
                    >编辑</el-button>
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
              <el-button type="primary" size="small" style="margin-left: 10px" @click="handlesearch1">查询</el-button>
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
    <el-dialog
      :titel="dialogTitle"
      :visible.sync="visible1"
      width="400px"
      :show-close="true"
      :destroy-on-close="true"
    >
      <el-col>
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px">
          <el-form-item label="参数" prop="sysVal.remark">
            {{ form.sysVal.remark }}
          </el-form-item>
          <el-form-item label="值" prop="score">
            <el-input-number v-model="form.value" :min="-99" :max="99" />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update(1)">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
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
    return {
      dialogTitle: '',
      defaultForm: {
        id: null,
        sysVal: {
          id: null,
          remark: ''
        },
        value: null
      },
      tableLoading: true,
      visible1: false,
      visible2: false,
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
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
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
    handlesearch() {
      this.fetchData()
    },
    handlesearch1() {
      this.fetchData()
    },
    handleadd() {
      this.dialogTitle = '添加学习行为'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.visible1 = true
    },
    handleadd1() {
      this.dialogTitle = '添加出勤等级'
      this.preform = {
        id: 0,
        name: '',
        level: ''
      }
      this.visible2 = true
    },
    closeForm() {
      this.visible1 = false
      this.visible2 = false
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
    handleDelete(index, row, visible) {
      if (visible === 2) {
        row = JSON.parse(JSON.stringify(row))
        crudPresent.deleteItem(row).then(response => {
          this.fetchData()
        })
      }
    },
    update(visible) {
      if (visible === 1) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.id !== null) {
              crudStudy.edit(this.form).then(response => {
                this.closeForm()
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
