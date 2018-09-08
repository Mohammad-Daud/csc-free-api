const Sequelize = require('sequelize');
const sequelize = require('../models/connection');


const User = sequelize.define('users', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true, 
        }
    },
    password: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.STRING
    }
},{
    createdAt: false,
    updatedAt: false,
});

module.exports = User;