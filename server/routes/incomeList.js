const express = require('express')
const router = express.Router()
const {IncomeList, LendPeople} = require('../models')
const log4js = require('../utils/log4j.js')
const {formatNumber, validateParams} = require("../utils");
const {Op} = require("sequelize");
const dayjs = require('dayjs')

/**
 * @api {post} /incomeList/add 添加一条收入记录
 * @apiParam {String} date 日期
 * @apiParam {String} type 类型
 * @apiParam {Number} amount 金额
 * @apiParam {String} remark 备注
 * @apiParam {Number} isReceived 是否到账
 */
router.post('/add',
  validateParams({
    date: '缺少必传参数 date (日期)',
    type: '缺少必传参数 type (类型)',
    amount: '缺少必传参数 amount (金额)',
    remark: '缺少必传参数 remark (备注)',
  }),
  async (req, res) => {
    const {
      date, amount, type,
      isReceived, remark
    } = req.body
    const currentUserId = req.user.id

    try {
      await IncomeList.create({
        date, amount, type,
        isReceived, remark,
        UserId: currentUserId
      })
      log4js.info('添加一条收入记录成功')
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
 * @api {get} /incomeList/list 查询收入记录
 * @apiParam {Number} page 页数 (非必传)
 * @apiParam {Number} limit 每页数量 (非必传)
 */
// 查询某个用户的借出记录
router.get('/list', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const {type, startTime, endTime} = req.query
  const currentUserId = req.user.id

  let searchWhere = {}
  if (type || (startTime && endTime)) {
    if (type) {
      searchWhere.type = type
    }
    if (startTime && endTime) {
      searchWhere.date = {
        [Op.between]: [startTime, endTime]
      }
    }
  }

  try {
    const offset = (page - 1) * limit
    const list = await IncomeList.findAll({
      // 查询条件需要查询isDelete为0的数据
      where: {
        ...searchWhere,
        UserId: currentUserId,
        isDelete: 0
      },
      attributes: { // 设置排除的字段
        exclude: ['UserId', 'isDelete', 'createdAt', 'updatedAt']
      },
      offset,
      limit,
      order: [['createdAt', 'DESC']]  // 倒序返回数据
    })

    const totalCount = await IncomeList.count({
      where: {
        ...searchWhere,
        UserId: currentUserId,
        isDelete: 0
      }
    })

    list.forEach(item => {
      item.amount = formatNumber(item.amount)
    })


    let typeList = await IncomeList.findAll({
      where: {
        UserId: currentUserId,
        isDelete: 0,
      },
      group: ['type'],
      attributes: ['type']
    })

    const typeOptions = typeList.map(item => item.type);

    log4js.info(`查询收入记录成功`)
    res.send({
      code: 200,
      msg: '查询成功',
      data: {
        options: typeOptions,
        list,
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

/**
 * @api {post} /incomeList/delete 删除一条收入记录
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
    const [num, rows] = await IncomeList.update(
      {isDelete: 1},
      {
        where: {
          id,
          UserId: currentUserId,
          isDelete: 0,
        }
      })
    if (num === 0) {
      const message = '该收入记录不存在'
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
 * @api {post} /incomeList/update 修改一条收入记录
 * @apiParam {String} date 日期
 * @apiParam {String} type 类型
 * @apiParam {Number} amount 金额
 * @apiParam {String} remark 备注
 * @apiParam {Number} isReceived 是否到账
 *
 */
// 修改一条借出记录
router.post("/update",
  validateParams({
    id: '缺少必传参数 id (借出记录id)',
    date: '缺少必传参数 date (日期)',
    type: '缺少必传参数 type (类型)',
    amount: '缺少必传参数 amount (金额)',
    remark: '缺少必传参数 remark (备注)',
  }),
  async (req, res) => {
    const {
      id, date, amount, type,
      isReceived, remark
    } = req.body
    const currentUserId = req.user.id

    try {
      const [num, rows] = await IncomeList.update(
        {
          date, amount, type,
          isReceived, remark
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
        const message = '该条收入记录不存在'
        log4js.error(message)
        res.send({
          code: 400,
          msg: message,
          data: null
        })
        return
      }

      log4js.info(`修改id为 ${id} 的收入记录成功`)
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


// 看板数据
router.get('/board', async (req, res) => {
  const currentUserId = req.user.id

  // dayjs 获取今年的开始日期和结束日期
  const yearStart = dayjs().startOf('year').format('YYYY-MM-DD')
  const yearEnd = dayjs().endOf('year').format('YYYY-MM-DD')
  // dayjs 获取本月的开始日期和结束日期
  const monthStart = dayjs().startOf('month').format('YYYY-MM-DD')
  const monthEnd = dayjs().endOf('month').format('YYYY-MM-DD')

  // 年收入
  const yearIncome = await IncomeList.sum('amount', {
    where: {
      UserId: currentUserId,
      isDelete: 0,
      isReceived: 1,
      date: {
        [Op.between]: [yearStart, yearEnd]
      }
    }
  })

  // 月收入
  const monthIncome = await IncomeList.sum('amount', {
    where: {
      UserId: currentUserId,
      isDelete: 0,
      isReceived: 1,
      date: {
        [Op.between]: [monthStart, monthEnd]
      }
    }
  })

  const today = new Date(); // 获取当前日期对象
  today.setHours(0, 0, 0, 0); // 将时间部分设置为 0，只保留日期部分

  // 今日收入
  const dayIncome = await IncomeList.sum('amount', {
    where: {
      UserId: currentUserId,
      isDelete: 0,
      isReceived: 1,
      date: {
        [Op.gte]: today, // 大于等于今天零点的时间戳
        [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000), // 小于明天零点的时间戳
      }
    }
  })

  // 本月工资
  const monthSalary = await IncomeList.sum('amount', {
    where: {
      UserId: currentUserId,
      isDelete: 0,
      isReceived: 1,
      type: "工资",
      date: {
        [Op.between]: [monthStart, monthEnd]
      }
    }
  })

  res.send({
    code: 200,
    msg: '查询成功',
    data: {
      yearIncome: formatNumber(yearIncome || 0),
      monthIncome: formatNumber(monthIncome || 0),
      dayIncome: formatNumber(dayIncome || 0),
      monthSalary: formatNumber(monthSalary || 0),
    }
  })
})

module.exports = router
