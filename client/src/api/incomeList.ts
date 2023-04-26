// @ts-ignore
import request from '@/utils/request'

interface IIncomeListInfoParam {
  page?: number,
  limit?: number,
  id?: number,
  type?: string,
  amount?: number,
  date?: string,
  isReceived?: number,
  remark?: string,
}

// 查询数据
export const getIncomeListInfo = (param?: IIncomeListInfoParam) => {
  return request({
    method: 'get',
    url: '/incomeList/list',
    data: param
  })
}

// 新增数据
export const addIncomeListInfo = (param: IIncomeListInfoParam) => {
  return request({
    method: 'post',
    url: '/incomeList/add',
    data: param,
  })
}

// 修改数据
export const editIncomeListInfo = (param: IIncomeListInfoParam) => {
  return request({
    method: 'post',
    url: '/incomeList/update',
    data: param
  })
}

// 删除数据
export const deleteIncomeListInfo = (param: IIncomeListInfoParam) => {
  return request({
    method: 'post',
    url: '/incomeList/delete',
    data: param
  })
}

// 看板数据
export const getIncomeListBoard = (param: IIncomeListInfoParam) => {
  return request({
    method: 'get',
    url: '/incomeList/board',
    data: param
  })
}

