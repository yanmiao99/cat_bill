// 添加一条借出记录
const express = require('express')
const router = express.Router()
const {Lend, User} = require('../models')
const log4js = require('../utils/log4j.js')

// 定义参数校验中间件
const validateParams = (requiredParams) => {
  return (req, res, next) => {
    for (const [param, message] of Object.entries(requiredParams)) {
      if (!req.body[param]) {
        log4js.error(message)
        return res.send({
          code: 400,
          msg: message,
          data: null
        })
      }
    }
    next()
  }
}

/**
 * @api {post} /lend/add 添加一条借出记录
 * @apiParam {String} date 日期
 * @apiParam {Number} amount 金额
 * @apiParam {String} borrower 借款人
 * @apiParam {String} reason 原因
 * @apiParam {String} repaymentDate 还款日期
 * @apiParam {String} type 类型
 * @apiParam {Number} interest 利息
 * @apiParam {String} voucher 凭证
 * @apiParam {String} settle 结算
 * @apiParam {String} remark 备注
 */
router.post('/add',
  validateParams({
    date: '缺少必传参数 date (日期)',
    amount: '缺少必传参数 amount (金额)',
    borrower: '缺少必传参数 borrower (借款人)',
    reason: '缺少必传参数 reason (原因)',
    repaymentDate: '缺少必传参数 repaymentDate (还款日期)',
    voucher: '缺少必传参数 voucher (凭证)',
  }),
  async (req, res) => {
    const {
      date, amount, borrower, reason,
      repaymentDate, type, interest, voucher,
      settle, remark
    } = req.body

    const currentUserId = req.user.id // 从解析后的 Token 中获取用户 ID

    try {
      await Lend.create({
        date, amount, borrower, reason,
        repaymentDate, type, interest, voucher,
        settle, uId: currentUserId, remark
      })
      log4js.info('添加一条借出记录成功')
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
 * @api {get} /lend/list 查询某个用户的借出记录
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
    const lendList = await Lend.findAll({
      // 查询条件需要查询isDelete为0的数据
      where: {
        uId: currentUserId,
        isDelete: 0
      },
      include: {   // 关联查询该用户的信息
        model: User,
        attributes: ['username', 'id']
      },
      attributes: { // 设置排除的字段
        exclude: ['isDelete', 'uId', 'createdAt', 'updatedAt']
      },
      offset,
      limit
    })
    const totalCount = await Lend.count({
      where: {
        uId: currentUserId,
        isDelete: 0
      }
    })
    const totalPages = Math.ceil(totalCount / limit)
    log4js.info(`查询用户id为 ${currentUserId} 的借出记录成功`)
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        list: lendList,
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
 * @api {post} /lend/delete 删除一条借出记录
 * @apiParam {Number} id 借出记录id
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
    const [num, rows] = await Lend.update(
      {isDelete: 1},
      {
        where: {
          id,
          isDelete: 0,
          uId: currentUserId
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
 * @api {post} /lend/update 修改一条借出记录
 * @apiParam {Number} id 借出记录id
 * @apiParam {String} date 日期
 * @apiParam {Number} amount 金额
 * @apiParam {String} borrower 借款人
 * @apiParam {String} reason 原因
 * @apiParam {String} repaymentDate 还款日期
 * @apiParam {String} type 类型
 * @apiParam {Number} interest 利息
 * @apiParam {String} voucher 凭证
 * @apiParam {Number} settle 是否结清
 * @apiParam {String} remark 备注
 *
 */
// 修改一条借出记录
router.post("/update",
  validateParams({
    id: '缺少必传参数 id (借出记录id)',
    date: '缺少必传参数 date (日期)',
    amount: '缺少必传参数 amount (金额)',
    borrower: '缺少必传参数 borrower (借款人)',
    reason: '缺少必传参数 reason (原因)',
    repaymentDate: '缺少必传参数 repaymentDate (还款日期)',
    voucher: '缺少必传参数 voucher (凭证)',
  }),
  async (req, res) => {
    const {
      id, date, amount, borrower, reason,
      repaymentDate, type, interest, voucher,
      settle, remark
    } = req.body

    const currentUserId = req.user.id // 从解析后的 Token 中获取用户 ID

    try {
      const [num, rows] = await Lend.update(
        {
          date, amount, borrower, reason,
          repaymentDate, type, interest, voucher,
          settle, remark
        },
        {
          where: {
            id,
            isDelete: 0,
            uId: currentUserId
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
 * @api {get} /lend/search 根据借款人查询借出记录
 * @apiParam {String} borrower 借款人
 * @apiParam {Number} page 页码 (非必传)
 * @apiParam {Number} limit 每页条数 (非必传)
 */
// 根据借款人查询借出记录
router.get("/search", async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const borrower = req.query.borrower

  const currentUserId = req.user.id; // 获取当前用户 ID

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
    const lendList = await Lend.findAll({
      // 查询条件需要查询isDelete为0的数据
      where: {
        uId: currentUserId,
        borrower,
        isDelete: 0
      },
      include: {   // 关联查询该用户的信息
        model: User,
        attributes: ['username', 'id']
      },
      attributes: { // 设置排除的字段
        exclude: ['isDelete', 'uId', 'createdAt', 'updatedAt']
      },
      offset,
      limit
    })
    const totalCount = await Lend.count({
      where: {
        borrower,
        uId: currentUserId,
        isDelete: 0
      }
    })
    const totalPages = Math.ceil(totalCount / limit)
    log4js.info(`查询借款人为 ${borrower} 的借出记录成功`)
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        list: lendList,
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
