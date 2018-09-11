const Sequelize = require('sequelize');
const sequelize = require('../models/connection');
const State     = require('../models/State');


const City = sequelize.define('cities', {
    name: {
        type: Sequelize.STRING
    },
    state_id: {
        type: Sequelize.INTEGER,
        references:{
            model: State,
            key: 'id',
        }
    }
},{
    createdAt: false,
    updatedAt: false,
    tableName: 'cities',
});

//State.hasMany(City, {foreignKey: 'state_id'});

module.exports = City;