import Mock from 'mockjs'
const data = Mock.mock({
  'items': [{
    id: 1,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '@county("true")'
  }, {
    id: 2,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1517 弄'
  }, {
    id: 3,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1519 弄'
  }, {
    id: 4,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }, {
    id: 5,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }, {
    id: 6,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }, {
    id: 7,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }, {
    id: 8,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }, {
    id: 9,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }, {
    id: 10,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }, {
    id: 11,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }, {
    id: 12,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }, {
    id: 13,
    date: '@datetime',
    name: '@sentence(1, 2)',
    address: '上海市普陀区金沙江路 1516 弄'
  }]
})

export default [
//   {
//     url: '/present-cloud/list/data',
//     type: 'get',
//     response: config => {
//       const { currentPage, pagesize } = config.query
//       const items = data.items.sort(function(a, b) {
//         const x = a['date']
//         const y = b['date']
//         return ((x < y) ? -1 : (x > y) ? 1 : 0)
//       })
//       return {
//         code: 20000,
//         data: {
//           total: items.length,
//           items: items.slice((currentPage - 1) * pagesize, currentPage * pagesize)
//         }
//       }
//     }
//   },
//   {
//     url: '/present-cloud/list/data',
//     type: 'get',
//     response: config => {
//       const { currentPage, pagesize, order } = config.query
//       //   let index = data.items.findIndex(item => item.id === 3)
//       //   data.items[index].name = '无敌'
//       //   index = data.items.findIndex(item => item.id === 6)
//       //   data.items[index].name = '无敌'
//       const items = data.items.sort(function(a, b) {
//         if (order === 'ascending') {
//           const x = a['date']
//           const y = b['date']
//           return ((x < y) ? -1 : (x > y) ? 1 : 0)
//         }
//         if (order === 'descending') {
//           const x = b['date']
//           const y = a['date']
//           return ((x < y) ? -1 : (x > y) ? 1 : 0)
//         }
//         if (order === null) {
//           return 1
//         }
//       })
//       return {
//         code: 20000,
//         data: {
//           total: items.length,
//           items: items.slice((currentPage - 1) * pagesize, currentPage * pagesize)
//         }
//       }
//     }
//   },
  {
    url: '/present-cloud/list/data',
    type: 'get',
    response: config => {
      const { currentPage, pagesize, order, name } = config.query
      let items
      if (name.length > 0) {
        items = data.items.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。
          // 注意： some() 不会对空数组进行检测。
          // 注意： some() 不会改变原始数组。
          return Object.keys(data).some(key => {
            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
            return String(data['name']).toLowerCase().indexOf(name) > -1
          })
        })
      } else {
        items = data.items
      }
      items = items.sort(function(a, b) {
        if (order === 'ascending') {
          const x = a['date']
          const y = b['date']
          return ((x < y) ? -1 : (x > y) ? 1 : 0)
        }
        if (order === 'descending') {
          const x = b['date']
          const y = a['date']
          return ((x < y) ? -1 : (x > y) ? 1 : 0)
        }
        if (order === null) {
          return 1
        }
      })
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        }
      }
    }
  },
  {
    url: '/present-cloud/list/update',
    type: 'put',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      const index = data.items.findIndex(item => item.id === newform.id)
      //   this.$set(data.items, index, form)
      data.items[index] = newform
      return {
        code: 20000,
        data: newform
      }
    }
  },
  {
    url: '/present-cloud/list/delete',
    type: 'delete',
    response: config => {
      const { form } = config.query
      const deleteform = JSON.parse(form)
      const index = data.items.findIndex(item => item.id === deleteform.id)
      data.items.splice(index, 1)
      return {
        code: 20000,
        data: index
      }
    }
  },
  {
    url: '/present-cloud/list/add',
    type: 'post',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      data.items.push(newform)
      return {
        code: 20000,
        data: newform
      }
    }
  }
]
