var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://martinpham@localhost:5432/bulletinboard');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// Column Name	Column Data Type
// id	serial primary key
// title	varchar (max length 100)
// body	text
// created	timestamp

var Messages = sequelize.define('messages',{
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	title: Sequelize.STRING,
	body: Sequelize.TEXT,
	createdAt: Sequelize.DATE,
	
});

Messages
	.sync()
	.then(function(){
		Messages.create({
			id: 1,
			title: 'this is the title',
			body: 'this is the body',
			// createdAt: Sequelize.DATE,
		});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(3002, function(){
  console.log('App is listening on port 3000');
});

app.get('/users', function(request, response){
	users.findAll().then(function(rows){
		response.send(rows);
	});
  // response.status(404).send('page not found')
});

module.exports = app;