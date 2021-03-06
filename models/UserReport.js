const Sequelize = require('sequelize');
const sequelize = require('../models/connection');
const User     = require('../models/User');


const UserReport = sequelize.define('user_reports', {
    reportTitle: {
        type: Sequelize.STRING
    },
    tableName: {
        type: Sequelize.STRING
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
    tableName: 'user_reports',
});



module.exports = UserReport;