
module.exports = function redirect2ErrorPage(res,errorCode){

    switch (errorCode) {
        case '500':
            res.redirect('/500');
            break;
    
        default:
            res.redirect('/');
            break;
    }

    
    
}