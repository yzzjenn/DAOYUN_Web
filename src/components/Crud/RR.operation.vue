<!--搜索与重置-->
<template>
  <span>
    <el-button class="filter-item" type="primary" @click="crud.toQuery">查询</el-button>
    <el-button v-if="crud.optShow.reset" class="filter-item" @click="crud.resetQuery()">重置</el-button>
  </span>
</template>
<script>
import { crud } from '@/components/Crud/crud'
export default {
  mixins: [crud()],
  props: {
    itemClass: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>
