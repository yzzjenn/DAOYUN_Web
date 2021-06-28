<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>标准列表</span>
        <el-input
          v-model="name"
          placeholder="请输入"
          style="width: 150px;"
          @keyup.enter.native="search"
        />
        <el-button type="primary" style="margin-left: 10px" @click="search">查询</el-button>
      </div>
      <div>
        <el-table
          v-loading="listLoading"
          :data="tableData"
          style="width: 100%"
          row-key="id"
          border
          highlight-current-row
          :default-sort="{prop: 'date', order: 'ascending'}"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @current-change="handleCurrentChange"
          @sort-change="sortChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="date"
            label="日期"
            width="180"
            sortable="custom"
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="address"
            label="地址"
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
        <Pagination :message="total" :type="type" @func="getMsg" />
      </div>
    </el-card>
    <el-dialog
      title="编辑信息"
      :visible.sync="visible"
      width="50%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="22">
        <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
          <el-form-item label="日期" prop="date">
            <el-input v-model="form.date" placeholder="请输入日期" clearable />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入地址" clearable />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination/Pagination'
import { getList, updateList, addItem, deleteItem } from '@/web/api/list'
export default {
  components: { Pagination },
  data() {
    return {
      visible: false,
      type: 0,
      pagesize: 5,
      currentPage: 1,
      currentRow: null,
      form: {
        id: '',
        date: '',
        name: '',
        address: ''
      },
      index: 0,
      rules: {
        user: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      tableData: [{
        id: '',
        date: '',
        name: '',
        address: ''
      }],
      name: '',
      total: 0,
      order: 'ascending',
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.currentPage, this.pagesize, this.order, this.name).then(response => {
        this.tableData = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    search() {
      this.fetchData()
    },
    closeForm() {
      this.visible = false
    },
    update() {
      this.listLoading = true
      updateList(this.form).then(response => {
      })
      this.form.id = this.total + 1
      addItem(this.form).then(response => {
      })
      // this.index = this.form.index
      // delete this.form.index
      // this.$set(this.tableData, this.index, this.form)
      this.closeForm()
      this.fetchData()
    },
    handleEdit(index, row) {
      this.visible = true
      // index = this.tableData.findIndex(item => item.id === row.id)
      this.form = JSON.parse(JSON.stringify(row))
      // this.$set(this.form, 'index', index)
    },
    handleDelete(index, row) {
      row = JSON.parse(JSON.stringify(row))
      deleteItem(row).then(response => {
      })
      this.fetchData()
    },
    getMsg(data) {
      this.pagesize = data[0]
      this.currentPage = data[1]
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    sortChange(column) {
      this.order = column.order
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
    margin: 15px;
    width: 95%;
}
</style>
