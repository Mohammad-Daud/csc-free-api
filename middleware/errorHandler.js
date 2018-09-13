
const winston = require('winston');
const appDebugger = require('debug')('app:appDebugger');

module.exports = function (err, req, res, next) {
    
    

    //winston logging label
    /*
        error, warn, info, verbose, debug, silly
    */
    winston.error(err.message, err);
    
    appDebugger(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    //res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500).send('Could not process this request...');
    //res.render('error');
}