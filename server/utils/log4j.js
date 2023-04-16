/*
* 日志存储
* */

const log4js = require('log4js')

// 定义 levels 级别
const levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL,
}

// 配置文件
log4js.configure({
    appenders: {
        console: {type: 'console'}, // console
        info: {type: 'file', filename: 'logs/info-logs.log'}, // file 输出日志到 info-logs.log
        error: {
            type: 'dateFile', // 按天
            filename: 'logs/error-logs',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true // 说明 filename 和 pattern 组合输出名称
        }, // 按天输出 error 日志
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'debug'
        },
        info: {
            appenders: ['info', 'console'],
            level: 'info'
        },
        error: {
            appenders: ['error', 'console'],
            level: 'error'
        }
    }
})

// 输出 debug
exports.debug = (content) => {
    let logger = log4js.getLogger()
    logger.level = levels.debug
    logger.debug(content)
}

// 输出 error
exports.error = (content) => {
    let logger = log4js.getLogger('error')
    logger.level = levels.error
    logger.error(content)
}

// 输出 info
exports.info = (content) => {
    let logger = log4js.getLogger('info')
    logger.level = levels.info
    logger.info(content)
}
