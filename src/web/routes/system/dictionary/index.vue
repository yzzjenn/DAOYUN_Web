<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
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
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
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
    <el-dialog
      :title="dialogTitle"
      :visible.sync="visible"
      width="660px"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="23">
        <el-form ref="form" :inline="true" :model="form" label-width="80px">
          <el-form-item label="字典名" label-position="right" prop="name">
            <el-input v-model="form.name" style="width: 150px;" placeholder="请输入字典名" clearable />
          </el-form-item>
          <el-form-item label="字典描述" label-position="right">
            <el-input v-model="form.description" style="width: 200px;" placeholder="请输入描述" clearable />
          </el-form-item>
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
    <el-dialog
      title="编辑字典详情"
      :visible.sync="visibleLabel"
      width="40%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="23">
        <el-form ref="labelForm" :model="labelForm" label-width="80px">
          <el-form-item label="标签名" prop="label">
            <el-input v-model="labelForm.label" placeholder="请输入标签名" clearable />
          </el-form-item>
          <el-form-item label="标签值" prop="value">
            <el-input v-model="labelForm.value" placeholder="请输入标签值" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="dictSort">
            <el-input-number v-model="labelForm.dictSort" :min="1" :max="999" clearable />
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
    return {
      total: 0,
      name: '',
      dialogTitle: '',
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      tableLoading: true,
      labelLoading: false,
      formLoading: false,
      visible: false,
      visibleLabel: false,
      deleteVisible: false,
      tableData: [],
      lableData: [],
      formlableData: [],
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
        dict: { id: null }
      },
      form: null,
      labelForm: null,
      row: null,
      ids: []
    }
  },
  created() {
    this.fetchData()
    this.form = JSON.parse(JSON.stringify(this.defaultForm))
    this.row = JSON.parse(JSON.stringify(this.defaultForm))
    this.labelForm = JSON.parse(JSON.stringify(this.defaultlabelForm))
  },
  methods: {
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
    search() {
      if (this.name.length === 0) {
        this.$message('不能为空')
      } else {
        this.tableLoading = true
        this.currentPage = 1
        this.fetchData()
      }
    },
    resetData() {
      this.tableLoading = true
      this.currentPage = 1
      this.name = null
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.row = JSON.parse(JSON.stringify(this.defaultForm))
      this.labelForm = JSON.parse(JSON.stringify(this.defaultlabelForm))
      this.fetchData()
    },
    tableCurrentChange(val) {
      this.row = val
      this.labelLoading = true
      crudDict.get(val.name).then(response => {
        this.lableData = response.content
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
    handleAdd() {
      this.dialogTitle = '新增字典'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.formlableData = []
      this.visible = true
    },
    handleLabelAdd() {
      this.dialogTitle = '新增字典详情'
      this.labelForm = JSON.parse(JSON.stringify(this.defaultlabelForm))
      this.labelForm.dict.id = this.form.id
      this.visibleLabel = true
    },
    handleEdit(index, row) {
      this.dialogTitle = '编辑字典'
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.form = {
        id: row.id,
        name: row.name,
        description: row.description
      }
      this.formLoading = true
      crudDict.get(this.form.name).then(response => {
        this.formlableData = response.content
        this.formLoading = false
      })
      this.visible = true
    },
    handleLabelEdit(index, row) {
      this.dialogTitle = '编辑字典详情'
      this.labelForm = JSON.parse(JSON.stringify(row))
      this.visibleLabel = true
    },
    handleDelete(index, row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.ids = [this.form.id]
      this.deleteVisible = true
    },
    handleLabelDelete(index, row) {
      this.labelForm = JSON.parse(JSON.stringify(row))
      this.formLoading = true
      crudDict.del(this.labelForm.id).then(response => {
        crudDict.get(this.form.name).then(response => {
          this.formlableData = response.content
          this.formLoading = false
          this.notifiSuccess('删除成功')
        })
      }).catch(() => {
        this.notifiError('删除失败')
      })
    },
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
    updatelableData() {
      this.$refs['labelForm'].validate((valid) => {
        if (valid) {
          if (this.labelForm.id === null) {
            crudDict.add(this.labelForm).then(response => {
              this.formLoading = true
              crudDict.get(this.form.name).then(response => {
                this.formlableData = response.content
                this.formLoading = false
                this.notifiSuccess('新增成功')
              })
            }).catch(() => {
              this.notifiError('新增失败')
            })
          } else {
            crudDict.edit(this.labelForm).then(response => {
              this.formLoading = true
              crudDict.get(this.form.name).then(response => {
                this.formlableData = response.content
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
