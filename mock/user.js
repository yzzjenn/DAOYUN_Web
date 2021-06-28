import Mock from 'mockjs'

const code = Mock.mock({
  value: '123456'
})
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  items: [{
    username: 'admin',
    password: '123456'
  },
  {
    username: 'editor',
    password: '123456'
  }],
  'admin-token': {
    roles: ['管理员'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['用户'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/present-cloud/user/login',
    type: 'post',
    response: config => {
      const { username, password } = config.body
      const token = tokens[username]
      const index = users.items.findIndex(item => item.username === username)
      const user = users.items[index]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '帐号不存在.'
        }
      }

      // if (password !== user.password) {
      //   return {
      //     code: 60204,
      //     message: '帐号或密码错误'
      //   }
      // }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/present-cloud/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/present-cloud/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // changePassword
  {
    url: '/present-cloud/user/changePassword',
    type: 'post',
    response: config => {
      const { form } = config.query
      const newform = JSON.parse(form)
      if (newform.code.toString() === code.value.toString()) {
        const items = users['items']
        const index = items.findIndex(item => item.username.toString() === newform.user.toString())
        if (index > -1) {
          users.items[index].password = newform.password
          return {
            code: 20000,
            data: 'success'
          }
        } else {
          return {
            code: 60204,
            message: '帐号不存在'
          }
        }
      } else {
        return {
          code: 60204,
          message: '验证码错误'
        }
      }
    }
  },

  // get code
  {
    url: '/present-cloud/user/getCode',
    type: 'get',
    response: config => {
      code.value = Mock.Random.string('number', 6)
      return {
        code: 20000,
        data: code.value
      }
    }
  }
]
