<template>
  <el-pagination
    style="margin-top: 10px"
    background
    :pager-count="5"
    :current-page="currentPage"
    :page-sizes="pagesizes"
    :page-size="pagesize"
    :layout="layout[type]"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    message: Number,
    // eslint-disable-next-line vue/require-default-prop
    type: Number
  },
  data() {
    return {
      pagesizes: [5, 10, 15, 20],
      pagesize: 5,
      currentPage: 1,
      layout: ['total, sizes, prev, pager, next, jumper', 'total, sizes, prev, pager, next'],
      total: this.message
    }
  },
  watch: {
    message(n, o) {
      this.total = n
      if ((this.currentPage - 1) * this.pagesize >= this.total && this.currentPage > 1) {
        this.currentPage -= 1
      }
      // console.log('页码', this.currentPage)
      this.$emit('func', [this.pagesize, this.currentPage])
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      console.log(this.pagesize, this.total)
      this.pagesize = val
      this.currentPage = 1
      this.$emit('func', [this.pagesize, this.currentPage])
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      console.log(this.currentPage)
      this.currentPage = val
      this.$emit('func', [this.pagesize, this.currentPage])
    }
  }
}
</script>
