// @ts-ignore
import request from '../utils/request'

// 上传图片
export const uploadImage = (param: any) => {
  return request({
    method: 'post',
    url: '/upload/image',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
