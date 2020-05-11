const Sequelize = require('sequelize');

const sequelize = new Sequelize('company', 'root', 'ylenia', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000
        //idle: 10000
    }
});

/**
 * CONNECTION
 */
sequelize.authenticate()
    .then(()=>{
        console.log('CONNECTION SEQUELIZE OK');
    }).catch(err=>{
        console.log(`ERROR SEQUELIZE: ${err.message}`);
    }); 

/**
 * MODEL
 */
const User = sequelize.define('users', {
    //attributes
    username:{
        type: Sequelize.STRING,
        allowNull: false
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

/**
 * SYNC ALL MODELS WITH DB
 */
//sequelize.sync();
sequelize.sync({force: false})
    .then(()=>{
        console.log('SYNC MODEL');
    });

/**
 * SELECT * USER
 */
/*User.findAll().then(users => {
    let usersString = JSON.stringify(users, null, 4);
    let usersObject = JSON.parse(usersString);
    console.log(usersObject);
    //console.log(`ALL USERS: ${JSON.stringify(users, null, 4)}`);ç
});*/

User.findAll().then(users => {
    let usersString = JSON.stringify(users, null, 4);
    let usersObject = JSON.parse(usersString);
    //SELECT *
    console.log(`ALL USERNAMES: ${usersObject.map((user)=>user.username)}`);
    //WHERE
    console.log(`USER KKK: ${usersObject.filter((user)=>user.username=='kkk')}`);
});