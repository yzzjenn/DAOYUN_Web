<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <!-- 卡片头部 -->
          <div>
            <el-row>
              <span>字典名：</span>
              <el-input
                v-model="name"
                placeholder="请输入字典名或描述"
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
          <!-- 卡片中部 -->
          <div>
            <el-row>
              <el-table
                v-loading="tableLoading"
                :data="tableData"
                style="width: 100%"
                row-key="id"
                lazy
                highlight-current-row
                @current-change="tableCurrentChange"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="50"
                />
                <el-table-column
                  prop="name"
                  label="字典名"
                />
                <el-table-column
                  prop="description"
                  label="描述"
                />
                <el-table-column label="操作" width="150">
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
            <!-- 底部 分页-->
            <el-row>
              <el-pagination
                background
                :current-page="currentPage"
                :page-sizes="pagesizes"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </div>
        </el-card>
      </el-col>
      <!-- 右侧卡片 -->
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-col :span="12"><span>字典详情</span></el-col>
          </div>
          <div>
            <span v-if="row.id === null || row.id < 1">点击左侧字典可以查看详情</span>
            <el-table
              v-if="row.id !== null && row.id > 0"
              ref="singleTable"
              v-loading="labelLoading"
              :data="lableData"
              style="width: 100%"
              row-key="id"
              lazy
              :default-sort="{prop: 'dictSort', order: 'ascending'}"
            >
              <el-table-column label="所属字典">
                {{ row.name }}
              </el-table-column>
              <el-table-column
                prop="label"
                label="标签名"
              />
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
    <!-- 添加字典 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      width="660px"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="23">
        <el-form ref="form" :inline="true" :rules="dicrules" :model="form" label-width="80px">
          <el-form-item label="字典名" label-position="right" prop="name">
            <el-input v-model="form.name" style="width: 150px;" placeholder="请输入字典名" clearable />
          </el-form-item>
          <el-form-item label="字典描述" label-position="right">
            <el-input v-model="form.description" style="width: 200px;" placeholder="请输入描述" clearable />
          </el-form-item>
          <!-- 如果该字典不是新加的，则form.id 有值，可以加载它的详情 -->
          <el-form-item v-if="form.id !== null" label="字典详情" label-position="top">
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
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update()">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 字典详情里面的：添加和编辑 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visibleLabel"
      width="40%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="23">
        <el-form ref="labelForm" :model="labelForm" :rules="labelAddOrEdit?editlableDetailrulesadd:editlableDetailrulesedit" label-width="80px">
          <el-form-item label="标签名" prop="label">
            <el-input v-model="labelForm.label" placeholder="请输入标签名" clearable />
          </el-form-item>
          <el-form-item label="标签值" prop="value">
            <el-input v-model="labelForm.value" placeholder="请输入标签值" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="dictSort">
            <el-input-number v-model="labelForm.dictSort" :min="1" :max="999" clearable />
          </el-form-item>
          <el-form-item label="默认值?" prop="isdefault">
            <el-radio v-model="labelForm.isdefault" label="是">是</el-radio>
            <el-radio v-model="labelForm.isdefault" label="否">否</el-radio>
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatelableData()">确 定</el-button>
        <el-button @click="visibleLabel = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import crudDict from '@/web/api/dictionary'
import crudDicts from '@/web/api/dicts'
import { Notification } from 'element-ui'

export default {
  name: 'Dictionary',
  data() {
    var validatelableValueAdd = (rule, value, callback) => {
      const n = this.formlableData.length
      var flag = 0
      for (let index = 0; index < n; index++) {
        if (value === this.formlableData[index].value) {
          flag = 1
        }
      }
      if (flag) {
        flag = 0
        callback(new Error('标签值重复'))
      } else {
        callback()
      }
    }
    var validatelableValueEdit = (rule, value, callback) => {
      const n = this.formlableData.length
      for (let index = 0; index < n; index++) {
        // eslint-disable-next-line eqeqeq
        if (this.formlableData[index].value != this.tempvalue && value == this.formlableData[index].value) {
          callback(new Error('标签值重复'))
        }
      }
      callback()
    }
    return {
      total: 0,
      name: '', // 搜索框关键字
      dialogTitle: '',
      labelAddOrEdit: true,
      tempvalue: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      tableLoading: true, // 加载表格的加载动画
      labelLoading: false,
      formLoading: false,
      visible: false, // 添加按钮的编辑页面
      visibleLabel: false, // 编辑按钮的编辑页面
      deleteVisible: false, // 删除按钮的弹出框
      tableData: [],
      lableData: [],
      formlableData: [], // 编辑弹出框里面的字典详细表格数据
      defaultForm: {
        id: null,
        name: '',
        description: ''
      },
      defaultlabelForm: {
        id: null,
        label: '',
        value: '',
        dictSort: 0,
        dict: { id: null },
        isdefault: '是'
      },
      form: null, // 弹出框的表格数据
      labelForm: null,
      row: null,
      ids: [],
      dicrules: {
        // 字典名验证
        name: [{ required: true, message: '请输入字典名', trigger: 'blur' }]
      },
      editlableDetailrulesadd: {
        value: [{ required: true, message: '请输入标签值', trigger: 'blur' },
          { required: true, validator: validatelableValueAdd, trigger: 'blur' }]
      },
      editlableDetailrulesedit: {
        value: [{ required: true, message: '请输入标签值', trigger: 'blur' },
          { required: true, validator: validatelableValueEdit, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
    this.form = JSON.parse(JSON.stringify(this.defaultForm))
    this.row = JSON.parse(JSON.stringify(this.defaultForm))
    this.labelForm = JSON.parse(JSON.stringify(this.defaultlabelForm))
  },
  methods: {
    // 下拉框
    styleChange(val) {
      // eslint-disable-next-line eqeqeq
      if (val == 0) {
        this.isShow1 = true
        this.isShow2 = false
      } else {
        this.isShow1 = false
        this.isShow2 = true
      }
      var data = {}
      this.outfallType = val
      data.outfallType = this.outfallType
      // eslint-disable-next-line no-undef
      getRealDataV2(data).then(val => {
        if (val.code === 200) {
          this.newData(val)
        }
      })
    },
    // 获取表格数据
    fetchData() {
      this.tableLoading = true
      this.ids = []
      const page = this.currentPage - 1
      const size = this.pagesize
      const sort = 'id,desc'
      const blurry = this.name
      crudDicts.getDicts(page, size, sort, blurry).then(response => {
        this.tableData = response.content
        this.total = response.totalElements
        if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
          this.currentPage -= 1
          this.fetchData()
        }
        this.tableLoading = false
      })
    },
    // 搜索框
    search() {
      if (this.name.length === 0) {
        this.$message('不能为空')
      } else {
        this.tableLoading = true
        crudDicts.search(this.name).then(response => {
          console.log(response)
          this.tableData = response
          this.tableLoading = false
        })
      }
    },
    // 重置
    resetData() {
      this.tableLoading = true
      this.currentPage = 1
      this.name = null
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.row = JSON.parse(JSON.stringify(this.defaultForm))
      this.labelForm = JSON.parse(JSON.stringify(this.defaultlabelForm))
      this.fetchData()
    },
    // 查看详情 val 是点击该行的对象
    tableCurrentChange(val) {
      this.row = val
      this.labelLoading = true
      crudDict.get(val.name).then(response => {
        this.lableData = response
        this.labelLoading = false
      })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.row = JSON.parse(JSON.stringify(this.defaultForm))
      this.fetchData()
    },
    // 新增字典
    handleAdd() {
      this.dialogTitle = '新增字典'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.formlableData = []
      this.visible = true
    },
    // 编辑详情里面的字典详情的添加
    handleLabelAdd() {
      this.labelAddOrEdit = true
      this.dialogTitle = '新增字典详情'
      this.labelForm = JSON.parse(JSON.stringify(this.defaultlabelForm))
      this.labelForm.dict.id = this.form.id
      this.visibleLabel = true
    },
    // 编辑字典
    handleEdit(index, row) {
      this.dialogTitle = '编辑字典'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.form = {
        id: row.id,
        name: row.name,
        description: row.description
      }
      this.formLoading = true // 编辑详情里面的字典详情加载动画
      crudDict.get(this.form.name).then(response => {
        this.formlableData = response
        this.formLoading = false
      })
      this.visible = true
    },
    // 编辑详情里面的字典详情的编辑
    handleLabelEdit(index, row) {
      this.labelAddOrEdit = false
      this.tempvalue = row.value
      console.log('this.tempvalue' + this.tempvalue)
      this.dialogTitle = '编辑字典详情'
      this.labelForm = JSON.parse(JSON.stringify(row))
      this.visibleLabel = true
    },
    // 字典删除，用来显示删除提示框
    handleDelete(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.ids = [this.form.id]
      this.deleteVisible = true // 删除提示框
    },
    // 编辑详情里面的字典详情的删除
    handleLabelDelete(index, row) {
      this.labelForm = JSON.parse(JSON.stringify(row))
      this.formLoading = true
      crudDict.del(this.labelForm.id).then(response => {
        crudDict.get(this.form.name).then(response => {
          this.formlableData = response
          this.formLoading = false
          this.notifiSuccess('删除成功')
        })
      }).catch(() => {
        this.notifiError('删除失败')
      })
    },
    // 字典的编辑和增加
    update() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          if (this.form.id === null) {
            crudDicts.add(this.form).then(response => {
              this.notifiSuccess('新增成功')
              this.closeForm()
              this.fetchData()
            }).catch(() => {
              this.notifiError('新增失败')
            })
          } else {
            crudDicts.edit(this.form).then(response => {
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
    // 字典详情里面的更新操作
    updatelableData() {
      this.$refs['labelForm'].validate((valid) => {
        if (valid) {
          // 新增操作
          if (this.labelForm.id === null) {
            crudDict.add(this.labelForm).then(response => {
              this.formLoading = true
              this.labelLoading = true
              crudDict.get(this.form.name).then(response => {
                this.formlableData = response
                this.lableData = response
                this.formLoading = false
                this.labelLoading = false
                this.notifiSuccess('新增成功')
              })
            }).catch(() => {
              this.notifiError('新增失败')
            })
          } else { // 编辑操作
            crudDict.edit(this.labelForm).then(response => {
              this.formLoading = true
              crudDict.get(this.form.name).then(response => {
                this.formlableData = response
                this.lableData = response
                this.labelLoading = false
                this.formLoading = false
                this.notifiSuccess('编辑成功')
              })
            }).catch(() => {
              this.notifiError('编辑失败')
            })
          }
          this.visibleLabel = false
        }
      })
    },

    deleteData() {
      crudDicts.del(this.ids).then(response => {
        this.ids = []
        this.deleteVisible = false
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.row = JSON.parse(JSON.stringify(this.defaultForm))
        this.notifiSuccess('删除成功')
        this.fetchData()
      }).catch(() => {
        this.notifiError('删除失败')
      })
      this.closeForm()
    },
    closeForm() {
      if (this.form.id !== null) {
        this.labelLoading = true
        crudDict.get(this.form.name).then(response => {
          this.lableData = response.content
          this.labelLoading = false
        })
      } else {
        this.lableData = []
      }
      this.ids = []
      this.row = JSON.parse(JSON.stringify(this.form))
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.visible = false
      this.deleteVisible = false
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
.box-card {
    // margin: 15px;
    width: 97%;
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
.table-input {
    width: 50;
}
</style>
