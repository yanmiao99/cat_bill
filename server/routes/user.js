const express = require('express')
const router = express.Router()
const {User} = require('../models')
const log4js = require('../utils/log4j.js')
const md5 = require("md5");
const jwt = require('jsonwebtoken');
const {SALT} = require("../config/index.js")
const passport = require('passport');
const {TOKEN_EXPIRES_IN} = require("../config/index.js")
const svgCaptcha = require('svg-captcha');
let captcha_text = ''

/**
 * 用户注册
 * @param username
 * @param password
 * @api {post} /api/user/register 用户注册
 */
router.post('/register', async (req, res) => {
  const {username, password} = req.body
  // 校验
  if (!username || !password) {
    log4js.error('参数错误')
    res.send({code: 400, msg: "参数错误"})
    return
  }
  if (username.length > 32) {
    log4js.error('用户名过长')
    res.send({code: 400, msg: "用户名过长"})
    return
  }
  // 判断用户是否已存在
  const user = await User.findOne({
    where: {
      username
    }
  })

  if (user) {
    log4js.error('该用户名已被注册')
    res.send({code: 400, msg: "该用户名已被注册"})
    return
  }
  // 创建一个新的用户
  try {
    const cryptoPassword = md5(password + SALT);
    await User.create({
      username,
      password: cryptoPassword,
    })
    log4js.info('注册成功')
    res.send({
      code: 200,
      msg: "注册成功",
      data: {
        username,
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

// 生成验证码
router.get('/captcha', async (req, res) => {
  try {
    const options = {
      width: 100,
      color:'red',
    };
    const captcha = svgCaptcha.create(options);
    res.type('svg');
    captcha_text = captcha.text.toLocaleLowerCase() // 将验证码文本存储在会话中
    res.send({
      code: 200,
      msg: "获取验证码成功",
      data: {
        captcha: captcha.data,
      }
    })
  } catch (err) {
    log4js.error(err)
    res.send({
      code: 400,
      msg: '获取验证码失败',
      data: err
    })
  }
})

/**
 * 用户登录
 * @param username
 * @param password
 * @api {post} /api/user/login 用户登录
 */
router.post('/login', async (req, res) => {
  const {username, password, captcha} = req.body
  if (!captcha || captcha.toLocaleLowerCase() !== captcha_text.toLocaleLowerCase()) {
    res.send({code: 400, msg: "验证码不正确"})
  } else {
    // 校验
    if (!username || !password) {
      log4js.error('参数错误')
      res.send({code: 400, msg: "参数错误"})
      return
    }

    // 查询用户是否存在
    const user = await User.findOne({
      where: {
        username
      }
    })

    if (!user) {
      log4js.error(`用户 ${username} 不存在`)
      res.send({code: 404, msg: "用户不存在"})
      return
    }

    // 验证密码是否正确
    const cryptoPassword = md5(password + SALT);
    if (user.password !== cryptoPassword) {
      log4js.error(`用户 ${username} 密码不正确`)
      res.send({code: 401, msg: "用户不存在或密码错误"})
      return
    }

    // 生成 token 并返回给客户端
    const payload = {userId: user.id + 123123}
    const options = {expiresIn: TOKEN_EXPIRES_IN}; // token 失效时间
    jwt.sign(payload, SALT, options, (err, token) => {
      if (err) throw err;
      log4js.info(`用户 ${username} 登录成功`)
      res.send({
        code: 200,
        msg: "登录成功",
        data: {
          token,
          userId: user.id,
          username: user.username,
        }
      });
    });
  }
})

/**
 * 获取当前用户信息
 * @api {get} /api/user/current 获取当前用户信息
 * @apiHeader {String} Authorization Bearer token
 * @api {get} /api/user/current 获取当前用户信息
 */
router.get(
  '/current',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    res.send({
      code: 200,
      msg: "获取用户信息成功",
      data: {
        userId: req.user.id,
        username: req.user.username,
      }
    })
  }
);

module.exports = router
