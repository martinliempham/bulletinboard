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
var messages = require('./models/index');

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
app.use('/', users);

// Get the Javascript in the browser
app.use("/javascripts", express.static("./outJavascripts"));
// Get the URL
app.all("/", function(req, res){
  // Render the Jade and Send for the client (Browser)
  req.render("index.jade");
});

app.get('/', function(req, res){
		res.render('index',{messages:rows});
	})
app.get('/new', function(req, res){
//needs to access the db and get the messages
	// messages.findAll().then(function(rows){
	res.render('new');

		// console.log(rows)
	})


//it needs to give the 'new' view that data



//then render the new view

// })
app.post('/new', function(req, res){

var Messages = sequelize.define('messages',{
	title: Sequelize.STRING(100),
	body: Sequelize.TEXT,
});

Messages
	.sync()
	.then(function(){
		Messages.create({
			title: req.body.title,
			body: req.body.messages
		});
		res.redirect('/new')
	});
})


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
  console.log('App is listening on port 3002');
});

app.get('/new', function(request, response){
	messages.findAll().then(function(rows){
		response.send(rows);
	});
  response.status(404).send('page not found')
});

module.exports = app;
