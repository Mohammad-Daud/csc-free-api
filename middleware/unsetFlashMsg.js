
module.exports = function(req,res,next){
    
    req.session.flash = '';
    next();

}