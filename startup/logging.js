
const winston       = require('winston');

module.exports = function(){

    process.on('uncaughtException', function(e){
        winston.error(e.message, e);
        process.exit(1);
      });
      
      process.on('unhandledRejection', function(e){
        winston.error(e.message, e);
        process.exit(1);
      });
      
      if(!process.env.JWT_SECRET){
        winston.error('FATAL ERROR: JWT_SECRET(jwt private key) not set.');
        process.exit(1);
      }

      

      if(process.env.NODE_ENV === 'development'){
        winston.add(new winston.transports.Console({ 
            colorize:true,
            prettyPrint:true
        }));
      }
      
      

      winston.add(new winston.transports.File({ filename: 'logs.log' }));

}