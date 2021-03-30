import PaginationComponent from './Pagination.vue'

const Pagination = {
  install: function(Vue) {
    Vue.Component('Pagination', PaginationComponent)
  }
}

export default Pagination
