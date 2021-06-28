<template>
  <div>
    <el-button :loading="crud.status.cu === 2" :disabled="disabledEdit" size="mini" @click="crud.toEdit(data)">编辑</el-button>
    <el-button slot="reference" :disabled="disabledDle" type="danger" size="mini" @click="deleteVisible = true">删除</el-button>
    <!-- <el-popover v-model="pop" placement="top" width="180" trigger="manual" @show="onPopoverShow" @hide="onPopoverHide">
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="doCancel">取消</el-button>
        <el-button :loading="crud.dataStatus[crud.getDataId(data)].delete === 2" type="primary" size="mini" @click="crud.doDelete(data)">确定</el-button>
      </div>
      <el-button slot="reference" :disabled="disabledDle" type="danger" size="mini" @click="toDelete">删除</el-button>
    </el-popover> -->
    <div style="display: inline-block;">
      <el-dialog
        title="确认删除"
        :visible.sync="deleteVisible"
        width="400px"
        :append-to-body="true"
        :show-close="false"
        :destroy-on-close="true"
      >
        <span>确认删除选中项？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="crud.doDelete(data)">确 定</el-button>
          <el-button @click="doCancel">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import CRUD, { crud } from '@/components/Crud/crud'
export default {
  mixins: [crud()],
  props: {
    data: {
      type: Object,
      required: true
    },
    disabledEdit: {
      type: Boolean,
      default: false
    },
    disabledDle: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: '确定删除本条数据吗？'
    }
  },
  data() {
    return {
      deleteVisible: false,
      pop: false
    }
  },
  methods: {
    doCancel() {
      this.pop = false
      this.deleteVisible = false
      this.crud.cancelDelete(this.data)
    },
    toDelete() {
      this.pop = true
    },
    [CRUD.HOOK.afterDelete](crud, data) {
      if (data === this.data) {
        this.pop = false
        this.deleteVisible = false
      }
    },
    onPopoverShow() {
      setTimeout(() => {
        document.addEventListener('click', this.handleDocumentClick)
      }, 0)
    },
    onPopoverHide() {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    handleDocumentClick(event) {
      this.pop = false
      this.deleteVisible = false
    }
  }
}
</script>
