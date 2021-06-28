const data = ({
  'items': [{
    id: 1,
    name: '学校',
    description: '描述'
  }, {
    id: 2,
    name: '用户类型',
    description: '描述'
  }, {
    id: 3,
    name: '角色类型',
    description: '描述'
  }, {
    id: 4,
    name: '菜单类型',
    description: '描述'
  }, {
    id: 5,
    name: '性别',
    description: '描述'
  }, {
    id: 6,
    name: '学院',
    description: '描述'
  }, {
    id: 7,
    name: '数据权限',
    description: '描述'
  }],
  'dictData': [{
    id: 1,
    name: '学校',
    label: '福州大学',
    value: '1',
    order: 1,
    isdefault: false
  }, {
    id: 2,
    name: '学校',
    label: '无',
    value: '0',
    order: 2,
    isdefault: true
  }, {
    id: 3,
    name: '性别',
    label: '男',
    value: '1',
    order: 1,
    isdefault: false
  }, {
    id: 4,
    name: '用户类型',
    label: '学生',
    value: '1',
    order: 1,
    isdefault: false
  }, {
    id: 5,
    name: '用户类型',
    label: '教师',
    value: '2',
    order: 2,
    isdefault: false
  }, {
    id: 6,
    name: '性别',
    label: '女',
    value: '2',
    order: 2,
    isdefault: false
  }, {
    id: 7,
    name: '性别',
    label: '未知',
    value: '0',
    order: 3,
    isdefault: false
  }]
})

export default [
  {
    url: '/present-cloud/dictionary/data',
    type: 'get',
    response: config => {
      const { currentPage, pagesize, name } = config.query
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
          total: items.length,
          items: items.slice((currentPage - 1) * pagesize, currentPage * pagesize)
        }
      }
    }
  },
  {
    url: '/present-cloud/dictionary/label',
    type: 'get',
    response: config => {
      const { id } = config.query
      const index = data.items.findIndex(item => item.id.toString() === id.toString())
      const name = data.items[index].name
      const table = data.dictData.filter(item => item.name.toString() === name.toString())
      //   this.$set(data.items, index, form)
      return {
        code: 20000,
        data: {
          items: table
        }
      }
    }
  },
  {
    url: '/present-cloud/dictionary/update',
    type: 'put',
    response: config => {
      const { form, dictData } = config.query
      const newform = JSON.parse(form)
      const newDictData = []
      let dictIndex = -1
      dictData.forEach(item => {
        newDictData.push(JSON.parse(item))
      })
      data.dictData.forEach((item, itemIndex) => {
        dictIndex = newDictData.findIndex(dict => {
          return (item.id === dict.id)
        })
        if (dictIndex === -1 && item.name === newform.name) {
          data.dictData.splice(itemIndex, 1)
        }
      })
      const index = data.items.findIndex(item => item.id === newform.id)
      dictIndex = -1
      data.items[index] = newform
      newDictData.forEach(item => {
        dictIndex = data.dictData.findIndex(dict => dict.id === item.id)
        if (dictIndex > -1) {
          data.dictData[dictIndex] = item
        } else {
          data.dictData.push(item)
        }
      })
      return {
        code: 20000,
        data: newDictData
      }
    }
  },
  {
    url: '/present-cloud/dictionary/delete',
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
    url: '/present-cloud/dictionary/add',
    type: 'post',
    response: config => {
      const { form, dictData } = config.query
      const newform = JSON.parse(form)
      const newDictData = []
      dictData.forEach(item => {
        newDictData.push(JSON.parse(item))
      })
      data.items.push(newform)
      newDictData.forEach(item => {
        data.dictData.push(item)
      })
      return {
        code: 20000,
        data: newform
      }
    }
  },
  {
    url: '/present-cloud/dictionary/exist',
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
  }
]
