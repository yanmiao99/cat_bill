const express = require('express')
const router = express.Router()
const {LendPeople, Lend, User} = require('../models')
const log4js = require('../utils/log4j.js')

/**
 * @api {post} /lendPeople/add 添加一条借出记录
 * @apiParam {String} borrower 借款人
 */
router.post('/add', async (req, res) => {
  const {borrower} = req.body
  const currentUserId = req.user.id

  // 判断是否重名
  const isExist = await LendPeople.findOne({
    where: {
      borrower,
      UserId: currentUserId,
      isDelete: 0
    }
  })
  if (isExist) {
    const message = '该借款人已存在'
    log4js.error(message)
    res.send({
      code: 400,
      msg: message,
      data: null
    })
    return
  }

  try {
    await LendPeople.create({
      borrower,
      UserId: currentUserId
    })
    log4js.info('添加一条借出人记录成功')
    res.send({
      code: 200,
      msg: '添加成功',
      data: null
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

/**
 * @api {get} /lendPeople/list 查询该用户的借出记录
 * @apiParam {Number} page 页数 (非必传)
 * @apiParam {Number} limit 每页数量 (非必传)
 */
// 查询某个用户的借出记录
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const currentUserId = req.user.id // 从解析后的 Token 中获取用户 ID
  try {
    const offset = (page - 1) * limit
    const lendPeopleList = await LendPeople.findAll({
      // 查询条件需要查询isDelete为0的数据
      where: {
        UserId: currentUserId,
        isDelete: 0
      },
      include: [{
        model: Lend,
        attributes: ["id",'amount'],
        where: { isDelete: 0 }
      }],
      attributes: { // 设置排除的字段
        exclude: ['isDelete', 'UserId', 'createdAt', 'updatedAt']
      },
      offset,
      limit,
      nest: true
    })
    const totalCount = await LendPeople.count({
      where: {
        UserId: currentUserId,
        isDelete: 0
      }
    })

    // 计算totalAmount
    for (const item of lendPeopleList) {
      item.totalAmount = 0
      if (item.Lends && item.Lends.length === 0) {
        continue;
      }

      item.Lends.forEach(lend => {
        item.totalAmount += lend.amount
      })

      await LendPeople.update(
        {totalAmount: item.totalAmount},
        {
          where: {
            id: item.id
          }
        })
    }

    const totalPages = Math.ceil(totalCount / limit)
    log4js.info(`查询用户id为 ${currentUserId} 的借出记录成功`)
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        list: lendPeopleList,
        pagination: {
          page, // 当前页数，即请求中传入的page参数。
          limit, // 每页返回的数据量，即请求中传入的limit参数。
          totalCount, // 满足查询条件的总数据量，也就是不考虑分页时查询结果的总数。
          totalPages // 根据limit和totalCount计算出来的总页数。
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

/**
 * @api {post} /lendPeople/delete 删除一条借出记录
 * @apiParam {Number} id 借款人id
 */
// 删除一条借出记录
router.post("/delete", async (req, res) => {
  const id = parseInt(req.body.id)
  const currentUserId = req.user.id // 从解析后的 Token 中获取用户 ID

  // 校验id 是否存在
  if (!id || isNaN(id)) {
    const message = '缺少必传参数 id (借出记录id)'
    log4js.error(message)
    res.send({
      code: 400,
      msg: message,
      data: null
    })
  }

  try {
    const [num, rows] = await LendPeople.update(
      {isDelete: 1},
      {
        where: {
          id,
          isDelete: 0,
          UserId: currentUserId
        }
      })
    if (num === 0) {
      const message = '该借出记录不存在'
      log4js.error(message)
      return res.send({
        code: 400,
        msg: message,
        data: null
      })
    }
    log4js.info(`删除id为 ${id} 的借出记录成功`)
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
 * @api {post} /lendPeople/update 修改一条借出记录
 * @apiParam {Number} id 借款人id
 * @apiParam {String} borrower 借款人
 */
// 修改一条借出记录
router.post("/update",
  async (req, res) => {
    const {id, borrower} = req.body
    const currentUserId = req.user.id

    try {
      const [num, rows] = await LendPeople.update(
        {
          borrower
        },
        {
          where: {
            id,
            isDelete: 0,
            UserId: currentUserId
          }
        }
      )

      if (num === 0) {
        const message = '该条借出记录不存在'
        log4js.error(message)
        res.send({
          code: 400,
          msg: message,
          data: null
        })
        return
      }

      log4js.info(`修改id为 ${id} 的借出记录成功`)
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

/**
 * @api {get} /lendPeople/search 根据借款人查询借出记录
 * @apiParam {String} borrower 借款人
 * @apiParam {Number} page 页码 (非必传)
 * @apiParam {Number} limit 每页条数 (非必传)
 */
// 根据借款人查询借出记录
router.get("/search", async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const borrower = req.query.borrower

  const currentUserId = req.user.id

  // 判断必传参数, 如果没有传入则报错
  if (!borrower) {
    const message = '缺少必传参数 borrower (借款人)'
    log4js.error(message)
    res.send({
      code: 400,
      msg: message,
      data: null
    })
  }

  try {
    const offset = (page - 1) * limit
    const lendPeopleList = await LendPeople.findAll({
      // 查询条件需要查询isDelete为0的数据
      where: {
        UserId: currentUserId,
        borrower,
        isDelete: 0
      },
      attributes: { // 设置排除的字段
        exclude: ['isDelete', 'UserId', 'createdAt', 'updatedAt']
      },
      offset,
      limit
    })
    const totalCount = await LendPeople.count({
      where: {
        borrower,
        UserId: currentUserId,
        isDelete: 0
      }
    })
    const totalPages = Math.ceil(totalCount / limit)
    log4js.info(`查询借款人为 ${borrower} 的借出记录成功`)
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        list: lendPeopleList,
        pagination: {
          page, // 当前页数，即请求中传入的page参数。
          limit, // 每页返回的数据量，即请求中传入的limit参数。
          totalCount, // 满足查询条件的总数据量，也就是不考虑分页时查询结果的总数。
          totalPages // 根据limit和totalCount计算出来的总页数。
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
