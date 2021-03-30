import Mock from 'mockjs'
const data = Mock.mock({
  'items': [{
    id: 1,
    name: '超级管理员',
    datapermission: '全部',
    level: 1,
    menus: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    description: '213'
  }, {
    id: 2,
    name: '管理员',
    datapermission: '全部',
    level: 3,
    menus: [2],
    description: '321'
  }, {
    id: 3,
    name: '用户',
    datapermission: '本级',
    level: 3,
    menus: [2],
    description: '123'
  }]
})
export default [
  {
    url: '/present-cloud/role/data',
    type: 'get',
    response: config => {
      const { currentPage, pagesize, name } = config.query
      let roles = data.items
      let items = data.items
      if (name.length > 0) {
        items = items.filter(data => {
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
        roles = items
        if (currentPage > -1 && pagesize > -1) {
          items = items.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        }
      }
      return {
        code: 20000,
        data: {
          total: roles.length,
          items: items
        }
      }
    }
  },
  {
    url: '/present-cloud/role/update',
    type: 'put',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      const index = data.items.findIndex(item => item.id === newform.id)
      data.items[index] = newform
      return {
        code: 20000,
        data: newform
      }
    }
  },
  {
    url: '/present-cloud/role/delete',
    type: 'delete',
    response: config => {
      const { form } = config.query
      const deleteform = JSON.parse(form)
      let index = data.items.findIndex(item => item.id === deleteform.id)
      data.items.splice(index, 1)
      index = data.items.findIndex(item => item.fatherId === deleteform.fatherId)
      if (index < 0) {
        index = data.items.findIndex(item => item.id === deleteform.fatherId)
        data.items[index].hasChildren = false
      }
      index = data.items.findIndex(item => item.fatherId === deleteform.id)
      while (index > -1) {
        data.items.splice(index, 1)
        index = data.items.findIndex(item => item.fatherId === deleteform.id)
      }
      const roles = data.items.filter(data => data.type === 1)
      return {
        code: 20000,
        data: roles.length
      }
    }
  },
  {
    url: '/present-cloud/role/add',
    type: 'post',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      newform.id = data.items[data.items.length - 1].id + 1
      data.items.push(newform)
      const index = data.items.findIndex(data => data.id.toString() === newform.id.toString())
      return {
        code: 20000,
        data: index
      }
    }
  },
  {
    url: '/present-cloud/role/exist',
    type: 'get',
    response: config => {
      const { id, name } = config.query
      let table = data.items
      table = table.filter(item => item.id.toString() !== id.toString())
      const index = table.findIndex(item => item.name.toString() === name.toString())
      let exist = false
      if (index > -1) {
        exist = true
      }
      return {
        code: 20000,
        data: exist
      }
    }
  }
]
