var express = require('express');
var router = express.Router();

const { getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog 
} = require('../controller/blog')
const { SuccessModel, ErrorModel} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', (req, res, next) => {
  let author = req.query.author || ''
    const keyword = req.query.keyword || ''

    if(req.query.isadmin) {
      // // 管理员界面
      console.log('is admin');
      
      if (req.session.username == null) {
        console.error('is admin ,but no login');
        
        // 未登录
       res.json(
          new ErrorModel('未登录')
        )
        return
      }
      // 强制查询自己的博客
      author = req.session.username
    }


    const result = getList(author, keyword)

    return result.then(listData => {
      res.json(new SuccessModel(listData))
    })
});

router.get('/detail', (req, res, next) => {
  const result = getDetail(req.query.id)
  return result.then(data => {
    res.json(new SuccessModel(data))
  })
  
});

router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then((data) => {
      res.json(new SuccessModel(data))
    })
});

router.post('/update', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const result = updateBlog(req.query.id, req.body)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModel())
      return
    }
    res.json(new ErrorModel('更新博客失败'))
  })
});

router.post('/del', loginCheck, (req, res, next) => {
  const result = delBlog(req.query.id, req.session.username)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModel())
      return
    }
    res.json(new ErrorModel('更新博客失败'))
  })
});

module.exports = router;
