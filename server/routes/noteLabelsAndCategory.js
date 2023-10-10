const express = require('express')
const router = express.Router()
const {NoteLabelsAndCategory} = require('../models')
const log4js = require('../utils/log4j.js')
const {validateParams} = require("../utils");

/**
 * @api {post} /noteLabelsAndCategory/add 添加一条标签记录
 * @apiParam {String} type 类型
 * @apiParam {String} tag 标签名称
 */
router.post('/add',
    validateParams({
      tag: '缺少必传参数 tag (名称)',
      type: '缺少必传参数 type (类型)',
    }),
    async (req, res) => {
      const {
        tag, type
      } = req.body
      const currentUserId = req.user.id

      // 校验是否已经存在
      const isExist = await NoteLabelsAndCategory.findOne({
        where: {
          tag,
          type,
          UserId: currentUserId,
          isDelete: 0
        }
      })
      if (isExist) {
        const message = '该标签已存在'
        log4js.error(message)
        res.send({
          code: 400,
          msg: message,
          data: null
        })
        return
      }

      // 限制字符长度在5个字符以内
      if (tag.length > 5) {
        const message = '标签名称长度不能超过5个字符'
        log4js.error(message)
        res.send({
          code: 400,
          msg: message,
          data: null
        })
        return
      }

      try {
        await NoteLabelsAndCategory.create({
          tag, type,
          UserId: currentUserId
        })
        log4js.info('添加一条标签成功')
        res.send({
          code: 200,
          msg: '标签添加成功',
          data: null
        })
      } catch (err) {
        log4js.error(err)
        res.send({
          code: 400,
          msg: '标签添加失败',
          data: err
        })
      }
    })

/**
 * @api {get} /noteLabelsAndCategory/list 查询标签
 * @apiParam {Number} type 类型 1-标签 2-分类
 */
// 查询某个用户的借出记录
router.get('/list', async (req, res) => {
  const {type} = req.query
  const currentUserId = req.user.id

  let whereValue = {}
  if (type) {
    whereValue = {
      type,
    }
  }

  try {
    const list = await NoteLabelsAndCategory.findAll({
      where: {
        ...whereValue,
        UserId: currentUserId,
        isDelete: 0
      },
      attributes: { // 设置排除的字段
        exclude: ['UserId', 'isDelete', 'createdAt', 'updatedAt']
      },
      // order: [['createdAt', 'DESC']]  // 倒序返回数据
    })

    log4js.info(`查询标签记录成功`)
    res.send({
      code: 200,
      msg: '标签查询成功',
      data: {
        list,
      }
    })
  } catch (err) {
    log4js.error(err)
    res.send({
      code: 400,
      msg: '标签查询失败',
      data: err
    })
  }
})

/**
 * @api {post} /noteLabelsAndCategory/delete 删除一条标签记录
 * @apiParam {Number} id 收入id
 */
// 删除一条借出记录
router.post("/delete", async (req, res) => {
  const id = parseInt(req.body.id)
  const currentUserId = req.user.id

  // 校验id 是否存在
  if (!id || isNaN(id)) {
    const message = '缺少必传参数 id (收入id)'
    log4js.error(message)
    res.send({
      code: 400,
      msg: message,
      data: null
    })
  }

  try {
    const [num, rows] = await NoteLabelsAndCategory.update(
        {isDelete: 1},
        {
          where: {
            id,
            UserId: currentUserId,
            isDelete: 0,
          }
        })
    if (num === 0) {
      const message = '该标签记录不存在'
      log4js.error(message)
      return res.send({
        code: 400,
        msg: message,
        data: null
      })
    }
    log4js.info(`删除id${id}收入记录成功`)
    res.send({
      code: 200,
      msg: '删除成功',
      data: null
    })

  } catch (err) {
    log4js.error(err)
    res.send({
      code: 400,
      msg: '删除失败',
      data: err
    })
  }
})

/**
 * @api {post} /noteLabelsAndCategory/update 修改一条标签记录
 * @apiParam {String} type 类型
 * @apiParam {String} tag 标签名称
 * @apiParam {Number} id 标签id
 *
 */
// 修改一条记录
router.post("/update",
    validateParams({
      id: '缺少必传参数 id (标签id)',
      type: '缺少必传参数 type (类型)',
      tag: '缺少必传参数 tag (名称)',
    }),
    async (req, res) => {
      const {
        id, type, tag
      } = req.body
      const currentUserId = req.user.id

      // 校验是否已经存在
      const isExist = await NoteLabelsAndCategory.findOne({
        where: {
          tag,
          type,
          UserId: currentUserId,
          isDelete: 0
        }
      })
      if (isExist) {
        const message = '标签名重复'
        log4js.error(message)
        res.send({
          code: 400,
          msg: message,
          data: null
        })
        return
      }

      try {
        const [num, rows] = await NoteLabelsAndCategory.update(
            {
              type, tag
            },
            {
              where: {
                UserId: currentUserId,
                id,
                isDelete: 0,
              }
            }
        )

        if (num === 0) {
          const message = '该条标签记录不存在'
          log4js.error(message)
          res.send({
            code: 400,
            msg: message,
            data: null
          })
          return
        }

        log4js.info(`修改id为 ${id} 的记录成功`)
        res.send({
          code: 200,
          msg: '修改成功',
          data: null
        })
      } catch (err) {
        log4js.error(err)
        res.send({
          code: 400,
          msg: '修改失败',
          data: err
        })
      }
    })
module.exports = router
