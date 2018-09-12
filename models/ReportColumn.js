const Sequelize = require('sequelize');
const sequelize = require('../models/connection');
const UserReport     = require('../models/UserReport');


const ReportColumn = sequelize.define('report_columns', {
    columnTitle: {
        type: Sequelize.STRING
    },
    selectedRuleType: {
        type: Sequelize.STRING
    },
    ruleValue: {
        type: Sequelize.STRING
    },
    report_id: {
        type: Sequelize.INTEGER,
        references:{
            model: UserReport,
            key: 'id',
        }
    }
},{
    createdAt: false,
    updatedAt: false,
    tableName: 'report_columns',
});



module.exports = ReportColumn;