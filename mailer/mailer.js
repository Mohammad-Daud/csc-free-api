
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const appDebugger = require('debug')('app:appDebugger');
const path = require('path');    


const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false, // use SSL
    auth: {
        user: '4776981164158ef31',
        pass: 'd2870c0c7f9525'
    }
});

module.exports = function(tpl, data, user){

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
                    from: '"Tester" testmail@zoho.com',
                    to: user.email,
                    subject: 'Hello, world',
                    html: data
                };
                console.log("html data ======================>", mainOptions.html);
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