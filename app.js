var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const uri = "mongodb+srv://admin:admin@cluster0.n4heo.mongodb.net/prototype-v4?retryWrites=true&w=majority";;

var indexRouter = require('./routes/index');
var gameRouter = require('./routes/game');
//var bluetoothRouter = require('./routes/bluetooth-control');
mongoose.connect(
	uri,
	{
	  useNewUrlParser: true,
	  useFindAndModify: false,
	  useUnifiedTopology: true
	}
);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/game', gameRouter);
//app.use('/bluetooth', bluetoothRouter);

// await mongoose.connect('mongodb://localhost/my_database', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
