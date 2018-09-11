
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const appDebugger = require('debug')('app:appDebugger');
const path = require('path');    


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // use SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

module.exports = function(tpl, data, user, subject=''){

    const p = new Promise(function(resolve, reject){

        let filePath = path.join(__dirname, '../views/mails/' + tpl);

        console.log(filePath);
        console.log(user.email);

        ejs.renderFile(filePath, data, function(err, data){
            if(err){
                appDebugger(err);
                reject(err);
            } else {
                var mainOptions = {
                    from: '"'+ process.env.FROM_NAME +'" '+process.env.FROM_ADDR,
                    to: user.email,
                    subject: subject,
                    html: data
                };
                //console.log("html data ======================>", mainOptions.html);
                transporter.sendMail(mainOptions, function (err, info) {
                    if (err) {
                        appDebugger(err);
                        reject(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                        resolve(1);
                    }
                });
            }
        });

    });

    
    return p;
    

    

}