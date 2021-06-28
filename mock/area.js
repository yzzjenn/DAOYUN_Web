import Mock from 'mockjs'
const data = Mock.mock({
  'provinces': [{
    id: 1,
    name: '福建省'
  }, {
    id: 2,
    name: '广东省'
  }, {
    id: 3,
    name: '浙江省'
  }, {
    id: 4,
    name: '上海'
  }],
  'cities': [{
    id: '@id',
    province: '福建省',
    name: '泉州市'
  }, {
    id: '@id',
    province: '广东省',
    name: '广州市'
  }, {
    id: '@id',
    province: '福建省',
    name: '福州市'
  }, {
    id: '@id',
    province: '广东省',
    name: '深圳市'
  }, {
    id: '@id',
    province: '浙江省',
    name: '杭州市'
  }, {
    id: '@id',
    province: '上海',
    name: '上海市'
  }]
})
export default [
  {
    url: '/present-cloud/area/province',
    type: 'get',
    response: config => {
      const items = data.provinces
      return {
        code: 20000,
        data: {
          items: items
        }
      }
    }
  },
  {
    url: '/present-cloud/area/city',
    type: 'get',
    response: config => {
      const { province } = config.query
      const items = data.cities.filter(data => data.province === province)
      return {
        code: 20000,
        data: {
          items: items
        }
      }
    }
  },
  {
    url: '/present-cloud/area/inProvince',
    type: 'get',
    response: config => {
      const { province, city } = config.query
      const items = data.cities.filter(data => data.province === province)
      const result = items.findIndex(data => data.name === city) > -1
      return {
        code: 20000,
        data: {
          result: result
        }
      }
    }
  }
]
