var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
var userRouter = require('./routes/user');

var app = express();


// 页面处理 注释
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json()); // post时候 将参数挂到 req.body
app.use(express.urlencoded({ extended: false })); // post数据兼容其他格式
app.use(cookieParser());

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret:'wto_AAA123#',
  cookie: {
    // path:'/', // 默认配置
    // httpOnly: true, // 默认配置
    maxAge: 24 * 60 * 60 *1000
  },
  store: sessionStore
}))

// // 静态文件处理 注释
// app.use(express.static(path.join(__dirname, 'public')));


// 注册路由
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter);

// catch 404 and forward to error handler检测404情况
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
