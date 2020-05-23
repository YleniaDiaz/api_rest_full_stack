const Sequelize = require('sequelize');
const dbSequelize = require('../database/db-sequelize');

const Employee = dbSequelize.define('employees', {
    //attributes
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    }, 
    name: {
        type: Sequelize.STRING
    }, 
    salary: {
        type: Sequelize.INTEGER
    }
}, {
    //options
    freezeTableName: true,
    timestamps: false
});


module.exports=Employee;