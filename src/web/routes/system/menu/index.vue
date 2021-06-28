<template>
  <el-card class="box-card">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <span>菜单名：</span>
        <el-input
          v-model="query.blurry"
          clearable
          placeholder="输入菜单名称搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation />
      </div>
      <crudOperation />
    </div>
    <div>
      <el-table
        ref="table"
        v-loading="crud.loading"
        lazy
        :load="getMenus"
        :data="crud.data"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="id"
        @select="crud.selectChange"
        @select-all="crud.selectAllChange"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="title"
          label="菜单标题"
          width="155"
        />
        <el-table-column
          prop="icon"
          label="图标"
          width="60"
          align="center"
        >
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon ? scope.row.icon : ''" />
          </template>
        </el-table-column>
        <el-table-column
          prop="menuSort"
          label="排序"
          align="center"
        />
        <el-table-column
          prop="path"
          label="路由地址"
          align="center"
          width="150"
        />
        <el-table-column
          prop="component"
          label="组件路径"
          align="center"
          width="150"
        />
        <el-table-column prop="hidden" label="可见" width="75" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.hidden">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="160"
        >
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
      <!-- 添加和编辑菜单 -->
      <el-dialog
        append-to-body
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="580px"
      >
        <el-col :span="22">
          <el-form ref="form" :model="form" :rules="rules" label-position="right" size="small" label-width="80px">
            <el-form-item v-if="form.type.toString() !== '2'" label="菜单标题" prop="title">
              <el-input v-model="form.title" placeholder="菜单标题" />
            </el-form-item>
            <el-form-item v-if="form.type.toString() === '2'" label="按钮名称" prop="title">
              <el-input v-model="form.title" placeholder="按钮名称" style="width: 178px;" />
            </el-form-item>
            <el-form-item label="菜单类型">
              <el-radio-group v-model="form.type" size="mini">
                <el-radio-button :label="0">目录</el-radio-button>
                <el-radio-button :label="1">菜单</el-radio-button>
                <el-radio-button :label="2">按钮</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="!form.iframe && form.type.toString() === '1'" label="组件名称" prop="componentName">
              <el-input v-model="form.componentName" placeholder="匹配组件内Name字段" />
            </el-form-item>
            <el-form-item v-show="form.type.toString() !== '2'" label="菜单图标" prop="icon">
              <el-input v-model="form.icon" placeholder="选择图标">
                <template slot="prepend"><svg-icon :icon-class="form.icon ? form.icon : ''" /></template>
                <el-button slot="append" @click="iconVisible = true">选择</el-button>
              </el-input>
            </el-form-item>
            <el-form-item v-show="form.type.toString() === '1'" label="菜单缓存" prop="cache">
              <el-radio-group v-model="form.cache" size="mini">
                <el-radio-button label="true">是</el-radio-button>
                <el-radio-button label="false">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单可见">
              <el-radio-group v-model="form.hidden">
                <el-radio-button :label="false">是</el-radio-button>
                <el-radio-button :label="true">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="menuSort">
              <el-input-number v-model="form.menuSort" :min="1" :max="999" clearable />
            </el-form-item>
            <el-form-item v-show="form.type.toString() !== '2'" label="路由地址">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
            <el-form-item v-show="form.type.toString() === '1'" label="组件路径">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
            <el-form-item v-show="form.type.toString() !== '0'" label="权限">
              <el-input v-model="form.permission" placeholder="请输入权限" />
            </el-form-item>
            <el-form-item label="上级菜单" prop="pid">
              <treeselect
                v-model="form.pid"
                :options="menus"
                :load-options="loadMenus"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-form>
        </el-col>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          <el-button @click="crud.cancelCU">取消</el-button>
        </div>
      </el-dialog>
      <!-- 选择图标页面 -->
      <el-dialog
        title="选择图标"
        :visible.sync="iconVisible"
        width="600px"
        :show-close="false"
        :destroy-on-close="true"
      >
        <el-row>
          <el-col v-for="(item,index) in icons" :key="index" :span="3">
            <el-button @click="selectIcon(item)">
              <svg-icon :icon-class="item ? item : ''" />
            </el-button>
          </el-col>
        </el-row>
        <el-button slot="reference">选择</el-button>
      </el-dialog>
    </div>
  </el-card>
</template>
<script>
// eslint-disable-next-line no-unused-vars
// import Treeselect from '@/components/treeSelect.vue'
import crudMenu from '@/web/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@/components/Crud/crud'
import rrOperation from '@/components/Crud/RR.operation'
import crudOperation from '@/components/Crud/CRUD.operation'
import udOperation from '@/components/Crud/UD.operation'

const defaultForm = {
  id: null,
  title: null,
  menuSort: 999,
  path: null,
  component: null,
  componentName: null,
  iframe: false,
  roles: [],
  pid: 0,
  icon: null,
  cache: false,
  hidden: false,
  type: 0,
  permission: null
}

export default {
  name: 'Menu',
  components: {
    Treeselect,
    crudOperation,
    rrOperation,
    udOperation
  },
  cruds() {
    return CRUD({ title: '菜单', url: 'api/menus', crudMethod: { ...crudMenu }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      iconVisible: false,
      icons: [],
      menus: [],
      permission: {
        add: ['admin', 'menu:add'],
        edit: ['admin', 'menu:edit'],
        del: ['admin', 'menu:del']
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.readFile()
  },
  methods: {
    [CRUD.HOOK.afterToCU](crud, form) {
      this.menus = []
      if (form.id != null) {
        if (form.pid === null) {
          form.pid = 0
        }
        this.getSupDepts(form.id)
      } else {
        this.menus.push({ id: 0, label: '顶级菜单', children: null })
      }
    },
    getMenus(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudMenu.getMenus(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    getSupDepts(id) {
      crudMenu.getMenuSuperior(id).then(res => {
        const children = res.map(function(obj) {
          if (!obj.leaf && !obj.children) {
            obj.children = null
          }
          return obj
        })
        this.menus = [{ id: 0, label: '顶级菜单', children: children }]
      })
    },
    loadMenus({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudMenu.getMenusTree(parentNode.id).then(res => {
          parentNode.children = res.map(function(obj) {
            if (!obj.leaf) {
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
    // 选中图标
    selected(name) {
      this.form.icon = name
    },
    // 读取图标文件
    readFile() {
      const req = require.context('@/icons/svg', false, /\.svg$/)
      const requireAll = requireContext => requireContext.keys()
      const re = /\.\/(.*)\.svg/
      this.icons = requireAll(req).map(i => {
        return i.match(re)[1]
      })
    },
    selectIcon(icon) {
      this.form.icon = icon
      this.iconVisible = false
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
