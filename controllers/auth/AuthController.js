const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const appDebugger = require('debug')('app:appDebugger');

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
                    id: user.id,
                    role: user.role
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
    
    auth:function(req,res){


        

        const valSchema = {
            email: Joi.string().min(4).max(200).email().required(),
            password: Joi.string().min(4).max(200).required(),
        }
        
        const valResult = Joi.validate(req.body,valSchema);

        if(valResult.error) return res.status(400).send(valResult);

        User.findOne({
            where:{
                email: req.body.email
            }
        }).then(function(user){
            if(!user) return res.status(400).send('Invalid email or password.');
            const validPass = bcrypt.compareSync(req.body.password, user.password); 
            //return bool
            if(!validPass) return res.status(400).send('Invalid email or password.');
           
            let token = getToken(user);

            return res.status(200).send({
                auth: true,
                token: token
            });

        });

    },
    authUser: async function(req,res){
        const user = await User.findById(req.user.id, {attributes: ['name', 'email', 'role']});
        if(!user) return res.status(400).send('Something went wrong!!');
        res.status(200).send(user); 
    },
    login: function(req,res){
        res.render('login',{
            title:'Login'
        });
    },
    getAccessToken:function(req,res){
        const password  = req.body.password;
        const email = req.body.email;

        //Validate
        const valSchema = {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }
        
        let valResult = Joi.validate(req.body,valSchema);

        if(valResult.error) {
            redirect2Login(req,res,valResult.error.details[0].message);
        } else {
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user){
                let matched = bcrypt.compareSync(password, user.password);
                if(matched){
                    //Send token
                    let token = getToken(user);
                    res.send(token);
                } else {
                    redirect2Login(req,res,'Something went wrong.');
                }
            }).catch(function(e){
                appDebugger(e);
                redirect2Login(req,res,'Something went wrong.');
            });
        } 

        

        

    }
    
}

function redirect2Login(req,res,msg){
    req.session.flash = msg;
    res.redirect('login');
}

function getToken(user){
    
    try {
        
        return jwt.sign({
            id: user.id,
            role:user.role
        }, process.env.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

    } catch (error) {
        
        appDebugger(error);
        return 'Error in getting token.';

    }
    
}


