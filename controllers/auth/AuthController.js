const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Joi = require('joi');


module.exports = {
    register: function(req, res){
        let hashedPassword = bcrypt.hashSync(req.body.password, 8); 
        //Synchonized so no need to then

        //Validae with JOI
        
        const valSchema = {
            name: Joi.string().min(4).max(200).required(),
            email: Joi.string().min(4).max(200).email().required(),
            password: Joi.string().min(4).max(200).required(),
        }
        
        let valResult = Joi.validate(req.body,valSchema);

        if(valResult.error) return res.status(400).send(valResult);

        

        User.findOne({
            where:{
                email: req.body.email
            }
        }).then(function(user){
            // if(user){
            //     return res.status(400).send('User already registerd.');
            // }

            //ABOVE line will not stop next line exe

            if(user) return res.status(400).send('User already registerd.');

            User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }).then(function(user){
                
                var token = jwt.sign({
                    id: user._id
                }, process.env.JWT_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });
                return res.status(200).send({
                    auth: true,
                    token: token
                });
    
            }).catch(function(err){
                return res.status(500).json({
                    error:err
                });
            });
            
        });

       

    },
    getToken: function(req,res){
        res.status(200).send('ok');
    }
    
}

