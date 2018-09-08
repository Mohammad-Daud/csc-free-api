const jwt = require('jsonwebtoken');

function auth(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denaid. x-auth-token not found in header.');
    
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        
        if(verify){
            req.user = verify;
            next();
        }

    } catch (error) {
        return res.status(400).send('Invalid Token.');
    }

    
}

module.exports = auth;