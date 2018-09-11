
module.exports = function redirect2Url(req,res,url,msg,alertClass){
    req.session.alertClass = 'alert-danger';
    if(alertClass){
        req.session.alertClass = alertClass;
    }
    if(msg){
        req.session.flash = msg;
    }
    if(url){
        return res.redirect(url);
    }
    return res.redirect('/');
}