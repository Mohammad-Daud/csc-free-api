const Sequelize = require('sequelize');
const sequelize = require('../models/connection');
const State = require('../models/State');

const Country = sequelize.define('countries', {
    sortname: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    phonecode: {
        type: Sequelize.INTEGER
    }
},{
    createdAt: false,
    updatedAt: false,
}
// ,{
    
//     associate: function(models){
//         Country.hasMany(models.State, {
//             foreignKey : 'country_id',
//             constraints : true //check FK constraints
//         })
//     }
// }
);

Country.hasMany(State, {foreignKey: 'country_id'});

module.exports = Country;