// @ts-ignore
import request from '@/utils/request'

interface IParam {
  id?: number,
  type?: string,

  tag?: string,
}

// 查询数据
export const getNoteTagInfo = (param?: IParam) => {
  return request({
    method: 'get',
    url: '/noteLabelsAndCategory/list',
    data: param
  })
}

// 新增数据
export const addNoteTagInfo = (param: IParam) => {
  return request({
    method: 'post',
    url: '/noteLabelsAndCategory/add',
    data: param,
  })
}

// 修改数据
export const editNoteTagInfo = (param: IParam) => {
  return request({
    method: 'post',
    url: '/noteLabelsAndCategory/update',
    data: param
  })
}

// 删除数据
export const deleteNoteTagInfo = (param: IParam) => {
  return request({
    method: 'post',
    url: '/noteLabelsAndCategory/delete',
    data: param
  })
}
