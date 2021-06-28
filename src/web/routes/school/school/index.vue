<template>
  <el-card class="box-card">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <span>院校名：</span>
        <el-input
          v-model="query.name"
          clearable
          placeholder="输入院校名称搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation />
      </div>
      <crudOperation />
    </div>
    <el-dialog
      append-to-body
      :title="crud.status.title"
      :visible.sync="crud.status.cu > 0"
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      width="500px"
    >
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="院校名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="院校排序" prop="deptSort">
          <el-input-number
            v-model.number="form.deptSort"
            :min="0"
            :max="999"
          />
        </el-form-item>
        <el-form-item label="是否学校">
          <el-radio-group v-model="form.isTop" style="width: 140px">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 学院需要选择它所在的学校 istop  == 1 说明是学校：即根-->
        <el-form-item v-if="form.isTop === '0'" style="margin-bottom: 0;" label="上级院校" prop="pid">
          <treeselect
            v-model="form.pid"
            :load-options="loadDepts"
            :options="depts"
            style="width: 370px;"
            placeholder="选择上级类目"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        <el-button @click="crud.cancelCU">取消</el-button>
      </div>
    </el-dialog>
    <el-table
      ref="table"
      v-loading="crud.loading"
      lazy
      :load="getDeptDatas"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="crud.data.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      row-key="id"
      @row-click="sohd"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="排序" prop="deptSort" />
      <el-table-column prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
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
    <Pagination :message="crud.page.total" :type="type" @func="getMsg" />
  </el-card>
</template>

<script>
import crudDept from '@/web/api/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'
import Pagination from '@/components/Pagination/Pagination'

const defaultForm = {
  id: null,
  name: null,
  isTop: '1',
  subCount: 0,
  pid: null,
  deptSort: 999,
  enabled: 'true'
}
export default {
  name: 'School',
  components: {
    Treeselect,
    crudOperation,
    rrOperation,
    udOperation,
    Pagination
  },
  cruds() {
    console.log('1.获取数据')
    // 扩展运算符(…)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中
    // crudMethod: { ...crudDept } 这里把crudDept里面的东西复制（全选复制）到crudMethod（全选删除后被复制）中，相同的覆盖（和文件复制（同名文件覆盖）道理一样）。
    return CRUD({ title: '院校', url: 'api/dept', crudMethod: { ...crudDept }})
  },
  //  mixins：
  //        父组件 + 子组件 >>> new父组件
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  // dicts: ['dept_status'],
  data() {
    return {
      pagesize: 5,
      currentPage: 1,
      type: 0,
      depts: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        deptSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  methods: {
    // 点击改行出现数据
    sohd(row, column, event) {
      // console.log(row)
    },
    // 获取下一级
    getDeptDatas(tree, treeNode, resolve) {
      console.log('加载了load')
      const params = { pid: tree.id }
      setTimeout(() => {
        // 获取子目录（这里是根据根目录的id进行查询子目录）
        crudDept.getDepts(params).then(res => {
          // console.log(res)
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    // from:即选中的行里面from的值，这里crud里面是CRUD对象，crud.data存放学校数据，即一级目录
    // pid ： parent_id（=id 学校的id） ，如院有pid属性，
    [CRUD.HOOK.afterToCU](crud, form) {
      // 这里主要是给单选框进行默认值操作
      console.log(form.id)
      if (form.pid !== null) {
        form.isTop = '0'
      } else if (form.id === null) {
        form.isTop = '1'
      }
      form.enabled = `${form.enabled}`
      if (form.id != null) {
        this.getSupDepts(form.id)
      } else {
        this.getDepts()
      }
    },
    getSupDepts(id) {
      crudDept.getDeptSuperior(id).then(res => {
        const date = res.content
        console.log(JSON.stringify(date))
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
    // 获取学校，即一级目录，这里获取了全部的学校
    // res.content （对象数组）采用 map(遍历的要求) 方法进行遍历
    // 这里map的功能是遍历每一个元素（学校），如果它有子代（即学院）则对这个元素对象添加children属性，并初始化为null;否则不做修改
    getDepts() {
      crudDept.getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
        console.log(this.depts)
      })
    },
    // 获取弹窗内院校数据
    loadDepts({ action, parentNode, callback }) {
      console.log('loadDepts')
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudDept.getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (this.form.pid !== null && this.form.pid === this.form.id) {
        this.$message({
          message: '上级院校不能为空',
          type: 'warning'
        })
        return false
      }
      if (this.form.isTop === '1') {
        this.form.pid = null
      }
      return true
    },
    // 获取分页参数
    getMsg(data) {
      this.pagesize = data[0]
      this.currentPage = data[1]
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .vue-treeselect__control, /deep/ .vue-treeselect__placeholder, /deep/ .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: center;
  }
</style>
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
</style>
