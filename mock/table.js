import Mock from 'mockjs'

const data = Mock.mock({
  // 'items|30': [{
  //   id: '@id',
  //   title: '@sentence(10, 20)',
  //   'status|1': ['published', 'draft', 'deleted'],
  //   author: 'name',
  //   display_time: '@datetime',
  //   pageviews: '@integer(300, 1000)'
  // }
  'items': [{
    id: '1',
    title: '333',
    'status': 'published',
    author: 'name',
    display_time: '@datetime',
    pageviews: '333'
  },
  {
    id: '2',
    title: '123',
    'status': 'deleted',
    author: 'name',
    display_time: '@datetime',
    pageviews: '444'
  }]
})

export default [
  {
    url: '/present-cloud/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
