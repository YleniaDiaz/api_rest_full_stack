const Sequelize = require('sequelize');
const dbSequelize = require('../database/db-sequelize');

const User = dbSequelize.define('users', {
    //attributes
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    username:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }, 
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    fullname: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    //options
    freezeTableName: true,
    timestamps: false
});


module.exports=User;