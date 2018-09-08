
module.exports = function(req,res,next){
    
    res.locals = {
        flash: req.session.flash
    };
    next();

}