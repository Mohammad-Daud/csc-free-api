
const Country = require('../../models/Country');
const State = require('../../models/State');
const City = require('../../models/City');

module.exports = {
    /**
     * @api {get} /countries-list Request All Countries List
     * @apiName GetCountries
     * @apiGroup Country
     *
     * @apiParam {String} x-auth-token Auth Token.
     *
     */
    countriesList: function (req, res, next) {

        Country.findAll().then(function (data) {
            res.json({
                countries: data
            });
        }).catch(function (error) {
            next(error);
        });

    },
    stateListWithCity: function (req, res, next) {

        State.findAll({
            include: [{
                model: City
            }]
        }).then(function (data) {
            res.send(data);
        }).catch(function (error) {
            next(error);
        });

    },
    countriesListWithState: function (req, res, next) {

        //EGER
        Country.findAll({
            include: [{
                model: State
            }]
        }).then(function (data) {
            res.send(data);
        }).catch(function (error) {
            next(error);
        });

    },
    stateList: function (req, res, next) {

        State.findAll().then(function (data) {
            res.json({
                state: data
            });
        }).catch(function (error) {
            next(error);
        });

    }
}