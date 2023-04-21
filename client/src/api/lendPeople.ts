// @ts-ignore
import request from '@/utils/request'

interface ILendPeopleInfoParam {
  page?: number,
  limit?: number,
  borrower?: string
}

// 获取借款人信息
export const getLendPeopleInfo = (param?: ILendPeopleInfoParam) => {
  return request({
    method: 'get',
    url: '/lendPeople/list',
    data: param
  })
}

// 查询某个人的借款信息
export const getSearchLendPeople = (param?: ILendPeopleInfoParam) => {
  return request({
    method: 'get',
    url: '/lendPeople/search',
    data: param
  })
}

// 更新借款人信息
export const updateLendPeopleInfo = (param?: ILendPeopleInfoParam) => {
  return request({
    method: 'post',
    url: '/lendPeople/update',
    data: param
  })
}

// 添加借款人信息
export const addLendPeopleInfo = (param?: ILendPeopleInfoParam) => {
  return request({
    method: 'post',
    url: '/lendPeople/add',
    data: param
  })
}

// 删除借款人信息
export const deleteLendPeopleInfo = (param?: ILendPeopleInfoParam) => {
  return request({
    method: 'post',
    url: '/lendPeople/delete',
    data: param
  })
}
