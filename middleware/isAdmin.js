
module.exports = function(req,res,next){
    
    //401 - unauth
    //403 - Forbidden

    if(req.user.role !== 'ADMIN') return res.status(403).send('Forbidden');

    next();

}