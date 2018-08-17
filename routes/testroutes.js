const express = require('express');
const router = express.Router();
const sequelize = require('../models/connection');
const Country = require('../models/Country');
const State = require('../models/State');


//GET /test
router.get('/', function (req, res, next) {
    res.send('ok');
});

router.get('/connection', function (req, res, next) {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
            res.json({
                msg: 'Connection has been established successfully.'
            });
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
            res.json({
                msg: 'Unable to connect to the database.',
                err: err
            });
        });
});

router.get('/countries-list', function (req, res, next) {

    Country.findAll().then(function (data) {
        res.json({
            countries: data
        });
    });

});

router.get('/countries-list-with-state', function (req, res, next) {

    //EGER
    Country.findAll({
        include: [{
            model: State
        }]
    }).then(function (data) {
        res.send(data);
    });

});

router.get('/state-list', function (req, res, next) {

    State.findAll().then(function (data) {
        res.json({
            state: data
        });
    });

});

router.get('/state-list-with-city', function (req, res, next) {

    State.findAll({
        include: [{
            model: City
        }]
    }).then(function (data) {
        res.send(data);
    });

});

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