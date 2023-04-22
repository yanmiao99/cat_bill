const express = require('express')
const router = express.Router()
const log4js = require('../utils/log4j.js')
const multer = require('multer')
const md5 = require('md5')
const {Upload} = require('../models')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 限制图片上传类型
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, 'public/images')
    } else {
      // 限制其他文件上传类型
      cb({error: '不支持该文件类型'})
    }
  },
  filename: function (req, file, cb) {
    // 处理文件名
    let fileFormat = (file.originalname).split(".");
    cb(null, md5(Number(new Date())) + "." + fileFormat[fileFormat.length - 1]);
  }
})
const uploadDir = multer({storage: storage});

// 上传图片接口
router.post('/image', uploadDir.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    log4js.error('上传失败')
    res.send({code: 400, msg: '上传失败'})
    return
  }
  const currentUserId = req.user.id
  try {
    const {originalname, filename, path} = req.file;
    await Upload.create({
      UserId: currentUserId,
      originalname,
      filename,
      path
    });
    const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`; // 本地可以用这个地址, 线上不要用
    log4js.info('上传成功')
    res.send({
      code: 200,
      msg: '上传成功',
      data: {
        url: imageUrl
      }
    })
  } catch (e) {
    log4js.error('上传图片失败', e)
    res.send({code: 500, msg: '上传图片失败'})
  }
})

module.exports = router
