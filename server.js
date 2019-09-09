var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
const hbs = require('express-handlebars');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// exphbs.create({
//   // Specify helpers which are only registered on this instance.
  
// });
 
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine( 'hbs', hbs( { 
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    each_upto: function(ary, max, options) {
      if(!ary || ary.length == 0)
          return options.inverse(this);
  
      var result = [ ];
      for(var i = 0; i < max && i < ary.length; ++i)
          result.push(options.fn(ary[i]));
      return result.join('');
  }
}
}));
app.set('view engine', 'hbs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// live reload setup only on development
var env = process.env.NODE_ENV || 'development';
if(env == 'development'){
  const livereloadMiddleware = require("connect-livereload");
  var livereload = require('livereload').createServer({
    exts: ['js','scss', 'hbs']
  });
  livereload.watch(path.join(__dirname));
  app.use(livereloadMiddleware());
}


app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
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
