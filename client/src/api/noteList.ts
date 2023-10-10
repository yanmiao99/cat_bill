//@ts-ignore
import request from '@/utils/request'

// 查询数据
export const getNoteList = (param: any) => {
  return request({
    method: 'get',
    url: '/notes/list',
    data: param
  })
}

// 删除
export const deleteNote = (param: any) => {
  return request({
    method: 'post',
    url: '/notes/delete',
    data: param
  })
}

// 新增
export const addNote = (param: any) => {
  return request({
    method: 'post',
    url: '/notes/add',
    data: param
  })
}

// 新增
export const updateNote = (param: any) => {
  return request({
    method: 'post',
    url: '/notes/update',
    data: param
  })
}

