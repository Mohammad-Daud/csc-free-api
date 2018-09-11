const Sequelize = require('sequelize');
const sequelize = require('../models/connection');
const User     = require('../models/User');


const UserReport = sequelize.define('UserReport', {
    reportTitle: {
        type: Sequelize.STRING
    },
    tableName: {
        type: Sequelize.STRING
    },
    columnIncluded: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        references:{
            model: User,
            key: 'id',
        }
    }
},{
    createdAt: false,
    updatedAt: false,
});



module.exports = UserReport;