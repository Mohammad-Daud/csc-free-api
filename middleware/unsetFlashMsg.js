
module.exports = function(req,res,next){
    
    req.session.flash = '';
    req.session.alertClass = '';
    req.session.oldFormData = '';
    next();

}