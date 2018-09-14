const express = require('express');
const router = express.Router();
const dbDebugger = require('debug')('app:db');

const sequelize = require('../models/connection');
const Country = require('../models/Country');
const State = require('../models/State');
const User = require('../models/User');
const mailer = require('../mailer/mailer');


//GET /test
router.get('/', function (req, res, next) {
    res.send('ok');
});

router.get('/mail', function (req, res, next) {
    User.findOne().then(function(user){
        let tpl = 'test.ejs';
        let data = { name: 'Stranger' };
        mailer(tpl, data, user).then(function(){
            res.send('ok');
        });
    }).catch(function(e){
        console.log(e);
        res.send('notok');
    });
    
});



router.get('/connection', function (req, res, next) {
    sequelize
        .authenticate()
        .then(() => {
            dbDebugger('Connection has been established successfully.');
            res.json({
                msg: 'Connection has been established successfully.'
            });
        })
        .catch(err => {
            dbDebugger('Unable to connect to the database:', err);
            res.json({
                msg: 'Unable to connect to the database.',
                err: err
            });
        });
});



//TRANSACTION

router.post('/add-country', function (req, res) {

    let countryName = req.body.country_name;
    let stateName = req.body.state_name;
    let cityName = req.body.city_name;


    //Unmanaged transactions force you to manually rollback or commit the transaction.

    return sequelize.transaction().then(function (t) {
        return Country.create({
            sortname: 'te',
            name: 'test',
            phonecode: '1234'
        }, {
            transaction: t
        }).then(function (country) {
            return State.create({
                name: 'test', // name__: 'test'
                country_id: country.id
            }, {
                transaction: t
            });
        }).then(function (result) {
            t.commit();
            return res.status(200).json(result);
        }).catch(function (err) {
            console.log(err);
            t.rollback();
            return res.status(500).send({
                message: err
            });
        });
    });

});







module.exports = router;