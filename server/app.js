// 创建express基本结构
const express = require('express')
const app = express()
const cors = require('cors')
const log4js = require('./utils/log4j.js')
const {PORT, SALT} = require("./config/index.js")
const passport = require('passport');
const {resolve} = require("path");

// passport 初始化 (用于验证token)
app.use(passport.initialize());
require('./utils/passport')(passport);

// 配置全局中间件 ( 中间键必须配置在路由的前面, 否则不生效 )
app.use(express.json()) // 解析 json 数据
app.use(express.urlencoded({extended: false})) // 解析 x-www-form-urlencoded 数据
app.use(cors()) // 解决跨域

// 静态资源
app.use('/public', express.static(resolve(__dirname, 'public')))  // 静态资源

// 封装统一的身份验证中间件
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send({msg: '未登录或身份已过期'});
    req.user = user;
    next();
  })(req, res, next);
};

// 路由
app.use('/api/user', require('./routes/user.js'))

// 统一身份验证 (需要token登录的接口)
const createRouter = (path, handler) => {
  const router = express.Router();
  router.use(authenticate);
  router.use(handler);
  app.use(path, router);
};
createRouter('/api/user', require('./routes/user.js'));
createRouter('/api/lendPeople', require('./routes/lendPeople.js'));
createRouter('/api/lend', require('./routes/lend.js'));
createRouter('/api/upload', require('./routes/upload.js'));
createRouter('/api/incomeList', require('./routes/incomeList.js'));
createRouter('/api/noteLabelsAndCategory', require('./routes/noteLabelsAndCategory.js'));


// 异常捕获的中间件 ( 需要放在所有路由的最后面 )
app.use((err, req, res, next) => {
  log4js.error(err)
  // 其他原员导致的错误
  res.send({code: 500, msg: '未知错误,请联系管理员!', err: err.toString()})
})

// 监听端口
app.listen(PORT, () => {
  log4js.info(`✅ - 当前启动的端口为 :  ${PORT}`)
  console.log(`✅ - 当前启动的端口为 :  ${PORT}`)
})
