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

