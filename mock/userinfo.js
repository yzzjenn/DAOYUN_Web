import Mock from 'mockjs'
const data = Mock.mock({
  'items|15': [{
    id: '@id',
    name: '@cname',
    userID: '@string( "number", 8 )',
    account: '-',
    roles: ['用户'],
    'gender|1': ['男', '女'],
    datapermission: '自定义',
    'school|1': ['福州大学', '福建师范大学', '@cword( 2, 3 )' + '大学'],
    department: '数计学院',
    'major|1': ['计算机技术', '数学', '软件工程'],
    phone: '131' + '@string( "number", 8 )',
    type: 1
  }, {
    id: '@id',
    name: '@cname',
    userID: '@string( "number", 8 )',
    account: '-',
    roles: ['管理员', '用户'],
    gender: '男',
    'school|1': ['福州大学', '福州大学', '@cword( 2, 3 )' + '大学'],
    'department|1': ['数计学院', '外语学院'],
    phone: '131' + '@string( "number", 8 )',
    type: 2
  }, {
    id: '@id',
    name: '@cname',
    userID: '-',
    account: '@string( "number", 8 )',
    roles: ['超级管理员'],
    gender: '',
    'school|1': ['福州大学', '@cword( 2, 3 )'],
    'department|1': ['数计学院', '外语学院', '物信学院'],
    phone: '131' + '@string( "number", 8 )',
    type: 3
  }]
})
export default [
  {
    url: '/present-cloud/userinfo/data',
    type: 'get',
    response: config => {
      const { currentPage, pagesize, type, name, ID } = config.query
      let items = data.items.filter(data => data.type.toString() === type)
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
            return (String(data['name']).toLowerCase().indexOf(name) > -1)
          })
        })
      }
      if (ID.length > 0) {
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
            return (String(data['userID']).toLowerCase().indexOf(ID) > -1 || String(data['account']).toLowerCase().indexOf(ID) > -1)
          })
        })
      }
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
    url: '/present-cloud/userinfo/update',
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
    url: '/present-cloud/userinfo/delete',
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
    url: '/present-cloud/userinfo/add',
    type: 'post',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      newform.id = Mock.Random.natural(23, 10000)
      data.items.push(newform)
      return {
        code: 20000,
        data: newform
      }
    }
  },
  {
    url: '/present-cloud/userinfo/exist',
    type: 'get',
    response: config => {
      const { id, value, type, kind } = config.query
      let table = data.items.filter(data => data.type.toString() === type.toString())
      table = table.filter(item => item.id.toString() !== id.toString())
      let index = -1
      if (kind === 'account') {
        index = table.findIndex(item => item.account.toString() === value.toString())
      }
      if (kind === 'userID') {
        index = table.findIndex(item => item.userID.toString() === value.toString())
      }
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
