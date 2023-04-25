// @ts-ignore
import request from '@/utils/request'

interface IParam {
  username: string,
  password: string,
  autoLogin?: boolean,
  captcha: string
}

// 登录
export const postLogin = (param: IParam) => {
  return request({
    method: 'post',
    url: '/user/login',
    data: param
  })
}
// 注册
export const postRegister = (param: IParam) => {
  return request({
    method: 'post',
    url: '/user/register',
    data: param
  })
}
// 获取验证码
export const getCaptcha = () => {
  return request({
    method: 'get',
    url: '/user/captcha'
  })
}
// 获取用户信息
export const getCurrentUserInfo = () => {
  return request({
    method: 'get',
    url: '/user/current'
  })
}
