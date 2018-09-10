
module.exports = function(req,res,next){
    
    res.locals = {
        flash: req.session.flash,
        alertClass: req.session.alertClass,
        oldFormData: req.session.oldFormData
    };
    next();

}