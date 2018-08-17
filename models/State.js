const Sequelize = require('sequelize');
const sequelize = require('../models/connection');
const Country = require('../models/Country');
const City = require('../models/City');

const State = sequelize.define('states', {
    name: {
        type: Sequelize.STRING
    },
    country_id: {
        type: Sequelize.INTEGER,
        references:{
            model: Country,
            key: 'id',
        }
    }
},{
    createdAt: false,
    updatedAt: false,
});

/*
User.hasOne(Project)
here User is source and Project is target
*/

//State.hasMany(City, {foreignKey: 'state_id'});

module.exports = State;