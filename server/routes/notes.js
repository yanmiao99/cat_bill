const express = require('express');
const router = express.Router();
const {Notes, IncomeList, Lend} = require('../models');
const log4js = require('../utils/log4j.js')
const {Op} = require('sequelize');

// 添加笔记
router.post('/add', async (req, res) => {
  const currentUserId = req.user.id
  const {
    cover,
    title,
    detail,
    tag,
    category
  } = req.body
  try {
    await Notes.create({
      cover,
      title,
      detail,
      tag,
      category,
      UserId: currentUserId,
    })

    log4js.info('添加笔记成功')
    res.send({
      code: 200,
      msg: '添加成功',
      data: {
        cover,
        title,
        detail,
        tag,
        category,
      }
    })
  } catch (err) {
    log4js.error(err)
    res.send({
      code: 400,
      msg: '添加失败',
      data: err
    })
  }
})

// 删除笔记
router.post('/delete', async (req, res) => {

  const id = parseInt(req.body.id)
  const currentUserId = req.user.id

  // 校验id 是否存在
  if (!id || isNaN(id)) {
    const message = '缺少必传参数 id '
    log4js.error(message)
    res.send({
      code: 400,
      msg: message,
      data: null
    })
  }

  try {
    const [num, rows] = await Notes.update(
        {isDelete: 1},
        {
          where: {
            id,
            UserId: currentUserId,
            isDelete: 0,
          }
        })
    if (num === 0) {
      const message = '该记录不存在'
      log4js.error(message)
      return res.send({
        code: 400,
        msg: message,
        data: null
      })
    }
    log4js.info(`删除笔记${id}成功`)
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

// 编辑笔记
router.post('/update', async (req, res) => {
  const currentUserId = req.user.id
  const {
    id,
    cover,
    title,
    detail,
    tag,
    category
  } = req.body

  try {
    await Notes.update(
        {
          cover,
          title,
          detail,
          tag,
          category
        },
        {
          where: {
            UserId: currentUserId,
            id,
            isDelete: 0,
          }
        }
    )

    log4js.info(`修改id为 ${id} 的笔记成功`)
    res.send({
      code: 200,
      msg: '修改成功',
      data: {
        id,
        cover,
        title,
        detail,
        tag,
        category
      }
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

// 查询笔记
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const currentUserId = req.user.id
  const {title} = req.query
  const {id} = req.query

  let searchWhere = {}
  if (title) {
    searchWhere = {
      title: {
        // 模糊搜索
        [Op.like]: `%${title}%`
      }
    }
  }

  if (id) {
    searchWhere = {id}
  }

  try {
    const offset = (page - 1) * limit
    const noteList = await Notes.findAll({
      // 查询条件需要查询isDelete为0的数据
      where: {
        UserId: currentUserId,
        isDelete: 0,
        ...searchWhere
      },
      attributes: { // 设置排除的字段
        //exclude: ['isDelete', 'LendPersonId', 'createdAt', 'updatedAt']
      },
      offset,
      limit,
      order: [['id', 'DESC']]  // 倒序返回数据
    })
    const totalCount = await Notes.count({
      where: {
        UserId: currentUserId,
        isDelete: 0,
        ...searchWhere
      }
    })

    log4js.info('查询笔记成功')
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        list: noteList,
        pagination: {
          page, // 当前页数，即请求中传入的page参数。
          limit, // 每页返回的数据量，即请求中传入的limit参数。
          totalCount, // 满足查询条件的总数据量，也就是不考虑分页时查询结果的总数。
        }
      }
    })
  } catch (err) {
    log4js.error(err)
    res.send({
      code: 400,
      msg: '查询失败',
      data: err
    })
  }
})

module.exports = router
