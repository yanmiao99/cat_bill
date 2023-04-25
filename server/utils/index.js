const Decimal = require('decimal.js');
const log4js = require("./log4j");

// 格式化金额
const formatNumber = (input) => {
  const num = new Decimal(input);
  return num.toFixed(2);
}

// 参数校验
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

module.exports = {
  formatNumber,
  validateParams
}
