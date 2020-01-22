var express = require('express');
var router = express.Router();

const { login } = require('../controller/user')
const { SuccessModel, ErrorModel} = require('../model/resModel')

router.post('/login', (req, res, next) => {
  const { username, password } = req.body
  const result = login(username, password)
    return result.then(data => {
      if (data.username) {

        req.session.username = data.username
        req.session.realname = data.realname

        console.log(req.session)

        res.json(new SuccessModel())

        return
      }
      res.json(new ErrorModel('登录失败'))
  })
});

router.get('/login-test', (req, res, next) => {
  console.log('req.session', req.session)
  if (req.session.username) {
    res.json({
      errorno: 0,
      msg: '已登录'
    })
    return
  }
  res.json({
    errorno: -1,
    msg: '未登录'
  })
});

// router.get('/session-test', (req, res, next) => {
//   session = req.session
//   if (session.viewNum == null) {
//     session.viewNum = 0
//   }

//   session.viewNum++
//   res.json({
//     viewNum: session.viewNum
//   })
// });

module.exports = router;
