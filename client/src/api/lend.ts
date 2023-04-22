// @ts-ignore
import request from '@/utils/request'

interface ILendInfoParam {
  page?: number,
  limit?: number,
  LendPersonId?: number,
}

// 查询数据
export const getLendInfo = (param?: ILendInfoParam) => {
  return request({
    method: 'get',
    url: '/lend/list',
    data: param
  })
}

// 新增数据
export const addLendInfo = (param: ILendInfoParam) => {
  return request({
    method: 'post',
    url: '/lend/add',
    data: param
  })
}

// 修改数据
export const editLendInfo = (param: ILendInfoParam) => {
  return request({
    method: 'post',
    url: '/lend/update',
    data: param
  })
}

// 删除数据
export const deleteLendInfo = (param: ILendInfoParam) => {
  return request({
    method: 'post',
    url: '/lend/delete',
    data: param
  })
}

