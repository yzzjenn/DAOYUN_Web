import Mock from 'mockjs'
const data = Mock.mock({
  'items': [{
    id: 1,
    name: '100%',
    level: '1'
  }, {
    id: 2,
    name: '>75%',
    level: '2'
  }, {
    id: 3,
    name: '>50%',
    level: '3'
  }, {
    id: 4,
    name: '>25%',
    level: '4'
  }, {
    id: 5,
    name: '0',
    level: 5
  }
  ]
})

export default [
  {
    url: '/present-cloud/present/data',
    type: 'get',
    response: config => {
      const { name } = config.query
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
      return {
        code: 20000,
        data: {
          items: items
        }
      }
    }
  },
  {
    url: '/present-cloud/present/update',
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
    url: '/present-cloud/present/delete',
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
    url: '/present-cloud/present/add',
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
    url: '/present-cloud/present/exist',
    type: 'get',
    response: config => {
      const { id, name } = config.query
      const table = data.items.filter(item => item.id.toString() !== id.toString())
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
  },
  {
    url: '/present-cloud/present/level_exist',
    type: 'get',
    response: config => {
      const { id, level } = config.query
      const table = data.items.filter(item => item.id.toString() !== id.toString())
      const index = table.findIndex(item => item.level.toString() === level.toString())
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
