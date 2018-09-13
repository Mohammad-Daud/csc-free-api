require('dotenv').load();

const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const favicon       = require('serve-favicon');
const helmet        = require('helmet');
const cookieSession = require('cookie-session');
const flashMsg      = require('./middleware/flashMsg');
const unsetFlashMsg = require('./middleware/unsetFlashMsg');
const errorHandler = require('./middleware/errorHandler');
const startupDebugger   = require('debug')('app:startup');
const routes        = require('./routes');
const testRoutes    = require('./routes/testroutes');

const app = express();


require('./startup/logging')();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middlewares
app.use(helmet());
app.use(cookieSession({
  name: 'session',
  secret: process.env.COOKIE_SESSION_SECRET,
  maxAge: 1 * 60 * 60 * 1000 // 1 hours
}));
if(process.env.NODE_ENV === 'development'){
  app.use(logger('dev'));
  app.set('trust proxy', 1) // trust first proxy
  startupDebugger('NODE_ENV: '+process.env.NODE_ENV);
  startupDebugger('Morgan Enabled...');
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(flashMsg);
app.use(unsetFlashMsg);


//ALL ROUTES
app.use('/', routes);
app.use('/test', testRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler middleware -- should on after all middleware
app.use(errorHandler);





module.exports = app;
