import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = 'present_cloud_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // if (rememberMe) {
    // return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  // } else 
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
